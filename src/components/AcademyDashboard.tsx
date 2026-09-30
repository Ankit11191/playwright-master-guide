import React from 'react';
import { 
  Award, 
  Flame, 
  BookOpen, 
  Code2, 
  Bug, 
  Bot, 
  Boxes, 
  Briefcase, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Globe,
  Settings,
  Star
} from 'lucide-react';
import { ACADEMY_MODULES } from '../data/academyModules';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/languages';

interface AcademyDashboardProps {
  progress: {
    completedLessons: string[];
    completedExercises: string[];
    completedDebugChallenges: string[];
    completedProjects: string[];
    quizScores: Record<string, number>;
    xp: number;
    streakDays: number;
  };
  selectedLanguage: SupportedLanguage;
  onOpenLanguageModal: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenCertificate: () => void;
}

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
  progress,
  selectedLanguage,
  onOpenLanguageModal,
  onNavigateTab,
  onOpenCertificate
}) => {
  const currentLang = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES.java;
  // Calculate total items
  const totalLessons = ACADEMY_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalExercises = 6;
  const totalDebug = 4;
  const totalProjects = 4;

  const completedLessonsCount = progress.completedLessons.length;
  const completedExercisesCount = progress.completedExercises.length;
  const completedDebugCount = progress.completedDebugChallenges.length;
  const completedProjectsCount = progress.completedProjects.length;

  const totalPossible = totalLessons + totalExercises + totalDebug + totalProjects;
  const totalCompleted = completedLessonsCount + completedExercisesCount + completedDebugCount + completedProjectsCount;
  const overallPercentage = Math.min(100, Math.round((totalCompleted / Math.max(1, totalPossible)) * 100));

  // Determine learner level based on XP
  const getLevelInfo = (xp: number) => {
    if (xp >= 1500) return { title: 'Automation Architect', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/50', border: 'border-purple-300 dark:border-purple-800', nextTier: 'Mastery Achieved', progressInTier: 100 };
    if (xp >= 1000) return { title: 'Senior SDET', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/50', border: 'border-blue-300 dark:border-blue-800', nextTier: '1,500 XP for Architect', progressInTier: Math.round(((xp - 1000) / 500) * 100) };
    if (xp >= 500) return { title: 'Advanced Automation Engineer', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/50', border: 'border-emerald-300 dark:border-emerald-800', nextTier: '1,000 XP for Senior SDET', progressInTier: Math.round(((xp - 500) / 500) * 100) };
    if (xp >= 200) return { title: 'Automation Engineer', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-950/50', border: 'border-cyan-300 dark:border-cyan-800', nextTier: '500 XP for Advanced SDET', progressInTier: Math.round(((xp - 200) / 300) * 100) };
    return { title: 'Foundation Learner', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/50', border: 'border-amber-300 dark:border-amber-800', nextTier: '200 XP for Automation Engineer', progressInTier: Math.round((xp / 200) * 100) };
  };

  const level = getLevelInfo(progress.xp);

  // Skill matrix tracking
  const languageSkillName = selectedLanguage === 'java' 
    ? 'Java & OOP Models' 
    : selectedLanguage === 'python' 
    ? 'Python & Pytest' 
    : selectedLanguage === 'javascript' 
    ? 'JavaScript & Node' 
    : 'TypeScript & Types';

  const skills = [
    { name: 'Playwright Core', level: Math.min(100, 30 + completedLessonsCount * 12), category: 'Framework' },
    { name: languageSkillName, level: Math.min(100, 40 + completedExercisesCount * 15), category: 'Language' },
    { name: 'Web-First Locators', level: Math.min(100, 50 + completedDebugCount * 18), category: 'Automation' },
    { name: 'Custom Fixtures & DI', level: Math.min(100, 25 + (progress.completedProjects.includes('proj-01') ? 35 : 10)), category: 'Architecture' },
    { name: 'API Hybrid Testing', level: Math.min(100, 20 + (progress.completedExercises.includes('ex-05') ? 40 : 15)), category: 'Integration' },
    { name: 'AI & MCP Self-Healing', level: Math.min(100, 15 + (progress.completedExercises.includes('ex-06') ? 45 : 10)), category: 'AI Testing' },
    { name: 'CI/CD & Docker', level: Math.min(100, 20 + (progress.completedProjects.includes('proj-03') ? 40 : 10)), category: 'DevOps' },
    { name: 'Flake Debugging', level: Math.min(100, 35 + completedDebugCount * 20), category: 'Diagnostics' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome & Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice-First Enterprise Curriculum</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Playwright AI Testing Academy
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Transform from basic test automation into an enterprise-ready Playwright, TypeScript, 
              CI/CD, API testing, AI testing, and automation architecture professional.
            </p>
            
            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs md:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{progress.streakDays} Day Streak</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{progress.xp} XP Earned</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{level.title}</span>
              </div>
            </div>
          </div>

          {/* Continue Learning CTA Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('modules')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('code-practice')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Launch Code Practice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Language Track Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/20 dark:border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl shadow-sm shrink-0">
            {currentLang.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Active Learning Track
              </span>
              {selectedLanguage === 'java' && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Default Course Preference
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <span>Playwright with {currentLang.name}</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({currentLang.frameworkRunner})
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {currentLang.description} Build Tool: <strong>{currentLang.buildTool}</strong> · Assertions: <code className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{currentLang.assertionLib}</code>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLanguageModal}
          className="self-start md:self-center px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:border-indigo-400 shrink-0"
        >
          <Settings className="w-3.5 h-3.5 text-indigo-500" />
          <span>Switch Language Track</span>
        </button>
      </div>

      {/* Progress & Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Progress */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Progress</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{overallPercentage}%</span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(5, overallPercentage)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {completedLessonsCount} of {totalLessons} core lessons mastered
          </p>
        </div>

        {/* Interactive Labs Status */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Hands-on Labs</span>
            <Code2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{completedExercisesCount}</span>
            <span className="text-xs text-slate-500">/ {totalExercises} exercises</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(5, (completedExercisesCount / totalExercises) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            TypeScript & Playwright sandboxed exercises
          </p>
        </div>

        {/* Debugging Challenges */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Diagnostics & Bugs</span>
            <Bug className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{completedDebugCount}</span>
            <span className="text-xs text-slate-500">/ {totalDebug} repaired</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(5, (completedDebugCount / totalDebug) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Flaky locators, race conditions & iframe fixes
          </p>
        </div>

        {/* Enterprise Projects & Certificate */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Enterprise Projects</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{completedProjectsCount}</span>
            <span className="text-xs text-slate-500">/ {totalProjects} completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(5, (completedProjectsCount / totalProjects) * 100)}%` }}
            ></div>
          </div>
          <button
            onClick={onOpenCertificate}
            className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Certificate Status</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Hub: Learning Path Modules + Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 7 Modules Roadmap Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Curriculum Roadmap (M01 – M07)</span>
            </h2>
            <button
              onClick={() => onNavigateTab('modules')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Lessons</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {ACADEMY_MODULES.map((module, idx) => {
              const moduleLessons = module.lessons.map(l => l.id);
              const doneCount = moduleLessons.filter(id => progress.completedLessons.includes(id)).length;
              const isComplete = doneCount === moduleLessons.length && moduleLessons.length > 0;

              return (
                <div
                  key={module.id}
                  onClick={() => onNavigateTab('modules')}
                  className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {module.code}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{module.duration}</span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-slate-500 dark:text-slate-400">{module.level}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {module.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {doneCount}/{module.lessons.length}
                      </span>
                      <span className="block text-[10px] text-slate-400">lessons</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isComplete 
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' 
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950 dark:group-hover:text-indigo-400'
                    }`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Skill Matrix & Quick Practice Hubs */}
        <div className="space-y-6">
          {/* Skill Proficiency Matrix */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Skill Mastery Index</span>
              </h2>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">16 Competencies</span>
            </div>

            <div className="space-y-3">
              {skills.map(skill => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hub Launchers */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Practice Hubs</h2>

            <button
              onClick={() => onNavigateTab('ai-lab')}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-purple-900/10 to-indigo-900/10 border border-purple-200 dark:border-purple-900/50 hover:border-purple-400 text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Testing & MCP Lab</h4>
                  <p className="text-[11px] text-slate-500">Self-healing locators & prompt playbook</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-500" />
            </button>

            <button
              onClick={() => onNavigateTab('architecture-lab')}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border border-cyan-200 dark:border-cyan-900/50 hover:border-cyan-400 text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Architecture Visualizer</h4>
                  <p className="text-[11px] text-slate-500">CDP vs WebDriver & Fixture DAGs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-500" />
            </button>

            <button
              onClick={() => onNavigateTab('interview-engine')}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-emerald-900/10 to-teal-900/10 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Interview Simulator</h4>
                  <p className="text-[11px] text-slate-500">SDET tracks + 160 Curated Q&As</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
