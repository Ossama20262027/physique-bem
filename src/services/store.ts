import {
  Field,
  Lesson,
  VideoItem,
  Exercise,
  QuizQuestion,
  QuizResult,
  StudyPlan,
  StudyPlanTask,
  Badge,
  UserProgress,
  DifficultyLevel
} from '../types';
import { INITIAL_CURRICULUM } from '../data/curriculumData';
import {
  INITIAL_VIDEOS,
  INITIAL_EXERCISES,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_BADGES
} from '../data/exercisesAndQuizzes';

const STORAGE_KEYS = {
  CURRICULUM: 'physique_4am_curriculum',
  VIDEOS: 'physique_4am_videos',
  EXERCISES: 'physique_4am_exercises',
  QUIZZES: 'physique_4am_quizzes',
  USER_PROGRESS: 'physique_4am_user_progress',
  STUDY_PLAN: 'physique_4am_study_plan',
  THEME: 'physique_4am_theme',
  ADMIN_AUTH: 'physique_4am_is_admin'
};

const DEFAULT_USER: UserProgress = {
  name: 'تلميذ الرابعة متوسط',
  avatar: '👨‍🎓',
  gradeLevel: 'السنة الرابعة متوسط - BEM',
  xp: 150,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['elec-1-1'],
  completedExerciseIds: [],
  bookmarkedLessonIds: ['elec-3-3', 'mech-2-2'],
  bookmarkedExerciseIds: [],
  quizHistory: [
    {
      id: 'res-init',
      date: new Date().toISOString().split('T')[0],
      fieldId: 'electricity',
      score: 16,
      totalQuestions: 5,
      correctAnswersCount: 4,
      mistakes: [
        {
          questionText: 'قراءة التوتر الفعال',
          studentAnswer: 'Umax',
          correctAnswer: 'Ueff = Umax / √2',
          explanation: 'الفولطمتر يقيس القيمة الفعالة وليس الأعظمية.',
          conceptToReview: 'العلاقة بين التوتر الأعظمي والفعال'
        }
      ],
      weakConcepts: ['حساب Ueff'],
      aiAdvice: 'بداية ممتازة في الظواهر الكهربائية! راجع قانون Ueff = Umax / 1.414 للتمكن التام.'
    }
  ],
  badges: INITIAL_BADGES
};

class DataStore {
  private curriculum: Field[];
  private videos: VideoItem[];
  private exercises: Exercise[];
  private quizQuestions: QuizQuestion[];
  private userProgress: UserProgress;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.curriculum = this.load(STORAGE_KEYS.CURRICULUM, INITIAL_CURRICULUM);
    this.videos = this.load(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);

    // Auto-migrate if localStorage contains old dummy video IDs
    const hasDummyVideos = this.videos.some(
      (v) =>
        v.videoId === '0tqGvM8kG-k' ||
        v.videoId === 'wYk3_Qj2f14' ||
        v.videoId === 'q7L1v2X3y4Z' ||
        v.videoId === 'p9k8j7h6g5f' ||
        v.videoId === 'z9y8x7w6v5u' ||
        v.videoId === 'n1m2l3k4j5i'
    );
    if (hasDummyVideos || this.videos.length < INITIAL_VIDEOS.length) {
      this.videos = INITIAL_VIDEOS;
      this.save(STORAGE_KEYS.VIDEOS, this.videos);
    }

    this.exercises = this.load(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES);
    this.quizQuestions = this.load(STORAGE_KEYS.QUIZZES, INITIAL_QUIZ_QUESTIONS);
    this.userProgress = this.load(STORAGE_KEYS.USER_PROGRESS, DEFAULT_USER);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Curriculum Access & Mutation ---
  public getCurriculum(): Field[] {
    return this.curriculum;
  }

  public getAllLessons(): Lesson[] {
    const list: Lesson[] = [];
    for (const field of this.curriculum) {
      for (const unit of field.units) {
        list.push(...unit.lessons);
      }
    }
    return list;
  }

  public getLessonById(id: string): Lesson | undefined {
    return this.getAllLessons().find((l) => l.id === id);
  }

  public addLesson(fieldId: string, unitId: string, lesson: Omit<Lesson, 'id'>) {
    const newId = `lesson-${Date.now()}`;
    const newLesson: Lesson = { ...lesson, id: newId };

    const field = this.curriculum.find((f) => f.id === fieldId);
    if (!field) return;

    let unit = field.units.find((u) => u.id === unitId);
    if (!unit) {
      unit = field.units[0];
    }
    unit.lessons.push(newLesson);

    this.save(STORAGE_KEYS.CURRICULUM, this.curriculum);
    return newLesson;
  }

