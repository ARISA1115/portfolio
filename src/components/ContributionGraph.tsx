'use client';

import { useState, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa6';
import type { ContributionData } from '@/lib/githubContributions';

type Data = { totalContributions: number; weeks: { contributionDays: { date: string; contributionCount: number }[] }[] };

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2024; // GitHubを始めた年
const AVAILABLE_YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

type Week = { contributionDays: { date: string; contributionCount: number }[] };

/**
 * 年を指定してその年の Jan 1〜Dec 31 を網羅する週配列を生成する。
 * 既存データは countByDate から引き、未来日や取得範囲外のセルは count=0 にする。
 */
function padWeeksToFullYear(
  existingWeeks: Week[],
  year: number
): Week[] {
  const countByDate = new Map<string, number>();
  existingWeeks.forEach((w) =>
    w.contributionDays.forEach((d) => countByDate.set(d.date, d.contributionCount))
  );

  const jan1 = new Date(`${year}-01-01T00:00:00Z`);
  const dec31 = new Date(`${year}-12-31T00:00:00Z`);

  // Jan 1 を含む週の日曜日から開始
  const cursor = new Date(jan1);
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());

  const paddedWeeks: Week[] = [];
  while (cursor <= dec31) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      days.push({ date: dateStr, contributionCount: countByDate.get(dateStr) ?? 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    paddedWeeks.push({ contributionDays: days });
  }
  return paddedWeeks;
}

/** コントリビューション数に応じた紫のグラデーション（0〜4+の5段階・紫で統一） */
function getLevelClass(count: number): string {
  if (count <= 0) return 'bg-slate-700/50';
  if (count <= 1) return 'bg-violet-400/40';
  if (count <= 2) return 'bg-violet-500';
  if (count <= 3) return 'bg-violet-600';
  if (count <= 4) return 'bg-violet-700';
  return 'bg-violet-800';
}

const CELL_GAP = 3;

/** 日付を "January 6th" 形式で表示 */
function formatTooltipDate(isoDate: string): string {
  const d = new Date(isoDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return `${months[d.getMonth()]} ${day}${suffix}`;
}

type TooltipState = { text: string; x: number; y: number } | null;

interface Props {
  initialData?: ContributionData | null;
}

export default function ContributionGraph({ initialData }: Props) {
  // null = 初期状態（過去12ヶ月表示）、数値 = 選択した暦年
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [data, setData] = useState<Data | null>(initialData ?? null);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const switchYear = useCallback(async (year: number) => {
    if (year === selectedYear) {
      // 選択中の年をもう一度クリックしたら初期状態（過去12ヶ月）に戻す
      setSelectedYear(null);
      setData(initialData ?? null);
      return;
    }
    setSelectedYear(year);
    setLoading(true);
    try {
      const res = await fetch(`/api/github-contributions?year=${year}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      const body = (await res.json()) as Data;
      setData(body);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, initialData]);

  const yearButtons = (
    <div className="flex gap-2 justify-center flex-wrap">
      {AVAILABLE_YEARS.map((year) => (
        <button
          key={year}
          onClick={() => switchYear(year)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedYear === year
              ? 'bg-violet-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );

  if (!data) {
    return (
      <section className="mt-12" aria-label="GitHub contribution graph">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
            <FaGithub className="w-6 h-6 text-white" />
            Contribution activity
          </h3>
          {yearButtons}
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 min-h-[180px] flex items-center justify-center">
          <span className="text-gray-500">
            {loading ? 'Loading...' : 'Contribution graph could not be loaded.'}
          </span>
        </div>
      </section>
    );
  }

  // 年を明示選択しているときは Jan 1〜Dec 31 の全週にパディングして GitHub と同じフル表示にする
  const displayWeeks = selectedYear !== null
    ? padWeeksToFullYear(data.weeks, selectedYear)
    : data.weeks;

  const numWeeks = displayWeeks.length;
  // 7行（曜日）× 週数。各セルに { count, date } を格納（ホバーで日付表示用）
  type Cell = { count: number; date: string };
  const grid: Cell[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: numWeeks }, () => ({ count: 0, date: '' }))
  );
  const firstDayStr = displayWeeks[0]?.contributionDays[0]?.date;
  const firstSunday = firstDayStr
    ? (() => {
        const d = new Date(firstDayStr);
        d.setDate(d.getDate() - d.getDay());
        return d;
      })()
    : null;
  displayWeeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day) => {
      const d = new Date(day.date);
      const dayOfWeek = d.getDay();
      grid[dayOfWeek][weekIndex] = { count: day.contributionCount, date: day.date };
    });
  });
  // 日付が空のセルは週・曜日から算出
  if (firstSunday) {
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < numWeeks; col++) {
        if (!grid[row][col].date) {
          const d = new Date(firstSunday);
          d.setDate(d.getDate() + col * 7 + row);
          grid[row][col].date = d.toISOString().slice(0, 10);
        }
      }
    }
  }

  return (
    <section className="mt-12" aria-label="GitHub contribution graph">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
          <FaGithub className="w-6 h-6 text-white" />
          Contribution activity
        </h3>
        {yearButtons}
      </div>
      <div className={`bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 relative transition-opacity ${loading ? 'opacity-50' : ''}`}>
        <p className="text-gray-400 text-sm mb-4">
          {data.totalContributions.toLocaleString()} contributions{' '}
          {selectedYear === null ? 'in the last year' : `in ${selectedYear}`}
        </p>

        <div className="w-full max-w-full overflow-hidden">
          <div className="flex flex-col gap-2 min-w-0 w-full">
            <div className="flex gap-2 min-w-0 w-full">
              {/* 曜日ラベル */}
              <div className="flex flex-col justify-around text-gray-500 shrink-0 py-0.5 w-6 text-xs">
                {DAY_LABELS.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>

              {/* グラフ本体: コンテナ幅いっぱいに広がり、マスは正方形（横スクロールなし） */}
              <div
                className="grid min-w-0 flex-1"
                style={{
                  gridTemplateColumns: `repeat(${numWeeks}, minmax(0, 1fr))`,
                  gridTemplateRows: 'repeat(7, auto)',
                  gap: CELL_GAP,
                }}
              >
                {grid.flatMap((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const tooltipText =
                      cell.count === 0
                        ? `No contributions on ${formatTooltipDate(cell.date)}`
                        : `${cell.count} contribution${cell.count !== 1 ? 's' : ''} on ${formatTooltipDate(cell.date)}`;
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-full min-w-0 aspect-square rounded-[3px]"
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            text: tooltipText,
                            x: rect.left + rect.width / 2,
                            y: rect.bottom,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <div
                          className={`w-full h-full rounded-[3px] ${getLevelClass(cell.count)} cursor-default`}
                          aria-label={tooltipText}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* カスタムツールチップ（サイトUIに合わせたスタイル） */}
            {tooltip && (
              <div
                className="fixed z-50 px-3 py-2 text-sm text-gray-200 bg-slate-800 border border-slate-600 rounded-lg shadow-lg pointer-events-none whitespace-nowrap -translate-x-1/2 translate-y-1.5"
                style={{ left: tooltip.x, top: tooltip.y }}
                role="tooltip"
              >
                {tooltip.text}
              </div>
            )}

            {/* 凡例（右寄せ・英語） */}
            <div className="flex items-center justify-end gap-2 mt-3 text-gray-500 text-xs pl-8">
              <span>Less</span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-[3px] shrink-0 ${getLevelClass(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        <a
          href="https://github.com/ARISA1115"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View GitHub profile →
        </a>
      </div>
    </section>
  );
}
