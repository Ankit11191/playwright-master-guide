import React, { useState } from 'react';
import { Layers, Plus, Trash2, ShieldCheck, Check, X, Play, RefreshCw, Cpu, Monitor, Globe } from 'lucide-react';

interface MockContext {
  id: string;
  name: string;
  hasAuth: boolean;
  pages: string[];
}

export const ArchitectureVisualizer: React.FC = () => {
  // Architecture State
  const [selectedEngine, setSelectedEngine] = useState<'chromium' | 'webkit' | 'firefox'>('chromium');
  const [contexts, setContexts] = useState<MockContext[]>([
    { id: 'ctx-1', name: 'Context 1 (Admin User)', hasAuth: true, pages: ['Dashboard Tab', 'Analytics Tab'] },
    { id: 'ctx-2', name: 'Context 2 (Guest User)', hasAuth: false, pages: ['Landing Page'] },
  ]);

  // Actionability Simulator State
  const [elementState, setElementState] = useState<'ready' | 'animating' | 'disabled' | 'obscured' | 'hidden'>('ready');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [checkResults, setCheckResults] = useState<{ [key: string]: 'pending' | 'pass' | 'fail' }>({
    attached: 'pending',
    visible: 'pending',
    stable: 'pending',
    receivesEvents: 'pending',
    enabled: 'pending',
    editable: 'pending',
  });

  const handleAddContext = () => {
    const newId = `ctx-${contexts.length + 1}`;
    setContexts([
      ...contexts,
      {
        id: newId,
        name: `Context ${contexts.length + 1} (Isolated Profile)`,
        hasAuth: false,
        pages: ['New Tab (about:blank)'],
      },
    ]);
  };

  const handleRemoveContext = (id: string) => {
    if (contexts.length <= 1) return;
    setContexts(contexts.filter((c) => c.id !== id));
  };

  const handleAddPage = (contextId: string) => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.id === contextId) {
          return {
            ...ctx,
            pages: [...ctx.pages, `Tab ${ctx.pages.length + 1}`],
          };
        }
        return ctx;
      })
    );
  };

  const handleToggleAuth = (contextId: string) => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.id === contextId) {
          return { ...ctx, hasAuth: !ctx.hasAuth };
        }
        return ctx;
      })
    );
  };

  const runActionabilitySimulation = () => {
    setIsSimulating(true);
    setSimulationLog(['[0ms] locator.click() initiated on element']);
    setCheckResults({
      attached: 'pending',
      visible: 'pending',
      stable: 'pending',
      receivesEvents: 'pending',
      enabled: 'pending',
      editable: 'pending',
    });

    setTimeout(() => {
      // 1. Attached check
      const attachedPass = elementState !== 'hidden' || true;
      setCheckResults((prev) => ({ ...prev, attached: 'pass' }));
      setSimulationLog((l) => [...l, '[12ms] Actionability Check: Element is attached to DOM (✓ PASS)']);

      setTimeout(() => {
        // 2. Visible check
        const visiblePass = elementState !== 'hidden';
        setCheckResults((prev) => ({ ...prev, visible: visiblePass ? 'pass' : 'fail' }));
        setSimulationLog((l) => [
          ...l,
          `[28ms] Actionability Check: Element visibility check (${visiblePass ? '✓ PASS: non-zero bounding box' : '✗ FAIL: element has display:none'})`,
        ]);

        if (!visiblePass) {
          setIsSimulating(false);
          setSimulationLog((l) => [...l, '[30000ms Timeout] Error: Element is not visible after 30s']);
          return;
        }

        setTimeout(() => {
          // 3. Stable check
          const stablePass = elementState !== 'animating';
          setCheckResults((prev) => ({ ...prev, stable: stablePass ? 'pass' : 'fail' }));
          setSimulationLog((l) => [
            ...l,
            `[45ms] Actionability Check: Animation stability check (${stablePass ? '✓ PASS: position stable' : '✗ RETRYING: CSS transform active...'})`,
          ]);

          setTimeout(() => {
            // 4. Receives events check
            const receivesPass = elementState !== 'obscured';
            setCheckResults((prev) => ({ ...prev, receivesEvents: receivesPass ? 'pass' : 'fail' }));
            setSimulationLog((l) => [
              ...l,
              `[62ms] Actionability Check: Hit target verification (${receivesPass ? '✓ PASS: coordinates clear' : '✗ FAIL: obscured by modal-backdrop div'})`,
            ]);

            setTimeout(() => {
              // 5. Enabled check
              const enabledPass = elementState !== 'disabled';
              setCheckResults((prev) => ({ ...prev, enabled: enabledPass ? 'pass' : 'fail' }));
              setSimulationLog((l) => [
                ...l,
                `[80ms] Actionability Check: Element enabled check (${enabledPass ? '✓ PASS' : '✗ FAIL: attribute disabled is present'})`,
              ]);

              setTimeout(() => {
                const allPassed = visiblePass && stablePass && receivesPass && enabledPass;
                if (allPassed) {
                  setCheckResults((prev) => ({ ...prev, editable: 'pass' }));
                  setSimulationLog((l) => [
                    ...l,
                    '[95ms] All 6 Actionability Checks Satisfied! Dispatched native pointerdown, pointerup, click events (✓ SUCCESS)',
                  ]);
                } else {
                  setSimulationLog((l) => [
                    ...l,
                    '[Auto-wait loop] Playwright is auto-waiting and retrying checks every 100ms until timeout...',
                  ]);
                }
                setIsSimulating(false);
              }, 200);
            }, 200);
          }, 200);
        }, 200);
      }, 200);
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Introduction */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Playwright Architectural Lab
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Interact directly with the two foundational pillars of Playwright: the hierarchical 
          <strong className="text-slate-900 font-semibold"> Browser & Context isolation model</strong> (Questions 5, 6, 10, 22) and the automated 
          <strong className="text-slate-900 font-semibold"> Actionability Checks engine</strong> (Questions 8, 27, 48).
        </p>
      </div>

      {/* SECTION 1: Architecture Hierarchy Sandbox */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                1. Browser → BrowserContext → Page Hierarchy Visualizer
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrates Question #5, #6, #10: One operating browser process hosts multiple isolated, lightweight (~10ms) context sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Engine Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
              {(['chromium', 'webkit', 'firefox'] as const).map((eng) => (
                <button
                  key={eng}
                  onClick={() => setSelectedEngine(eng)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors ${
                    selectedEngine === eng ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {eng}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddContext}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Context</span>
            </button>
          </div>
        </div>

        {/* Outer Browser Box */}
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-2 font-bold text-slate-900">
              <Cpu className="w-4 h-4 text-slate-700" />
              Browser Process: {selectedEngine.toUpperCase()} (PID: 94821)
            </span>
            <span className="text-slate-500">
              Heavy OS Process (Launched once per test suite worker)
            </span>
          </div>

          {/* Contexts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contexts.map((ctx) => (
              <div
                key={ctx.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">{ctx.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAuth(ctx.id)}
                      className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                        ctx.hasAuth
                          ? 'bg-emerald-100 text-emerald-800 font-medium'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Simulates storageState login"
                    >
                      {ctx.hasAuth ? '● Authenticated (storageState)' : '○ Guest Session'}
                    </button>

                    {contexts.length > 1 && (
                      <button
                        onClick={() => handleRemoveContext(ctx.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Close Context"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Isolated cookies, LocalStorage, Cache, and Proxy settings. Zero leakage to other contexts.
                </div>

                {/* Pages inside this context */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Pages / Tabs ({ctx.pages.length})</span>
                    <button
                      onClick={() => handleAddPage(ctx.id)}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      + New Tab
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ctx.pages.map((pageTitle, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 text-slate-800 rounded-md font-mono"
                      >
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span>{pageTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Actionability Checks Simulator */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              2. Actionability Checks & Auto-Waiting Live Engine
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Demonstrates Question #8 & #27: Before invoking an action (like .click()), Playwright automatically verifies 6 actionability invariants.
          </p>
        </div>

        {/* State selector controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700">Simulate Element Condition:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ready', label: 'Normal / Actionable (All Pass)' },
                { id: 'animating', label: 'Animating CSS Transition' },
                { id: 'disabled', label: 'Attribute disabled="true"' },
                { id: 'obscured', label: 'Covered by Modal Backdrop' },
                { id: 'hidden', label: 'CSS display: none' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setElementState(item.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    elementState === item.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={isSimulating}
            onClick={runActionabilitySimulation}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
          >
            {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Execute await page.click()</span>
          </button>
        </div>

        {/* 6 Checks Checklist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: 'attached', label: 'Attached', desc: 'Element in DOM' },
            { key: 'visible', label: 'Visible', desc: 'Non-zero rect & visible' },
            { key: 'stable', label: 'Stable', desc: 'Animation finished' },
            { key: 'receivesEvents', label: 'Hit Test', desc: 'Not obscured by overlay' },
            { key: 'enabled', label: 'Enabled', desc: 'Not disabled' },
            { key: 'editable', label: 'Editable', desc: 'Writable input' },
          ].map((check) => {
            const status = checkResults[check.key];
            let badgeBg = "bg-slate-50 border-slate-200 text-slate-500";
            if (status === 'pass') badgeBg = "bg-emerald-50 border-emerald-300 text-emerald-900";
            if (status === 'fail') badgeBg = "bg-red-50 border-red-300 text-red-900";

            return (
              <div key={check.key} className={`border rounded-xl p-3 text-center transition-all ${badgeBg}`}>
                <div className="flex items-center justify-center mb-1">
                  {status === 'pass' && <Check className="w-5 h-5 text-emerald-600" />}
                  {status === 'fail' && <X className="w-5 h-5 text-red-600" />}
                  {status === 'pending' && <span className="w-5 h-5 rounded-full border-2 border-slate-300 inline-block" />}
                </div>
                <div className="text-xs font-bold">{check.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{check.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Live Execution Terminal Log */}
        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold pb-1 border-b border-slate-800">
            Actionability Engine Log Stream
          </div>
          {simulationLog.length === 0 ? (
            <div className="text-slate-600 italic py-2">
              Select an element condition above and click "Execute await page.click()" to inspect the live Actionability verification trace.
            </div>
          ) : (
            simulationLog.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('FAIL') || log.includes('Timeout')
                    ? 'text-red-400 font-semibold'
                    : log.includes('SUCCESS')
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
