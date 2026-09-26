import React, { useState } from 'react';
import { PLAYWRIGHT_QUESTIONS } from '../data/playwrightQuestions';
import { X, Copy, Check, Download, Printer, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# Top 50 Playwright Interview Questions & Comprehensive Guide\n\n`;
    md += `*Generated from Playwright 50 Master Guide*\n\n---\n\n`;

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

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([generateMarkdown()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'playwright-50-questions-guide.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJSON = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(PLAYWRIGHT_QUESTIONS, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'playwright-50-questions.json';
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
              Export 50 Playwright Questions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Export the complete reference handbook containing all 50 questions, detailed technical answers, code snippets, and interview pro tips for offline reading or company study guides.
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
                  {copiedMd ? 'Copied to Clipboard!' : 'Copy All 50 Q&A as Markdown'}
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
                  Full standalone guide formatted in Markdown
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
                  Raw data schema with tags, code snippets, and levels
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
