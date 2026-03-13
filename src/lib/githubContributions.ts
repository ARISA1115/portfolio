import { GITHUB_USER, GITHUB_GRAPHQL, CACHE_REVALIDATE } from '@/config/site';

export type ContributionData = {
  totalContributions: number;
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
};

const CONTRIBUTION_QUERY = `
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

function getToken(): string | undefined {
  return process.env.SKILLS_API ?? process.env.GITHUB_TOKEN;
}

function hasInvalidChars(token: string): boolean {
  return [...token].some((c) => c.codePointAt(0)! > 255);
}

/**
 * GitHub GraphQL API からコントリビューションデータを取得する。
 * dateRange を省略した場合は過去 12 ヶ月を取得する。
 * サーバー専用。失敗時は null を返す。
 */
export async function fetchGitHubContributions(
  dateRange?: { from: Date; to: Date }
): Promise<ContributionData | null> {
  try {
    const token = getToken();

    if (token && hasInvalidChars(token)) {
      console.error('fetchGitHubContributions: SKILLS_API/GITHUB_TOKEN に非ASCII文字が含まれています。');
      return null;
    }

    const now = new Date();
    const to = dateRange?.to ?? now;
    const from = dateRange?.from ?? (() => {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d;
    })();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: CONTRIBUTION_QUERY,
        variables: { login: GITHUB_USER, from: from.toISOString(), to: to.toISOString() },
      }),
      next: { revalidate: CACHE_REVALIDATE },
    });

    if (!res.ok) {
      console.error('fetchGitHubContributions fetch error:', res.status);
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
      console.error('fetchGitHubContributions GraphQL errors:', json.errors);
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
