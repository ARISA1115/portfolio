package main

import (
	"encoding/json"
	"encoding/xml"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

type Article struct {
	ID          int      `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Date        string   `json:"date"`
	Tags        []string `json:"tags"`
	Category    string   `json:"category"`
	URL         string   `json:"url"`
	Platform    string   `json:"platform"`
}

type QiitaItem struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	URL       string `json:"url"`
	CreatedAt string `json:"created_at"`
	Body      string `json:"body"`
	Tags      []struct {
		Name string `json:"name"`
	} `json:"tags"`
}

type RSSFeed struct {
	Channel struct {
		Items []RSSItem `xml:"item"`
	} `xml:"channel"`
}

type RSSItem struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	PubDate     string `xml:"pubDate"`
	Description string `xml:"description"`
}

const (
	qiitaUser = "ARISA1115"
	zennUser  = "arisa1115"
)

func main() {
	var outputDir string
	flag.StringVar(&outputDir, "output", filepath.Join("..", "..", "public", "data"),
		"articles.json の出力先ディレクトリ（スクリプトのディレクトリからの相対パス）")
	flag.Parse()

	outputPath := filepath.Join(outputDir, "articles.json")

	var articles []Article

	qiitaArticles, err := fetchQiitaArticles()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Qiita 取得エラー: %v\n", err)
	} else {
		articles = append(articles, qiitaArticles...)
		fmt.Printf("Qiita: %d 件取得\n", len(qiitaArticles))
	}

	zennArticles, err := fetchZennArticles()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Zenn 取得エラー: %v\n", err)
	} else {
		articles = append(articles, zennArticles...)
		fmt.Printf("Zenn: %d 件取得\n", len(zennArticles))
	}

	sort.Slice(articles, func(i, j int) bool {
		return articles[i].Date > articles[j].Date
	})

	for i := range articles {
		articles[i].ID = i + 1
	}

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		fmt.Fprintf(os.Stderr, "ディレクトリ作成失敗: %v\n", err)
		os.Exit(1)
	}

	data, err := json.MarshalIndent(articles, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "JSON 変換エラー: %v\n", err)
		os.Exit(1)
	}

	if err := os.WriteFile(outputPath, data, 0644); err != nil {
		fmt.Fprintf(os.Stderr, "ファイル書き込みエラー: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("完了: %s に %d 件の記事を保存しました\n", outputPath, len(articles))
}

func fetchQiitaArticles() ([]Article, error) {
	token := os.Getenv("QIITA_TOKEN")
	client := &http.Client{Timeout: 30 * time.Second}

	var allItems []QiitaItem
	for page := 1; ; page++ {
		url := fmt.Sprintf("https://qiita.com/api/v2/users/%s/items?per_page=100&page=%d", qiitaUser, page)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, fmt.Errorf("リクエスト作成失敗: %w", err)
		}
		if token != "" {
			req.Header.Set("Authorization", "Bearer "+token)
		}

		resp, err := client.Do(req)
		if err != nil {
			return nil, fmt.Errorf("Qiita API リクエスト失敗: %w", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("Qiita API がステータス %d を返しました", resp.StatusCode)
		}

		var items []QiitaItem
		if err := json.NewDecoder(resp.Body).Decode(&items); err != nil {
			return nil, fmt.Errorf("Qiita レスポンス解析失敗: %w", err)
		}

		allItems = append(allItems, items...)
		if len(items) < 100 {
			break
		}
	}

	articles := make([]Article, 0, len(allItems))
	for _, item := range allItems {
		tags := make([]string, len(item.Tags))
		for i, t := range item.Tags {
			tags[i] = t.Name
		}
		articles = append(articles, Article{
			Title:       item.Title,
			Description: extractDescription(item.Body),
			Date:        formatQiitaDate(item.CreatedAt),
			Tags:        tags,
			Category:    inferCategory(tags, item.Title),
			URL:         item.URL,
			Platform:    "qiita",
		})
	}
	return articles, nil
}

func fetchZennArticles() ([]Article, error) {
	url := fmt.Sprintf("https://zenn.dev/%s/feed", zennUser)
	client := &http.Client{Timeout: 30 * time.Second}

	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("Zenn RSS リクエスト失敗: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("Zenn RSS 読み込み失敗: %w", err)
	}

	var feed RSSFeed
	if err := xml.Unmarshal(body, &feed); err != nil {
		return nil, fmt.Errorf("Zenn RSS 解析失敗: %w", err)
	}

	articles := make([]Article, 0, len(feed.Channel.Items))
	for _, item := range feed.Channel.Items {
		tags := inferZennTags(item.Title)
		description := stripHTML(item.Description)
		articles = append(articles, Article{
			Title:       item.Title,
			Description: description,
			Date:        formatRSSDate(item.PubDate),
			Tags:        tags,
			Category:    inferCategory(tags, item.Title),
			URL:         item.Link,
			Platform:    "zenn",
		})
	}
	return articles, nil
}

// inferCategory はタグとタイトルからカテゴリを推定します。
// 優先順位: Terraform > Security > Network > Frontend > Backend > DevOps
func inferCategory(tags []string, title string) string {
	tagSet := make(map[string]bool, len(tags))
	for _, tag := range tags {
		tagSet[strings.ToLower(tag)] = true
	}
	titleLower := strings.ToLower(title)

	if tagSet["terraform"] || tagSet["iac"] || tagSet["cloudformation"] {
		return "Terraform"
	}
	if tagSet["security"] || strings.Contains(titleLower, "セキュリティ") ||
		strings.Contains(titleLower, "フィッシング") || strings.Contains(titleLower, "脆弱性") {
		return "Security"
	}
	if tagSet["network"] || tagSet["virtualbox"] || tagSet["webserver"] || tagSet["http"] ||
		tagSet["almalinux"] || tagSet["virtualization"] ||
		strings.Contains(titleLower, "ネットワーク") || strings.Contains(titleLower, "仮想マシン") {
		return "Network"
	}
	if tagSet["react"] || tagSet["next.js"] || tagSet["typescript"] || tagSet["javascript"] ||
		tagSet["vue"] || tagSet["css"] || tagSet["html"] || tagSet["frontend"] ||
		tagSet["tailwind css"] || tagSet["tailwindcss"] || tagSet["svelte"] {
		return "Frontend"
	}
	if tagSet["python"] || tagSet["fastapi"] || tagSet["mysql"] || tagSet["dynamodb"] ||
		tagSet["database"] || tagSet["git"] || tagSet["ruby"] || tagSet["java"] ||
		tagSet["go"] || tagSet["postgresql"] || tagSet["redis"] || tagSet["backend"] ||
		tagSet["alembic"] || tagSet["api"] {
		return "Backend"
	}
	if tagSet["aws"] || tagSet["docker"] || tagSet["github actions"] || tagSet["datadog"] ||
		tagSet["vercel"] || tagSet["ecs"] || tagSet["kubernetes"] || tagSet["ci/cd"] ||
		tagSet["linux"] || tagSet["devops"] || tagSet["amazonqcli"] {
		return "DevOps"
	}

	return "Backend"
}

// inferZennTags はZenn記事のタイトルからタグを推定します。
// ZennのRSSフィードはタグ情報を含まないため、タイトルのキーワードで補完します。
func inferZennTags(title string) []string {
	titleLower := strings.ToLower(title)
	seen := make(map[string]bool)
	var tags []string

	add := func(tag string) {
		if !seen[tag] {
			tags = append(tags, tag)
			seen[tag] = true
		}
	}

	keywordMap := []struct {
		keyword string
		tag     string
	}{
		{"terraform", "Terraform"},
		{"cloudformation", "CloudFormation"},
		{"iac", "IaC"},
		{"aws", "AWS"},
		{"docker", "Docker"},
		{"kubernetes", "Kubernetes"},
		{"datadog", "Datadog"},
		{"vercel", "Vercel"},
		{"github actions", "GitHub Actions"},
		{"react", "React"},
		{"next.js", "Next.js"},
		{"typescript", "TypeScript"},
		{"javascript", "JavaScript"},
		{"vue", "Vue"},
		{"python", "Python"},
		{"fastapi", "FastAPI"},
		{"go ", "Go"},
		{"golang", "Go"},
		{"mysql", "MySQL"},
		{"postgresql", "PostgreSQL"},
		{"dynamodb", "DynamoDB"},
		{"database", "Database"},
		{"データベース", "Database"},
		{"git", "Git"},
		{"network", "Network"},
		{"ネットワーク", "Network"},
		{"virtualbox", "VirtualBox"},
		{"webサーバー", "WebServer"},
		{"web server", "WebServer"},
		{"apache", "WebServer"},
		{"nginx", "WebServer"},
		{"http", "HTTP"},
		{"almalinux", "AlmaLinux"},
		{"仮想", "Virtualization"},
		{"security", "Security"},
		{"セキュリティ", "Security"},
		{"フィッシング", "Security"},
	}

	for _, km := range keywordMap {
		if strings.Contains(titleLower, km.keyword) {
			add(km.tag)
		}
	}

	if len(tags) == 0 {
		tags = []string{"Tech"}
	}
	return tags
}

func formatQiitaDate(s string) string {
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		if len(s) >= 10 {
			return strings.ReplaceAll(s[:10], "-", ".")
		}
		return s
	}
	return t.Format("2006.01.02")
}

func formatRSSDate(s string) string {
	formats := []string{
		time.RFC1123Z,
		time.RFC1123,
		"Mon, 02 Jan 2006 15:04:05 -0700",
		"Mon, 2 Jan 2006 15:04:05 -0700",
	}
	for _, format := range formats {
		if t, err := time.Parse(format, s); err == nil {
			return t.Format("2006.01.02")
		}
	}
	return s
}

var (
	reHeading    = regexp.MustCompile(`(?m)^#{1,6}\s+`)
	reCodeBlock  = regexp.MustCompile("(?s)```.*?```")
	reInlineCode = regexp.MustCompile("`[^`]+`")
	reImage      = regexp.MustCompile(`!\[[^\]]*\]\([^)]+\)`)
	reLink       = regexp.MustCompile(`\[([^\]]+)\]\([^)]+\)`)
	reHTML       = regexp.MustCompile(`<[^>]+>`)
	reWhitespace = regexp.MustCompile(`\s+`)
)

func extractDescription(body string) string {
	body = reCodeBlock.ReplaceAllString(body, "")
	body = reHeading.ReplaceAllString(body, "")
	body = reInlineCode.ReplaceAllString(body, "")
	body = reImage.ReplaceAllString(body, "")
	body = reLink.ReplaceAllString(body, "$1")
	body = reHTML.ReplaceAllString(body, "")
	body = strings.TrimSpace(reWhitespace.ReplaceAllString(body, " "))
	return truncate(body, 150)
}

func stripHTML(s string) string {
	s = reHTML.ReplaceAllString(s, "")
	s = strings.NewReplacer(
		"&lt;", "<",
		"&gt;", ">",
		"&amp;", "&",
		"&quot;", `"`,
		"&#39;", "'",
		"&nbsp;", " ",
	).Replace(s)
	s = strings.TrimSpace(reWhitespace.ReplaceAllString(s, " "))
	return truncate(s, 150)
}

func truncate(s string, maxRunes int) string {
	runes := []rune(s)
	if len(runes) > maxRunes {
		return string(runes[:maxRunes]) + "..."
	}
	return s
}
