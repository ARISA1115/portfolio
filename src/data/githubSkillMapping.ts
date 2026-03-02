import type { SkillCategory } from '../types';

/**
 * GitHub API の言語名 → 既存スキル（カテゴリ名 + スキル名）へのマッピング。
 * 複数言語が同一スキルにマップする場合（例: HTML + CSS → HTML/CSS）は
 * マージ時に最大値を使う。
 */
export const githubLanguageToSkill: Record<
  string,
  { category: string; skill: string }
> = {
  Python: { category: 'Backend', skill: 'Python' },
  TypeScript: { category: 'Frontend', skill: 'TypeScript' },
  JavaScript: { category: 'Frontend', skill: 'JavaScript' },
  Go: { category: 'Backend', skill: 'Go' },
  'C#': { category: 'Backend', skill: 'C#' },
  HTML: { category: 'Frontend', skill: 'HTML/CSS' },
  CSS: { category: 'Frontend', skill: 'HTML/CSS' },
  HCL: { category: 'DevOps & Cloud', skill: 'Terraform' },
};

/**
 * 静的 skillCategories と GitHub 言語別 0–100 をマージする。
 * マッピングにあるスキルは GitHub 値で上書き（同一スキルに複数言語がある場合は最大値）。
 */
export function mergeSkillsWithGitHub(
  staticCategories: SkillCategory[],
  githubLevels: Record<string, number>
): SkillCategory[] {
  const merged = staticCategories.map((cat) => ({
    name: cat.name,
    skills: cat.skills.map((s) => ({ ...s })),
  }));

  const levelByKey: Record<string, number> = {};
  for (const [lang, level] of Object.entries(githubLevels)) {
    const map = githubLanguageToSkill[lang];
    if (!map) continue;
    const key = `${map.category}:${map.skill}`;
    levelByKey[key] = Math.max(levelByKey[key] ?? 0, level);
  }

  for (const cat of merged) {
    for (const skill of cat.skills) {
      const key = `${cat.name}:${skill.name}`;
      if (levelByKey[key] !== undefined) {
        skill.level = levelByKey[key];
      }
    }
  }

  return merged;
}
