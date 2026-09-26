import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizQuestions';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';

export const InteractiveQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({ ...prev, [question.id]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  // Score calculation
  const correctCount = Object.entries(userAnswers).reduce((acc, [qId, ans]) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === Number(qId));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  if (isQuizCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Interview Assessment Completed!
          </h2>
          <p className="text-sm text-slate-600">
            You scored <strong className="font-mono tabular-nums text-slate-900">{correctCount}</strong> out of <span className="font-mono tabular-nums">{QUIZ_QUESTIONS.length}</span> ({scorePercentage}%)
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 text-left max-w-md mx-auto space-y-3">
          <div className="text-xs uppercase font-semibold tracking-wider text-slate-500">
            Interview Readiness Assessment
          </div>
          <p className="text-sm text-slate-700">
            {scorePercentage >= 80 ? (
              <span className="text-emerald-700 font-semibold">
                Outstanding! You have strong mastery of Playwright core architecture, auto-waiting, locators, and best practices.
              </span>
            ) : scorePercentage >= 60 ? (
              <span className="text-amber-700 font-semibold">
                Solid Foundation! Review the questions in Network Interception, storageState, and Actionability checks to reach senior-level confidence.
              </span>
            ) : (
              <span className="text-slate-800">
                Good practice run! Use the All 50 Q&A and Flashcard modes to strengthen your conceptual knowledge before your next technical interview.
              </span>
            )}
          </p>
        </div>

        <button
          onClick={handleRestartQuiz}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-900">
            Playwright Mock Interview Challenge
          </span>
        </div>

        <div className="text-xs text-slate-600">
          Question <span className="font-mono font-bold text-slate-900">{currentIdx + 1}</span> of <span className="font-mono">{QUIZ_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-600 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-2">
          <div className="text-xs text-slate-500 font-medium">
            Category: {question.category} · Question Ref: #{question.questionNumber}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;

            let optionStyle = "border-slate-200 hover:bg-slate-50 text-slate-800";
            if (isAnswerSubmitted) {
              if (isCorrect) {
                optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium";
              } else if (isSelected) {
                optionStyle = "border-red-500 bg-red-50 text-red-950";
              } else {
                optionStyle = "border-slate-200 opacity-60 text-slate-600";
              }
            } else if (isSelected) {
              optionStyle = "border-emerald-600 bg-emerald-50/50 text-emerald-950 font-medium ring-1 ring-emerald-600";
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center shrink-0 font-mono text-xs font-semibold text-slate-600 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card upon submit */}
        {isAnswerSubmitted && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-200">
            <span className="font-bold text-slate-900 block">Explanation:</span>
            <p className="leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {/* Actions Button */}
        <div className="pt-2 flex justify-end">
          {!isAnswerSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-xs"
            >
              <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
