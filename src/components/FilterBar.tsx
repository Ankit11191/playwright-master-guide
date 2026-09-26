import React from 'react';
import {
  Search,
  X,
  CheckCircle,
  Bookmark,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Filter,
  GraduationCap
} from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  statusFilter: 'all' | 'mastered' | 'unmastered' | 'bookmarked';
  setStatusFilter: (status: 'all' | 'mastered' | 'unmastered' | 'bookmarked') => void;
  categories: string[];
  totalQuestions: number;
  filteredCount: number;
  isAllExpanded: boolean;
  onToggleExpandAll: () => void;
  onResetFilters: () => void;
  onOpenTopicDrawer?: () => void;
  difficultyCounts?: {
    All: number;
    Beginner: number;
    Intermediate: number;
    Advanced: number;
  };
  categoryCounts?: Record<string, number>;
  masteredCount?: number;
  bookmarkedCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  statusFilter,
  setStatusFilter,
  categories,
  totalQuestions,
  filteredCount,
  isAllExpanded,
  onToggleExpandAll,
  onResetFilters,
  onOpenTopicDrawer,
  difficultyCounts,
  categoryCounts = {},
  masteredCount = 0,
  bookmarkedCount = 0,
}) => {
  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedDifficulty !== 'All' || 
    statusFilter !== 'all';

  const diffCounts = difficultyCounts || {
    All: totalQuestions,
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0,
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-2xs space-y-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Row 1: Search input + Primary Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search all ${totalQuestions} questions, methods (storageState, getByRole, route)...`}
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Topic Sheet Trigger for Mobile / Touch */}
            {onOpenTopicDrawer && (
              <button
                onClick={onOpenTopicDrawer}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Categories & Level</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 ml-0.5" />
                )}
              </button>
            )}

            {/* Expand / Collapse All */}
            <button
              onClick={onToggleExpandAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              {isAllExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Collapse All</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Expand All</span>
                </>
              )}
            </button>

            {/* Reset Filters if active */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Difficulty Level Selector Chips (Requested feature) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>Difficulty:</span>
            </div>

            {/* All Levels */}
            <button
              onClick={() => setSelectedDifficulty('All')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>All Levels</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedDifficulty === 'All' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
              }`}>
                {diffCounts.All}
              </span>
            </button>

            {/* Beginner */}
            <button
              onClick={() => setSelectedDifficulty('Beginner')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'Beginner'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Beginner</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedDifficulty === 'Beginner' ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-200/70 text-emerald-900'
              }`}>
                {diffCounts.Beginner}
              </span>
            </button>

            {/* Intermediate */}
            <button
              onClick={() => setSelectedDifficulty('Intermediate')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'Intermediate'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Intermediate</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedDifficulty === 'Intermediate' ? 'bg-blue-700 text-blue-100' : 'bg-blue-200/70 text-blue-900'
              }`}>
                {diffCounts.Intermediate}
              </span>
            </button>

            {/* Advanced */}
            <button
              onClick={() => setSelectedDifficulty('Advanced')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                selectedDifficulty === 'Advanced'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Advanced</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedDifficulty === 'Advanced' ? 'bg-purple-700 text-purple-100' : 'bg-purple-200/70 text-purple-900'
              }`}>
                {diffCounts.Advanced}
              </span>
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              <span>Topic:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[240px] truncate"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} {categoryCounts[cat] ? `(${categoryCounts[cat]})` : '(0)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2.5: Interactive Category Filter Chips based on Difficulty */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Topics</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedCategory === 'All' ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {selectedDifficulty === 'All' 
                ? totalQuestions 
                : diffCounts[selectedDifficulty as keyof typeof diffCounts] || 0}
            </span>
          </button>

          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs ring-1 ring-emerald-600'
                    : count === 0
                    ? 'bg-slate-50 text-slate-400 border border-slate-200/50 opacity-50 cursor-default'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                }`}
                title={count === 0 ? `No ${selectedDifficulty} questions in ${cat}` : `Filter by ${cat}`}
                disabled={count === 0 && selectedDifficulty !== 'All'}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-emerald-700 text-emerald-100'
                    : count === 0
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Study Status Filters (All, Mastered, Needs Practice, Starred) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Questions ({totalQuestions})
            </button>
            <button
              onClick={() => setStatusFilter('mastered')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'mastered'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mastered</span>
              {masteredCount > 0 && (
                <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                  {masteredCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('unmastered')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'unmastered'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Practice
            </button>
            <button
              onClick={() => setStatusFilter('bookmarked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'bookmarked'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Starred</span>
              {bookmarkedCount > 0 && (
                <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                  {bookmarkedCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                  Topic: <strong>{selectedCategory}</strong>
                  <button onClick={() => setSelectedCategory('All')} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDifficulty !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                  Level: <strong>{selectedDifficulty}</strong>
                  <button onClick={() => setSelectedDifficulty('All')} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                  Status: <strong>{statusFilter}</strong>
                  <button onClick={() => setStatusFilter('all')} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Counter and current active filter summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800 font-mono tabular-nums">{filteredCount}</strong> of <span className="font-mono tabular-nums">{totalQuestions}</span> questions
            </span>
            {hasActiveFilters && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">Active filter applied</span>
              </>
            )}
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Offline ready · Filter by difficulty or topic above
          </div>
        </div>
      </div>
    </div>
  );
};
