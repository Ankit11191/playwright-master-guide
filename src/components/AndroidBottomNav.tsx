import React from 'react';
import { BookOpen, Filter, Sparkles, HelpCircle, FileText } from 'lucide-react';

interface AndroidBottomNavProps {
  activeTab: 'questions' | 'flashcards' | 'quiz' | 'architecture' | 'cheatsheet';
  setActiveTab: (tab: 'questions' | 'flashcards' | 'quiz' | 'architecture' | 'cheatsheet') => void;
  onOpenTopicPicker: () => void;
  hasActiveFilters: boolean;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenTopicPicker,
  hasActiveFilters,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden pb-safe">
      <div className="flex items-center justify-around h-15 px-2">
        {/* Tab 1: Questions */}
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            activeTab === 'questions'
              ? 'text-emerald-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">50 Q&A</span>
        </button>

        {/* Tab 2: Topics & Filter Drawer */}
        <button
          onClick={onOpenTopicPicker}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-800 transition-colors min-h-[44px] relative"
        >
          <Filter className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Topics</span>
          {hasActiveFilters && (
            <span className="absolute top-1.5 right-6 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
          )}
        </button>

        {/* Tab 3: Study Cards */}
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            activeTab === 'flashcards'
              ? 'text-amber-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Cards</span>
        </button>

        {/* Tab 4: Quiz */}
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            activeTab === 'quiz'
              ? 'text-blue-700 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Quiz</span>
        </button>

        {/* Tab 5: Cheatsheet */}
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            activeTab === 'cheatsheet'
              ? 'text-slate-900 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Cheatsheet</span>
        </button>
      </div>
    </nav>
  );
};
