import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Code2, 
  Terminal, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/languages';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (language: SupportedLanguage) => void;
  isInitialOnboarding?: boolean;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  isInitialOnboarding = false
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLanguage || 'java');
  const [activePreviewTab, setActivePreviewTab] = useState<SupportedLanguage>(currentLanguage || 'java');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectLanguage(selectedLang);
    onClose();
  };

  const languagesList: SupportedLanguage[] = ['java', 'python', 'javascript', 'typescript'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 relative bg-gradient-to-r from-indigo-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {isInitialOnboarding ? 'Step 1 of 1 · Course Entry Criteria' : 'Switch Learning Language'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Java is Default Preference
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose Your Preferred Programming Language
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Select the programming language you want to learn Playwright with. The course roadmap, modules, 
            and architecture remain identical, while all code examples, syntax, test runners, and practice 
            exercises will dynamically adapt to your selected language.
          </p>
        </div>

        {/* Language Grid */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {languagesList.map((langKey) => {
              const lang = SUPPORTED_LANGUAGES[langKey];
              const isSelected = selectedLang === langKey;
              const isDefault = langKey === 'java';

              return (
                <div
                  key={langKey}
                  onClick={() => {
                    setSelectedLang(langKey);
                    setActivePreviewTab(langKey);
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  {isDefault && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Default Preference
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                          {lang.icon}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{lang.name}</span>
                            <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {lang.fileExtension.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {lang.frameworkRunner}
                          </span>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {lang.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Tool: <strong className="text-slate-700 dark:text-slate-300">{lang.buildTool}</strong></span>
                    <span>Assert: <strong className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">{lang.assertionLib.split('.')[0]}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Code Preview Comparison */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-white">Live Code Preview for {SUPPORTED_LANGUAGES[selectedLang].name}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {SUPPORTED_LANGUAGES[selectedLang].frameworkRunner}
              </span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-48">
              <code>{SUPPORTED_LANGUAGES[selectedLang].sampleSnippet}</code>
            </pre>
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Progress Loss Guarantee:</strong> You can switch your preferred language at any time 
              from the header selector. All completed lessons, practice scores, streak days, and XP stay intact.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Current Choice: <strong className="text-slate-900 dark:text-white">{SUPPORTED_LANGUAGES[selectedLang].name}</strong> ({SUPPORTED_LANGUAGES[selectedLang].frameworkRunner})
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isInitialOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isInitialOnboarding ? `Start Course in ${SUPPORTED_LANGUAGES[selectedLang].name}` : `Update to ${SUPPORTED_LANGUAGES[selectedLang].name}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
