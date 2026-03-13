'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  CodeBracketIcon,
  CommandLineIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';
import { skillCategories } from '@/data/skills';

const SKILL_CARD_STYLES = [
  {
    icon: CodeBracketIcon,
    border: 'hover:border-cyan-400',
    iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: CommandLineIcon,
    border: 'hover:border-blue-400',
    iconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: CloudIcon,
    border: 'hover:border-indigo-400',
    iconBg: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
] as const;

export default function SkillSection() {
  useEffect(() => {
    const cards = document.querySelectorAll('.skill-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-12 pb-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const style = SKILL_CARD_STYLES[index];
            const Icon = style.icon;
            const isTwoLine = index === 0 || index === 2;
            const skillList = category.skills.map((s) => s.name).join(' | ');
            const mid = Math.ceil(category.skills.length / 2);
            const line1 = category.skills.slice(0, mid).map((s) => s.name).join(' | ');
            const line2 = category.skills.slice(mid).map((s) => s.name).join(' | ');

            return (
              <Link key={category.name} href="/profile#skills">
                <div
                  className={`skill-card group bg-slate-900/60 border border-slate-700 rounded-xl p-8 text-center ${style.border} hover:shadow-xl transition duration-300`}
                >
                  <div
                    className={`w-14 h-14 mb-5 mx-auto flex items-center justify-center rounded-lg ${style.iconBg} transition`}
                  >
                    <Icon className={`w-8 h-8 ${style.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white tracking-wide mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm tracking-wide leading-relaxed min-h-[2.75rem] text-center">
                    {isTwoLine ? (
                      <>
                        <span className="block">{line1}</span>
                        <span className="block">{line2}</span>
                      </>
                    ) : (
                      skillList
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
