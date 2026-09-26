import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PLAYWRIGHT_QUESTIONS, PlaywrightQuestion } from './data/playwrightQuestions';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { QuestionCard } from './components/QuestionCard';
import { StudyFlashcards } from './components/StudyFlashcards';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { CheatSheetView } from './components/CheatSheetView';
import { QuickJumpBar } from './components/QuickJumpBar';
import { ExportModal } from './components/ExportModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidTopicDrawer } from './components/AndroidTopicDrawer';
import { usePWAInstall } from './hooks/usePWAInstall';
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  ArrowUp, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Smartphone,
  Filter
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'questions' | 'flashcards' | 'quiz' | 'architecture' | 'cheatsheet'>('questions');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unmastered' | 'bookmarked'>('all');

  // Expansion state
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set([1, 2, 8]));

  // Persistence for Mastered & Bookmarked
  const [masteredIds, setMasteredIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('pw_mastered_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set([1]);
    } catch {
      return new Set([1]);
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('pw_bookmarked_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set([6, 8, 22]);
    } catch {
      return new Set([6, 8, 22]);
    }
  });

  // Modals & Drawers
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);

  // Android PWA Hook
  const { isInstallable, isInstalled, isOnline, install } = usePWAInstall();

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  // References for smooth scrolling
  const questionRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    try {
      localStorage.setItem('pw_mastered_ids', JSON.stringify(Array.from(masteredIds)));
    } catch (e) {
      console.error(e);
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_bookmarked_ids', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    PLAYWRIGHT_QUESTIONS.forEach((q) => set.add(q.category));
    return Array.from(set);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'All' ||
      selectedDifficulty !== 'All' ||
      statusFilter !== 'all'
    );
  }, [searchQuery, selectedCategory, selectedDifficulty, statusFilter]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return PLAYWRIGHT_QUESTIONS.filter((q) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = q.question.toLowerCase().includes(query);
        const inShort = q.shortAnswer.toLowerCase().includes(query);
        const inDetails = q.detailedExplanation.some((p) => p.toLowerCase().includes(query));
        const inTags = q.tags.some((t) => t.toLowerCase().includes(query));
        const inCode = q.codeSnippet?.code.toLowerCase().includes(query) || false;
        if (!inTitle && !inShort && !inDetails && !inTags && !inCode) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status
      if (statusFilter === 'mastered' && !masteredIds.has(q.id)) {
        return false;
      }
      if (statusFilter === 'unmastered' && masteredIds.has(q.id)) {
        return false;
      }
      if (statusFilter === 'bookmarked' && !bookmarkedIds.has(q.id)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, statusFilter, masteredIds, bookmarkedIds]);

  const isAllExpanded = useMemo(() => {
    if (filteredQuestions.length === 0) return false;
    return filteredQuestions.every((q) => expandedIds.has(q.id));
  }, [filteredQuestions, expandedIds]);

  const handleToggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedIds(new Set());
    } else {
      const allCurrent = new Set(expandedIds);
      filteredQuestions.forEach((q) => allCurrent.add(q.id));
      setExpandedIds(allCurrent);
    }
  };

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleMastered = (id: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setStatusFilter('all');
  };

  const handleQuickJump = (id: number) => {
    setActiveTab('questions');
    setExpandedIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      const el = questionRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const masteryPercent = Math.round((masteredIds.size / PLAYWRIGHT_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={masteredIds.size}
        bookmarkedCount={bookmarkedIds.size}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'questions' && (
          <div className="space-y-6 pb-12">
            {/* Filter & Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categories={categories}
              totalQuestions={PLAYWRIGHT_QUESTIONS.length}
              filteredCount={filteredQuestions.length}
              isAllExpanded={isAllExpanded}
              onToggleExpandAll={handleToggleExpandAll}
              onResetFilters={handleResetFilters}
              onOpenTopicDrawer={() => setIsTopicDrawerOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Android App Install Banner (if not installed yet) */}
              {!isInstalled && (
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-slate-700/50">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Use as an Android Application
                      </h3>
                      <p className="text-xs text-slate-300">
                        Install on any Android OS device for instant 1-tap launch and 100% offline access.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => setIsInstallModalOpen(true)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Install to Android
                    </button>
                    <button
                      onClick={() => setIsTopicDrawerOpen(true)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl transition-colors font-medium sm:hidden flex items-center gap-1"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Topics</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress & Quick Stats Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Interview Readiness Progress
                      </span>
                      <span className="text-xs text-slate-500">
                        ({masteredIds.size} of 50 Mastered)
                      </span>
                    </div>
                    <div className="w-full sm:w-80 bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-300"
                        style={{ width: `${masteryPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Mode switcher shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Study Modes:</span>
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors font-medium border border-amber-200/80"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Flashcards</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors font-medium border border-blue-200/80"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Practice Quiz</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('architecture')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 transition-colors font-medium border border-purple-200/80"
                    >
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>Architecture Lab</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Jump Bar (1 - 50 Grid) */}
              <QuickJumpBar
                onSelectQuestion={handleQuickJump}
                masteredIds={masteredIds}
                bookmarkedIds={bookmarkedIds}
              />

              {/* Questions List */}
              {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    No questions found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No Playwright questions match your search or filter criteria. Try adjusting your query or resetting filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      ref={(el) => {
                        questionRefs.current[q.id] = el;
                      }}
                    >
                      <QuestionCard
                        question={q}
                        isExpanded={expandedIds.has(q.id)}
                        onToggleExpand={() => handleToggleExpand(q.id)}
                        isMastered={masteredIds.has(q.id)}
                        onToggleMastered={() => handleToggleMastered(q.id)}
                        isBookmarked={bookmarkedIds.has(q.id)}
                        onToggleBookmark={() => handleToggleBookmark(q.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="pb-12">
            <StudyFlashcards
              questions={PLAYWRIGHT_QUESTIONS}
              masteredIds={masteredIds}
              onToggleMastered={handleToggleMastered}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="pb-12">
            <InteractiveQuiz />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="pb-12">
            <ArchitectureVisualizer />
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <div className="pb-12">
            <CheatSheetView />
          </div>
        )}
      </main>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-6 p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 z-30"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Android Bottom Navigation */}
      <AndroidBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTopicPicker={() => setIsTopicDrawerOpen(true)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Android Topic & Filter Drawer */}
      <AndroidTopicDrawer
        isOpen={isTopicDrawerOpen}
        onClose={() => setIsTopicDrawerOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        masteredIds={masteredIds}
        bookmarkedIds={bookmarkedIds}
        onSelectQuestion={handleQuickJump}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Android Install Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={install}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Playwright 50 Master Guide</span>
            <span aria-hidden="true">·</span>
            <span>Android PWA Ready & Offline Capable</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Install on Android
            </button>
            <a
              href="https://playwright.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <span>Playwright Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://trace.playwright.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <span>Trace Viewer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
