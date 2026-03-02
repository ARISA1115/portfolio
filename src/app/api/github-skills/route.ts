import { NextResponse } from 'next/server';

const GITHUB_USER = 'ARISA1115';
const GITHUB_API = 'https://api.github.com';

async function fetchRepos(token: string | undefined) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const url = token
    ? `${GITHUB_API}/user/repos?per_page=100&sort=pushed`
    : `${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100`;
  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub repos: ${res.status}`);
  return res.json() as Promise<{ full_name: string; name: string; owner: { login: string } }[]>;
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
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return {};
  return res.json() as Promise<Record<string, number>>;
}

export async function GET() {
  try {
    const token = process.env.SKILLS_API;
    const repos = await fetchRepos(token);
    const aggregated: Record<string, number> = {};

    for (const repo of repos) {
      const owner = repo.owner.login;
      const name = repo.name;
      const lang = await fetchLanguages(owner, name, token);
      for (const [language, bytes] of Object.entries(lang)) {
        aggregated[language] = (aggregated[language] ?? 0) + bytes;
      }
    }

    const maxBytes = Math.max(...Object.values(aggregated), 1);
    const normalized: Record<string, number> = {};
    for (const [language, bytes] of Object.entries(aggregated)) {
      normalized[language] = Math.round((bytes / maxBytes) * 100);
    }

    return NextResponse.json(normalized, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (e) {
    console.error('github-skills:', e);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub languages' },
      { status: 500 }
    );
  }
}
