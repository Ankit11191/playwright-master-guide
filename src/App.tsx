import {
    ArrowUp,
    BookOpen,
    Coffee,
    ExternalLink,
    Github,
    HelpCircle,
    Layers,
    Linkedin,
    Sparkles,
    Terminal
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidTopicDrawer } from './components/AndroidTopicDrawer';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { CheatSheetView } from './components/CheatSheetView';
import { ExportModal } from './components/ExportModal';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { JavaCompilerConsole } from './components/JavaCompilerConsole';
import { QuestionCard } from './components/QuestionCard';
import { QuickJumpBar } from './components/QuickJumpBar';
import { StudyFlashcards } from './components/StudyFlashcards';
import { PLAYWRIGHT_QUESTIONS } from './data/playwrightQuestions';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'questions' | 'flashcards' | 'quiz' | 'architecture' | 'cheatsheet' | 'console'>('questions');

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
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);

  // Connection status
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const difficultyCounts = useMemo(() => {
    return {
      All: PLAYWRIGHT_QUESTIONS.length,
      Beginner: PLAYWRIGHT_QUESTIONS.filter((q) => q.difficulty === 'Beginner').length,
      Intermediate: PLAYWRIGHT_QUESTIONS.filter((q) => q.difficulty === 'Intermediate').length,
      Advanced: PLAYWRIGHT_QUESTIONS.filter((q) => q.difficulty === 'Advanced').length,
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PLAYWRIGHT_QUESTIONS.forEach((q) => {
      // If a difficulty is selected, show count of that difficulty in each category
      if (selectedDifficulty === 'All' || q.difficulty === selectedDifficulty) {
        counts[q.category] = (counts[q.category] || 0) + 1;
      }
    });
    return counts;
  }, [selectedDifficulty]);

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
              difficultyCounts={difficultyCounts}
              categoryCounts={categoryCounts}
              masteredCount={masteredIds.size}
              bookmarkedCount={bookmarkedIds.size}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Progress & Quick Stats Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Interview Readiness Progress
                      </span>
                      <span className="text-xs text-slate-500">
                        ({masteredIds.size} of {PLAYWRIGHT_QUESTIONS.length} Mastered)
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
                    <button
                      onClick={() => setActiveTab('console')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all font-semibold shadow-xs hover:shadow-sm"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Java Console</span>
                      <span className="text-[10px] bg-amber-950/30 px-1 py-0.2 rounded font-mono">
                        RUN
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Jump Bar (1 - 160 Grid) */}
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
                        onSelectCategory={(cat) => setSelectedCategory(cat)}
                        onSelectDifficulty={(diff) => setSelectedDifficulty(diff)}
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

        {activeTab === 'console' && (
          <div className="pb-12">
            <JavaCompilerConsole />
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
        difficultyCounts={difficultyCounts}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Footer - Always positioned at the bottom across all pages & navigation */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-800">Playwright Master Guide (160 Q&A)</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-600">Created by <strong className="text-slate-900 font-medium">Ankit Mittal</strong></span>
          </div>

          {/* Social Profiles & Developer Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/ankitmittal061091/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#0A66C2]/10 border border-slate-200 hover:border-[#0A66C2]/40 text-slate-700 hover:text-[#0A66C2] font-medium transition-all group shadow-2xs hover:shadow-xs"
              title="Connect with Ankit Mittal on LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/Ankit11191"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-900/10 border border-slate-200 hover:border-slate-800/40 text-slate-700 hover:text-slate-900 font-medium transition-all group shadow-2xs hover:shadow-xs"
              title="View Ankit Mittal on GitHub"
            >
              <Github className="w-4 h-4 text-slate-900 group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1" aria-hidden="true" />

            <div className="flex items-center gap-3">
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
        </div>
      </footer>
    </div>
  );
}
