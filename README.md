# Portfolio Site

個人ポートフォリオサイト。<br>レスポンシブデザインに対応し、プロジェクト実績や技術記事、スキルセットを効果的に紹介します。

## 技術スタック

<p align="left" style="display: flex; align-items: center; gap: 8px;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" height="42" alt="Next.js Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="42" alt="React Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="42" alt="TypeScript Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" height="40" alt="Tailwind CSS Logo" style="vertical-align: middle; margin-right: 8px;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-plain.svg" height="40" alt="Chart.js Logo" style="vertical-align: middle;" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" height="40" alt="Go Logo" style="vertical-align: middle; margin-left: 8px;" />
</p>

| Framework | Language   | Styling              | Visualization | 記事取得スクリプト | パッケージマネージャ |
|-----------|------------|----------------------|---------------|--------------------|---------------------|
| Next.js 16 | TypeScript | Tailwind CSS + PostCSS | Chart.js      | Go                 | pnpm                |

## 概要

技術力とプロジェクト実績を視覚的に伝えるポートフォリオサイトです。<br>レスポンシブ対応により、デスクトップからモバイルまで最適な閲覧体験を提供します。

### 主要機能

- レスポンシブナビゲーション（ハンバーガーメニュー → 右側スライドメニュー）
- プロジェクト一覧とモーダル詳細表示（レスポンシブグリッドレイアウト）
- スキルセットのレーダーチャート可視化（GitHub API 連携で言語使用量を動的反映）
- Profile：About Me（現在の経歴をカテゴリ別表示）
- **技術記事の自動取得**（Qiita API + Zenn RSS を Go スクリプトで定期取得 → JSON 生成）
- 記事一覧のフィルタリング・検索・ページネーション
- 背景アニメーション（星とジオメトリック要素）

## セットアップ

### 必要な環境

- Node.js 20.x 以上
- pnpm（`corepack enable` で有効化可能）
- Go 1.21 以上（記事取得スクリプト実行時のみ）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/ARISA1115/portfolio.git
cd portfolio

# 依存パッケージをインストール
pnpm install
```

### 開発サーバー起動

```bash
pnpm run dev
```

ブラウザで `http://localhost:4000` にアクセスし、アプリが正常に動作することを確認してください。

### ビルド

```bash
pnpm run build
pnpm run start
```

### Lintチェック

```bash
pnpm run lint
```

### 記事データの手動更新

```bash
pnpm run fetch-articles
```

Qiita と Zenn から最新記事を取得し、`public/data/articles.json` を更新します。

### 環境変数（任意）

- **SKILLS_API**: GitHub Personal Access Token（classic, `repo` スコープ）。Profile のスキルレーダーチャートを GitHub のリポジトリ言語から動的取得する際に使用。未設定の場合は公開リポジトリのみ参照し、設定時は private / 所属 org のリポジトリも含まれる。**コントリビューショングラフ**（`/api/github-contributions`）でも同じトークンを使用する。未認証だと GitHub のレート制限（403）になりやすいため、ローカルでグラフを表示する場合は `.env.local` に設定推奨。
- **GITHUB_TOKEN**: 上記の代わりにこちらを設定しても、コントリビューショングラフ用 API で使用される（SKILLS_API が優先）。
- **QIITA_TOKEN**: 記事取得スクリプト（Go）が使用する Qiita API トークン（`read_qiita` スコープ）。未設定でも動作するが、レート制限（60回/時間/IP）回避のため推奨。GitHub Actions の Secrets に `QIITA_TOKEN` として登録する。

## ディレクトリ構成

