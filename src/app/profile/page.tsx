import SkillRadarChart from '../../components/charts/SkillRadarChart';
import { skillCategories as staticSkillCategories } from '../../data/skills';
import { mergeSkillsWithGitHub } from '../../data/githubSkillMapping';
import { experienceCategories } from '../../data/experience';
import type { SkillCategory } from '../../types';
import {
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { FaGithub } from 'react-icons/fa6';
import XIcon from '../../components/icons/Xicon';
import Image from 'next/image';
import { headers } from 'next/headers';

/** リクエストのホストから base URL を組み立て（Vercel で自己 fetch が確実に動くようにする） */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  if (host) return `${proto}://${host}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export const dynamic = 'force-dynamic';

export default async function Profile() {
  let skillCategories: SkillCategory[] = staticSkillCategories;
  try {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/github-skills`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const githubLevels = (await res.json()) as Record<string, number>;
      skillCategories = mergeSkillsWithGitHub(staticSkillCategories, githubLevels);
    }
  } catch {
    // フォールバック: 静的データのまま
  }

  return (
    <div className="min-h-screen pt-16 relative">
      {/* Background overlay for consistency */}
      {/* (overlay removed to keep body/footer background continuous) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-400 text-lg">API とデータ基盤の開発を担当しています</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-24">

              {/* Avatar and Name */}
              <div className="w-20 h-20 mb-5 mx-auto flex items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition">
                <Image
                  src="/images/penguin.png"
                  alt="Penguin Icon"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Location and Join Date */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span>Osaka, Japan</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span>Started: 2024.05.28</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                <a
                  href="https://github.com/ARISA1115"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaGithub className="w-5 h-5 text-gray-400" />
                  <span className="truncate">github.com/ARISA1115</span>
                </a>
                <a
                  href="https://x.com/ar1sa1115"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-400" />
                  <span className="truncate">x.com/ar1sa1115</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* About Me Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                About Me
              </h3>
              <div className="text-gray-300 mb-6 space-y-2">
                <p>官公庁向けセキュリティ・システムからデータ基盤・SaaSまで、設計・実装・インフラまで一貫して携わっています。</p>
                <p>主な経験は以下のとおりです。</p>
              </div>
              <div className="text-gray-300 space-y-4">
                {experienceCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="font-semibold text-white mb-2">{category.title}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {category.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Skills Section */}
        <section id="skills" className="mt-12">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center flex items-center justify-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-white" />
            Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => {
              const colors = ['#06b6d4', '#3b82f6', '#6366f1']; // cyan, blue, indigo
              return (
                <SkillRadarChart
                  key={category.name}
                  skills={category.skills}
                  color={colors[index]}
                  title={category.name}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}