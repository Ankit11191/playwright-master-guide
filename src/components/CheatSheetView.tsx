import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Copy,
  Check,
  Terminal,
  FileCode,
  ShieldCheck,
  MousePointer,
  Compass,
  Layers,
  Keyboard,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  Code,
  Zap,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  PLAYWRIGHT_CHEAT_SHEET_SECTIONS,
  CheatSheetItem,
  CheatSheetSection,
} from '../data/playwrightCheatSheet';

// Map icon names to Lucide icons
const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Terminal,
  FileCode,
  Search,
  MousePointer,
  ShieldCheck,
  Compass,
  Layers,
  Keyboard,
  Globe,
  Sparkles,
};

export const CheatSheetView: React.FC = () => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(() => new Set(['setup-init', 'loc-get-by-role', 'assert-visible']));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Collect all unique tags across all sections
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    PLAYWRIGHT_CHEAT_SHEET_SECTIONS.forEach((sec) => {
      sec.items.forEach((item) => {
        item.tags.forEach((t) => tagSet.add(t));
      });
    });
    return Array.from(tagSet).sort();
  }, []);

  // Total count of all items
  const totalItemCount = useMemo(() => {
    return PLAYWRIGHT_CHEAT_SHEET_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  }, []);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Toggle item expansion
  const toggleExpand = (id: string) => {
    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand or collapse all currently displayed items
  const handleToggleExpandAll = (expand: boolean, itemIds: string[]) => {
    if (expand) {
      setExpandedItemIds(new Set(itemIds));
    } else {
      setExpandedItemIds(new Set());
    }
  };

  // Filtered sections and items
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return PLAYWRIGHT_CHEAT_SHEET_SECTIONS.map((section) => {
      // If a section is selected and it does not match, return empty items
      if (selectedSectionId !== 'all' && section.id !== selectedSectionId) {
        return null;
      }

      const matchingItems = section.items.filter((item) => {
        // Tag filter
        if (selectedTag !== 'all' && !item.tags.includes(selectedTag)) {
          return false;
        }

        // Search query filter
        if (query) {
          const matchName = item.name.toLowerCase().includes(query);
          const matchSyntax = item.syntax.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
          const matchCode = item.exampleCode?.toLowerCase().includes(query) || false;
          const matchSubcategory = item.subcategory?.toLowerCase().includes(query) || false;

          if (!matchName && !matchSyntax && !matchDesc && !matchTags && !matchCode && !matchSubcategory) {
            return false;
          }
        }

        return true;
      });

      if (matchingItems.length === 0) {
        return null;
      }

      return {
        ...section,
        items: matchingItems,
      };
    }).filter(Boolean) as CheatSheetSection[];
  }, [searchQuery, selectedSectionId, selectedTag]);

  // Total filtered items
  const filteredItemCount = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [filteredSections]);

  const allFilteredItemIds = useMemo(() => {
    const ids: string[] = [];
    filteredSections.forEach((sec) => sec.items.forEach((item) => ids.push(item.id)));
    return ids;
  }, [filteredSections]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedSectionId !== 'all' || selectedTag !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSectionId('all');
    setSelectedTag('all');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Complete Playwright API Reference & Cheat Sheet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Playwright Syntax & Command Encyclopedia
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Instant search and lookup for installation, CLI flags, test lifecycle hooks, web-first assertions, accessible locators, actions, network mocking, and advanced multi-tab browser automation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{totalItemCount} Documented APIs & Commands</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>10 Core Categories</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Web-First Auto-Waiting Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search bar + View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by method (e.g. getByRole, toBeVisible, route, codegen, storageState)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Expand/Collapse */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Detailed Cards with Runnable Snippets"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Compact Table Matrix"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            {viewMode === 'cards' && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => handleToggleExpandAll(true, allFilteredItemIds)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={() => handleToggleExpandAll(false, allFilteredItemIds)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Pills (Horizontal Scrollable) */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Category Filter</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSectionId('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                selectedSectionId === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Sections ({totalItemCount})
            </button>
            {PLAYWRIGHT_CHEAT_SHEET_SECTIONS.map((sec) => {
              const IconComp = SECTION_ICONS[sec.iconName] || FileCode;
              const isSelected = selectedSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{sec.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
                    {sec.badgeCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Tag Filters */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <Tag className="w-3 h-3 text-slate-400" />
            <span>Tags:</span>
          </div>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2 py-0.5 text-[11px] rounded-md transition-colors ${
              selectedTag === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tags
          </button>
          {['Recommended', 'Web-First', 'Auto-Retry', 'CLI', 'Accessibility', 'Forms', 'Mocking', 'Visual', 'Fixtures', 'Storage', 'iFrame'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
              className={`px-2 py-0.5 text-[11px] rounded-md transition-colors ${
                selectedTag === tag
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tag}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <span className="font-semibold text-slate-900">{filteredItemCount}</span> entries across{' '}
          <span className="font-semibold text-slate-900">{filteredSections.length}</span> categories
        </span>
        {hasActiveFilters && (
          <span className="text-emerald-700 font-medium">Active filter applied</span>
        )}
      </div>

      {/* Main Content Area */}
      {filteredSections.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No matching Playwright syntax found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No results found for &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;getByRole&rdquo;, &ldquo;toBeVisible&rdquo;, &ldquo;route&rdquo;, or reset your filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSections.map((section) => {
            const IconComponent = SECTION_ICONS[section.iconName] || FileCode;

            return (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* Section Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          {section.title}
                        </h2>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {section.items.length} items
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const allSyntax = section.items
                        .map((it) => `// ${it.name}\n${it.syntax}\n${it.description}`)
                        .join('\n\n');
                      copyToClipboard(allSyntax, `section-copy-${section.id}`);
                    }}
                    className="self-start sm:self-center flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Copy section reference to clipboard"
                  >
                    {copiedKey === `section-copy-${section.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied Section!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Section</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Card View Mode */}
                {viewMode === 'cards' && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {section.items.map((item) => {
                      const isExpanded = expandedItemIds.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all overflow-hidden"
                        >
                          {/* Item Card Header */}
                          <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{item.name}</span>
                                {item.isWebFirst && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                    Web-First (Auto-Retry)
                                  </span>
                                )}
                                {item.isAsync && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200">
                                    async
                                  </span>
                                )}
                                {item.subcategory && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200/70 text-slate-700">
                                    {item.subcategory}
                                  </span>
                                )}
                              </div>

                              {/* Syntax Strip */}
                              <div className="flex items-center gap-2">
                                <div className="font-mono text-xs font-medium text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded border border-emerald-200/70 overflow-x-auto select-all max-w-full">
                                  <code>{item.syntax}</code>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed pr-2">
                                {item.description}
                              </p>
                            </div>

                            {/* Actions Right */}
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                              <button
                                onClick={() => copyToClipboard(item.syntax, `item-${item.id}`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                                title="Copy syntax"
                              >
                                {copiedKey === `item-${item.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              {item.exampleCode && (
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                  title="Toggle example code"
                                >
                                  <Code className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{isExpanded ? 'Hide Code' : 'Example'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expandable Example Code & Pro-Tip */}
                          {item.exampleCode && isExpanded && (
                            <div className="border-t border-slate-200 bg-slate-900 text-slate-100 p-4 space-y-3">
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="font-semibold text-slate-300">Runnable TypeScript Example:</span>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(item.exampleCode!, `code-${item.id}`)}
                                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                                >
                                  {copiedKey === `code-${item.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  <span>Copy Snippet</span>
                                </button>
                              </div>

                              <pre className="font-mono text-xs overflow-x-auto p-3 rounded-lg bg-slate-950/70 text-emerald-300 border border-slate-800 leading-relaxed">
                                <code>{item.exampleCode}</code>
                              </pre>

                              {item.proTip && (
                                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2 text-xs text-emerald-200">
                                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-emerald-300">Pro-Tip: </strong>
                                    <span>{item.proTip}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tag footer */}
                          <div className="px-3.5 sm:px-4 py-2 bg-slate-100/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.tags.map((t) => (
                                <span
                                  key={t}
                                  onClick={() => setSelectedTag(t)}
                                  className="cursor-pointer hover:text-slate-800 hover:bg-slate-200 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 transition-colors"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                            {item.returns && (
                              <span className="font-mono text-slate-600">
                                returns: <code className="text-slate-800 font-semibold">{item.returns}</code>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Compact Table View Mode */}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 w-1/4">Method / Command</th>
                          <th className="py-3 px-4 w-1/3">Syntax Example</th>
                          <th className="py-3 px-4">Behavior & Actionability</th>
                          <th className="py-3 px-4 w-20 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {section.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              <div className="flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {item.isWebFirst && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Web-First assertion" />
                                )}
                              </div>
                              {item.subcategory && (
                                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                                  {item.subcategory}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-emerald-800 bg-slate-50/40">
                              <div className="max-w-md truncate" title={item.syntax}>
                                {item.syntax}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {item.description}
                              {item.proTip && (
                                <div className="text-[11px] text-emerald-700 mt-0.5">
                                  Tip: {item.proTip}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => copyToClipboard(item.syntax, `table-${item.id}`)}
                                className="p-1.5 text-slate-400 hover:text-slate-900 rounded bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                                title="Copy syntax"
                              >
                                {copiedKey === `table-${item.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Quick Links */}
      <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Playwright features automatic waiting before interacting with elements and web-first assertions that eliminate arbitrary sleeps.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://playwright.dev/docs/intro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
          >
            Official Docs &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};
