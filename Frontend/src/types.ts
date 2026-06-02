export type Page = 'dashboard' | 'upload' | 'reports' | 'question_bank' | 'settings' | 'support';

export interface AcademicPaper {
  id: string;
  name: string;
  size: string;
  status: 'completed' | 'uploading' | 'waiting' | 'failed';
  progress: number;
  subject: string;
  bloomAnalysis: boolean;
  uploadedAt: string;
}

export interface Question {
  id: string;
  number?: number;
  code?: string; // e.g. "PHYS-204"
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string; // e.g. "Difficulty 8/10"
  taxonomy: 'Apply' | 'Evaluate' | 'Analyze' | 'Understanding' | 'Evaluating' | 'Analyzing' | 'Applying' | string;
  text: string;
  aiInsights: string;
  warning?: string; // e.g. "Ambiguous phrasing"
  paperName?: string;
  date?: string;
  lecturer?: string;
  isStarred?: boolean;
}

export interface Report {
  id: string;
  paperId: string;
  reportId: string; // e.g. "#99281"
  title: string;
  faculty: string;
  semester: string;
  aiSummary: string;
  questionCount: number;
  avgDifficulty: 'Easy' | 'Medium' | 'Hard' | string;
  difficultyProfile: {
    hard: number;
    medium: number;
    easy: number;
  };
  bloomsDistribution: {
    apply: number;
    evaluate: number;
    analyze: number;
    score: number; // overall percentage
  };
  topicDistribution: {
    topic: string;
    percentage: number;
    questionsCount: number;
    isMajor: boolean;
  }[];
  questions: Question[];
}
