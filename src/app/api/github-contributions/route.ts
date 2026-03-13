import { NextResponse } from 'next/server';
import { fetchGitHubContributions } from '@/lib/githubContributions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const now = new Date();
    const currentYear = now.getFullYear();

    let dateRange: { from: Date; to: Date } | undefined;
    if (yearParam) {
      const year = parseInt(yearParam, 10);
      dateRange = {
        from: new Date(`${year}-01-01T00:00:00Z`),
        to: year === currentYear ? now : new Date(`${year}-12-31T23:59:59Z`),
      };
    }

    const data = await fetchGitHubContributions(dateRange);
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to fetch GitHub contributions' },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
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
