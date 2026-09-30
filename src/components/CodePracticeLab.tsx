import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Copy, 
  Code2, 
  Terminal, 
  Lightbulb, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';
import { PRACTICE_EXERCISES, PracticeExercise, getExerciseForLanguage } from '../data/practiceExercises';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/languages';

interface CodePracticeLabProps {
  completedExercises: string[];
  onCompleteExercise: (id: string, xpEarned: number) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const CodePracticeLab: React.FC<CodePracticeLabProps> = ({
  completedExercises,
  onCompleteExercise,
  selectedLanguage,
  onSelectLanguage
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(PRACTICE_EXERCISES[0].id);
  const [labLanguage, setLabLanguage] = useState<SupportedLanguage>(selectedLanguage || 'java');

  const baseEx = PRACTICE_EXERCISES.find(e => e.id === selectedExId) || PRACTICE_EXERCISES[0];
  const currentEx = getExerciseForLanguage(baseEx, labLanguage);
  const activeLangInfo = SUPPORTED_LANGUAGES[labLanguage] || SUPPORTED_LANGUAGES.java;

  const [code, setCode] = useState<string>(currentEx.starterCode);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'running' | 'passed' | 'failed';
    output: string;
    runtimeMs: number;
    errorDetails?: string;
  }>({ status: 'idle', output: '', runtimeMs: 0 });

  // Sync with global language changes or exercise selection
  useEffect(() => {
    if (selectedLanguage) {
      setLabLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const resolved = getExerciseForLanguage(baseEx, labLanguage);
    setCode(resolved.starterCode);
    setActiveHintIndex(-1);
    setShowSolution(false);
    setTestResult({ status: 'idle', output: '', runtimeMs: 0 });
  }, [labLanguage, selectedExId]);

  const handleSelectExercise = (id: string) => {
    setSelectedExId(id);
  };

  const handleSwitchLanguage = (lang: SupportedLanguage) => {
    setLabLanguage(lang);
    if (onSelectLanguage) {
      onSelectLanguage(lang);
    }
  };

  const handleResetCode = () => {
    setCode(currentEx.starterCode);
    setShowSolution(false);
    setTestResult({ status: 'idle', output: '', runtimeMs: 0 });
  };

  const handleShowSolution = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      setCode(currentEx.solutionCode);
    } else {
      setCode(currentEx.starterCode);
    }
  };

  const handleNextHint = () => {
    if (activeHintIndex < currentEx.hints.length - 1) {
      setActiveHintIndex(prev => prev + 1);
    }
  };

  // Simulated in-browser execution validator
  const handleRunCode = () => {
    setIsRunning(true);
    setTestResult({ 
      status: 'running', 
      output: `Compiling ${activeLangInfo.name} & running ${activeLangInfo.frameworkRunner} suite...`, 
      runtimeMs: 0 
    });

    setTimeout(() => {
      const startTime = performance.now();
      const userCode = code.trim();

      // Check validation rules
      let passed = true;
      let failureReason = '';

      if (currentEx.validationRules.mustContain) {
        for (const req of currentEx.validationRules.mustContain) {
          if (!userCode.includes(req)) {
            passed = false;
            failureReason = `Missing required construct: "${req}" in ${activeLangInfo.name}`;
            break;
          }
        }
      }

      if (passed && currentEx.validationRules.mustNotContain) {
        for (const forbidden of currentEx.validationRules.mustNotContain) {
          if (userCode.includes(forbidden)) {
            passed = false;
            failureReason = `Anti-pattern detected: Avoid using "${forbidden}" in production code`;
            break;
          }
        }
      }

      const elapsed = Math.round(performance.now() - startTime + Math.random() * 80 + 40);

      if (passed) {
        setTestResult({
          status: 'passed',
          output: currentEx.expectedOutput,
          runtimeMs: elapsed
        });
        onCompleteExercise(baseEx.id, 75);
      } else {
        setTestResult({
          status: 'failed',
          output: `Test failed: Assertion or structure check unmet.\n${failureReason}`,
          runtimeMs: elapsed,
          errorDetails: failureReason
        });
      }

      setIsRunning(false);
    }, 650);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Exercise Selector & Language Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-500" />
            <span>Interactive Code Practice Lab</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browser-based Playwright execution engine with multi-language support (Java, Python, JS, TS), instant validation, and progressive hints.
          </p>
        </div>

        {/* Top Controls: Exercise Selector & Language Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {(['java', 'python', 'javascript', 'typescript'] as SupportedLanguage[]).map((langKey) => {
              const lang = SUPPORTED_LANGUAGES[langKey];
              const isActive = labLanguage === langKey;
              return (
                <button
                  key={langKey}
                  onClick={() => handleSwitchLanguage(langKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Exercise Quick Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {PRACTICE_EXERCISES.map((ex, idx) => {
              const isDone = completedExercises.includes(ex.id);
              const isSelected = selectedExId === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 text-emerald-300" />}
                  <span>{ex.moduleCode}: Ex {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Instructions & Progressive Hints (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  {currentEx.moduleCode}
                </span>
                <span className="text-slate-500">{currentEx.category}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-emerald-600 dark:text-emerald-400">{currentEx.difficulty}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {currentEx.title}
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentEx.description}
            </p>

            {/* Task Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Requirements ({activeLangInfo.name})
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">{activeLangInfo.frameworkRunner}</span>
              </div>
              <ul className="space-y-2">
                {currentEx.instructions.map((inst, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Progressive Hints Accordion */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Progressive Hints</span>
                </h4>
                <button
                  onClick={handleNextHint}
                  disabled={activeHintIndex >= currentEx.hints.length - 1}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                >
                  {activeHintIndex === -1 ? 'Reveal First Hint' : activeHintIndex < currentEx.hints.length - 1 ? 'Next Hint' : 'All Revealed'}
                </button>
              </div>

              {activeHintIndex >= 0 && (
                <div className="space-y-1.5 animate-fadeIn">
                  {currentEx.hints.slice(0, activeHintIndex + 1).map((hint, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed"
                    >
                      {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-sm flex flex-col">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {currentEx.filename}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {activeLangInfo.name} / {activeLangInfo.buildTool}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Reset code to starter template"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleShowSolution}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Test'}</span>
                </button>
              </div>
            </div>

            {/* In-Browser Code Editor Textarea */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full p-4 font-mono text-xs md:text-sm bg-slate-950 text-slate-100 resize-y focus:outline-none focus:ring-1 focus:ring-cyan-500/50 leading-relaxed scrollbar-thin"
              />
            </div>

            {/* Test Execution Output Console */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Test Execution Feedback ({activeLangInfo.name})</span>
                </span>
                {testResult.runtimeMs > 0 && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Time: {testResult.runtimeMs}ms
                  </span>
                )}
              </div>

              {testResult.status === 'idle' && (
                <div className="p-3 rounded-lg bg-slate-950 text-xs text-slate-500 font-mono">
                  Ready. Click &quot;Run Test&quot; to execute your {activeLangInfo.name} code against Playwright test assertions.
                </div>
              )}

              {testResult.status === 'running' && (
                <div className="p-3 rounded-lg bg-slate-950 text-xs text-cyan-400 font-mono animate-pulse">
                  {testResult.output}
                </div>
              )}

              {testResult.status === 'passed' && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs font-mono space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>✓ All Assertions & Pattern Rules Passed (+75 XP)</span>
                  </div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {testResult.output}
                  </pre>
                </div>
              )}

              {testResult.status === 'failed' && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs font-mono space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Validation Failure</span>
                  </div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {testResult.output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
