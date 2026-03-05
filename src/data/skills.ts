import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'JavaScript', level: 60 },
      { name: 'TypeScript', level: 50 },
      { name: 'React', level: 60 },
      { name: 'Tailwind CSS', level: 50 },
      { name: 'Next.js', level: 50 },
      { name: 'Nuxt.js', level: 50 }
    ]
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Python', level: 60 },
      { name: 'Go', level: 20 },
      { name: 'Java', level: 20 },
      { name: 'Kotlin', level: 20 },
      { name: 'C#', level: 10 },
      { name: 'Rust', level: 15 }
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', level: 70 },
      { name: 'GCP', level: 55 },
      { name: 'Docker', level: 50 },
      { name: 'GitHub Actions', level: 70 },
      { name: 'Linux', level: 60 },
      { name: 'Terraform', level: 35 }
    ]
  }
];