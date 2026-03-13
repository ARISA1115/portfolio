'use client';

import { useState } from 'react';
import type { Article } from '@/types';
import { getTagColor } from '@/utils/getTagColor';
import Pagination from '@/components/ui/Pagination';
import Card from '@/components/ui/Card';
import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type Props = {
  articles: Article[];
};

const FILTERS = ['All', 'Frontend', 'Backend', 'DevOps', 'Terraform', 'Network', 'Security'];
const ARTICLES_PER_PAGE = 10;

export default function ArticlesClient({ articles }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Articles</h1>
          <p className="text-gray-400 text-lg">技術を学ぶ中での気づきや発見を記録し、発信しています</p>
        </div>

        {/* Filter & Search */}
        <Card className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="記事を検索"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paginatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
            />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">記事が見つかりませんでした</div>
            <p className="text-gray-500 text-sm mt-2">別のキーワードで検索してみてください</p>
          </div>
        )}

        <Pagination
          totalItems={filteredArticles.length}
          itemsPerPage={ARTICLES_PER_PAGE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

type ArticleCardProps = {
  article: Article;
  tagFilter: string | null;
  setTagFilter: (tag: string | null) => void;
};

function ArticleCard({ article, tagFilter, setTagFilter }: ArticleCardProps) {
  return (
    <Card className="hover:bg-slate-800/70 transition-all duration-300 group">
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

      {article.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getTagColor(tag)} ${
              tagFilter === tag ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </Card>
  );
}
