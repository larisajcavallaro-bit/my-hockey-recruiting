export type SearchParams = Promise<{ tab?: string }>; // for app router async params


// Choice interface representing an answer choice for a question


export interface Choice {
    id: string;
    text: string;
}

export interface Question {
    id: number;
    type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer';
    question: string;
    choices?: Choice[];
    correctAnswer?: string | boolean;
    explanation?: string;
    userAnswer?: string | boolean | null;
    isCorrect?: boolean;
}


// Exercise interface representing a quiz or practice exercise


export interface Exercise {
    id: number;
    title: string;
    subtitle: string;
    totalQuestions: number;
    type: string;
    progress: number;
    status: string;
    icon: string;
    timeLimit?: number;
    passingScore?: number;
    score?: number;
    completedAt?: string;
    questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  items: string[];
}

// GrammarSection interface representing a section of grammar notes

export interface GrammarSection {
  id: string;
  title: string;
  description: string;
  content: {
    title: string;
    description: string;
    exercises: {
      title: string;
      instructions: string;
      items: string[];
    };
  };
}

export interface NotesData {
  title: string;
  subtitle: string;
  topics: Topic[];
  grammarSection: GrammarSection;
}

// GrammarNotes interface representing the overall grammar notes structure
export interface Grammar {
    id: number;
    title: string;
    subtitle: string;
    totalQuestions: number;
    type: string;
    progress: number;
    status: string;
    icon: string;
    timeLimit?: number;
    passingScore?: number;
    score?: number;
    completedAt?: string;
    questions: Question[];
}