const GITHUB_USER = 'ARISA1115';
const GITHUB_API = 'https://api.github.com';

async function fetchRepos(token: string | undefined) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  // type=owner で自分が owner のリポジトリだけ取得（組織リポジトリを除外）
  const url = token
    ? `${GITHUB_API}/user/repos?per_page=100&sort=pushed&type=owner`
    : `${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100&type=owner`;
  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub repos: ${res.status}`);
  const repos = (await res.json()) as {
    full_name: string;
    name: string;
    owner: { login: string };
    fork: boolean;
  }[];
  // fork したリポジトリは除外（自分で書いたコードのみを対象にする）
  return repos.filter((r) => !r.fork);
}

async function fetchLanguages(
  owner: string,
  repo: string,
  token: string | undefined
): Promise<Record<string, number>> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/languages`,
    { headers, next: { revalidate: 3600 } }
  );
  if (!res.ok) return {};
  return res.json() as Promise<Record<string, number>>;
}

/**
 * 自分が owner のリポジトリ（fork 除く）の言語集計を取得。
 * 正規化: 最も多い言語を基準（対数スケール）にして 0–90 の範囲で返す。
 * - 最多言語でも 90 止まりにすることで「100% 習得済み」に見えない
 * - 対数スケールで、バイト数が少ない言語も適度に底上げする
 * サーバー専用。失敗時は null。
 */
export async function fetchGitHubLanguageLevels(): Promise<Record<string, number> | null> {
  try {
    const token = process.env.SKILLS_API ?? process.env.GITHUB_TOKEN;
    const repos = await fetchRepos(token);
    console.log(`[githubSkills] fetching ${repos.length} repos (owner, non-fork)`);

    const aggregated: Record<string, number> = {};
    for (const repo of repos) {
      const owner = repo.owner.login;
      const name = repo.name;
      const lang = await fetchLanguages(owner, name, token);
      for (const [language, bytes] of Object.entries(lang)) {
        aggregated[language] = (aggregated[language] ?? 0) + bytes;
      }
    }

    const values = Object.values(aggregated);
    if (values.length === 0) return {};

    const maxBytes = Math.max(...values);
    const normalized: Record<string, number> = {};
    for (const [language, bytes] of Object.entries(aggregated)) {
      // 対数スケールで 0–90 に正規化（最多言語 = 90）
      normalized[language] = Math.round(
        (Math.log1p(bytes) / Math.log1p(maxBytes)) * 90
      );
    }

    console.log('[githubSkills] normalized levels:', normalized);
    return normalized;
  } catch (e) {
    console.error('fetchGitHubLanguageLevels:', e);
    return null;
  }
}
