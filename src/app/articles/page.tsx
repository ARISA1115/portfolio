'use client';

import { useState } from 'react';
import { articles } from '../../data/articles';
import type { Article } from '../../types';
import { getTagColor } from '@/utils/getTagColor';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Articles() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  const filters = ['All', 'Frontend', 'Backend', 'DevOps', 'Terraform', 'Network', 'Security'];

  const filteredArticles = articles
    .filter((article) => {
      const matchesFilter = activeFilter === 'All' || article.category === activeFilter;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !tagFilter || article.tags.includes(tagFilter);
      return matchesFilter && matchesSearch && matchesTag;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <div className="min-h-screen pt-16 relative">
      {/* (overlay removed to keep body/footer background continuous) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Articles</h1>
          <p className="text-gray-400 text-lg">技術を学ぶ中での気づきや発見を記録し、発信しています</p>
        </div>

        {/* Filter & Search */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${activeFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="記事を検索"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paginatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              getTagColor={getTagColor}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">記事が見つかりませんでした</div>
            <p className="text-gray-500 text-sm mt-2">別のキーワードで検索してみてください</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-md font-semibold ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type ArticleCardProps = {
  article: Article;
  getTagColor: (tag: string) => string;
  tagFilter: string | null;
  setTagFilter: (tag: string | null) => void;
};

function ArticleCard({ article, getTagColor, tagFilter, setTagFilter }: ArticleCardProps) {
  return (
    <article className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:bg-slate-800/70 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <CalendarIcon className="w-4 h-4" />
          <span>{article.date}</span>
        </div>
        <div className="flex items-center">
          {article.platform === 'qiita' && (
            <Image src="/images/qiita.png" alt="Qiita" width={20} height={20} className="w-5 h-5" />
          )}
          {article.platform === 'zenn' && (
            <Image src="/images/zenn.png" alt="Zenn" width={20} height={20} className="w-5 h-5" />
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {article.title}
        </a>
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getTagColor(tag)
              } ${tagFilter === tag ? 'ring-2 ring-blue-400' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  );
}