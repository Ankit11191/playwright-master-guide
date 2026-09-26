import React, { useState } from 'react';
import { PlaywrightQuestion } from '../data/playwrightQuestions';
import { 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  CheckCircle, 
  Copy, 
  Check, 
  Code2, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface QuestionCardProps {
  question: PlaywrightQuestion;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMastered: boolean;
  onToggleMastered: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectDifficulty?: (difficulty: string) => void;
  onSelectTag?: (tag: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isExpanded,
  onToggleExpand,
  isMastered,
  onToggleMastered,
  isBookmarked,
  onToggleBookmark,
  onSelectCategory,
  onSelectDifficulty,
  onSelectTag,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (question.codeSnippet) {
      navigator.clipboard.writeText(question.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    const markdown = `### Question ${question.id}: ${question.question}
**Category**: ${question.category} | **Level**: ${question.difficulty}

**Short Answer**:
${question.shortAnswer}

**Detailed Answer**:
${question.detailedExplanation.join('\n\n')}

${question.codeSnippet ? `\`\`\`${question.codeSnippet.language}
${question.codeSnippet.code}
\`\`\`` : ''}

**Interview Pro Tip**:
${question.proTip}
`;
    navigator.clipboard.writeText(markdown);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-800 border-blue-200/80 hover:bg-blue-100';
      case 'Advanced':
        return 'bg-purple-50 text-purple-800 border-purple-200/80 hover:bg-purple-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  };

  return (
    <article 
      className={`border rounded-xl transition-all duration-200 overflow-hidden ${
        isMastered 
          ? 'bg-emerald-50/20 border-emerald-200' 
          : 'bg-white border-slate-200 hover:border-slate-300'
      } shadow-xs`}
    >
      {/* Card Header clickable to expand */}
      <div
        onClick={onToggleExpand}
        className="p-4 sm:p-5 cursor-pointer select-none"
      >
        {/* Metadata Row with clickable category & difficulty tags */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold tabular-nums text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
              Q{question.id.toString().padStart(2, '0')}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory?.(question.category);
              }}
              title={`Filter by category: ${question.category}`}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer text-left"
            >
              {question.category}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectDifficulty?.(question.difficulty);
              }}
              title={`Filter by level: ${question.difficulty}`}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${getDifficultyBadge(question.difficulty)}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                question.difficulty === 'Beginner' ? 'bg-emerald-500' :
                question.difficulty === 'Intermediate' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />
              <span>{question.difficulty}</span>
            </button>
          </div>

          {/* Action buttons (Bookmark, Mark as Mastered, Copy) */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onToggleMastered}
              title={isMastered ? "Mark as needing review" : "Mark as Mastered"}
              className={`p-1.5 rounded-md transition-colors ${
                isMastered 
                  ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleBookmark}
              title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
              className={`p-1.5 rounded-md transition-colors ${
                isBookmarked 
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleCopyFull}
              title="Copy Question & Full Answer"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              {copiedFull ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Primary Question Headline */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-snug">
            {question.question}
          </h2>

          <div className="text-slate-400 shrink-0 pt-0.5">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Short Answer Callout */}
        <div className="mt-3 bg-slate-50 border-l-2 border-emerald-500 px-3.5 py-2.5 rounded-r-lg text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900 mr-1.5">Quick Answer:</span>
          {question.shortAnswer}
        </div>
      </div>

      {/* Expanded Detailed Section */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
          {/* Detailed Explanation */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2.5">
              Comprehensive Technical Explanation
            </h3>
            <div className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
              {question.detailedExplanation.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Code Snippet Box */}
          {question.codeSnippet && (
            <div className="rounded-lg bg-slate-900 text-slate-100 overflow-hidden shadow-xs border border-slate-800">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  {question.codeSnippet.language}
                </span>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed">
                  <code>{question.codeSnippet.code}</code>
                </pre>
              </div>

              {question.codeSnippet.explanation && (
                <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 text-xs text-slate-400">
                  {question.codeSnippet.explanation}
                </div>
              )}
            </div>
          )}

          {/* Pro Tip & Follow-up Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Pro Tip */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Interview Pro Tip</span>
              </div>
              <p className="leading-relaxed text-amber-950">{question.proTip}</p>
            </div>

            {/* Common Follow-up */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-3 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-semibold text-blue-800 mb-1">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Common Interview Follow-Up</span>
              </div>
              <p className="leading-relaxed text-blue-950 font-medium italic">"{question.commonFollowUp}"</p>
            </div>
          </div>

          {/* Footer tags unboxed */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100 flex-wrap">
            <span className="font-medium text-slate-500">Related topics:</span>
            {question.tags.map((tag, i) => (
              <React.Fragment key={tag}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag?.(tag);
                  }}
                  title={`Filter by tag: ${tag}`}
                  className="text-slate-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {tag}
                </button>
                {i < question.tags.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