  public updateLesson(lessonId: string, updates: Partial<Lesson>) {
    let found = false;
    for (const field of this.curriculum) {
      for (const unit of field.units) {
        const idx = unit.lessons.findIndex((l) => l.id === lessonId);
        if (idx !== -1) {
          unit.lessons[idx] = { ...unit.lessons[idx], ...updates };
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) {
      this.save(STORAGE_KEYS.CURRICULUM, this.curriculum);
    }
  }

  public deleteLesson(lessonId: string) {
    for (const field of this.curriculum) {
      for (const unit of field.units) {
        unit.lessons = unit.lessons.filter((l) => l.id !== lessonId);
      }
    }
    this.save(STORAGE_KEYS.CURRICULUM, this.curriculum);
  }

  // --- Videos Access & Mutation ---
  public getVideos(): VideoItem[] {
    return this.videos;
  }

  public getVideosForLesson(lessonId: string): VideoItem[] {
    const list = this.videos.filter((v) => v.lessonId === lessonId);
    // Sort so teacher's channel "دروسي على النت" is always first
    return list.sort((a, b) => {
      if (a.isTeacherChannel && !b.isTeacherChannel) return -1;
      if (!a.isTeacherChannel && b.isTeacherChannel) return 1;
      return 0;
    });
  }

  public addVideo(video: Omit<VideoItem, 'id'>) {
    const newVideo: VideoItem = { ...video, id: `video-${Date.now()}` };
    this.videos.unshift(newVideo);
    this.save(STORAGE_KEYS.VIDEOS, this.videos);
    return newVideo;
  }

  public updateVideo(videoId: string, updates: Partial<VideoItem>) {
    const idx = this.videos.findIndex((v) => v.id === videoId);
    if (idx !== -1) {
      this.videos[idx] = { ...this.videos[idx], ...updates };
      this.save(STORAGE_KEYS.VIDEOS, this.videos);
    }
  }

  public deleteVideo(videoId: string) {
    this.videos = this.videos.filter((v) => v.id !== videoId);
    this.save(STORAGE_KEYS.VIDEOS, this.videos);
  }

  // --- Exercises Access & Mutation ---
  public getExercises(): Exercise[] {
    return this.exercises;
  }

  public getExercisesForLesson(lessonId: string): Exercise[] {
    return this.exercises.filter((ex) => ex.lessonId === lessonId);
  }

  public addExercise(exercise: Omit<Exercise, 'id'>) {
    const newExercise: Exercise = {
      ...exercise,
      id: `ex-${Date.now()}`,
      isCustom: true
    };
    this.exercises.unshift(newExercise);
    this.save(STORAGE_KEYS.EXERCISES, this.exercises);
    return newExercise;
  }

  public updateExercise(exerciseId: string, updates: Partial<Exercise>) {
    const idx = this.exercises.findIndex((e) => e.id === exerciseId);
    if (idx !== -1) {
      this.exercises[idx] = { ...this.exercises[idx], ...updates };
      this.save(STORAGE_KEYS.EXERCISES, this.exercises);
    }
  }

  public deleteExercise(exerciseId: string) {
    this.exercises = this.exercises.filter((e) => e.id !== exerciseId);
    this.save(STORAGE_KEYS.EXERCISES, this.exercises);
  }

  // --- Quiz Questions ---
  public getQuizQuestions(): QuizQuestion[] {
    return this.quizQuestions;
  }

  public getQuestionsForLesson(lessonId: string): QuizQuestion[] {
    return this.quizQuestions.filter((q) => q.lessonId === lessonId);
  }

  public addQuizQuestion(q: Omit<QuizQuestion, 'id'>) {
    const newQ: QuizQuestion = { ...q, id: `q-${Date.now()}` };
    this.quizQuestions.unshift(newQ);
    this.save(STORAGE_KEYS.QUIZZES, this.quizQuestions);
    return newQ;
  }

  public deleteQuizQuestion(id: string) {
    this.quizQuestions = this.quizQuestions.filter((q) => q.id !== id);
    this.save(STORAGE_KEYS.QUIZZES, this.quizQuestions);
  }

  // --- User Progress & Gamification ---
  public getUserProgress(): UserProgress {
    return this.userProgress;
  }

  public updateUserProfile(updates: Partial<UserProgress>) {
    this.userProgress = { ...this.userProgress, ...updates };
    this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
  }

  public toggleLessonCompleted(lessonId: string) {
    const completed = new Set(this.userProgress.completedLessonIds);
    let gainedXP = 0;
    if (completed.has(lessonId)) {
      completed.delete(lessonId);
    } else {
      completed.add(lessonId);
      gainedXP = 50;
    }

    this.userProgress.completedLessonIds = Array.from(completed);
    if (gainedXP > 0) {
      this.addXP(gainedXP);
    }
    this.checkBadges();
    this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
  }

  public toggleLessonBookmark(lessonId: string) {
    const bookmarks = new Set(this.userProgress.bookmarkedLessonIds);
    if (bookmarks.has(lessonId)) {
      bookmarks.delete(lessonId);
    } else {
      bookmarks.add(lessonId);
    }
    this.userProgress.bookmarkedLessonIds = Array.from(bookmarks);
    this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
  }

  public markExerciseCompleted(exerciseId: string) {
    const completed = new Set(this.userProgress.completedExerciseIds);
    if (!completed.has(exerciseId)) {
      completed.add(exerciseId);
      this.userProgress.completedExerciseIds = Array.from(completed);
      this.addXP(30);
      this.checkBadges();
      this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
    }
  }

  public saveQuizResult(result: QuizResult) {
    this.userProgress.quizHistory.unshift(result);
    // Add XP based on score
    this.addXP(result.score * 5);
    this.checkBadges();
    this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
  }

  public addXP(amount: number) {
    this.userProgress.xp += amount;
    this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
  }

  private checkBadges() {
    const p = this.userProgress;
    let modified = false;

    // First lesson badge
    const b1 = p.badges.find((b) => b.id === 'badge-first-lesson');
    if (b1 && !b1.unlocked && p.completedLessonIds.length >= 1) {
      b1.unlocked = true;
      b1.progress = 1;
      b1.unlockedAt = new Date().toISOString();
      modified = true;
    }

    // 5 exercises badge
    const b2 = p.badges.find((b) => b.id === 'badge-ten-exercises');
    if (b2 && !b2.unlocked) {
      b2.progress = p.completedExerciseIds.length;
      if (p.completedExerciseIds.length >= b2.maxProgress) {
        b2.unlocked = true;
        b2.unlockedAt = new Date().toISOString();
        modified = true;
      }
    }

    // BEM Ready badge
    const bBEM = p.badges.find((b) => b.id === 'badge-bem-ready');
    if (bBEM && !bBEM.unlocked) {
      const topScore = p.quizHistory.reduce((acc, q) => Math.max(acc, q.score), 0);
      bBEM.progress = topScore;
      if (topScore >= 16) {
        bBEM.unlocked = true;
        bBEM.unlockedAt = new Date().toISOString();
        modified = true;
      }
    }

    if (modified) {
      this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
    }
  }

  // --- Study Plan Generator ---
  public generateStudyPlan(
    availableDays: number,
    dailyMinutes: number,
    targetExamDate?: string,
    lessonIds?: string[]
  ): StudyPlan {
    const allLessons = this.getAllLessons();
    const selected = (lessonIds && lessonIds.length > 0)
      ? allLessons.filter((l) => lessonIds.includes(l.id))
      : allLessons;

    const daysCount = Math.max(1, availableDays);
    const planDays: StudyPlan['days'] = [];

    // Distribute lessons over the available days
    for (let i = 0; i < daysCount; i++) {
      const lesson = selected[i % selected.length];
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + i);

      planDays.push({
        dayNumber: i + 1,
        dateStr: dayDate.toISOString().split('T')[0],
        lessonId: lesson.id,
        tasks: [
          {
            id: `task-${i}-1`,
            type: 'lesson',
            label: `مراجعة درس: ${lesson.title}`,
            completed: false
          },
          {
            id: `task-${i}-2`,
            type: 'video',
            label: `مشاهدة شرح فيديو للأستاذ`,
            completed: false
          },
          {
            id: `task-${i}-3`,
            type: 'exercise',
            label: `حل تمرين تطبيقي (${lesson.title})`,
            completed: false
          },
          {
            id: `task-${i}-4`,
            type: 'quiz',
            label: `اختبار سريع 5 دقائق وتقييم المفاهيم`,
            completed: false
          }
        ],
        completed: false
      });
    }

    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      availableDays: daysCount,
      dailyMinutes,
      targetExamDate,
      selectedLessonIds: selected.map((l) => l.id),
      days: planDays
    };

    this.userProgress.activeStudyPlan = newPlan;
    this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
    return newPlan;
  }

