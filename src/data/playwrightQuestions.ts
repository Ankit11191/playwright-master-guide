import { QUESTIONS_PART_1 } from './questions/questionsPart1';
import { QUESTIONS_PART_2 } from './questions/questionsPart2';
import { QUESTIONS_PART_3 } from './questions/questionsPart3';

export interface PlaywrightQuestion {
  id: number;
  question: string;
  shortAnswer: string;
  category: 
    | 'Architecture & Core'
    | 'Locators & Interactions'
    | 'Auto-Waiting & Assertions'
    | 'Network & API Mocking'
    | 'Sessions, Auth & Dialogs'
    | 'Test Runner, CI/CD & Config'
    | 'Debugging & Tracing'
    | 'Advanced Testing & Best Practices';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  detailedExplanation: string[];
  codeSnippet?: {
    language: string;
    code: string;
    explanation?: string;
  };
  proTip: string;
  commonFollowUp: string;
}

export const PLAYWRIGHT_QUESTIONS: PlaywrightQuestion[] = [
  ...QUESTIONS_PART_1,
  ...QUESTIONS_PART_2,
  ...QUESTIONS_PART_3,
];
