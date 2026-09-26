import React, { useState } from 'react';
import { PLAYWRIGHT_QUESTIONS } from '../data/playwrightQuestions';
import { PLAYWRIGHT_CHEAT_SHEET_SECTIONS } from '../data/playwrightCheatSheet';
import { X, Copy, Check, Download, Printer, FileText, Zap } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [activeExportTab, setActiveExportTab] = useState<'qa' | 'cheatsheet'>('qa');
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const generateQAMarkdown = () => {
    let md = `# Top ${PLAYWRIGHT_QUESTIONS.length} Playwright Interview Questions & Comprehensive Guide\n\n`;
    md += `*Generated from Playwright Master Guide (160 Q&A)*\n\n---\n\n`;

    PLAYWRIGHT_QUESTIONS.forEach((q) => {
      md += `### ${q.id}. ${q.question}\n`;
      md += `**Category:** ${q.category} | **Difficulty:** ${q.difficulty}\n\n`;
      md += `**Quick Answer:**\n${q.shortAnswer}\n\n`;
      md += `**Detailed Explanation:**\n${q.detailedExplanation.join('\n\n')}\n\n`;
      if (q.codeSnippet) {
        md += `\`\`\`${q.codeSnippet.language}\n${q.codeSnippet.code}\n\`\`\`\n\n`;
      }
      md += `**Interview Pro Tip:** ${q.proTip}\n\n`;
      md += `**Follow-Up Question:** ${q.commonFollowUp}\n\n---\n\n`;
    });

    return md;
  };

  const generateCheatSheetMarkdown = () => {
    let md = `# Playwright Complete API Reference & Cheat Sheet\n\n`;
    md += `*Comprehensive Syntax Guide with Locators, Actions, Assertions, Network Mocking & CLI*\n\n---\n\n`;

    PLAYWRIGHT_CHEAT_SHEET_SECTIONS.forEach((section) => {
      md += `## ${section.title}\n`;
      md += `*${section.description}*\n\n`;

      section.items.forEach((item) => {
        md += `### ${item.name}\n`;
        md += `\`${item.syntax}\`\n\n`;
        md += `${item.description}\n\n`;
        if (item.tags.length > 0) {
          md += `**Tags:** ${item.tags.map((t) => `\`#${t}\``).join(' ')}\n\n`;
        }
        if (item.exampleCode) {
          md += `\`\`\`typescript\n${item.exampleCode}\n\`\`\`\n\n`;
        }
        if (item.proTip) {
          md += `> **Pro-Tip:** ${item.proTip}\n\n`;
        }
      });
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    const content = activeExportTab === 'qa' ? generateQAMarkdown() : generateCheatSheetMarkdown();
    navigator.clipboard.writeText(content);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const isQA = activeExportTab === 'qa';
    const content = isQA ? generateQAMarkdown() : generateCheatSheetMarkdown();
    const filename = isQA ? `playwright-${PLAYWRIGHT_QUESTIONS.length}-questions-guide.md` : 'playwright-cheat-sheet-reference.md';

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJSON = () => {
    const isQA = activeExportTab === 'qa';
    const data = isQA ? PLAYWRIGHT_QUESTIONS : PLAYWRIGHT_CHEAT_SHEET_SECTIONS;
    const filename = isQA ? `playwright-${PLAYWRIGHT_QUESTIONS.length}-questions.json` : 'playwright-cheat-sheet.json';

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Export Playwright Guides
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch between Q&A and Cheat Sheet */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveExportTab('qa')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              activeExportTab === 'qa'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {PLAYWRIGHT_QUESTIONS.length} Interview Q&A
          </button>
          <button
            onClick={() => setActiveExportTab('cheatsheet')}
            className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeExportTab === 'cheatsheet'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complete Cheat Sheet</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {activeExportTab === 'qa'
            ? `Export the complete reference handbook containing all ${PLAYWRIGHT_QUESTIONS.length} questions, detailed technical answers, code snippets, and interview pro tips.`
            : 'Export the complete 10-category Playwright Cheat Sheet covering 90+ API methods, CLI commands, locators, actions, and network mocking snippets.'}
        </p>

        <div className="space-y-2.5">
          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                {copiedMd ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  {copiedMd ? 'Copied to Clipboard!' : `Copy All ${activeExportTab === 'qa' ? `${PLAYWRIGHT_QUESTIONS.length} Q&A` : 'Cheat Sheet'} as Markdown`}
                </div>
                <div className="text-[11px] text-slate-500">
                  Paste directly into Notion, Obsidian, GitHub or Slack
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Download Markdown Document (.md)
                </div>
                <div className="text-[11px] text-slate-500">
                  Full standalone guide formatted in clean Markdown
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Download Structured JSON Data (.json)
                </div>
                <div className="text-[11px] text-slate-500">
                  Raw data schema with syntax, code snippets, and tags
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Print or Save as PDF
                </div>
                <div className="text-[11px] text-slate-500">
                  Printer-friendly layout for desktop or physical study
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