```
portfolio/
├── public/
│   ├── data/
│   │   └── articles.json        # 自動生成（fetch-articles スクリプトが出力）
│   └── images/                  # プロジェクト画像・アイコン
├── scripts/
│   └── fetch-articles/          # 記事自動取得 Go スクリプト
│       ├── main.go
│       └── go.mod
├── .github/
│   └── workflows/
│       └── fetch-articles.yml   # 毎日 JST 10:00 に記事を自動更新
└── src/
    ├── app/                     # Next.js App Router
    │   ├── api/
    │   │   ├── github-contributions/  # GitHub コントリビューション API
    │   │   └── github-skills/         # GitHub 言語取得 API（スキルレーダー用）
    │   ├── layout.tsx
    │   ├── page.tsx             # ホームページ（Server Component）
    │   ├── profile/             # プロフィールページ（Server Component）
    │   ├── projects/            # プロジェクト一覧ページ
    │   └── articles/
    │       ├── page.tsx         # 記事一覧（Server Component・JSON 読み込み）
    │       └── ArticlesClient.tsx  # クライアント側フィルタ・検索・ページネーション
    ├── components/
    │   ├── layout/              # レイアウト系
    │   │   ├── Navigation.tsx
    │   │   ├── MobileSideMenu.tsx
    │   │   └── GlobalMobileOverlay.tsx
    │   ├── home/                # ホームページ専用
    │   │   ├── TypewriterHero.tsx   # タイプライターアニメーション（Client）
    │   │   └── SkillSection.tsx     # スキルカード一覧（Client）
    │   ├── features/
    │   │   └── github/
    │   │       └── ContributionGraph.tsx  # GitHub コントリビューショングラフ
    │   ├── charts/
    │   │   └── SkillRadarChart.tsx
    │   ├── common/
    │   │   ├── ConditionalScrollButton.tsx
    │   │   └── ModalPortal.tsx
    │   ├── icons/
    │   │   └── Xicon.tsx
    │   └── ui/                  # 汎用UIコンポーネント
    │       ├── Card.tsx             # 共通カードコンポーネント
    │       ├── Footer.tsx
    │       ├── Pagination.tsx
    │       ├── ScrollToggleButton.tsx
    │       ├── Slideshow.tsx
    │       └── StarField.tsx
    ├── config/
    │   └── site.ts              # サイト全体の定数（GITHUB_USER 等）
    ├── data/
    │   ├── articles.ts          # 記事フォールバックデータ（JSON 未生成時）
    │   ├── experience.ts        # 現在の経歴（Profile About Me）
    │   ├── githubSkillMapping.ts
    │   ├── profile.ts           # プロフィール情報（SNS リンク・場所・開始日）
    │   ├── projects.ts
    │   └── skills.ts
    ├── lib/
    │   ├── githubContributions.ts  # GitHub コントリビューション取得ロジック
    │   └── githubSkills.ts         # GitHub 言語取得ロジック
    ├── types/
    │   └── index.ts
    └── utils/
        └── getTagColor.ts
```

## 記事自動取得の仕組み

```
GitHub Actions（毎日 JST 10:00 / 手動実行可）
  └─ Go スクリプト（scripts/fetch-articles/）を実行
       ├─ Qiita API: ARISA1115 のすべての記事を取得
       ├─ Zenn RSS:  arisa1115 のフィードを取得
       ├─ タグ・タイトルからカテゴリを自動推定
       └─ public/data/articles.json を生成・コミット
            └─ Vercel が検知して自動デプロイ
                 └─ /articles ページに最新記事が反映
```

フォールバック: `articles.json` が存在しない場合は `src/data/articles.ts` の静的データを使用。

## コーディング設計のポイント

### アーキテクチャ

- **Server / Client 分離**：データ取得は Server Component、インタラクションは Client Component に分離
- **関心の分離**：定数は `config/`、外部API呼び出しは `lib/`、静的データは `data/`、UI は `components/` に集約
- **コンポーネント構造**：`layout/`（レイアウト系）/ `features/`（機能固有）/ `home/`（ページ専用）/ `ui/`（汎用）で役割を明確化
- **共通 Card コンポーネント**：`components/ui/Card.tsx` でカードスタイルを一元管理

### レスポンシブ対応

- モバイルファースト設計
- Tailwind のブレークポイント活用（sm / md / lg）
- 条件付きレンダリングによる最適な UI 切り替え

### z-index 階層管理

```
z-9999: MobileSideMenu（最前面）
z-9998: Navigation 内の操作要素（ロゴ・ボタン）
z-9997: GlobalMobileOverlay（全画面オーバーレイ）
z-[9996]: Navigation 背景
z-10: メインコンテンツ
z-負: 背景要素（StarField）
```

### パフォーマンス最適化

- Next.js Image コンポーネントで画像最適化
- Server Component による静的事前レンダリング（`/` / `/articles` / `/projects`）
- `next: { revalidate: 3600 }` による GitHub API レスポンスキャッシュ

### 型安全性

- TypeScript による厳密な型定義
- props と state の型チェック
- カスタムイベントの型安全な管理

## 開発方針・設計思想

### ユーザー体験優先

- 直感的なナビゲーション
- スムーズなアニメーション（300ms transition）
- 視認性の高い UI デザイン

### 保守性重視

- コンポーネントの単一責任原則
- データと UI の分離（`data/` ディレクトリ）
- 定数の一元管理（`config/site.ts`）
- 一貫したコーディングスタイル

### デザイン統一

- 背景色の完全統一（bg-slate-900）
- 共通 Card コンポーネントによる一貫したカードスタイル
- グラデーション効果の一貫性

### アクセシビリティ

- Escape キーでのメニュー・モーダルクローズ
- aria-label 属性の適切な使用
- キーボード操作対応

## 今後の拡張予定

### 機能追加

- お問い合わせフォーム

### パフォーマンス改善

- 画像の遅延読み込み（Lazy Loading）
- Service Worker によるオフライン対応
- リソースのキャッシュ戦略最適化

### SEO 最適化

- メタタグの動的生成
- サイトマップの自動生成
- 構造化データの実装

### テスト・品質向上

- ユニットテストの導入（Jest / Testing Library）
- E2E テストの導入（Playwright）
- CI/CD：GitHub Actions で main プッシュ時に Vercel へデプロイ（`.github/deploy.yml`）。GitHub Secrets の `SKILLS_API` をデプロイ時に Vercel の環境変数へ同期

## ライセンス

This project is private and not licensed for public use.
