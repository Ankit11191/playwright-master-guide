import React, { useState } from 'react';
import { X, Check, Bookmark, CheckCircle, Search, SlidersHorizontal, GraduationCap } from 'lucide-react';
import { PLAYWRIGHT_QUESTIONS } from '../data/playwrightQuestions';

interface AndroidTopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (diff: string) => void;
  statusFilter: 'all' | 'mastered' | 'unmastered' | 'bookmarked';
  setStatusFilter: (status: 'all' | 'mastered' | 'unmastered' | 'bookmarked') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  masteredIds: Set<number>;
  bookmarkedIds: Set<number>;
  onSelectQuestion: (id: number) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  difficultyCounts?: {
    All: number;
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
}

export const AndroidTopicDrawer: React.FC<AndroidTopicDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  masteredIds,
  bookmarkedIds,
  onSelectQuestion,
  onResetFilters,
  hasActiveFilters,
  difficultyCounts,
}) => {
  const [jumpRange, setJumpRange] = useState<'1-50' | '51-100' | '101-160' | 'all'>('1-50');

  if (!isOpen) return null;

  const totalQuestions = PLAYWRIGHT_QUESTIONS.length;
  const diffCounts = difficultyCounts || {
    All: totalQuestions,
    Beginner: PLAYWRIGHT_QUESTIONS.filter(q => q.difficulty === 'Beginner').length,
    Intermediate: PLAYWRIGHT_QUESTIONS.filter(q => q.difficulty === 'Intermediate').length,
    Advanced: PLAYWRIGHT_QUESTIONS.filter(q => q.difficulty === 'Advanced').length,
  };

  const jumpQuestions = PLAYWRIGHT_QUESTIONS.filter((q) => {
    if (jumpRange === '1-50') return q.id >= 1 && q.id <= 50;
    if (jumpRange === '51-100') return q.id >= 51 && q.id <= 100;
    if (jumpRange === '101-160') return q.id >= 101 && q.id <= 160;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Android Drawer Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Categories & Difficulty Filter
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded bg-emerald-50"
              >
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1 text-xs">
          {/* Quick Search inside Drawer */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search methods, topics, concepts..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Difficulty Level with Dynamic Counts */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-slate-800">Difficulty Level</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { lvl: 'All', label: 'All Levels', count: diffCounts.All, color: 'border-slate-300' },
                { lvl: 'Beginner', label: 'Beginner', count: diffCounts.Beginner, color: 'border-emerald-300 text-emerald-800' },
                { lvl: 'Intermediate', label: 'Intermediate', count: diffCounts.Intermediate, color: 'border-blue-300 text-blue-800' },
                { lvl: 'Advanced', label: 'Advanced', count: diffCounts.Advanced, color: 'border-purple-300 text-purple-800' },
              ].map(({ lvl, label, count, color }) => {
                const isSelected = selectedDifficulty === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`py-2 px-3 text-left rounded-lg transition-colors flex items-center justify-between border ${color} ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold border-slate-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics / Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">Select Topic Domain</span>
              <span className="text-[11px] text-slate-400">8 Categories</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>All Topics ({totalQuestions})</span>
                {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>

              {categories.map((cat) => {
                const count = PLAYWRIGHT_QUESTIONS.filter((q) => 
                  q.category === cat && (selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
                ).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    disabled={count === 0 && selectedDifficulty !== 'All'}
                    className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-semibold'
                        : count === 0
                        ? 'bg-slate-50 text-slate-400 opacity-50 cursor-default'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="truncate pr-1">{cat}</span>
                    <span className="font-mono text-[10px] opacity-80 shrink-0">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <span className="font-bold text-slate-800 block mb-2">Study Progress Status</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: `All (${totalQuestions})`, icon: null },
                { id: 'mastered', label: `Mastered (${masteredIds.size})`, icon: CheckCircle },
                { id: 'unmastered', label: 'Needs Practice', icon: null },
                { id: 'bookmarked', label: `Starred (${bookmarkedIds.size})`, icon: Bookmark },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStatusFilter(item.id as any)}
                  className={`py-2 px-3 text-left rounded-lg transition-colors flex items-center justify-between ${
                    statusFilter === item.id
                      ? 'bg-emerald-50 border border-emerald-500 text-emerald-950 font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.icon && <item.icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Question Picker Grid (1-160 with range tabs) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">Jump to Question (1–{totalQuestions})</span>
              <div className="flex gap-1 text-[10px]">
                <button
                  onClick={() => setJumpRange('1-50')}
                  className={`px-1.5 py-0.5 rounded ${jumpRange === '1-50' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  1-50
                </button>
                <button
                  onClick={() => setJumpRange('51-100')}
                  className={`px-1.5 py-0.5 rounded ${jumpRange === '51-100' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  51-100
                </button>
                <button
                  onClick={() => setJumpRange('101-160')}
                  className={`px-1.5 py-0.5 rounded ${jumpRange === '101-160' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}
                >
                  101-160
                </button>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-1.5 max-h-48 overflow-y-auto">
              {jumpQuestions.map((q) => {
                const isM = masteredIds.has(q.id);
                const isB = bookmarkedIds.has(q.id);
                let btnCls = "bg-slate-100 text-slate-700 hover:bg-slate-200";
                if (isM) btnCls = "bg-emerald-100 text-emerald-800 font-bold";
                else if (isB) btnCls = "bg-amber-100 text-amber-800 font-bold";

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuestion(q.id);
                      onClose();
                    }}
                    className={`h-7 rounded text-xs font-mono tabular-nums flex items-center justify-center ${btnCls}`}
                    title={`Q${q.id} [${q.difficulty}]: ${q.question}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-3 shrink-0">
          <button
            onClick={onResetFilters}
            className="flex-1 py-2.5 px-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Apply & View
          </button>
        </div>
      </div>
    </div>
  );
};
