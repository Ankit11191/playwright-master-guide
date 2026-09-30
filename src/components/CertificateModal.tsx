import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  onUpdateLearnerName: (name: string) => void;
  completionDate: string;
  credentialId: string;
  progressPercentage: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  learnerName,
  onUpdateLearnerName,
  completionDate,
  credentialId,
  progressPercentage
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(learnerName);

  if (!isOpen) return null;

  const handleSaveName = () => {
    onUpdateLearnerName(tempName);
    setIsEditingName(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Official Credential Verification</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Scrollable Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Certificate Frame */}
          <div className="relative p-8 md:p-12 rounded-2xl border-4 border-double border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/10 dark:to-slate-950 shadow-inner text-center space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Professional Institute of Quality Engineering</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                Certificate of Master Achievement
              </h2>
              <p className="text-xs text-slate-500 italic">This is proudly awarded to</p>
            </div>

            {/* Learner Name Field */}
            <div className="py-2">
              {isEditingName ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="p-2 text-center text-lg font-bold border-b-2 border-indigo-600 bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="cursor-pointer group inline-block"
                  title="Click to edit name"
                >
                  <span className="text-2xl md:text-3xl font-black text-indigo-700 dark:text-indigo-400 border-b-2 border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 pb-1 px-4">
                    {learnerName}
                  </span>
                  <span className="block text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                    (Click to customize your certificate name)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              for successfully mastering and demonstrating verified competence in the enterprise curriculum:
              <br />
              <strong className="text-slate-900 dark:text-white font-bold">
                Playwright with AI Testing & Next-Gen Automation
              </strong>
            </p>

            {/* Competency Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Web-First Locators</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Custom Fixtures & DI</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Hybrid API Testing</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>MCP & Self-Healing AI</span>
              </div>
            </div>

            {/* Credential Meta */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
              <div>
                <span>Issue Date: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{completionDate}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Credential ID: {credentialId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <span className="text-xs text-slate-500">
            Completion Status: <strong>{progressPercentage}% Verified</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
