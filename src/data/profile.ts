import { GITHUB_USER } from '@/config/site';

export const profile = {
  name: 'Arisa',
  location: 'Osaka, Japan',
  startedAt: '2024.05.28',
  bio: '官公庁向けセキュリティ・システムからデータ基盤・SaaSまで、設計・実装・インフラまで一貫して携わっています。',
  social: {
    github: {
      url: `https://github.com/${GITHUB_USER}`,
      label: `github.com/${GITHUB_USER}`,
    },
    twitter: {
      url: 'https://x.com/ar1sa1115',
      label: 'x.com/ar1sa1115',
    },
  },
} as const;
