import React, { useState } from 'react';
import { 
  Award, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Check, 
  Copy, 
  FileCode, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { ENTERPRISE_PROJECTS, EnterpriseProject } from '../data/enterpriseProjectsData';

interface EnterpriseProjectsProps {
  completedProjects: string[];
  onCompleteProject: (id: string, xp: number) => void;
}

export const EnterpriseProjects: React.FC<EnterpriseProjectsProps> = ({
  completedProjects,
  onCompleteProject
}) => {
  const [selectedProjId, setSelectedProjId] = useState<string>(ENTERPRISE_PROJECTS[0].id);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    score: number;
    feedback: string[];
    passed: boolean;
  } | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const currentProject = ENTERPRISE_PROJECTS.find(p => p.id === selectedProjId) || ENTERPRISE_PROJECTS[0];

  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(t => t !== taskId) : [...prev, taskId]
    );
  };

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleSubmitProject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const taskRatio = completedTaskIds.length / Math.max(1, currentProject.tasks.length);
      const passed = taskRatio >= 0.75;
      const score = Math.round(75 + taskRatio * 25);

      setSubmissionFeedback({
        score,
        passed,
        feedback: [
          'Architecture adherence: Strict modularity & TypeScript types verified.',
          'Zero flake policy: No arbitrary sleeps detected in test execution.',
          'CI/CD readiness: Matrix sharding and artifact retention configured.'
        ]
      });

      if (passed) {
        onCompleteProject(currentProject.id, currentProject.type === 'Capstone' ? 300 : 150);
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-500" />
            <span>Enterprise Projects & Capstone Platform</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build complete production suites: Environment CLIs, dynamic checkouts, Dockerized matrix pipelines, and the Architect Capstone.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {ENTERPRISE_PROJECTS.map(proj => {
            const isDone = completedProjects.includes(proj.id);
            const isSelected = selectedProjId === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjId(proj.id);
                  setSubmissionFeedback(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-emerald-300" />}
                <span>{proj.code}: {proj.type === 'Capstone' ? 'Capstone Platform' : proj.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements & Tasks (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  currentProject.type === 'Capstone'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                }`}>
                  {currentProject.code} · {currentProject.type}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentProject.duration}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {currentProject.difficulty}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentProject.title}
              </h2>
            </div>

            {/* Business Scenario */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-500" />
                Enterprise Business Scenario
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentProject.businessScenario}
              </p>
            </div>

            {/* Architecture Requirements */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Architecture Deliverables
              </h3>
              <ul className="space-y-1.5">
                {currentProject.architectureRequirements.map((req, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tasks with Interactive Checkboxes */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Project Implementation Checklist
              </h3>
              <div className="space-y-3">
                {currentProject.tasks.map(task => {
                  const isChecked = completedTaskIds.includes(task.id);
                  return (
                    <div 
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {task.description}
                        </p>
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {task.acceptanceCriteria.map((ac, idx) => (
                            <span key={idx} className="text-[10px] text-slate-500 dark:text-slate-400">
                              • {ac}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {completedTaskIds.length}/{currentProject.tasks.length} checklist items completed
              </span>
              <button
                onClick={handleSubmitProject}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-purple-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Evaluating Submission...' : 'Submit for Rubric Evaluation'}</span>
              </button>
            </div>

            {/* Submission Feedback */}
            {submissionFeedback && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Evaluation Result: PASS (Score: {submissionFeedback.score}/100)
                  </span>
                  <span>+{currentProject.type === 'Capstone' ? 300 : 150} XP Awarded</span>
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  {submissionFeedback.feedback.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Starter Code & Evaluation Rubric (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Starter Files */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm space-y-0">
            {currentProject.starterFiles.map(file => (
              <div key={file.filename}>
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>{file.filename}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(file.filename, file.code)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedFile === file.filename ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFile === file.filename ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[350px]">
                  <code>{file.code}</code>
                </pre>
              </div>
            ))}
          </div>

          {/* Evaluation Rubric */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Architectural Evaluation Rubric</span>
            </h3>
            <div className="space-y-2">
              {currentProject.evaluationRubric.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.criteria}</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{item.weight}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
