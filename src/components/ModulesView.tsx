import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Terminal, 
  HelpCircle, 
  ShieldCheck, 
  Code2, 
  Copy, 
  Check, 
  Layers
} from 'lucide-react';
import { ACADEMY_MODULES, AcademyModule, Lesson } from '../data/academyModules';

interface ModulesViewProps {
  completedLessons: string[];
  onToggleLesson: (lessonId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  completedLessons,
  onToggleLesson,
  onNavigateTab
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(ACADEMY_MODULES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(ACADEMY_MODULES[0].lessons[0].id);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentModule = ACADEMY_MODULES.find(m => m.id === selectedModuleId) || ACADEMY_MODULES[0];
  const currentLesson = currentModule.lessons.find(l => l.id === selectedLessonId) || currentModule.lessons[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header with Module Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <span>Curriculum Modules & Structured Lessons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            7 Enterprise Modules with step-by-step concepts, production patterns, and interview questions.
          </p>
        </div>

        {/* Quick Module Dropdown for Mobile / Compact */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {ACADEMY_MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModuleId(m.id);
                setSelectedLessonId(m.lessons[0]?.id || '');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedModuleId === m.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{m.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Lessons in this Module (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Module Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentModule.code}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentModule.duration}
              </span>
            </div>
            <h2 className="text-sm font-bold">{currentModule.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{currentModule.description}</p>
            
            {/* Quick Links */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <button
                onClick={() => onNavigateTab('code-practice')}
                className="hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Code Lab</span>
              </button>
              <span>·</span>
              <button
                onClick={() => onNavigateTab('study-cards')}
                className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Study Card</span>
              </button>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Module Lessons ({currentModule.lessons.length})
            </h3>
            {currentModule.lessons.map(lesson => {
              const isDone = completedLessons.includes(lesson.id);
              const isSelected = selectedLessonId === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">{lesson.duration}</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">{lesson.difficulty}</span>
                    </div>
                    <h4 className={`text-xs font-bold ${
                      isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {lesson.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLesson(lesson.id);
                    }}
                    title={isDone ? "Mark as uncompleted" : "Mark as completed"}
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'border border-slate-300 dark:border-slate-700 text-transparent hover:border-emerald-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Module Topics Checklist */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Competencies Covered in {currentModule.code}</span>
            </h3>
            <ul className="space-y-1.5">
              {currentModule.topics.map((topic, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Content Area: Detailed Lesson View (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Lesson Title & Completion Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-indigo-600 dark:text-indigo-400">{currentModule.code}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-slate-500">{currentLesson.duration}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{currentLesson.difficulty}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
              </div>

              <button
                onClick={() => onToggleLesson(currentLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  completedLessons.includes(currentLesson.id)
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{completedLessons.includes(currentLesson.id) ? 'Lesson Completed' : 'Mark Complete (+50 XP)'}</span>
              </button>
            </div>

            {/* Objective & Real-World Relevance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  Learning Objective
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentLesson.objective}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Why It Matters in Production
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentLesson.whyItMatters}
                </p>
              </div>
            </div>

            {/* In-Depth Architectural Concept */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Concept & Architectural Rationale</span>
              </h3>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentLesson.concept}
              </p>
            </div>

            {/* Executable Minimal Working Example */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span>Production Code Pattern</span>
                </h3>
                <button
                  onClick={() => handleCopyCode(currentLesson.minimalWorkingExample)}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>example.spec.ts</span>
                  <span>TypeScript / Playwright</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{currentLesson.minimalWorkingExample}</code>
                </pre>
              </div>
            </div>

            {/* Line-by-Line Technical Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Technical Execution Breakdown
              </h4>
              <ul className="space-y-2">
                {currentLesson.codeExplanation.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Practices vs Common Mistakes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Best Practices */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Production Best Practices
                </span>
                <ul className="space-y-1.5">
                  {currentLesson.productionBestPractices.map((bp, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Common Mistakes to Avoid
                </span>
                <ul className="space-y-1.5">
                  {currentLesson.commonMistakes.map((cm, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">✕</span>
                      <span>{cm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interview Question Callout */}
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Interview Defense Question
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Q: {currentLesson.interviewQuestion.question}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Answer: </span>
                {currentLesson.interviewQuestion.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
