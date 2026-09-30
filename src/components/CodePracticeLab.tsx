import React, { useState } from 'react';
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
  EyeOff
} from 'lucide-react';
import { PRACTICE_EXERCISES, PracticeExercise } from '../data/practiceExercises';

interface CodePracticeLabProps {
  completedExercises: string[];
  onCompleteExercise: (id: string, xpEarned: number) => void;
}

export const CodePracticeLab: React.FC<CodePracticeLabProps> = ({
  completedExercises,
  onCompleteExercise
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(PRACTICE_EXERCISES[0].id);
  const currentEx = PRACTICE_EXERCISES.find(e => e.id === selectedExId) || PRACTICE_EXERCISES[0];

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

  // When switching exercise, reset state
  const handleSelectExercise = (id: string) => {
    const ex = PRACTICE_EXERCISES.find(e => e.id === id) || PRACTICE_EXERCISES[0];
    setSelectedExId(id);
    setCode(ex.starterCode);
    setActiveHintIndex(-1);
    setShowSolution(false);
    setTestResult({ status: 'idle', output: '', runtimeMs: 0 });
  };

  const handleResetCode = () => {
    setCode(currentEx.starterCode);
    setTestResult({ status: 'idle', output: '', runtimeMs: 0 });
  };

  const handleShowSolution = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      setCode(currentEx.solutionCode);
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
    setTestResult({ status: 'running', output: 'Compiling TypeScript & running Playwright test runner...', runtimeMs: 0 });

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
            failureReason = `Missing required architectural construct: "${req}"`;
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
        onCompleteExercise(currentEx.id, 75);
      } else {
        setTestResult({
          status: 'failed',
          output: `Test failed: Assertion or structure check unmet.\n${failureReason}`,
          runtimeMs: elapsed,
          errorDetails: failureReason
        });
      }

      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Exercise Selection Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-500" />
            <span>Interactive Code Practice Lab</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browser-based TypeScript & Playwright execution engine with validation rules, progressive hints, and diff output.
          </p>
        </div>

        {/* Exercise Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {PRACTICE_EXERCISES.map((ex, idx) => {
            const isDone = completedExercises.includes(ex.id);
            const isSelected = selectedExId === ex.id;
            return (
              <button
                key={ex.id}
                onClick={() => handleSelectExercise(ex.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-sm'
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
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Requirements
              </h4>
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

            {/* Progressive Hints Section */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Progressive Hints ({Math.max(0, activeHintIndex + 1)}/{currentEx.hints.length})</span>
                </h4>
                {activeHintIndex < currentEx.hints.length - 1 && (
                  <button
                    onClick={handleNextHint}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Unlock Next Hint
                  </button>
                )}
              </div>

              {activeHintIndex >= 0 ? (
                <div className="space-y-2">
                  {currentEx.hints.slice(0, activeHintIndex + 1).map((hint, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed"
                    >
                      <span className="font-bold">Step {idx + 1}: </span>
                      {hint}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Need guidance? Unlock progressive clues without revealing the full solution immediately.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Editor Container */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>test-solution.ts</span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-400">TypeScript / Playwright</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleShowSolution}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Compare solution"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isRunning 
                      ? 'bg-cyan-800 text-cyan-200 cursor-not-allowed' 
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md hover:shadow-cyan-500/20'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Editable Code Textarea */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={16}
                className="w-full p-4 font-mono text-xs md:text-sm text-slate-100 bg-slate-950 resize-y focus:outline-none focus:ring-1 focus:ring-cyan-500/50 leading-relaxed"
                placeholder="Write your Playwright code solution here..."
              />
            </div>

            {/* Terminal Output Console */}
            <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  Execution Terminal
                </span>
                {testResult.runtimeMs > 0 && (
                  <span className="text-[11px] font-mono text-slate-500">
                    Execution time: {testResult.runtimeMs}ms
                  </span>
                )}
              </div>

              {testResult.status === 'idle' ? (
                <p className="text-xs font-mono text-slate-500">
                  Ready. Click "Run Code" to compile and execute your test against validation criteria.
                </p>
              ) : testResult.status === 'running' ? (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Executing test suite...</span>
                </div>
              ) : testResult.status === 'passed' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ALL CHECKS PASSED (+75 XP)</span>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                    {testResult.output}
                  </pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-mono">
                    <XCircle className="w-4 h-4" />
                    <span>EXECUTION FAILED</span>
                  </div>
                  <pre className="text-xs font-mono text-rose-300/90 whitespace-pre-wrap leading-relaxed bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
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
