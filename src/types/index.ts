export type SkillData = {
  name: string;
  level: number;
}

export type SkillCategory = {
  name: string;
  skills: SkillData[];
}

export type LearningFocus = {
  title: string;
  description: string;
  progress?: number;
}


export type Project = {
  id: string;
  title: string;
  description: string;
  points: string[];
  stacks: {
    frontend: string[];
    backend: string[];
    infra: string[];
    others?: string[];
  };
  tags: string[];
  category: 'Personal' | 'Hackathon';
  icon?: React.ReactNode;
  githubUrl?: string;
  imageUrl: string;
  imageUrls: string[];
}

export type Article = {
  id: number;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  url: string;
  platform: 'qiita' | 'zenn'; 
};