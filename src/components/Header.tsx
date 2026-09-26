import React from 'react';
import { 
  Bookmark, 
  Download, 
  Sparkles, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  FileText, 
  CheckCircle2,
  Smartphone,
  WifiOff
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'questions' | 'flashcards' | 'quiz' | 'architecture' | 'cheatsheet';
  setActiveTab: (tab: 'questions' | 'flashcards' | 'quiz' | 'architecture' | 'cheatsheet') => void;
  masteredCount: number;
  bookmarkedCount: number;
  onOpenExport: () => void;
  onOpenInstallModal: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  masteredCount,
  bookmarkedCount,
  onOpenExport,
  onOpenInstallModal,
  isInstallable,
  isInstalled,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      {/* Offline Alert Strip if offline */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-[11px] font-semibold py-1 px-4 text-center flex items-center justify-center gap-1.5 shadow-inner">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active — All 50 Questions & Code Cached for Offline Android Reading</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('questions')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-emerald-700 transition-colors">
                PW
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Playwright 50
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  Android App Ready
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'questions'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                All 50 Q&A
              </span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'flashcards'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Study Cards
              </span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Interview Quiz
              </span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" />
                Architecture Lab
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'cheatsheet'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                Cheat Sheet
              </span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Progress counter */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600 pr-2 border-r border-slate-200">
              <span className="flex items-center gap-1" title="Mastered Questions">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono tabular-nums font-semibold text-slate-900">{masteredCount}</span>/50
              </span>
              <span className="flex items-center gap-1" title="Bookmarked Questions">
                <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-mono tabular-nums font-semibold text-slate-900">{bookmarkedCount}</span>
              </span>
            </div>

            {/* Android Install Button */}
            <button
              onClick={onOpenInstallModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                isInstalled
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse-subtle'
              }`}
              title="Install Android app"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'Android App' : 'Install App'}</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Export questions to Markdown or JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
