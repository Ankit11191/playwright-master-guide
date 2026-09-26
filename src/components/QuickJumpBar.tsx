import React from 'react';
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
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Quick Jump Grid (1 — 50)</span>
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

      <div className="grid grid-cols-10 sm:grid-cols-25 gap-1.5">
        {PLAYWRIGHT_QUESTIONS.map((q) => {
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
              title={`Q${q.id}: ${q.question}`}
            >
              {q.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
