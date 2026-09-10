export type FieldId = 'electricity' | 'matter' | 'mechanics' | 'optics';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'bem';

export interface Formula {
  id: string;
  name: string;
  expression: string; // e.g., "P = m × g"
  explanation: string;
  units: { symbol: string; meaning: string; unit: string }[];
  example?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  fieldId: FieldId;
  title: string;
  frenchTitle?: string;
  order: number;
  description: string;
  objectives: string[];
  concepts: { title: string; content: string }[];
  formulas: Formula[];
  commonMistakes: string[];
  importantNotes: string[];
  youtubeKeywords: string[];
  difficulty: DifficultyLevel;
  customSummary?: string;
}

export interface Unit {
  id: string;
  fieldId: FieldId;
  order: number;
  title: string;
  frenchTitle?: string;
  lessons: Lesson[];
}

export interface Field {
  id: FieldId;
  title: string;
  frenchTitle: string;
  icon: string; // emoji or lucide key
  color: string;
  badgeColor: string;
  bgGradient: string;
  description: string;
  units: Unit[];
}

export interface VideoItem {
  id: string;
  lessonId: string;
  title: string;
  channelTitle: string;
  channelId?: string;
  isTeacherChannel: boolean; // true for "دروسي على النت"
  videoId: string; // YouTube embed ID (clean valid education video ID or embeddable)
  duration: string;
  thumbnail: string;
  views?: string;
  publishedAt?: string;
}

export interface LessonVideoItem {
  id: string;
  title?: string;
  teacherName: string;
  channelName: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  duration?: string;
  isVerified?: boolean;
}

export interface LessonDownloadItem {
  pdfUrl?: string;
  wordUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'word' | 'none';
  fileSize?: string;
  isAvailable: boolean;
}

export interface LessonLibraryItem {
  id: string;
  title: string;
  frenchTitle?: string;
  fieldId: FieldId;
  fieldTitle: string;
  subject: string;
  grade?: string;
  description: string;
  objectives?: string[];
  concepts?: { title: string; content: string }[];
  formulas?: Formula[];
  download: LessonDownloadItem;
  videos: LessonVideoItem[]; // Exactly 5 videos
}

export interface SolutionStepDetail {
  givens: string[];
  required: string[];
  formula: string;
  substitution: string;
  calculation: string;
  result: string;
  unit: string;
  verification: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  fieldId: FieldId;
  title: string;
  difficulty: DifficultyLevel;
  text: string;
  imageUrl?: string;
  hints: string[];
  expectedFormulas: string[];
  points: number;
  fullSolution: SolutionStepDetail;
  isCustom?: boolean;
}

export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'formula_choice'
  | 'calculation'
  | 'situation_analysis';

export interface QuizQuestion {
  id: string;
  lessonId: string;
  fieldId: FieldId;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptToReview: string;
}

export interface QuizResult {
  id: string;
  date: string;
  fieldId?: FieldId | 'all';
  lessonId?: string;
  score: number; // out of 20
  totalQuestions: number;
  correctAnswersCount: number;
  mistakes: {
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
    conceptToReview: string;
  }[];
  weakConcepts: string[];
  aiAdvice: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  dateStr: string;
  lessonId: string;
  tasks: {
    id: string;
    type: 'lesson' | 'video' | 'exercise' | 'quiz';
    label: string;
    completed: boolean;
  }[];
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  createdAt: string;
  availableDays: number;
  dailyMinutes: number;
  targetExamDate?: string;
  selectedLessonIds: string[];
  days: StudyPlanDay[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'progress' | 'quiz' | 'streak' | 'mastery';
}

export interface UserProgress {
  name: string;
  avatar: string;
  gradeLevel: string; // "السنة الرابعة متوسط - 4AM"
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedExerciseIds: string[];
  bookmarkedLessonIds: string[];
  bookmarkedExerciseIds: string[];
  quizHistory: QuizResult[];
  badges: Badge[];
  activeStudyPlan?: StudyPlan;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  type?: 'text' | 'exercise_guidance' | 'solution' | 'warning';
  data?: any;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: string;
}

export interface StudyPlanTask {
  id: string;
  dayNumber: number;
  title: string;
  durationMinutes: number;
  field: string;
  description: string;
  completed?: boolean;
}

