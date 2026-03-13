import { readFile } from 'fs/promises';
import path from 'path';
import { articles as staticArticles } from '../../data/articles';
import type { Article } from '../../types';
import ArticlesClient from './ArticlesClient';

async function getArticles(): Promise<Article[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as Article[];
  } catch {
    return staticArticles;
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return <ArticlesClient articles={articles} />;
}
