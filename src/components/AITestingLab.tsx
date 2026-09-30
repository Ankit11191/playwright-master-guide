import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Copy, 
  Check, 
  Search, 
  FileCode, 
  Workflow, 
  Network, 
  SlidersHorizontal 
} from 'lucide-react';

export const AITestingLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'self-healing' | 'prompts'>('mcp');
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  // MCP Simulation State
  const [selectedMcpTool, setSelectedMcpTool] = useState<string>('inspect_accessibility_tree');
  const [mcpExecuting, setMcpExecuting] = useState<boolean>(false);
  const [mcpLog, setMcpLog] = useState<string>('Ready. Click "Invoke MCP Tool" to simulate Playwright - MCP Server - LLM handshake.');

  // Self-Healing Simulation State
  const [healingStage, setHealingStage] = useState<'idle' | 'failed' | 'inspecting' | 'healed'>('idle');

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const handleRunMcpTool = () => {
    setMcpExecuting(true);
    setMcpLog(`[MCP Client] Dispatching JSON-RPC 2.0 tool call: tools/call -> "${selectedMcpTool}"...`);

    setTimeout(() => {
      if (selectedMcpTool === 'inspect_accessibility_tree') {
        setMcpLog(`[MCP Server] Response (200 OK):
{
  "role": "RootWebArea",
  "name": "Enterprise Checkout",
  "children": [
    { "role": "heading", "name": "Payment Method", "level": 2 },
    { "role": "textbox", "name": "Card Number", "required": true },
    { "role": "button", "name": "Confirm & Pay ($149.00)", "focused": false },
    { "role": "link", "name": "Cancel order" }
  ]
}
[LLM Context Ingestion] Analyzed 4 semantic nodes. Identified primary action button.`);
      } else if (selectedMcpTool === 'propose_recovery_locator') {
        setMcpLog(`[MCP Server] Heuristic evaluation complete:
Target Intent: "Submit checkout form"
Candidate 1: page.getByRole('button', { name: /confirm & pay/i }) -> Confidence: 96% (WCAG Accessible)
Candidate 2: page.locator('button.btn-pay-v2') -> Confidence: 68% (CSS class unstable)
Candidate 3: page.locator('xpath=//button[contains(., "149")]') -> Confidence: 38% (XPath anti-pattern)

[Safety Gate] Recommendation: Candidate 1 (getByRole). Passes WCAG AAA and strict stability check.`);
      } else {
        setMcpLog(`[MCP Server] Network trace snapshot:
GET /api/v1/cart/status -> 200 OK (32ms)
POST /api/v1/payment/tokenize -> 201 Created (142ms)
Active WebSockets: 1 (CDP persistent connection healthy)`);
      }
      setMcpExecuting(false);
    }, 600);
  };

  const handleRunSelfHealing = () => {
    setHealingStage('failed');
    setTimeout(() => {
      setHealingStage('inspecting');
      setTimeout(() => {
        setHealingStage('healed');
      }, 1000);
    }, 1000);
  };

  const enterprisePrompts = [
    {
      title: 'Edge Case & Test Matrix Generator from User Story',
      category: 'Test Design',
      prompt: `Act as a Principal SDET. Analyze the following User Story and Acceptance Criteria:
[PASTE USER STORY & AC HERE]

Generate a comprehensive Playwright Test Matrix with:
1. Positive Happy Paths (P0)
2. Negative Boundary & Validation Scenarios (P1)
3. Concurrency & Asynchronous Race Conditions (P1)
4. Accessibility & Responsive Viewport Edge Cases (P2)
5. Recommended locator strategy (prioritizing getByRole) and required mock network intercept points.`
    },
    {
      title: 'Flaky Test Failure Root Cause & Trace Diagnostics',
      category: 'Diagnostics',
      prompt: `Act as a Senior Test Automation Architect. Diagnose this failing Playwright test:
[PASTE TEST CODE]

Here is the Playwright error output and action log:
[PASTE ERROR OUTPUT & TRACE LOG]

Tasks:
1. Identify the exact root cause (race condition, strict mode violation, animation instability, or iframe drop).
2. Explain why this happened in headless CI versus headed local mode.
3. Provide the corrected, production-grade Playwright TypeScript code utilizing web-first assertions.
4. Provide prevention architecture so other engineers on the team do not repeat this mistake.`
    },
    {
      title: 'Gherkin / Feature File to Playwright Page Object Translation',
      category: 'Refactoring',
      prompt: `Translate the following Gherkin BDD scenario into an enterprise-grade Playwright TypeScript Page Object Model:
[PASTE GHERKIN SCENARIO]

Requirements:
1. Strict TypeScript interfaces for all method arguments and return types.
2. Web-First Locators exclusively (getByRole, getByLabel, getByTestId); NO brittle CSS or XPath.
3. Decouple assertion logic from action methods using fluent chaining.
4. Auto-waiting synchronization without arbitrary page.waitForTimeout.`
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-500" />
            <span>AI Testing Lab & Model Context Protocol (MCP)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore MCP architecture, self-healing locator heuristics, and tested enterprise prompt engineering playbooks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mcp'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            MCP Simulator
          </button>
          <button
            onClick={() => setActiveTab('self-healing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'self-healing'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Self-Healing Engine
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Prompt Playbook
          </button>
        </div>
      </div>

      {/* Mode 1: MCP Simulator */}
      {activeTab === 'mcp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Flow Diagram (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Model Context Protocol (MCP) Architecture
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  How MCP Bridges Playwright and AI
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  MCP creates a secure standard protocol where the LLM does not execute blind guesses. Instead, it queries structured tools exposed by the Playwright runner.
                </p>

                {/* Protocol Flow Architecture */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold text-purple-600 dark:text-purple-400">
                    <span>1. Playwright Runner</span>
                    <span>➔</span>
                    <span>2. MCP Server</span>
                    <span>➔</span>
                    <span>3. LLM</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Playwright extracts accessibility tree & DOM state via CDP. The MCP server formats parameters as JSON Schema. The LLM returns structured tool arguments with zero hallucinated code execution.
                  </p>
                </div>

                {/* Tool Selector */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select MCP Tool Call to Execute:
                  </label>
                  <select
                    value={selectedMcpTool}
                    onChange={(e) => setSelectedMcpTool(e.target.value)}
                    className="w-full p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="inspect_accessibility_tree">tools/call: inspect_accessibility_tree</option>
                    <option value="propose_recovery_locator">tools/call: propose_recovery_locator</option>
                    <option value="inspect_network_snapshot">tools/call: inspect_network_snapshot</option>
                  </select>

                  <button
                    onClick={handleRunMcpTool}
                    disabled={mcpExecuting}
                    className="w-full mt-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{mcpExecuting ? 'Communicating over MCP...' : 'Invoke MCP Tool Call'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Protocol Handshake Console (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-purple-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>mcp-jsonrpc-transport.log</span>
                  </div>
                  <span className="text-[11px] text-slate-500">JSON-RPC 2.0 / WebSocket</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[300px]">
                  {mcpLog}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: AI Self-Healing Engine */}
      {activeTab === 'self-healing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Live Self-Healing Pipeline
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Automated Selector Mutation & Semantic Recovery
                </h3>
              </div>
              <button
                onClick={handleRunSelfHealing}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate DOM Mutation & Self-Heal</span>
              </button>
            </div>

            {/* Stepper Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className={`p-4 rounded-xl border transition-all ${
                healingStage === 'failed' || healingStage === 'inspecting' || healingStage === 'healed'
                  ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                  <span>1. Primary Failure</span>
                  {healingStage !== 'idle' && <AlertTriangle className="w-4 h-4" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
                  locator('#submit-order-btn')
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Timeout: Frontend engineers refactored ID to dynamic hash.
                </p>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-xl border transition-all ${
                healingStage === 'inspecting' || healingStage === 'healed'
                  ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-900'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-purple-600">
                  <span>2. Semantic A11y Inspection</span>
                  {healingStage === 'inspecting' && <Bot className="w-4 h-4 animate-bounce" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
                  role="button" name="Submit Order"
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Accessibility tree confirms unique button intent match.
                </p>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-xl border transition-all ${
                healingStage === 'healed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span>3. Healed & Resumed</span>
                  {healingStage === 'healed' && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
                  getByRole('button', &#123; name: 'Submit Order' &#125;)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Confidence: 96% · Test continued without suite failure.
                </p>
              </div>
            </div>

            {/* Safety Verification Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                AI Safety Verification Gate Checklist
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No unvetted arbitrary eval() scripts executed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strict threshold (&gt;85% confidence) enforced</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PII and auth credentials sanitized before prompt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Git commit changes require human review sign-off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Prompt Engineering Playbook */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {enterprisePrompts.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyPrompt(item.prompt, idx)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedPromptIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptIndex === idx ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {item.prompt}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
