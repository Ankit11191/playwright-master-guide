import React from 'react';
import { Search, X, CheckCircle, Bookmark, SlidersHorizontal, ChevronDown, ChevronUp, Filter } from 'lucide-react';

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
}) => {
  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedDifficulty !== 'All' || 
    statusFilter !== 'all';

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top row: Search input + Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 50 questions, methods (storageState, getByRole, page.route)..."
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
                <span>Topics & Filters</span>
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
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded hover:bg-emerald-50 transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Second row: Segmented Status Controls + Category dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (50)
            </button>
            <button
              onClick={() => setStatusFilter('mastered')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'mastered'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Mastered
            </button>
            <button
              onClick={() => setStatusFilter('unmastered')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === 'unmastered'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Practice
            </button>
            <button
              onClick={() => setStatusFilter('bookmarked')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'bookmarked'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Starred
            </button>
          </div>

          {/* Difficulty & Category selector */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[200px] truncate"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
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
                <span className="text-emerald-700 font-medium">Filtered</span>
              </>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Offline ready · Tap any card to reveal answer
          </div>
        </div>
      </div>
    </div>
  );
};
