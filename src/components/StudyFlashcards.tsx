import React, { useState, useEffect, useCallback } from 'react';
import { PlaywrightQuestion } from '../data/playwrightQuestions';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  CheckCircle, 
  Shuffle, 
  Bookmark, 
  Lightbulb, 
  Code2, 
  Eye
} from 'lucide-react';

interface StudyFlashcardsProps {
  questions: PlaywrightQuestion[];
  masteredIds: Set<number>;
  onToggleMastered: (id: number) => void;
  bookmarkedIds: Set<number>;
  onToggleBookmark: (id: number) => void;
}

export const StudyFlashcards: React.FC<StudyFlashcardsProps> = ({
  questions,
  masteredIds,
  onToggleMastered,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => set.add(q.category));
    return Array.from(set);
  }, [questions]);

  // Compute filtered deck
  const activeDeck = React.useMemo(() => {
    return questions.filter((q) => {
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [questions, selectedDifficulty, selectedCategory]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedDifficulty, selectedCategory]);

  const currentQ = activeDeck[currentIndex] || activeDeck[0];

  const handleNext = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  }, [activeDeck.length]);

  const handlePrev = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  }, [activeDeck.length]);

  const handleShuffle = () => {
    if (activeDeck.length <= 1) return;
    setIsFlipped(false);
    // Jump to random card
    const randomIdx = Math.floor(Math.random() * activeDeck.length);
    setCurrentIndex(randomIdx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Deck Filter Strip (Difficulty & Category) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Difficulty:
            </span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => {
              const isSelected = selectedDifficulty === diff;
              const count = questions.filter(
                (q) => (diff === 'All' || q.difficulty === diff) && (selectedCategory === 'All' || q.category === selectedCategory)
              ).length;
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{diff === 'All' ? 'All Levels' : diff}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Topic:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[220px] truncate"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map((cat) => {
                const count = questions.filter(
                  (q) => q.category === cat && (selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
                ).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {activeDeck.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">No flashcards found for this filter combination.</p>
          <button
            onClick={() => {
              setSelectedDifficulty('All');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Top Controls & Counter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Recall Study Mode
              </h2>
              <p className="text-xs text-slate-500">
                Card <span className="font-mono font-semibold tabular-nums text-slate-800">{currentIndex + 1}</span> of <span className="font-mono tabular-nums">{activeDeck.length}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-700">Space</kbd> to flip, <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-700">←</kbd> <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-700">→</kbd> to navigate
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Randomize Card"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  bookmarkedIds.has(currentQ.id)
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
                title="Star Question"
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(currentQ.id) ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                onClick={() => onToggleMastered(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  masteredIds.has(currentQ.id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{masteredIds.has(currentQ.id) ? 'Mastered' : 'Mark Mastered'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeDeck.length) * 100}%` }}
            />
          </div>

          {/* The Flashcard Body */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 min-h-[380px] flex flex-col justify-between transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900">
              Question #{currentQ.id.toString().padStart(2, '0')}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentQ.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-700">{currentQ.difficulty}</span>
          </div>

          <div className="text-xs text-slate-400">
            {isFlipped ? 'Answer Revealed' : 'Prompt / Recall'}
          </div>
        </div>

        {/* Card Main Content */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          {!isFlipped ? (
            <div className="space-y-4 text-center py-6">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
                Interview Question
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 max-w-2xl mx-auto leading-relaxed">
                {currentQ.question}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto pt-2">
                Take a moment to recall the answer in your mind or speak it aloud before flipping.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question summary */}
              <div className="text-xs font-semibold text-slate-500">
                Q: {currentQ.question}
              </div>

              {/* Short Answer */}
              <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-4 rounded-r-lg">
                <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider block mb-1">
                  Key Takeaway
                </span>
                <p className="text-sm font-medium text-emerald-950 leading-relaxed">
                  {currentQ.shortAnswer}
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
                {currentQ.detailedExplanation.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Code Snippet if present */}
              {currentQ.codeSnippet && (
                <div className="bg-slate-900 text-emerald-300 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentQ.codeSnippet.language} sample:</span>
                  </div>
                  <code>{currentQ.codeSnippet.code}</code>
                </div>
              )}

              {/* Pro Tip */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-950">Interview Pro Tip: </strong>
                  {currentQ.proTip}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer / Flip Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setIsFlipped((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            {isFlipped ? (
              <>
                <RotateCw className="w-4 h-4" />
                <span>Hide Answer (Flip to Question)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Reveal Detailed Answer</span>
              </>
            )}
          </button>

          {/* Quick jump to question in full list */}
          <div className="text-xs text-slate-400">
            Tag: <span className="text-slate-600">{currentQ.tags[0]}</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons (Prev / Next) */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-medium text-sm transition-colors shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-colors shadow-xs"
        >
          <span>Next Question</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  )}
</div>
  );
};
