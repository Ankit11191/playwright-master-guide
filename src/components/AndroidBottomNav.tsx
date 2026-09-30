import React from 'react';
import { Sparkles, BookOpen, Code2, Bug, Briefcase, Menu } from 'lucide-react';
import { AcademyTab } from './Header';

interface AndroidBottomNavProps {
  activeTab: AcademyTab;
  setActiveTab: (tab: AcademyTab) => void;
  onOpenMobileMenu: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe">
      <div className="flex items-center justify-around h-14 px-1">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Modules */}
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            activeTab === 'modules'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Modules</span>
        </button>

        {/* Tab 3: Code Lab */}
        <button
          onClick={() => setActiveTab('code-practice')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            activeTab === 'code-practice'
              ? 'text-cyan-600 dark:text-cyan-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Code Lab</span>
        </button>

        {/* Tab 4: Debugging */}
        <button
          onClick={() => setActiveTab('debugging-lab')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            activeTab === 'debugging-lab'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Bug className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Debug</span>
        </button>

        {/* Tab 5: Interview */}
        <button
          onClick={() => setActiveTab('interview-engine')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            activeTab === 'interview-engine'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Interview</span>
        </button>

        {/* Tab 6: More Menu */}
        <button
          onClick={onOpenMobileMenu}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors min-h-[44px] cursor-pointer"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
