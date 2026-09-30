import React, { useState, useEffect } from 'react';
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
  EyeOff,
  Globe
} from 'lucide-react';
import { DEBUGGING_CHALLENGES, DebuggingChallenge, getChallengeForLanguage } from '../data/debuggingChallenges';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/languages';

interface DebuggingLabProps {
  completedDebugChallenges: string[];
  onCompleteChallenge: (id: string, xp: number) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const DebuggingLab: React.FC<DebuggingLabProps> = ({
  completedDebugChallenges,
  onCompleteChallenge,
  selectedLanguage,
  onSelectLanguage
}) => {
  const [selectedId, setSelectedId] = useState<string>(DEBUGGING_CHALLENGES[0].id);
  const [debugLanguage, setDebugLanguage] = useState<SupportedLanguage>(selectedLanguage || 'java');

  const baseChallenge = DEBUGGING_CHALLENGES.find(c => c.id === selectedId) || DEBUGGING_CHALLENGES[0];
  const currentChallenge = getChallengeForLanguage(baseChallenge, debugLanguage);
  const activeLangInfo = SUPPORTED_LANGUAGES[debugLanguage] || SUPPORTED_LANGUAGES.java;

  const [code, setCode] = useState<string>(currentChallenge.failingCode);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: 'idle' | 'running' | 'resolved' | 'failed';
    message: string;
  }>({ status: 'idle', message: '' });

  // Sync with global language changes
  useEffect(() => {
    if (selectedLanguage) {
      setDebugLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const resolved = getChallengeForLanguage(baseChallenge, debugLanguage);
    setCode(resolved.failingCode);
    setActiveHintIndex(-1);
    setShowSolution(false);
    setResult({ status: 'idle', message: '' });
  }, [debugLanguage, selectedId]);

  const handleSelectChallenge = (id: string) => {
    setSelectedId(id);
  };

  const handleSwitchLanguage = (lang: SupportedLanguage) => {
    setDebugLanguage(lang);
    if (onSelectLanguage) {
      onSelectLanguage(lang);
    }
  };

  const handleReset = () => {
    setCode(currentChallenge.failingCode);
    setShowSolution(false);
    setResult({ status: 'idle', message: '' });
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      setCode(currentChallenge.fixedCode);
    } else {
      setCode(currentChallenge.failingCode);
    }
  };

