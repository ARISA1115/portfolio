import { NextResponse } from 'next/server';
import { fetchGitHubLanguageLevels } from '@/lib/githubSkills';

export async function GET() {
  const normalized = await fetchGitHubLanguageLevels();
  if (normalized === null) {
    return NextResponse.json(
      { error: 'Failed to fetch GitHub languages' },
      { status: 500 }
    );
  }
  return NextResponse.json(normalized, {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
