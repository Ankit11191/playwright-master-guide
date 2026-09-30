import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  Linkedin, 
  Github, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { Header, AcademyTab } from './components/Header';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AcademyDashboard } from './components/AcademyDashboard';
import { ModulesView } from './components/ModulesView';
import { CodePracticeLab } from './components/CodePracticeLab';
import { DebuggingLab } from './components/DebuggingLab';
import { AITestingLab } from './components/AITestingLab';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { EnterpriseProjects } from './components/EnterpriseProjects';
import { InterviewEngine } from './components/InterviewEngine';
import { StudyResourcesView } from './components/StudyResourcesView';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { JavaCompilerConsole } from './components/JavaCompilerConsole';
import { CertificateModal } from './components/CertificateModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AcademyTab>('dashboard');

  // Learner Progress State with LocalStorage
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pw_academy_lessons');
      return saved ? JSON.parse(saved) : ['m01-l01', 'm02-l01'];
    } catch {
      return ['m01-l01', 'm02-l01'];
    }
  });

  const [completedExercises, setCompletedExercises] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pw_academy_exercises');
      return saved ? JSON.parse(saved) : ['ex-01'];
    } catch {
      return ['ex-01'];
    }
  });

  const [completedDebugChallenges, setCompletedDebugChallenges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pw_academy_debug');
      return saved ? JSON.parse(saved) : ['dbg-01'];
    } catch {
      return ['dbg-01'];
    }
  });

  const [completedProjects, setCompletedProjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pw_academy_projects');
      return saved ? JSON.parse(saved) : ['proj-01'];
    } catch {
      return ['proj-01'];
    }
  });

  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pw_academy_xp');
      return saved ? JSON.parse(saved) : 475;
    } catch {
      return 475;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pw_academy_streak');
      return saved ? JSON.parse(saved) : 5;
    } catch {
      return 5;
    }
  });

  const [learnerName, setLearnerName] = useState<string>(() => {
    try {
      return localStorage.getItem('pw_academy_user_name') || 'Ankit Mittal';
    } catch {
      return 'Ankit Mittal';
    }
  });

  // Question bank bookmarks and mastered
  const [masteredIds, setMasteredIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('pw_mastered_ids');
      return saved ? JSON.parse(saved) : [1, 2, 8];
    } catch {
      return [1, 2, 8];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('pw_bookmarked_ids');
      return saved ? JSON.parse(saved) : [6, 8, 22];
    } catch {
      return [6, 8, 22];
    }
  });

  // Modals
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('pw_academy_lessons', JSON.stringify(completedLessons));
    } catch (e) { console.error(e); }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_academy_exercises', JSON.stringify(completedExercises));
    } catch (e) { console.error(e); }
  }, [completedExercises]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_academy_debug', JSON.stringify(completedDebugChallenges));
    } catch (e) { console.error(e); }
  }, [completedDebugChallenges]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_academy_projects', JSON.stringify(completedProjects));
    } catch (e) { console.error(e); }
  }, [completedProjects]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_academy_xp', JSON.stringify(xp));
    } catch (e) { console.error(e); }
  }, [xp]);

  useEffect(() => {
    try {
      localStorage.setItem('pw_academy_user_name', learnerName);
    } catch (e) { console.error(e); }
  }, [learnerName]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Completion Handlers
  const handleToggleLesson = (lessonId: string) => {
    setCompletedLessons(prev => {
      const exists = prev.includes(lessonId);
      if (exists) {
        return prev.filter(id => id !== lessonId);
      } else {
        setXp(current => current + 50);
        return [...prev, lessonId];
      }
    });
  };

  const handleCompleteExercise = (exId: string, xpEarned: number) => {
    if (!completedExercises.includes(exId)) {
      setCompletedExercises(prev => [...prev, exId]);
      setXp(current => current + xpEarned);
    }
  };

  const handleCompleteDebugChallenge = (dbgId: string, xpEarned: number) => {
    if (!completedDebugChallenges.includes(dbgId)) {
      setCompletedDebugChallenges(prev => [...prev, dbgId]);
      setXp(current => current + xpEarned);
    }
  };

  const handleCompleteProject = (projId: string, xpEarned: number) => {
    if (!completedProjects.includes(projId)) {
      setCompletedProjects(prev => [...prev, projId]);
      setXp(current => current + xpEarned);
    }
  };

  const handleToggleMastered = (id: number) => {
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculate progress percentage for certificate
  const totalTasks = 8 + 6 + 4 + 4;
  const doneTasks = completedLessons.length + completedExercises.length + completedDebugChallenges.length + completedProjects.length;
  const progressPercent = Math.min(100, Math.round((doneTasks / totalTasks) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors">
      {/* Academy Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakDays={streakDays}
        xp={xp}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'dashboard' && (
          <AcademyDashboard
            progress={{
              completedLessons,
              completedExercises,
              completedDebugChallenges,
              completedProjects,
              quizScores: {},
              xp,
              streakDays
            }}
            onNavigateTab={(tab) => setActiveTab(tab as AcademyTab)}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {activeTab === 'modules' && (
          <ModulesView
            completedLessons={completedLessons}
            onToggleLesson={handleToggleLesson}
            onNavigateTab={(tab) => setActiveTab(tab as AcademyTab)}
          />
        )}

        {activeTab === 'code-practice' && (
          <CodePracticeLab
            completedExercises={completedExercises}
            onCompleteExercise={handleCompleteExercise}
          />
        )}

        {activeTab === 'debugging-lab' && (
          <DebuggingLab
            completedDebugChallenges={completedDebugChallenges}
            onCompleteChallenge={handleCompleteDebugChallenge}
          />
        )}

        {activeTab === 'ai-lab' && (
          <AITestingLab />
        )}

        {activeTab === 'architecture-lab' && (
          <div className="space-y-6">
            <ArchitectureVisualizer />
          </div>
        )}

        {activeTab === 'projects' && (
          <EnterpriseProjects
            completedProjects={completedProjects}
            onCompleteProject={handleCompleteProject}
          />
        )}

        {activeTab === 'interview-engine' && (
          <InterviewEngine
            bookmarks={bookmarkedIds}
            completedQuestions={masteredIds}
            onBookmarkToggle={handleToggleBookmark}
            onToggleComplete={handleToggleMastered}
          />
        )}

        {activeTab === 'study-cards' && (
          <StudyResourcesView />
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <InteractiveQuiz />
          </div>
        )}

        {activeTab === 'console' && (
          <div className="space-y-6">
            <JavaCompilerConsole />
          </div>
        )}
      </main>

      {/* Scroll to Top floating action button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-6 p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 z-30 cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Android Bottom Navigation */}
      <AndroidBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobileMenu={() => setActiveTab('dashboard')}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        learnerName={learnerName}
        onUpdateLearnerName={(name) => setLearnerName(name)}
        completionDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        credentialId="PW-AI-2026-8941"
        progressPercentage={progressPercent}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Persistent Footer with LinkedIn and GitHub Links */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500 dark:text-slate-400 pb-20 md:pb-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Playwright AI Testing Academy
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-400">
              Created by <strong className="text-slate-900 dark:text-white font-semibold">Ankit Mittal</strong>
            </span>
          </div>

          {/* Social Profiles & Developer Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/ankitmittal061091/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-[#0A66C2]/10 border border-slate-200 dark:border-slate-700 hover:border-[#0A66C2]/40 text-slate-700 dark:text-slate-300 hover:text-[#0A66C2] font-medium transition-all group shadow-2xs hover:shadow-xs"
              title="Connect with Ankit Mittal on LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/Ankit11191"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-900/10 border border-slate-200 dark:border-slate-700 hover:border-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-all group shadow-2xs hover:shadow-xs"
              title="View Ankit Mittal on GitHub"
            >
              <Github className="w-4 h-4 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" aria-hidden="true" />

            <div className="flex items-center gap-3">
              <a
                href="https://playwright.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>Playwright Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://trace.playwright.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>Trace Viewer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
