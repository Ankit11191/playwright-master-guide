import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  Download,
  Coffee,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingCart,
  ShieldCheck,
  Laptop,
  Maximize2,
  Trash2,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  JAVA_PRESETS,
  PREDEFINED_IMPORTS,
  PREDEFINED_CLASS_WRAPPER_START,
  PREDEFINED_CLASS_WRAPPER_END,
  QUICK_INSERT_COMMANDS,
  MAVEN_POM_XML,
  GRADLE_BUILD,
  JavaPreset
} from '../data/playwrightJavaPresets';

interface LogItem {
  id: string;
  type: 'stdout' | 'stderr' | 'action' | 'assertion' | 'system' | 'error';
  text: string;
  time: string;
}

interface BrowserState {
  url: string;
  title: string;
  searchQuery: string;
  cartCount: number;
  loginEmail: string;
  loginPass: string;
  rememberMe: boolean;
  isLoggedIn: boolean;
  activeDialog: { message: string; type: string; accepted?: boolean } | null;
  asyncLoaded: boolean;
  asyncLoading: boolean;
  highlightedSelector: string | null;
  lastAction: string | null;
  screenshots: Array<{ id: string; name: string; timestamp: string }>;
}

export const JavaCompilerConsole: React.FC = () => {
  // Current Preset & Code
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ecommerce-flow');
  const [viewMode, setViewMode] = useState<'snippet' | 'fullClass'>('snippet');
  const [snippetCode, setSnippetCode] = useState<string>(JAVA_PRESETS[0].commandSnippet);
  const [fullCode, setFullCode] = useState<string>(JAVA_PRESETS[0].fullClassCode);

  // Execution & UI state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [slowMoSpeed, setSlowMoSpeed] = useState<number>(100); // 0, 100, 300ms
  const [activeRightTab, setActiveRightTab] = useState<'terminal' | 'browser' | 'reference'>('browser');
  const [terminalFilter, setTerminalFilter] = useState<'all' | 'stdout' | 'action' | 'assertion' | 'error'>('all');
  const [isBoilerplateExpanded, setIsBoilerplateExpanded] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedTerminal, setCopiedTerminal] = useState<boolean>(false);
  const [copiedPom, setCopiedPom] = useState<boolean>(false);

  // Terminal Logs & Stats
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Playwright Java Practice Environment initialized (OpenJDK 21 LTS + Playwright v1.49.0)',
      time: '00:00:00'
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Predefined objects available: page, context, browser, playwright, assertThat(...)',
      time: '00:00:00'
    },
    {
      id: 'init-3',
      type: 'stdout',
      text: '>> Ready for practice. Click "Run Code (▶)" to execute commands.',
      time: '00:00:01'
    }
  ]);

  const [runStats, setRunStats] = useState<{
    durationMs: number;
    passedAssertions: number;
    totalAssertions: number;
    exitCode: number;
  }>({
    durationMs: 0,
    passedAssertions: 0,
    totalAssertions: 0,
    exitCode: 0
  });

  // Simulated Virtual Browser State
  const [browserState, setBrowserState] = useState<BrowserState>({
    url: JAVA_PRESETS[0].initialUrl,
    title: 'Playwright Tech Store | Quality Audio & Hardware',
    searchQuery: '',
    cartCount: 0,
    loginEmail: '',
    loginPass: '',
    rememberMe: false,
    isLoggedIn: false,
    activeDialog: null,
    asyncLoaded: false,
    asyncLoading: false,
    highlightedSelector: null,
    lastAction: null,
    screenshots: []
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<{ aborted: boolean }>({ aborted: false });

  // Auto scroll terminal on logs
  useEffect(() => {
    if (activeRightTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeRightTab]);

  // Sync preset change
  const handleSelectPreset = (presetId: string) => {
    const preset = JAVA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setSnippetCode(preset.commandSnippet);
    setFullCode(preset.fullClassCode);
    setBrowserState((prev) => ({
      ...prev,
      url: preset.initialUrl,
      title: preset.id === 'login-validation'
        ? 'Enterprise Customer Portal | Sign In'
        : preset.id === 'assertions-autowait' || preset.id === 'dialogs-alerts'
        ? 'Automation Practice Sandbox | Playwright Lab'
        : 'Playwright Tech Store | Quality Audio & Hardware',
      searchQuery: '',
      cartCount: 0,
      loginEmail: '',
      loginPass: '',
      rememberMe: false,
      isLoggedIn: false,
      activeDialog: null,
      asyncLoaded: false,
      asyncLoading: false,
      highlightedSelector: null,
      lastAction: null
    }));

    addLog('system', `Loaded preset scenario: "${preset.name}" (${preset.category})`);
  };

  const addLog = (type: LogItem['type'], text: string) => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
    setLogs((prev) => [...prev, { id: Math.random().toString(36).slice(2, 9), type, text, time }]);
  };

  const handleInsertSnippet = (snippet: string) => {
    if (viewMode === 'snippet') {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const current = snippetCode;
        const updated = current.substring(0, start) + '\n' + snippet + current.substring(end);
        setSnippetCode(updated);
      } else {
        setSnippetCode((prev) => prev + '\n' + snippet);
      }
    } else {
      setFullCode((prev) => prev.replace('// Your Commands:', `// Your Commands:\n            ${snippet}`));
    }
    addLog('system', `Inserted Playwright Java statement: ${snippet.split('\n')[0]}`);
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isRunning) {
        handleRunCode();
      }
    }
  };

  // Playwright Java Virtual Execution Engine
  const handleRunCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    abortControllerRef.current = { aborted: false };
    const startTime = performance.now();

    // Determine code to execute
    let codeToExecute = viewMode === 'snippet' ? snippetCode : fullCode;

    // Switch right tab to terminal/browser view
    setActiveRightTab('browser');

    // Reset browser dynamic state
    setBrowserState((prev) => ({
      ...prev,
      highlightedSelector: null,
      lastAction: 'Initializing Playwright runtime...',
      searchQuery: '',
      cartCount: 0,
      isLoggedIn: false,
      activeDialog: null,
      asyncLoaded: false,
      asyncLoading: false
    }));

    addLog('system', '────────────────────────────────────────────────────────');
    addLog('system', `▶ Compilation started: javac PlaywrightPractice.java`);
    addLog('system', `✓ Compiled successfully with OpenJDK 21.0.4. Running JVM...`);
    addLog('action', `[PW:INIT] Playwright.create() initialized with chromium`);
    addLog('action', `[PW:BROWSER] Launching Chromium (headless=false, slowMo=${slowMoSpeed}ms)`);
    addLog('action', `[PW:CONTEXT] BrowserContext context = browser.newContext(viewport: 1280x720)`);
    addLog('action', `[PW:PAGE] Page page = context.newPage()`);

    // Parse commands line by line
    const lines = codeToExecute.split('\n');
    let passedAsserts = 0;
    let totalAsserts = 0;
    let hasError = false;

    // Helper sleep
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      for (let i = 0; i < lines.length; i++) {
        if (abortControllerRef.current.aborted) {
          addLog('system', '⏹ Execution halted by user.');
          break;
        }

        const rawLine = lines[i].trim();

        // Skip comment or empty lines or Java class boilerplate
        if (
          !rawLine ||
          rawLine.startsWith('//') ||
          rawLine.startsWith('/*') ||
          rawLine.startsWith('*') ||
          rawLine.startsWith('package ') ||
          rawLine.startsWith('import ') ||
          rawLine.startsWith('public class ') ||
          rawLine.startsWith('public static void main') ||
          rawLine.startsWith('try (Playwright') ||
          rawLine.startsWith('browser.close()') ||
          rawLine.startsWith('}') ||
          rawLine.startsWith('{')
        ) {
          continue;
        }

        if (slowMoSpeed > 0) {
          await delay(slowMoSpeed);
        }

        // 1. page.navigate(...)
        const navMatch = rawLine.match(/page\.navigate\s*\(\s*["']([^"']+)["']\s*\)/);
        if (navMatch) {
          const targetUrl = navMatch[1];
          let newTitle = 'Playwright Tech Store | Quality Audio & Hardware';
          if (targetUrl.includes('login')) {
            newTitle = 'Enterprise Customer Portal | Sign In';
          } else if (targetUrl.includes('automation') || targetUrl.includes('practice')) {
            newTitle = 'Automation Practice Sandbox | Playwright Lab';
          }

          setBrowserState((prev) => ({
            ...prev,
            url: targetUrl,
            title: newTitle,
            lastAction: `Navigated to ${targetUrl}`
          }));

          addLog('action', `[PW:NAVIGATE] GET ${targetUrl} (200 OK - 82ms)`);
          continue;
        }

        // 2. System.out.println(...)
        const printMatch = rawLine.match(/System\.out\.println\s*\(\s*(.+)\s*\)\s*;/);
        if (printMatch) {
          let expr = printMatch[1].trim();
          let resolved = expr;

          // Simple string concatenation evaluation
          const parts = expr.split('+');
          const evaluatedParts = parts.map((part) => {
            const p = part.trim();
            // Literal string
            const strLiteralMatch = p.match(/^["'](.*)["']$/);
            if (strLiteralMatch) return strLiteralMatch[1];

            // Method calls
            if (p.includes('page.title()')) return browserState.title;
            if (p.includes('page.url()')) return browserState.url;
            if (p.includes('.textContent()')) {
              if (p.includes('productTitle')) return 'Playwright Pro Headphones';
              if (p.includes('cart-badge')) return String(browserState.cartCount || 1);
              if (p.includes('welcomeBanner') || p.includes('welcome-user')) return 'Welcome back, QA Engineer!';
              if (p.includes('successBadge')) return 'Data loaded successfully!';
              if (p.includes('dialogResult')) return 'Dialog Accepted: Accepted by Playwright Java Test Runner';
              return 'Playwright Element Content';
            }
            if (p.includes('.count()')) {
              if (p.includes('categoryButtons')) return '6';
              if (p.includes('inStockCards')) return '8';
              return '4';
            }
            if (p.includes('.isChecked()')) return 'true';
            if (p.includes('.isVisible()')) return 'true';

            return p;
          });

          resolved = evaluatedParts.join('');
          addLog('stdout', resolved);
          continue;
        }

        // 3. System.err.println(...)
        const printErrMatch = rawLine.match(/System\.err\.println\s*\(\s*(.+)\s*\)\s*;/);
        if (printErrMatch) {
          let msg = printErrMatch[1].replace(/^["']|["']$/g, '');
          addLog('stderr', msg);
          continue;
        }

        // 4. Fill actions (e.g. getByPlaceholder(...).fill("...") or locator(...).fill("..."))
        const fillMatch = rawLine.match(/\.fill\s*\(\s*["']([^"']+)["']\s*\)/);
        if (fillMatch) {
          const fillValue = fillMatch[1];
          let fieldName = 'Input Field';

          if (rawLine.includes('getByPlaceholder') || rawLine.includes('Search')) {
            fieldName = 'Search Box';
            setBrowserState((prev) => ({
              ...prev,
              searchQuery: fillValue,
              highlightedSelector: 'search-input',
              lastAction: `page.fill("search", "${fillValue}")`
            }));
          } else if (rawLine.includes('Email') || rawLine.includes('#userEmail')) {
            fieldName = 'Email';
            setBrowserState((prev) => ({
              ...prev,
              loginEmail: fillValue,
              highlightedSelector: 'login-email',
              lastAction: `page.fill("email", "${fillValue}")`
            }));
          } else if (rawLine.includes('Password')) {
            fieldName = 'Password';
            setBrowserState((prev) => ({
              ...prev,
              loginPass: fillValue,
              highlightedSelector: 'login-password',
              lastAction: `page.fill("password", "••••••••")`
            }));
          }

          addLog('action', `[PW:FILL] Filled locator with "${fillValue}"`);
          continue;
        }

        // 5. Click actions
        if (rawLine.includes('.click()')) {
          let clickedTarget = 'Button';
          if (rawLine.includes('Search')) {
            clickedTarget = 'Search Button';
            setBrowserState((prev) => ({
              ...prev,
              highlightedSelector: 'search-button',
              lastAction: 'Clicked Search Button'
            }));
          } else if (rawLine.includes('Add to Cart')) {
            clickedTarget = 'Add to Cart Button';
            setBrowserState((prev) => ({
              ...prev,
              cartCount: prev.cartCount + 1,
              highlightedSelector: 'add-to-cart-btn',
              lastAction: 'Added item to cart (count + 1)'
            }));
          } else if (rawLine.includes('Sign In') || rawLine.includes('Login')) {
            clickedTarget = 'Sign In Button';
            setBrowserState((prev) => ({
              ...prev,
              isLoggedIn: true,
              highlightedSelector: 'signin-btn',
              lastAction: 'Submitted Authentication Form'
            }));
          } else if (rawLine.includes('Load Data')) {
            clickedTarget = 'Load Data Asynchronously Button';
            setBrowserState((prev) => ({
              ...prev,
              asyncLoading: true,
              highlightedSelector: 'async-btn',
              lastAction: 'Triggered async data load'
            }));
            await delay(150);
            setBrowserState((prev) => ({
              ...prev,
              asyncLoading: false,
              asyncLoaded: true
            }));
          } else if (rawLine.includes('Trigger Confirmation') || rawLine.includes('Alert')) {
            clickedTarget = 'Trigger Confirmation Dialog Button';
            setBrowserState((prev) => ({
              ...prev,
              activeDialog: {
                type: 'confirm',
                message: 'Are you sure you want to proceed with this Playwright action?',
                accepted: true
              },
              highlightedSelector: 'dialog-btn',
              lastAction: 'Triggered JavaScript confirmation dialog'
            }));
          }

          addLog('action', `[PW:CLICK] Clicked locator "${clickedTarget}"`);
          continue;
        }

        // 6. Checkbox actions
        if (rawLine.includes('.check()')) {
          setBrowserState((prev) => ({
            ...prev,
            rememberMe: true,
            highlightedSelector: 'remember-checkbox',
            lastAction: 'Checked "Remember me"'
          }));
          addLog('action', `[PW:CHECK] Checked locator (AriaRole.CHECKBOX)`);
          continue;
        }

        // 7. Dialog handling registration (page.onceDialog)
        if (rawLine.includes('page.onceDialog')) {
          addLog('action', `[PW:EVENT] Registered page.onceDialog(dialog -> ...) listener`);
          continue;
        }

        // 8. Network route mocking (page.route)
        if (rawLine.includes('page.route')) {
          addLog('action', `[PW:ROUTE] Intercepted route matching pattern "**/api/**"`);
          continue;
        }

        // 9. Screenshots
        if (rawLine.includes('.screenshot(')) {
          const snapshotId = 'snap_' + Math.random().toString(36).slice(2, 7);
          setBrowserState((prev) => ({
            ...prev,
            screenshots: [
              ...prev.screenshots,
              {
                id: snapshotId,
                name: rawLine.includes('full') ? 'Full Page Viewport Snapshot' : 'Element Locator Snapshot',
                timestamp: new Date().toLocaleTimeString()
              }
            ]
          }));
          addLog('action', `[PW:SCREENSHOT] Captured viewport snapshot (${snapshotId}.png - 1280x720)`);
          continue;
        }

        // 10. Assertions: assertThat(page).hasTitle(...)
        const titleAssertMatch = rawLine.match(/assertThat\s*\(\s*page\s*\)\.hasTitle\s*\(\s*["']([^"']+)["']\s*\)/);
        if (titleAssertMatch) {
          totalAsserts++;
          const expectedTitle = titleAssertMatch[1];
          // Title check
          if (browserState.title.toLowerCase().includes(expectedTitle.toLowerCase()) || expectedTitle.includes('Playwright')) {
            passedAsserts++;
            addLog('assertion', `✓ [ASSERTION PASS] assertThat(page).hasTitle("${expectedTitle}")`);
          } else {
            hasError = true;
            addLog('error', `✗ [ASSERTION FAIL] assertThat(page).hasTitle("${expectedTitle}") - actual: "${browserState.title}"`);
          }
          continue;
        }

        // 11. Assertions on locators: isVisible(), hasText(), isEnabled(), hasValue()
        if (rawLine.includes('assertThat(')) {
          totalAsserts++;
          if (rawLine.includes('.isVisible()')) {
            passedAsserts++;
            addLog('assertion', `✓ [ASSERTION PASS] assertThat(locator).isVisible() -> element is in DOM and visible`);
          } else if (rawLine.includes('.hasText(')) {
            passedAsserts++;
            const textMatch = rawLine.match(/\.hasText\s*\(\s*["']([^"']+)["']\s*\)/);
            addLog('assertion', `✓ [ASSERTION PASS] assertThat(locator).hasText("${textMatch ? textMatch[1] : 'matched'}")`);
          } else if (rawLine.includes('.isEnabled()')) {
            passedAsserts++;
            addLog('assertion', `✓ [ASSERTION PASS] assertThat(locator).isEnabled() -> element is ready for input`);
          } else if (rawLine.includes('.hasValue(')) {
            passedAsserts++;
            addLog('assertion', `✓ [ASSERTION PASS] assertThat(locator).hasValue(...) -> value matched`);
          } else {
            passedAsserts++;
            addLog('assertion', `✓ [ASSERTION PASS] ${rawLine}`);
          }
          continue;
        }

        // 12. Generic locator declaration or variable assignment
        if (rawLine.includes('Locator ') || rawLine.includes('String ') || rawLine.includes('int ')) {
          addLog('action', `[PW:LOCATOR] Resolved: ${rawLine}`);
          continue;
        }

        // Any other statement
        addLog('action', `[EXEC] ${rawLine}`);
      }
    } catch (err: any) {
      hasError = true;
      addLog('error', `Exception in thread "main" com.microsoft.playwright.PlaywrightException: ${err.message || 'Execution error'}`);
    }

    const duration = Math.round(performance.now() - startTime);

    setRunStats({
      durationMs: duration,
      passedAssertions: passedAsserts,
      totalAssertions: totalAsserts,
      exitCode: hasError ? 1 : 0
    });

    addLog('system', `────────────────────────────────────────────────────────`);
    addLog(
      hasError ? 'error' : 'system',
      hasError
        ? `✗ Process exited with code 1 (Errors encountered) in ${duration}ms`
        : `✓ Process finished with exit code 0 (Success) in ${duration}ms`
    );

    setIsRunning(false);
  };

  const handleStopExecution = () => {
    abortControllerRef.current.aborted = true;
    setIsRunning(false);
    addLog('system', '⏹ Execution aborted by user.');
  };

  const handleResetToPreset = () => {
    handleSelectPreset(selectedPresetId);
  };

  const handleCopyCode = () => {
    const textToCopy = viewMode === 'snippet' ? snippetCode : fullCode;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadJavaFile = () => {
    const content = viewMode === 'fullClass'
      ? fullCode
      : `${PREDEFINED_CLASS_WRAPPER_START}${snippetCode.split('\n').map(l => '            ' + l).join('\n')}${PREDEFINED_CLASS_WRAPPER_END}`;
    const blob = new Blob([content], { type: 'text/x-java-source' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PlaywrightPractice.java';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyTerminal = () => {
    const terminalText = logs.map((l) => `[${l.time}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(terminalText);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  const handleClearTerminal = () => {
    setLogs([
      {
        id: 'cleared',
        type: 'system',
        text: 'Console cleared. JVM ready.',
        time: new Date().toTimeString().split(' ')[0]
      }
    ]);
  };

  // Filter logs for view
  const filteredLogs = logs.filter((log) => {
    if (terminalFilter === 'all') return true;
    if (terminalFilter === 'stdout') return log.type === 'stdout';
    if (terminalFilter === 'action') return log.type === 'action';
    if (terminalFilter === 'assertion') return log.type === 'assertion';
    if (terminalFilter === 'error') return log.type === 'error' || log.type === 'stderr';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner & Environment Info */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 text-white rounded-2xl p-5 border border-amber-500/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Playwright Java Compiler & Practice Console
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-normal">
                    Java 21 LTS • v1.49
                  </span>
                </h1>
                <p className="text-xs text-slate-300">
                  Write and practice Playwright Java commands interactively. Predefined classes and imports are automatically wired!
                </p>
              </div>
            </div>
          </div>

          {/* Quick presets selector & execution actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="appearance-none bg-slate-800 text-slate-200 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl border border-slate-700 hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-colors cursor-pointer"
              >
                {JAVA_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Run Button */}
            <button
              onClick={isRunning ? handleStopExecution : handleRunCode}
              disabled={false}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                isRunning
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]'
              }`}
              title={isRunning ? 'Halt Execution' : 'Run Playwright Java Code (Ctrl+Enter)'}
            >
              {isRunning ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Java (▶)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Predefined Class & Imports Notice */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong className="text-amber-300">Predefined Context Injected:</strong>{' '}
                <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono text-[11px]">Playwright playwright</code>,{' '}
                <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono text-[11px]">Browser browser</code>,{' '}
                <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono text-[11px]">Page page</code>,{' '}
                <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono text-[11px]">assertThat(...)</code>
              </span>
            </div>
            <button
              onClick={() => setIsBoilerplateExpanded(!isBoilerplateExpanded)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-medium"
            >
              {isBoilerplateExpanded ? 'Hide Predefined Wrapper' : 'View Predefined Wrapper & Imports'}
              {isBoilerplateExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isBoilerplateExpanded && (
            <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-2">
              <div className="text-amber-400/90 font-semibold">// Pre-injected Imports:</div>
              <div className="text-slate-300 space-y-0.5 pl-2">
                {PREDEFINED_IMPORTS.map((imp, idx) => (
                  <div key={idx}>{imp}</div>
                ))}
              </div>
              <div className="text-amber-400/90 font-semibold pt-1">// Predefined Class Wrapper:</div>
              <div className="text-slate-400 pl-2">
                <span className="text-purple-400">public class</span> PlaywrightPractice &#123;
                <br />
                &nbsp;&nbsp;<span className="text-purple-400">public static void</span> main(String[] args) &#123; ... &#125;
                <br />
                &#125;
              </div>
              <p className="text-[10px] text-slate-500 italic pt-1">
                You can write raw commands like <code>page.navigate(...)</code> or switch to "Full Class Mode" below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Editor & Execution Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Code Editor (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
          {/* Editor Header Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('snippet')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  viewMode === 'snippet'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Write only commands without boilerplate"
              >
                🚀 Command Mode (Snippet)
              </button>
              <button
                onClick={() => setViewMode('fullClass')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  viewMode === 'fullClass'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View and edit the complete Java file"
              >
                📄 Full Class File
              </button>
            </div>

            {/* Editor Utilities */}
            <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
              {/* SlowMo speed selector */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">SlowMo:</span>
                <select
                  value={slowMoSpeed}
                  onChange={(e) => setSlowMoSpeed(Number(e.target.value))}
                  className="bg-transparent text-slate-200 font-mono text-[11px] focus:outline-none cursor-pointer"
                >
                  <option value={0} className="bg-slate-900">0ms (Instant)</option>
                  <option value={100} className="bg-slate-900">100ms</option>
                  <option value={300} className="bg-slate-900">300ms</option>
                  <option value={600} className="bg-slate-900">600ms (Slow)</option>
                </select>
              </div>

              {/* Reset to preset */}
              <button
                onClick={handleResetToPreset}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Reset code to original preset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Copy Code */}
              <button
                onClick={handleCopyCode}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Copy Java code to clipboard"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Download .java file */}
              <button
                onClick={handleDownloadJavaFile}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Download PlaywrightPractice.java file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Insert Command Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick Add:
            </span>
            {QUICK_INSERT_COMMANDS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleInsertSnippet(item.code)}
                className="shrink-0 px-2 py-0.5 bg-slate-800/90 hover:bg-amber-600/30 text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/50 rounded-md font-mono text-[10.5px] transition-colors"
                title={`Insert: ${item.code}`}
              >
                + {item.label}
              </button>
            ))}
          </div>

          {/* Code Textarea with line numbers simulated */}
          <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] bg-slate-900 font-mono text-xs flex">
            {/* Visual Line Numbers */}
            <div className="select-none py-3 px-2 bg-slate-950/70 border-r border-slate-800 text-slate-600 text-right font-mono text-[11px] w-10 shrink-0">
              {Array.from({ length: Math.max(20, (viewMode === 'snippet' ? snippetCode : fullCode).split('\n').length) }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Actual Editable Textarea */}
            <textarea
              ref={textareaRef}
              value={viewMode === 'snippet' ? snippetCode : fullCode}
              onChange={(e) => {
                if (viewMode === 'snippet') {
                  setSnippetCode(e.target.value);
                } else {
                  setFullCode(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="flex-1 w-full p-3 bg-transparent text-emerald-300 font-mono text-[12px] leading-6 resize-none focus:outline-none selection:bg-amber-500/30 selection:text-white"
              placeholder="// Write your Playwright Java commands here..."
            />
          </div>

          {/* Editor Footer Status Bar */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                {viewMode === 'snippet' ? 'Snippet Mode' : 'PlaywrightPractice.java'}
              </span>
              <span className="text-slate-600">|</span>
              <span>
                Lines: {(viewMode === 'snippet' ? snippetCode : fullCode).split('\n').length}
              </span>
              <span className="text-slate-600">|</span>
              <span>
                Chars: {(viewMode === 'snippet' ? snippetCode : fullCode).length}
              </span>
            </div>
            <div className="text-slate-400 flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">
                Ctrl
              </kbd>
              +
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">
                Enter
              </kbd>
              <span>to run</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Views (Browser / Terminal / Reference) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveRightTab('browser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeRightTab === 'browser'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Browser</span>
                {browserState.cartCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {browserState.cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveRightTab('terminal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeRightTab === 'terminal'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>Console Logs</span>
                {runStats.totalAssertions > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                    {runStats.passedAssertions}/{runStats.totalAssertions}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveRightTab('reference')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeRightTab === 'reference'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Pom.xml</span>
              </button>
            </div>

            {/* Quick action for active tab */}
            {activeRightTab === 'terminal' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyTerminal}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
                  title="Copy terminal output"
                >
                  {copiedTerminal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleClearTerminal}
                  className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-200 transition-colors"
                  title="Clear console"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: SIMULATED BROWSER VIEWPORT */}
          {activeRightTab === 'browser' && (
            <div className="flex-1 flex flex-col bg-slate-50">
              {/* Chrome Mock URL Bar */}
              <div className="p-2.5 bg-white border-b border-slate-200 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 transition-colors px-2.5 py-1 rounded-md text-[11px] text-slate-700 font-mono truncate border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{browserState.url}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  1280×720
                </div>
              </div>

              {/* Action Pulse Bar */}
              {browserState.lastAction && (
                <div className="bg-amber-50 border-b border-amber-200 px-3 py-1 text-[11px] text-amber-900 font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
                    <span className="truncate font-semibold">{browserState.lastAction}</span>
                  </span>
                  {isRunning && (
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase">
                      Active
                    </span>
                  )}
                </div>
              )}

              {/* Rendered Web Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[460px]">
                {/* Dialog popup if triggered */}
                {browserState.activeDialog && (
                  <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-xl shadow-md text-xs space-y-2 animate-bounce">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        JavaScript Dialog (Prompt / Confirm)
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                        Handled by page.onceDialog
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{browserState.activeDialog.message}</p>
                    <div className="text-[11px] text-emerald-700 font-mono" id="dialogResultText">
                      Dialog Accepted: Accepted by Playwright Java Test Runner
                    </div>
                  </div>
                )}

                {/* Scenario 1: E-Commerce Store */}
                {browserState.url.includes('ecommerce') && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          PW
                        </div>
                        <h2 className="font-bold text-slate-900 text-sm">Playwright Tech Store</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`relative p-2 rounded-lg bg-slate-100 text-slate-700 transition-all ${
                            browserState.highlightedSelector === 'add-to-cart-btn'
                              ? 'ring-4 ring-emerald-500/50 bg-emerald-50 text-emerald-900 scale-105'
                              : ''
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="cart-badge absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {browserState.cartCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Search Field */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex-1 flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-1.5 text-xs transition-all ${
                          browserState.highlightedSelector === 'search-input'
                            ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/50'
                            : 'border-slate-200'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          readOnly
                          placeholder="Search products..."
                          value={browserState.searchQuery}
                          className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${
                          browserState.highlightedSelector === 'search-button'
                            ? 'bg-amber-600 ring-4 ring-amber-400/50 scale-105'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        Search
                      </button>
                    </div>

                    {/* Product Card */}
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        browserState.highlightedSelector === 'add-to-cart-btn'
                          ? 'border-emerald-500 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            In Stock
                          </span>
                          <h3 className="product-title font-bold text-slate-900 text-sm mt-1">
                            Playwright Pro Headphones
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Wireless Active Noise-Canceling Audio • Ultra-low Latency
                          </p>
                        </div>
                        <span className="text-sm font-bold text-slate-900 font-mono">$199.00</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="user-role-badge text-[10px] text-slate-500 font-medium">
                          Role: Senior QA Architect
                        </span>
                        <button
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                            browserState.highlightedSelector === 'add-to-cart-btn'
                              ? 'bg-emerald-600 ring-4 ring-emerald-400/40 scale-105'
                              : 'bg-emerald-600 hover:bg-emerald-500'
                          }`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scenario 2: Login Portal */}
                {browserState.url.includes('login') && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                    <div className="text-center space-y-1">
                      <h2 className="font-bold text-slate-900 text-sm">Enterprise Sign In</h2>
                      <p className="text-xs text-slate-500">Sign in to your automated test account</p>
                    </div>

                    {browserState.isLoggedIn && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="welcome-user font-bold">Welcome back, QA Engineer!</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={browserState.loginEmail}
                          placeholder="qa.engineer@company.com"
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border bg-slate-50 ${
                            browserState.highlightedSelector === 'login-email'
                              ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/40'
                              : 'border-slate-200'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          readOnly
                          value={browserState.loginPass ? '••••••••••••' : ''}
                          placeholder="••••••••"
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border bg-slate-50 ${
                            browserState.highlightedSelector === 'login-password'
                              ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/40'
                              : 'border-slate-200'
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={browserState.rememberMe}
                            readOnly
                            className={`rounded text-emerald-600 ${
                              browserState.highlightedSelector === 'remember-checkbox'
                                ? 'ring-4 ring-amber-400'
                                : ''
                            }`}
                          />
                          <span className="text-slate-700 text-[11px]">Remember me</span>
                        </label>
                        <span className="text-[11px] text-emerald-700 hover:underline">Forgot password?</span>
                      </div>

                      <button
                        className={`w-full py-2 rounded-lg text-xs font-bold text-white transition-all ${
                          browserState.highlightedSelector === 'signin-btn'
                            ? 'bg-emerald-600 ring-4 ring-emerald-400/50 scale-[1.02]'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}

                {/* Scenario 3: Automation Sandbox */}
                {(browserState.url.includes('automation') || browserState.url.includes('practice')) && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                    <h2 className="font-bold text-slate-900 text-sm">Playwright Automation Sandbox</h2>

                    {/* Async loader block */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">Dynamic Content Waiter</span>
                        <button
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg text-white transition-all ${
                            browserState.highlightedSelector === 'async-btn'
                              ? 'bg-amber-600 ring-4 ring-amber-400/40'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          Load Data Asynchronously
                        </button>
                      </div>

                      {browserState.asyncLoaded && (
                        <div className="async-success-message p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-bold flex items-center gap-1.5 animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          Data loaded successfully!
                        </div>
                      )}
                    </div>

                    {/* Input Verification */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 block">Form Field State</label>
                      <input
                        id="userEmail"
                        type="text"
                        readOnly
                        value={browserState.loginEmail || 'test@playwright.dev'}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Captured Screenshots Drawer */}
                {browserState.screenshots.length > 0 && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>📸 Captured Snapshots ({browserState.screenshots.length})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {browserState.screenshots.map((s) => (
                        <div key={s.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <div className="w-full h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded flex items-center justify-center border border-slate-700 text-slate-400">
                            <Laptop className="w-6 h-6 text-emerald-400" />
                          </div>
                          <p className="text-[10px] text-slate-300 truncate font-mono">{s.name}</p>
                          <p className="text-[9px] text-slate-500">{s.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TERMINAL CONSOLE LOGS */}
          {activeRightTab === 'terminal' && (
            <div className="flex-1 flex flex-col bg-slate-950 text-slate-200 font-mono text-xs">
              {/* Terminal filter bar */}
              <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[10px] mr-1">Filter:</span>
                  {(['all', 'stdout', 'action', 'assertion', 'error'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTerminalFilter(filter)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        terminalFilter === filter
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">
                  {filteredLogs.length} entries
                </div>
              </div>

              {/* Terminal Logs List */}
              <div className="flex-1 p-3 overflow-y-auto space-y-1 max-h-[460px] text-[11px] leading-5">
                {filteredLogs.map((log) => {
                  let badgeColor = 'text-slate-400';
                  let textColor = 'text-slate-300';

                  if (log.type === 'stdout') {
                    badgeColor = 'text-emerald-400 font-bold';
                    textColor = 'text-emerald-200';
                  } else if (log.type === 'stderr' || log.type === 'error') {
                    badgeColor = 'text-rose-400 font-bold';
                    textColor = 'text-rose-300';
                  } else if (log.type === 'action') {
                    badgeColor = 'text-blue-400 font-bold';
                    textColor = 'text-slate-300';
                  } else if (log.type === 'assertion') {
                    badgeColor = 'text-amber-400 font-bold';
                    textColor = log.text.includes('FAIL') ? 'text-rose-400' : 'text-amber-200';
                  } else if (log.type === 'system') {
                    badgeColor = 'text-purple-400 font-semibold';
                    textColor = 'text-slate-400';
                  }

                  return (
                    <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/40 px-1 py-0.5 rounded">
                      <span className="text-[10px] text-slate-600 shrink-0 font-mono select-none">{log.time}</span>
                      <span className={`shrink-0 text-[10px] uppercase font-mono ${badgeColor}`}>
                        [{log.type}]
                      </span>
                      <span className={`break-all ${textColor}`}>{log.text}</span>
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Execution Summary Footer */}
              <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>JVM Ready</span>
                  </span>
                  {runStats.durationMs > 0 && (
                    <span className="text-slate-400">
                      • Duration: <strong className="text-slate-200 font-mono">{runStats.durationMs}ms</strong>
                    </span>
                  )}
                </div>
                {runStats.totalAssertions > 0 && (
                  <div className="flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {runStats.passedAssertions}/{runStats.totalAssertions} Assertions Passed
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MAVEN & GRADLE REFERENCE */}
          {activeRightTab === 'reference' && (
            <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4 max-h-[460px] text-xs">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  Playwright Java Setup Guide
                </h3>
                <p className="text-xs text-slate-600">
                  Ready to run this locally in IntelliJ, Eclipse, or VS Code? Add these dependencies to your Java build tool.
                </p>
              </div>

              {/* Maven pom.xml */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 font-mono text-[11px]">Maven: pom.xml</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(MAVEN_POM_XML);
                      setCopiedPom(true);
                      setTimeout(() => setCopiedPom(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    {copiedPom ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPom ? 'Copied' : 'Copy Maven XML'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {MAVEN_POM_XML}
                </pre>
              </div>

              {/* Gradle build.gradle */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800 font-mono text-[11px]">Gradle: build.gradle</span>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {GRADLE_BUILD}
                </pre>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                <strong className="block font-bold">CLI Browser Installation:</strong>
                <p>Run this command once in your terminal after adding dependencies to install browsers:</p>
                <code className="block p-1.5 bg-white border border-amber-300 rounded font-mono text-slate-800 text-[10.5px]">
                  mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install"
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
