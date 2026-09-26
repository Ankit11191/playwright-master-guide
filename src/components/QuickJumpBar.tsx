import React, { useState } from 'react';
import { PLAYWRIGHT_QUESTIONS } from '../data/playwrightQuestions';

interface QuickJumpBarProps {
  activeQuestionId?: number;
  onSelectQuestion: (id: number) => void;
  masteredIds: Set<number>;
  bookmarkedIds: Set<number>;
}

export const QuickJumpBar: React.FC<QuickJumpBarProps> = ({
  activeQuestionId,
  onSelectQuestion,
  masteredIds,
  bookmarkedIds,
}) => {
  const [selectedRange, setSelectedRange] = useState<'all' | '1-50' | '51-100' | '101-160'>('1-50');

  const displayedQuestions = PLAYWRIGHT_QUESTIONS.filter((q) => {
    if (selectedRange === '1-50') return q.id >= 1 && q.id <= 50;
    if (selectedRange === '51-100') return q.id >= 51 && q.id <= 100;
    if (selectedRange === '101-160') return q.id >= 101 && q.id <= 160;
    return true; // 'all'
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Quick Jump Grid (1 — {PLAYWRIGHT_QUESTIONS.length})</span>
          <span className="text-[11px] text-slate-400">· Click question # to jump</span>
        </div>

        {/* Range Segment Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs self-start sm:self-auto font-medium">
          <button
            onClick={() => setSelectedRange('1-50')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedRange === '1-50' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Q1–50
          </button>
          <button
            onClick={() => setSelectedRange('51-100')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedRange === '51-100' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Q51–100
          </button>
          <button
            onClick={() => setSelectedRange('101-160')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedRange === '101-160' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Q101–160
          </button>
          <button
            onClick={() => setSelectedRange('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedRange === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (160)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span>Mastered</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
            <span>Starred</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-10 sm:grid-cols-25 gap-1.5 max-h-60 overflow-y-auto pr-1">
        {displayedQuestions.map((q) => {
          const isMastered = masteredIds.has(q.id);
          const isBookmarked = bookmarkedIds.has(q.id);
          const isActive = activeQuestionId === q.id;

          let btnColor = "bg-slate-100 text-slate-700 hover:bg-slate-200";
          if (isMastered) btnColor = "bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200";
          else if (isBookmarked) btnColor = "bg-amber-100 text-amber-800 font-bold hover:bg-amber-200";

          if (isActive) {
            btnColor += " ring-2 ring-slate-900";
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q.id)}
              className={`h-7 rounded text-xs font-mono tabular-nums transition-all flex items-center justify-center ${btnColor}`}
              title={`Q${q.id} [${q.difficulty}]: ${q.question}`}
            >
              {q.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
