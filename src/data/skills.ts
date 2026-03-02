import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'HTML/CSS', level: 80 },
      { name: 'JavaScript', level: 60 },
      { name: 'TypeScript', level: 50 },
      { name: 'React', level: 60 },
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
      { name: 'C#', level: 10 },
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
      { name: 'GCP', level: 0 }
    ]
  }
];