  public togglePlanTask(dayNumber: number, taskId: string) {
    if (!this.userProgress.activeStudyPlan) return;
    const day = this.userProgress.activeStudyPlan.days.find((d) => d.dayNumber === dayNumber);
    if (!day) return;

    const task = day.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      day.completed = day.tasks.every((t) => t.completed);
      if (task.completed) {
        this.addXP(20);
      }
      this.save(STORAGE_KEYS.USER_PROGRESS, this.userProgress);
    }
  }

  public getQuizzes(): QuizQuestion[] {
    return this.getQuizQuestions();
  }

  public recordQuizResult(result: {
    date: string;
    totalQuestions: number;
    correctAnswersCount: number;
    score: number;
    weakConcepts: string[];
  }) {
    const fullResult: QuizResult = {
      id: `quiz-res-${Date.now()}`,
      date: result.date,
      totalQuestions: result.totalQuestions,
      correctAnswersCount: result.correctAnswersCount,
      score: result.score,
      mistakes: [],
      weakConcepts: result.weakConcepts,
      aiAdvice: result.score >= 15 ? 'أداء ممتاز واصل على هذا النحو' : 'راجع المفاهيم المقترحة'
    };
    this.saveQuizResult(fullResult);
  }

  public getStudyPlan(): StudyPlanTask[] {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaults: StudyPlanTask[] = [
      {
        id: 'task-1',
        dayNumber: 1,
        title: 'مراجعة درس التكهرب والشحنة الكهربائية',
        durationMinutes: 30,
        field: 'الظواهر الكهربائية',
        description: 'فهم النموذج المبسط للذرة والتكهرب بالدلك واللمس والتأثير',
        completed: true
      },
      {
        id: 'task-2',
        dayNumber: 2,
        title: 'حل تمارين التيار المتناوب وراسم الاهتزاز المهبطي',
        durationMinutes: 40,
        field: 'الظواهر الكهربائية',
        description: 'حساب التوتر الأعظمي Umax، الفعال Ueff، الدور T والتواتر f',
        completed: false
      },
      {
        id: 'task-3',
        dayNumber: 3,
        title: 'مراجعة التحليل الكهربائي البسيط لمحلول كلور الزنك',
        durationMinutes: 35,
        field: 'المادة وتحولاتها',
        description: 'كتابة المعادلات النصفية عند المصعد والمهبط والمعادلة الإجمالية',
        completed: false
      },
      {
        id: 'task-4',
        dayNumber: 4,
        title: 'تطبيقات دافعة أرخميدس وطفو الأجسام الصلبة',
        durationMinutes: 45,
        field: 'الظواهر الميكانيكية',
        description: 'حساب الثقل الحقيقي P، الثقل الظاهري P\' ودافعة أرخميدس Fa',
        completed: false
      },
      {
        id: 'task-5',
        dayNumber: 5,
        title: 'كويز شامل على نمط موضوع BEM رسمي',
        durationMinutes: 30,
        field: 'الظواهر الضوئية',
        description: 'اختبار تجريبي في انتشار الضوء وتطبيقات المرايا',
        completed: false
      }
    ];
    this.save(STORAGE_KEYS.STUDY_PLAN, defaults);
    return defaults;
  }

  public addStudyTask(task: Omit<StudyPlanTask, 'id'>) {
    const tasks = this.getStudyPlan();
    const newTask: StudyPlanTask = { ...task, id: `task-${Date.now()}`, completed: false };
    tasks.push(newTask);
    this.save(STORAGE_KEYS.STUDY_PLAN, tasks);
    return newTask;
  }

  public toggleStudyTaskCompleted(taskId: string) {
    const tasks = this.getStudyPlan();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      if (task.completed) {
        this.addXP(25);
      }
      this.save(STORAGE_KEYS.STUDY_PLAN, tasks);
    }
  }

  // --- Reset to default seeds if requested ---
  public resetToDefaults() {
    this.curriculum = INITIAL_CURRICULUM;
    this.videos = INITIAL_VIDEOS;
    this.exercises = INITIAL_EXERCISES;
    this.quizQuestions = INITIAL_QUIZ_QUESTIONS;
    this.userProgress = DEFAULT_USER;
    localStorage.removeItem(STORAGE_KEYS.CURRICULUM);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    this.notify();
  }
}

export const dataStore = new DataStore();
