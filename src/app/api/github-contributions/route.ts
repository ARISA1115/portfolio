import { NextResponse } from 'next/server';

const GITHUB_USER = 'ARISA1115';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

type ContributionDay = { date: string; contributionCount: number };
type Week = { contributionDays: ContributionDay[] };
type ContributionCalendar = { totalContributions: number; weeks: Week[] };

const query = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export type ContributionsResponse = {
  totalContributions: number;
  weeks: Week[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const now = new Date();
    const currentYear = now.getFullYear();
    const year = yearParam ? parseInt(yearParam, 10) : currentYear;

    let from: Date;
    let to: Date;
    if (year === currentYear) {
      // 現在年を明示指定: Jan 1〜今日（暦年ビュー）
      from = new Date(`${year}-01-01T00:00:00Z`);
      to = now;
    } else {
      from = new Date(`${year}-01-01T00:00:00Z`);
      to = new Date(`${year}-12-31T23:59:59Z`);
    }
    const fromStr = from.toISOString();

    // SKILLS_API または GITHUB_TOKEN を使用（認証するとレート制限が緩和されます）
    let token = process.env.SKILLS_API ?? process.env.GITHUB_TOKEN;
    // ヘッダーは ASCII のみ可。全角・日本語が混ざっていると fetch が ByteString エラーになる
    if (token && [...token].some((c) => c.codePointAt(0)! > 255)) {
      console.error('github-contributions: SKILLS_API/GITHUB_TOKEN に非ASCII文字が含まれています。.env.local を確認し、トークンは ghp_ で始まる英数字のみにしてください。');
      return NextResponse.json(
        {
          error: 'invalid_token',
          message:
            '環境変数に使えない文字が含まれています。.env.local のトークンは、半角英数字のみ（ghp_ で始まる値）にしてください。',
        },
        { status: 500 }
      );
    }
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: { login: GITHUB_USER, from: fromStr, to: to.toISOString() },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('github-contributions fetch:', res.status, text);
      const isRateLimit = res.status === 403 && text.includes('rate limit');
      return NextResponse.json(
        {
          error: isRateLimit ? 'rate_limit' : 'GitHub API request failed',
          message: isRateLimit
            ? 'GitHubのレート制限に達しました。.env.local に GITHUB_TOKEN または SKILLS_API（GitHub Personal Access Token）を設定して再起動してください。'
            : undefined,
        },
        { status: res.status === 403 ? 403 : 502 }
      );
    }

    const json = (await res.json()) as {
      data?: { user?: { contributionsCollection?: { contributionCalendar: ContributionCalendar } } };
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      console.error('github-contributions GraphQL:', json.errors);
      return NextResponse.json(
        { error: json.errors[0]?.message ?? 'GraphQL error' },
        { status: 502 }
      );
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      return NextResponse.json(
        { error: 'User or contribution data not found' },
        { status: 404 }
      );
    }

    const body: ContributionsResponse = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (e) {
    console.error('github-contributions:', e);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub contributions' },
      { status: 500 }
    );
  }
}
