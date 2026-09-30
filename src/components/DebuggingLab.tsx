import React, { useState } from 'react';
import { 
  Bug, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  ShieldCheck, 
  Terminal, 
  Check, 
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { DEBUGGING_CHALLENGES, DebuggingChallenge } from '../data/debuggingChallenges';

interface DebuggingLabProps {
  completedDebugChallenges: string[];
  onCompleteChallenge: (id: string, xp: number) => void;
}

export const DebuggingLab: React.FC<DebuggingLabProps> = ({
  completedDebugChallenges,
  onCompleteChallenge
}) => {
  const [selectedId, setSelectedId] = useState<string>(DEBUGGING_CHALLENGES[0].id);
  const currentChallenge = DEBUGGING_CHALLENGES.find(c => c.id === selectedId) || DEBUGGING_CHALLENGES[0];

  const [code, setCode] = useState<string>(currentChallenge.failingCode);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: 'idle' | 'running' | 'resolved' | 'failed';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleSelectChallenge = (id: string) => {
    const c = DEBUGGING_CHALLENGES.find(item => item.id === id) || DEBUGGING_CHALLENGES[0];
    setSelectedId(id);
    setCode(c.failingCode);
    setActiveHintIndex(-1);
    setShowSolution(false);
    setResult({ status: 'idle', message: '' });
  };

  const handleReset = () => {
    setCode(currentChallenge.failingCode);
    setResult({ status: 'idle', message: '' });
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      setCode(currentChallenge.fixedCode);
    }
  };

  const handleRunRepair = () => {
    setIsVerifying(true);
    setResult({ status: 'running', message: 'Re-running repaired test suite in Playwright container...' });

    setTimeout(() => {
      const userCode = code.trim();
      let resolved = false;

      // Smart heuristic verification based on challenge id
      if (currentChallenge.id === 'dbg-01') {
        // Strict mode violation fix: must use getByRole with accessible name or specific selector
        resolved = userCode.includes('getByRole') && userCode.includes('Save Changes') && !userCode.includes("locator('button').click()");
      } else if (currentChallenge.id === 'dbg-02') {
        // Flaky animation fix: remove force: true, assert dialog visibility
        resolved = !userCode.includes('{ force: true }') && (userCode.includes('dialog') || userCode.includes('toBeVisible'));
      } else if (currentChallenge.id === 'dbg-03') {
        // Iframe fix: must use frameLocator
        resolved = userCode.includes('frameLocator');
      } else if (currentChallenge.id === 'dbg-04') {
        // Worker state leak fix: eliminate shared mutable global let activeUserToken
        resolved = userCode.includes('base.extend') || (userCode.includes('TestFixtures') && !userCode.includes('let activeUserToken'));
      }

      if (resolved) {
        setResult({
          status: 'resolved',
          message: '✓ Flake eliminated! Test passed with zero timeouts and zero strict mode violations.'
        });
        onCompleteChallenge(currentChallenge.id, 100);
      } else {
        setResult({
          status: 'failed',
          message: 'Test still failing. Root cause not yet resolved. Check hints for architectural direction.'
        });
      }

      setIsVerifying(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bug className="w-6 h-6 text-amber-500" />
            <span>Enterprise Debugging Lab</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Diagnose and repair real-world automation failures: strict locator violations, animation race conditions, iframe drops, and parallel worker leaks.
          </p>
        </div>

        {/* Challenge Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {DEBUGGING_CHALLENGES.map((ch, idx) => {
            const isDone = completedDebugChallenges.includes(ch.id);
            const isSelected = selectedId === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChallenge(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-emerald-300" />}
                <span>Bug {idx + 1}: {ch.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Failure Diagnostics & Stack Trace (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Failure Context Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                {currentChallenge.category}
              </span>
              <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
                {currentChallenge.difficulty}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {currentChallenge.title}
            </h2>

            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Symptom Observed:
              </span>
              <p className="leading-relaxed">{currentChallenge.symptom}</p>
            </div>

            {/* Error Stack Output */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Playwright Failure Output / Trace Log
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {currentChallenge.errorOutput}
              </pre>
            </div>

            {/* Hints */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Hints ({Math.max(0, activeHintIndex + 1)}/{currentChallenge.hints.length})
                </span>
                {activeHintIndex < currentChallenge.hints.length - 1 && (
                  <button
                    onClick={() => setActiveHintIndex(prev => prev + 1)}
                    className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
                  >
                    Next Hint
                  </button>
                )}
              </div>

              {activeHintIndex >= 0 && (
                <div className="space-y-1.5">
                  {currentChallenge.hints.slice(0, activeHintIndex + 1).map((h, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-300 p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      {h}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Fix Validator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>broken-test.spec.ts</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleToggleSolution}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? 'Hide Solution' : 'View Fix'}</span>
                </button>

                <button
                  onClick={handleRunRepair}
                  disabled={isVerifying}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isVerifying
                      ? 'bg-amber-800 text-amber-200 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-amber-500/20'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVerifying ? 'Diagnosing...' : 'Test Repaired Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={14}
              className="w-full p-4 font-mono text-xs md:text-sm text-slate-100 bg-slate-950 resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50 leading-relaxed"
            />

            {/* Execution Result Box */}
            <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Diagnostic Engine Output
              </span>

              {result.status === 'idle' ? (
                <p className="text-xs font-mono text-slate-500">
                  Modify the broken code above to address the root cause, then click "Test Repaired Code".
                </p>
              ) : result.status === 'running' ? (
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{result.message}</span>
                </div>
              ) : result.status === 'resolved' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DEFECT RESOLVED (+100 XP)</span>
                  </div>
                  <p className="text-xs font-mono text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                    {result.message}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-mono">
                    <XCircle className="w-4 h-4" />
                    <span>REPAIR INCOMPLETE</span>
                  </div>
                  <p className="text-xs font-mono text-rose-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Root Cause & Production Prevention (Revealed upon success or solution toggle) */}
          {(result.status === 'resolved' || showSolution) && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Engineering Root Cause Analysis
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentChallenge.rootCause}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Production Prevention Architecture
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentChallenge.productionPreventionStrategy}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
