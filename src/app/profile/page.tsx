import SkillRadarChart from '../../components/charts/SkillRadarChart';
import { skillCategories, learningFocus } from '../../data/skills';
import type { LearningFocus, SkillCategory } from '../../types';
import {
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { FaGithub } from 'react-icons/fa6';
import XIcon from '../../components/icons/Xicon';
import Image from 'next/image';


export default function Profile() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
                  width={50}
                  height={50}
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
              <div className="text-gray-300 space-y-4">
                <p>
                  2024年5月から IT スクール「RareTECH」でフロントエンド、バックエンド、クラウド、DevOps <br />を幅広く学び、React／TypeScript／Next.js、AWS、Docker、Terraform を用いた開発や CI/CDや<br />IaCの基盤を実践しました。
                </p>
                <p>
                  IT ヘルプデスクとしての現場経験を経て、2025年9月からはエンジニアとして勤務しています。
                </p>
                <p>
                 現在は、Intel RealSense・Omron 環境センサを用いたデータ収集基盤の開発を担当し、<br />Django ベースの API 実装や MongoDB／Redis によるデータ管理・処理フローの構築を進めています。
                </p>
                <p>
                  さらに Unity との連携によるデータ可視化にも取り組んでおり、C# と Unity を活用した開発も行って<br />います。
                </p>
</div>
            </section>

            {/* Current Learning Focus Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5" />
                Current Learning Focus
              </h3>
              <div className="space-y-4">
                {learningFocus.map((focus: LearningFocus, index: number) => (
                  <div key={index} className="border border-slate-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{focus.title}</h4>
                    <p className="text-gray-400 text-sm mb-3">{focus.description}</p>
                    {focus.progress && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-blue-400">{focus.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${focus.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
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
            {skillCategories.map((category: SkillCategory, index: number) => {
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