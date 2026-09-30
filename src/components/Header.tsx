import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Bug,
  Bot,
  Boxes,
  Briefcase,
  HelpCircle,
  FileText,
  Layers,
  Terminal,
  Award,
  Flame,
  Zap,
  Menu,
  X,
  Sparkles,
  Download
} from 'lucide-react';

export type AcademyTab = 
  | 'dashboard'
  | 'modules'
  | 'code-practice'
  | 'debugging-lab'
  | 'ai-lab'
  | 'architecture-lab'
  | 'projects'
  | 'interview-engine'
  | 'study-cards'
  | 'quiz'
  | 'console';

interface HeaderProps {
  activeTab: AcademyTab;
  setActiveTab: (tab: AcademyTab) => void;
  streakDays: number;
  xp: number;
  onOpenCertificate: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  xp,
  onOpenCertificate,
  onOpenExport
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AcademyTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 'modules', label: 'Modules', icon: <BookOpen className="w-3.5 h-3.5 text-blue-500" /> },
    { id: 'code-practice', label: 'Code Lab', icon: <Code2 className="w-3.5 h-3.5 text-cyan-500" /> },
    { id: 'debugging-lab', label: 'Debugging', icon: <Bug className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'ai-lab', label: 'AI & MCP', icon: <Bot className="w-3.5 h-3.5 text-purple-500" /> },
    { id: 'architecture-lab', label: 'Architecture', icon: <Boxes className="w-3.5 h-3.5 text-cyan-600" /> },
    { id: 'projects', label: 'Projects', icon: <Award className="w-3.5 h-3.5 text-purple-600" /> },
    { id: 'interview-engine', label: 'Interview Prep', icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'study-cards', label: 'Study Cards', icon: <Layers className="w-3.5 h-3.5 text-indigo-600" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> },
    { id: 'console', label: 'Java Console', icon: <Terminal className="w-3.5 h-3.5 text-amber-600" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
                PW
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Playwright AI Academy
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Master Education Platform
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links (Scrollable segmented bar for clean access) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Metrics & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak & XP */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400" title="Streak Days">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{streakDays}d</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400" title="Total XP">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{xp} XP</span>
              </span>
            </div>

            {/* Certificate Button */}
            <button
              onClick={onOpenCertificate}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="View Master Certificate"
            >
              <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Certificate</span>
            </button>

            {/* Export Q&A */}
            <button
              onClick={onOpenExport}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Export questions"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-1.5 animate-fadeIn">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
