import type { SkillCategory, LearningFocus } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'HTML/CSS', level: 80 },
      { name: 'JavaScript', level: 60 },
      { name: 'TypeScript', level: 50 },
      { name: 'React.js', level: 55 },
      { name: 'Next.js', level: 50 },
      { name: 'Tailwind CSS', level: 50 }
    ]
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Python', level: 60 },
      { name: 'FastAPI', level: 50 },
      { name: 'Django', level: 45 },
      { name: 'Go', level: 20 },
      { name: 'Echo', level: 20 },
      { name: 'MySQL', level: 70 }
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', level: 70 },
      { name: 'Docker', level: 50 },
      { name: 'Terraform', level: 35 },
      { name: 'GitHub Actions', level: 70 },
      { name: 'Linux', level: 60 },
      { name: 'Kubernetes', level: 0 }
    ]
  }
];

export const learningFocus: LearningFocus[] = [
  {
    title: 'AWS Cloud Architecture',
    description: 'SAA、SAP資格取得を目指してクラウドアーキテクチャを学習',
    progress: 30
  },
  {
    title: 'DevOps & CI/CD',
    description: 'GitHub Actions や Docker を用いた AWS 向け CI/CD の構築と、Terraform による IaC を学習',
    progress: 60
  },
  {
    title: 'Modern Frontend Development',
    description: 'React/Next.js、TypeScriptを使ったモダンなフロントエンド開発',
    progress: 50
  }
];