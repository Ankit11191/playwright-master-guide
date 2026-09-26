import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Search, ShieldCheck } from 'lucide-react';

export const CheatSheetView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Playwright Quick Reference & Cheat Sheet
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          A high-density reference guide of essential Playwright locators, web-first assertions, CLI commands, and configuration options.
        </p>
      </div>

      {/* 1. Recommended Locators Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Locator Hierarchy & Recommended Priority (Questions 7 & 43)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">User-Facing First</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Priority / Type</th>
                <th className="py-3 px-4">Playwright Syntax</th>
                <th className="py-3 px-4">HTML Example</th>
                <th className="py-3 px-4">When to Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-semibold text-emerald-800">1. Role (Recommended)</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-900">page.getByRole('button', &#123; name: 'Submit' &#125;)</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-500">&lt;button&gt;Submit&lt;/button&gt;</td>
                <td className="py-3 px-4">Buttons, links, checkboxes, headings, dialogs. Closest to real user behavior.</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-semibold text-emerald-800">2. Label</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-900">page.getByLabel('Email Address')</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-500">&lt;label&gt;Email Address &lt;input/&gt;&lt;/label&gt;</td>
                <td className="py-3 px-4">Form inputs associated with label tags or aria-label attributes.</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-semibold text-emerald-800">3. Placeholder</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-900">page.getByPlaceholder('Search products...')</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-500">&lt;input placeholder="..."/&gt;</td>
                <td className="py-3 px-4">Inputs lacking explicit labels.</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-semibold text-emerald-800">4. Text</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-900">page.getByText('Order Confirmation')</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-500">&lt;p&gt;Order Confirmation&lt;/p&gt;</td>
                <td className="py-3 px-4">Static text nodes, paragraphs, headings.</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-semibold text-amber-800">5. Test ID</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-900">page.getByTestId('cart-summary')</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-500">&lt;div data-testid="..."/&gt;</td>
                <td className="py-3 px-4">When role or text is dynamic or ambiguous.</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="py-3 px-4 font-semibold text-slate-500">6. CSS / XPath (Last)</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-900">page.locator('.container &gt; div:nth-child(2)')</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-500">Arbitrary DOM tree</td>
                <td className="py-3 px-4 text-amber-700">Avoid where possible. Fragile to CSS class refactoring.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Web-First Assertions Cheat Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Essential Web-First Assertions (Questions 9 & 27)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">All poll & auto-retry</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {[
            { assertion: "await expect(locator).toBeVisible();", desc: "Waits until element has non-zero rect & visible" },
            { assertion: "await expect(locator).toBeEnabled();", desc: "Waits until element does not have disabled attribute" },
            { assertion: "await expect(locator).toHaveText(/Order #\\d+/);", desc: "Waits until element text matches regex pattern" },
            { assertion: "await expect(locator).toHaveValue('alice@test.com');", desc: "Waits until input field contains specific text" },
            { assertion: "await expect(locator).toHaveCount(5);", desc: "Waits until locator matches exactly 5 DOM elements" },
            { assertion: "await expect(locator).toHaveAttribute('aria-expanded', 'true');", desc: "Waits for accordion or dropdown aria state" },
            { assertion: "await expect(page).toHaveURL(/.*checkout/);", desc: "Waits for page URL to match path or regex" },
            { assertion: "await expect(page).toHaveTitle(/Dashboard/);", desc: "Waits for page title document metadata" },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
              <div>
                <span className="text-emerald-700 font-semibold block">{item.assertion}</span>
                <span className="text-slate-500 font-sans text-[11px] mt-0.5 block">{item.desc}</span>
              </div>
              <button
                onClick={() => copyToClipboard(item.assertion, `assert-${i}`)}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Copy"
              >
                {copiedKey === `assert-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Essential CLI Commands */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Playwright CLI Superpowers (Questions 18, 23, 24, 25)
            </h3>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {[
            { cmd: "npx playwright test", desc: "Run all tests headlessly in parallel" },
            { cmd: "npx playwright test --ui", desc: "Open rich interactive UI mode with time-travel" },
            { cmd: "npx playwright test --debug", desc: "Run with Playwright Inspector step-by-step" },
            { cmd: "npx playwright test --headed", desc: "Execute with visible browser window" },
            { cmd: "npx playwright test --project=chromium", desc: "Run only against specific browser project" },
            { cmd: "npx playwright test --workers=4", desc: "Control number of parallel worker processes" },
            { cmd: "npx playwright show-report", desc: "Launch interactive HTML test report" },
            { cmd: "npx playwright show-trace ./trace.zip", desc: "Inspect captured trace file locally" },
            { cmd: "npx playwright codegen https://example.com", desc: "Record user actions and generate test code" },
            { cmd: "npx playwright test --shard=1/4", desc: "Distribute tests across multiple CI machines" },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-slate-900 text-slate-200 rounded-lg flex items-center justify-between gap-3">
              <div>
                <span className="text-emerald-400 font-semibold block">{item.cmd}</span>
                <span className="text-slate-400 font-sans text-[11px] mt-0.5 block">{item.desc}</span>
              </div>
              <button
                onClick={() => copyToClipboard(item.cmd, `cli-${i}`)}
                className="p-1 text-slate-400 hover:text-white"
                title="Copy Command"
              >
                {copiedKey === `cli-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
