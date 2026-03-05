const GITHUB_USER = 'ARISA1115';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

export type ContributionData = {
  totalContributions: number;
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
};

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

/**
 * GitHub GraphQL API からコントリビューションデータを取得する。
 * サーバー専用。失敗時は null を返す。
 */
export async function fetchGitHubContributions(): Promise<ContributionData | null> {
  try {
    const token = process.env.SKILLS_API ?? process.env.GITHUB_TOKEN;

    if (token && [...token].some((c) => c.codePointAt(0)! > 255)) {
      console.error('githubContributions: SKILLS_API/GITHUB_TOKEN に非ASCII文字が含まれています。');
      return null;
    }

    const now = new Date();
    const to = now.toISOString();
    const from = new Date(now);
    from.setFullYear(from.getFullYear() - 1);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: { login: GITHUB_USER, from: from.toISOString(), to },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('githubContributions fetch error:', res.status);
      return null;
    }

    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar: {
              totalContributions: number;
              weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
            };
          };
        };
      };
      errors?: { message: string }[];
    };

    if (json.errors?.length) {
      console.error('githubContributions GraphQL errors:', json.errors);
      return null;
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    };
  } catch (e) {
    console.error('fetchGitHubContributions:', e);
    return null;
  }
}
