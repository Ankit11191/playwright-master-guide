import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  BookMarked, 
  Search, 
  Check, 
  Copy, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { STUDY_CARDS, StudyCard } from '../data/studyCardsData';
import { CheatSheetView } from './CheatSheetView';

export const StudyResourcesView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'study-cards' | 'cheat-sheets' | 'glossary'>('study-cards');
  const [selectedCardId, setSelectedCardId] = useState<string>(STUDY_CARDS[0].id);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  const currentCard = STUDY_CARDS.find(c => c.id === selectedCardId) || STUDY_CARDS[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const glossaryTerms = [
    { term: 'Actionability Checks', category: 'Playwright Core', definition: 'The 5-step automated validation (Attached, Visible, Stable, Receives Events, Enabled) Playwright executes before clicking, typing, or checking an element.' },
    { term: 'APIRequestContext', category: 'API Testing', definition: 'Playwright built-in HTTP client for executing direct REST/GraphQL requests with shared cookie and storage state.' },
    { term: 'BrowserContext', category: 'Architecture', definition: 'An isolated, incognito-equivalent browser session with separate cookies, cache, and localStorage, taking ~10ms to spawn.' },
    { term: 'Custom Fixture', category: 'Design Patterns', definition: 'Modular setup and teardown building block created via test.extend<T>() that provides parallel-safe dependency injection.' },
    { term: 'Model Context Protocol (MCP)', category: 'AI Testing', definition: 'An open standard for LLMs to securely query live browser state, accessibility trees, and execute bounded diagnostic tools.' },
    { term: 'Self-Healing Locator', category: 'AI Testing', definition: 'An algorithmic recovery pipeline that uses semantic and accessibility heuristics to identify mutated DOM elements without failing tests.' },
    { term: 'Sharding (--shard=x/y)', category: 'CI/CD & DevOps', definition: 'Native Playwright capability to partition a test suite into N distinct subsets distributed across parallel CI workers.' },
    { term: 'Soft Assertions (expect.soft)', category: 'Assertions', definition: 'Assertions that record failures without immediately halting test execution, useful for full-page audits.' },
    { term: 'StorageState', category: 'Authentication', definition: 'A serialized JSON snapshot containing authenticated cookies and localStorage keys to bypass repetitive UI logins.' },
    { term: 'Trace Viewer', category: 'Diagnostics', definition: 'Playwright post-mortem tool providing action-by-action DOM snapshots, console logs, network waterfalls, and visual screencasts.' },
    { term: 'Web-First Locators', category: 'Locators', definition: 'Accessible locators (getByRole, getByLabel) that auto-wait and query the accessibility tree rather than raw CSS or XPath.' },
    { term: 'Zod', category: 'TypeScript', definition: 'TypeScript-first schema declaration and validation library used for runtime environment configuration integrity.' }
  ];

  const filteredGlossary = glossaryTerms.filter(g => 
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
    g.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.category.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            <span>Enterprise Study Cards, Cheat Sheets & Glossary</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            7 In-depth interview study cards (SC-01 to SC-07), production quick references, and technical dictionary.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveSubTab('study-cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'study-cards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Study Cards (7)
          </button>
          <button
            onClick={() => setActiveSubTab('cheat-sheets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'cheat-sheets'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Cheat Sheets
          </button>
          <button
            onClick={() => setActiveSubTab('glossary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'glossary'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Glossary
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 7 In-Depth Study Cards */}
      {activeSubTab === 'study-cards' && (
        <div className="space-y-6">
          {/* Card Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {STUDY_CARDS.map(card => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  selectedCardId === card.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <span>{card.code}</span>
                <span className="text-[11px] opacity-80">{card.title.split(' ')[0]}...</span>
              </button>
            ))}
          </div>

          {/* Deep-Dive Study Card View */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                    {currentCard.code}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{currentCard.category}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentCard.moduleCode}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentCard.title}
                </h2>
              </div>
            </div>

            {/* Problem Statement vs Architectural Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Engineering Anti-Pattern / Problem
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentCard.deepDive.problemStatement}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Architectural Solution & Best Practice
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentCard.deepDive.architecturalSolution}
                </p>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Production Reference Implementation
                </span>
                <button
                  onClick={() => handleCopy(currentCard.deepDive.keyCodeSnippet)}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{currentCard.deepDive.keyCodeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Key Takeaways & Anti-Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Core Architectural Takeaways
                </h4>
                <ul className="space-y-1.5">
                  {currentCard.deepDive.bulletTakeaways.map((takeaway, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Anti-Patterns to Never Use
                </h4>
                <ul className="space-y-1.5">
                  {currentCard.deepDive.antiPatterns.map((anti, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">✕</span>
                      <span>{anti}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Production Cheat Sheets */}
      {activeSubTab === 'cheat-sheets' && (
        <div className="space-y-4">
          <CheatSheetView />
        </div>
      )}

      {/* SUB-TAB 3: Technical Glossary */}
      {activeSubTab === 'glossary' && (
        <div className="space-y-4">
          {/* Glossary Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search glossary terms (e.g. MCP, Actionability, Fixture, Sharding)..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Glossary Terms List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.term}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
