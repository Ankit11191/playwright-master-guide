import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Send, 
  Award, 
  Search, 
  Filter, 
  BookOpen, 
  Layers, 
  RotateCcw,
  Check
} from 'lucide-react';
import { INTERVIEW_TRACKS, InterviewTrack, InterviewQuestion } from '../data/interviewTracksData';
import { PLAYWRIGHT_QUESTIONS, PlaywrightQuestion } from '../data/playwrightQuestions';
import { QuestionCard } from './QuestionCard';

interface InterviewEngineProps {
  onBookmarkToggle?: (id: number) => void;
  bookmarks?: number[];
  completedQuestions?: number[];
  onToggleComplete?: (id: number) => void;
}

export const InterviewEngine: React.FC<InterviewEngineProps> = ({
  onBookmarkToggle,
  bookmarks = [],
  completedQuestions = [],
  onToggleComplete
}) => {
  const [activeView, setActiveView] = useState<'tracks' | 'bank' | 'star-builder'>('tracks');
  
  // Track State
  const [selectedTrackId, setSelectedTrackId] = useState<string>(INTERVIEW_TRACKS[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(2700); // 45 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // STAR builder state
  const [starState, setStarState] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  });

  // 160 Bank Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1]));

  const handleToggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentTrack = INTERVIEW_TRACKS.find(t => t.id === selectedTrackId) || INTERVIEW_TRACKS[0];
  const currentQuestion = currentTrack.questions[currentQuestionIndex] || currentTrack.questions[0];

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter 160 question bank
  const filtered160 = PLAYWRIGHT_QUESTIONS.filter((q: PlaywrightQuestion) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (q.shortAnswer && q.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Main Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-500" />
            <span>Interview Preparation & Career Acceleration</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Role-specific simulation tracks, STAR methodology response workshop, and the comprehensive 160 curated Playwright Q&A repository.
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveView('tracks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'tracks'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Role Tracks ({INTERVIEW_TRACKS.length})
          </button>
          <button
            onClick={() => setActiveView('star-builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'star-builder'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            STAR Workshop
          </button>
          <button
            onClick={() => setActiveView('bank')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'bank'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            160 Q&A Bank
          </button>
        </div>
      </div>

      {/* VIEW 1: Role-Specific Mock Tracks */}
      {activeView === 'tracks' && (
        <div className="space-y-6">
          {/* Track Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {INTERVIEW_TRACKS.map(track => (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrackId(track.id);
                  setCurrentQuestionIndex(0);
                  setShowAnswer(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  selectedTrackId === track.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <span>{track.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-white/90">
                  {track.level}
                </span>
              </button>
            ))}
          </div>

          {/* Active Question Simulator Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Simulator Header & Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentTrack.targetRole}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-slate-500">Question {currentQuestionIndex + 1} of {currentTrack.questions.length}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{currentQuestion.type}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-center">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1 cursor-pointer"
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>

            {/* Key Architectural Evaluation Criteria */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                What the Interviewer Evaluates in This Round:
              </h4>
              <ul className="space-y-1.5">
                {currentQuestion.keyEvaluationPoints.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Answer Reveal Section */}
            <div className="space-y-3">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{showAnswer ? 'Hide Ideal Defense' : 'Reveal Ideal Technical Defense'}</span>
              </button>

              {showAnswer && (
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3 animate-fadeIn">
                  {currentQuestion.sampleTechnicalAnswer && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Senior SDET Reference Answer:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentQuestion.sampleTechnicalAnswer}
                      </p>
                    </div>
                  )}

                  {currentQuestion.sampleStarAnswer && (
                    <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-emerald-900/50 text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        STAR Behavioral Response Breakdown:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                        <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-600">S (Situation): </span>
                          {currentQuestion.sampleStarAnswer.situation}
                        </div>
                        <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-600">T (Task): </span>
                          {currentQuestion.sampleStarAnswer.task}
                        </div>
                        <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-600">A (Action): </span>
                          {currentQuestion.sampleStarAnswer.action}
                        </div>
                        <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="font-bold text-emerald-600">R (Result): </span>
                          {currentQuestion.sampleStarAnswer.result}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
                  setShowAnswer(false);
                }}
                disabled={currentQuestionIndex === 0}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  setCurrentQuestionIndex(Math.min(currentTrack.questions.length - 1, currentQuestionIndex + 1));
                  setShowAnswer(false);
                }}
                disabled={currentQuestionIndex === currentTrack.questions.length - 1}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STAR Response Builder Workshop */}
      {activeView === 'star-builder' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              STAR Methodology Response Workshop
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Structure Your Automation Success Stories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hiring managers evaluate technical leadership through quantifiable results. Practice structuring your real accomplishments below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                1. Situation (Context, Business Problem, Challenge)
              </label>
              <textarea
                value={starState.situation}
                onChange={(e) => setStarState({ ...starState, situation: e.target.value })}
                rows={3}
                placeholder="e.g. Our legacy Selenium suite was running for 3 hours with 25% flakiness, blocking the daily release train..."
                className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. Task (Your Direct Ownership & Mission)
              </label>
              <textarea
                value={starState.task}
                onChange={(e) => setStarState({ ...starState, task: e.target.value })}
                rows={3}
                placeholder="e.g. As Lead SDET, I was tasked with migrating the suite to Playwright and reducing execution time under 15 minutes..."
                className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                3. Action (Technical Decisions & Architectural Execution)
              </label>
              <textarea
                value={starState.action}
                onChange={(e) => setStarState({ ...starState, action: e.target.value })}
                rows={4}
                placeholder="e.g. I designed a custom fixture framework with API data seeding, implemented matrix sharding across 8 GitHub Actions workers, and enforced getByRole locators..."
                className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                4. Result (Quantified Business & Engineering Metrics)
              </label>
              <textarea
                value={starState.result}
                onChange={(e) => setStarState({ ...starState, result: e.target.value })}
                rows={4}
                placeholder="e.g. Runtime dropped from 180 mins to 9.5 mins (94% reduction). Flake rate dropped to 0.4%, saving 12 developer hours weekly and accelerating deployments to 3x daily..."
                className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Full 160 Curated Q&A Question Bank */}
      {activeView === 'bank' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search across 160 questions, concepts, code snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Difficulties</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Categories</option>
                <option value="Core Concepts">Core Concepts</option>
                <option value="Architecture & Comparison">Architecture</option>
                <option value="Locators & Selectors">Locators</option>
                <option value="Actions & Interactions">Actions</option>
                <option value="Waiting & Flakiness">Synchronization</option>
                <option value="Network & API Testing">API & Network</option>
                <option value="Advanced Patterns & CI/CD">CI/CD & Advanced</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered160.length} of {PLAYWRIGHT_QUESTIONS.length} curated interview questions</span>
          </div>

          {/* Question Cards Grid */}
          <div className="space-y-4">
            {filtered160.slice(0, 30).map((question: PlaywrightQuestion) => (
              <QuestionCard
                key={question.id}
                question={question}
                isExpanded={expandedIds.has(question.id)}
                onToggleExpand={() => handleToggleExpand(question.id)}
                isMastered={completedQuestions.includes(question.id)}
                onToggleMastered={() => onToggleComplete?.(question.id)}
                isBookmarked={bookmarks.includes(question.id)}
                onToggleBookmark={() => onBookmarkToggle?.(question.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
