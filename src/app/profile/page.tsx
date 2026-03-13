import SkillRadarChart from '@/components/charts/SkillRadarChart';
import ContributionGraph from '@/components/features/github/ContributionGraph';
import Card from '@/components/ui/Card';
import { skillCategories as staticSkillCategories } from '@/data/skills';
import { mergeSkillsWithGitHub } from '@/data/githubSkillMapping';
import { fetchGitHubLanguageLevels } from '@/lib/githubSkills';
import { fetchGitHubContributions } from '@/lib/githubContributions';
import { experienceCategories } from '@/data/experience';
import { profile } from '@/data/profile';
import type { SkillCategory } from '@/types';
import {
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { FaGithub } from 'react-icons/fa6';
import XIcon from '@/components/icons/Xicon';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let skillCategories: SkillCategory[] = staticSkillCategories;
  const [githubLevels, contributionData] = await Promise.all([
    fetchGitHubLanguageLevels(),
    fetchGitHubContributions(),
  ]);
  if (githubLevels !== null) {
    skillCategories = mergeSkillsWithGitHub(staticSkillCategories, githubLevels);
  }

  return (
    <div className="min-h-screen pt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-400 text-lg">セキュリティ・データ基盤・SaaSの設計・実装・インフラを担当しています</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="w-20 h-20 mb-5 mx-auto flex items-center justify-center rounded-lg bg-blue-500/10 transition">
                <Image
                  src="/images/penguin.png"
                  alt="Penguin Icon"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span>Started: {profile.startedAt}</span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={profile.social.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaGithub className="w-5 h-5 text-gray-400" />
                  <span className="truncate">{profile.social.github.label}</span>
                </a>
                <a
                  href={profile.social.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-400" />
                  <span className="truncate">{profile.social.twitter.label}</span>
                </a>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                About Me
              </h3>
              <div className="text-gray-300 mb-6 space-y-2">
                <p>{profile.bio}</p>
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
            </Card>
          </div>
        </div>

        <ContributionGraph initialData={contributionData} />

        <section id="skills" className="mt-12">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center flex items-center justify-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-white" />
            Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => {
              const colors = ['#06b6d4', '#3b82f6', '#6366f1'];
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