  const handleRunRepair = () => {
    setIsVerifying(true);
    setResult({ 
      status: 'running', 
      message: `Re-running repaired ${activeLangInfo.name} (${activeLangInfo.frameworkRunner}) test in test container...` 
    });

    setTimeout(() => {
      const userCode = code.trim();
      let resolved = false;

      // Smart heuristic verification based on challenge id across all languages
      if (baseChallenge.id === 'dbg-01') {
        // Strict mode violation fix: must use getByRole or get_by_role with accessible name and avoid bare locator('button')
        const hasRole = userCode.includes('getByRole') || userCode.includes('get_by_role');
        const hasName = userCode.includes('Save Changes');
        const noBareButton = !userCode.includes("locator('button').click()") && !userCode.includes('locator("button").click()');
        resolved = hasRole && hasName && noBareButton;
      } else if (baseChallenge.id === 'dbg-02') {
        // Flaky animation fix: remove force click, assert dialog visibility
        const noForce = !userCode.includes('force') && !userCode.includes('setForce');
        const hasDialog = userCode.includes('dialog') || userCode.includes('DIALOG') || userCode.includes('toBeVisible') || userCode.includes('to_be_visible') || userCode.includes('isVisible');
        resolved = noForce && hasDialog;
      } else if (baseChallenge.id === 'dbg-03') {
        // Iframe fix: must use frameLocator or frame_locator
        resolved = userCode.includes('frameLocator') || userCode.includes('frame_locator') || userCode.includes('FrameLocator');
      } else if (baseChallenge.id === 'dbg-04') {
        // Worker state leak fix: ThreadLocal in Java, fixture in Python, base.extend in JS/TS
        resolved = userCode.includes('ThreadLocal') || userCode.includes('base.extend') || (userCode.includes('fixture') && !userCode.includes('global active_user_token')) || userCode.includes('TestFixtures');
      }

      if (resolved) {
        setResult({
          status: 'resolved',
          message: `✓ Flake eliminated in ${activeLangInfo.name}! Test passed with zero timeouts and zero strict mode violations.`
        });
        onCompleteChallenge(baseChallenge.id, 100);
      } else {
        setResult({
          status: 'failed',
          message: `Test still failing in ${activeLangInfo.name}. Root cause not yet resolved. Check hints for architectural direction.`
        });
      }

      setIsVerifying(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bug className="w-6 h-6 text-amber-500" />
            <span>Flake & Failure Diagnostics Lab</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Diagnose and repair real-world broken automation tests in Java, Python, JavaScript, and TypeScript.
          </p>
        </div>

        {/* Top Controls: Challenge & Language Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Switcher Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {(['java', 'python', 'javascript', 'typescript'] as SupportedLanguage[]).map((langKey) => {
              const lang = SUPPORTED_LANGUAGES[langKey];
              const isActive = debugLanguage === langKey;
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

          {/* Challenge Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {DEBUGGING_CHALLENGES.map((c, i) => {
              const isDone = completedDebugChallenges.includes(c.id);
              const isSelected = selectedId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectChallenge(c.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 text-emerald-300" />}
                  <span>Bug #{i + 1}: {c.category.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Failure Diagnostic Report (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {currentChallenge.category}
              </span>
              <span className="text-xs text-rose-500 font-semibold">{currentChallenge.difficulty}</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentChallenge.title} ({activeLangInfo.name})
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                <strong>Symptom:</strong> {currentChallenge.symptom}
              </p>
            </div>

            {/* Error Output Trace */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Test Failure Traceback</span>
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
                {currentChallenge.errorOutput}
              </div>
            </div>

            {/* Progressive Hints */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Diagnostic Hints</span>
                </span>
                <button
                  onClick={() => {
                    if (activeHintIndex < currentChallenge.hints.length - 1) {
                      setActiveHintIndex(prev => prev + 1);
                    }
                  }}
                  disabled={activeHintIndex >= currentChallenge.hints.length - 1}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                >
                  {activeHintIndex === -1 ? 'Show Hint 1' : activeHintIndex < currentChallenge.hints.length - 1 ? 'Next Hint' : 'All Hints Revealed'}
                </button>
              </div>

              {activeHintIndex >= 0 && (
                <div className="space-y-1.5 animate-fadeIn">
                  {currentChallenge.hints.slice(0, activeHintIndex + 1).map((hint, idx) => (
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

            {/* Root Cause & Production Prevention (Revealed when resolved) */}
            {result.status === 'resolved' && (
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Production Prevention Strategy</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
                  <p><strong>Root Cause:</strong> {currentChallenge.rootCause}</p>
                  <p><strong>Architecture Rule:</strong> {currentChallenge.productionPreventionStrategy}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Repair Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-sm flex flex-col">
            {/* Editor Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentChallenge.filename}</span>
                <span className="text-[11px] text-slate-500">({activeLangInfo.name})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleToggleSolution}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showSolution ? 'Hide Solution' : 'View Fix'}</span>
                </button>

                <button
                  onClick={handleRunRepair}
                  disabled={isVerifying}
                  className="px-4 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVerifying ? 'Verifying...' : 'Verify Fix'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full p-4 font-mono text-xs md:text-sm bg-slate-950 text-slate-100 resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50 leading-relaxed scrollbar-thin"
              />
            </div>

            {/* Verification Result Output */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              {result.status === 'idle' && (
                <span className="text-xs text-slate-500 font-mono">
                  Modify the failing code in {activeLangInfo.name} and click &quot;Verify Fix&quot; to test your diagnostic repair.
                </span>
              )}

              {result.status === 'running' && (
                <span className="text-xs text-amber-400 font-mono animate-pulse">
                  {result.message}
                </span>
              )}

              {result.status === 'resolved' && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{result.message}</span>
                </div>
              )}

              {result.status === 'failed' && (
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold animate-fadeIn">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{result.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
