import type { SkillCategory } from '../types';

/**
 * GitHub API /repos/:owner/:repo/languages で返る言語名 → スキル（カテゴリ:スキル名）へのマッピング。
 * 複数言語が同一スキルにマップする場合はマージ時に最大値を使う。
 */
export const githubLanguageToSkill: Record<
  string,
  { category: string; skill: string }
> = {
  Python: { category: 'Backend', skill: 'Python' },
  TypeScript: { category: 'Frontend', skill: 'TypeScript' },
  JavaScript: { category: 'Frontend', skill: 'JavaScript' },
  Go: { category: 'Backend', skill: 'Go' },
  Java: { category: 'Backend', skill: 'Java' },
  Kotlin: { category: 'Backend', skill: 'Kotlin' },
  'C#': { category: 'Backend', skill: 'C#' },
  Rust: { category: 'Backend', skill: 'Rust' },
  Vue: { category: 'Frontend', skill: 'Nuxt.js' },
  HCL: { category: 'DevOps & Cloud', skill: 'Terraform' },
  Shell: { category: 'DevOps & Cloud', skill: 'Linux' },
};

/**
 * 静的 skillCategories と GitHub 言語別 0–100 をマージする。
 * マッピングがあるスキルは API の値をそのまま使用（レーダーチャートが API から取得した値で表示される）。
 * API にないスキル（React, Next.js, FastAPI など GitHub が言語として返さないもの）は静的値のまま。
 * 同一スキルに複数言語がマップする場合は、API 値の最大を使う。
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
      const apiLevel = levelByKey[key];
      if (apiLevel !== undefined) {
        skill.level = apiLevel;
      }
    }
  }

  return merged;
}
