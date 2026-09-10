import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Timer,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  AlertTriangle,
  Play
} from 'lucide-react';
import { QuizQuestion, UserProgress, FieldId } from '../types';
import { dataStore } from '../services/store';
import { triggerConfetti, triggerSuperConfetti } from '../utils/confetti';

interface QuizViewProps {
  userProgress: UserProgress;
  onNavigateToLesson: (lessonId: string) => void;
  onRefresh: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  userProgress,
  onNavigateToLesson,
  onRefresh
}) => {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showAnswerExplanation, setShowAnswerExplanation] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes default

  const allQuestions = useMemo(() => dataStore.getQuizzes(), []);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isQuizActive && !isCompleted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, isCompleted, secondsRemaining]);

  const handleStartQuiz = () => {
    let pool = allQuestions;
    if (selectedField !== 'all') {
      pool = pool.filter((q) => q.fieldId === selectedField);
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    if (picked.length === 0) {
      alert('لا توجد أسئلة كافية في هذا الميدان حالياً');
      return;
    }

    setQuestions(picked);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowAnswerExplanation(false);
    setSecondsRemaining(picked.length * 60); // 1 minute per question
    setIsQuizActive(true);
    setIsCompleted(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    if (!currentQ || selectedAnswers[currentQ.id] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
    setShowAnswerExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowAnswerExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setIsCompleted(true);
    setIsQuizActive(false);

    // Calculate score
    let correctCount = 0;
    const mistakes: string[] = [];

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      } else {
        mistakes.push(q.conceptToReview || q.fieldId);
      }
    });

    const finalScore = Math.round((correctCount / (questions.length || 1)) * 20);

    // Save to store
    dataStore.recordQuizResult({
      date: new Date().toLocaleDateString('ar-DZ'),
      totalQuestions: questions.length,
      correctAnswersCount: correctCount,
      score: finalScore,
      weakConcepts: Array.from(new Set(mistakes))
    });

    if (finalScore >= 16) {
      triggerSuperConfetti();
    } else if (finalScore >= 10) {
      triggerConfetti();
    }

    onRefresh();
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // -------------------------------------------------------------
  // VIEW: FINAL SCORE EVALUATION
  // -------------------------------------------------------------
  if (isCompleted) {
    let correctCount = 0;
    const weakLessonsMap: Record<string, string> = {};

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      } else if (q.lessonId) {
        weakLessonsMap[q.lessonId] = q.question;
      }
    });

    const scoreOutOf20 = Math.round((correctCount / (questions.length || 1)) * 20);

    return (
      <div id="quiz-result-view" className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        {/* Main Result Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 mx-auto flex items-center justify-center text-3xl shadow-inner">
            {scoreOutOf20 >= 16 ? '🥇' : scoreOutOf20 >= 10 ? '🥈' : '📚'}
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              نتيجة تقييم BEM
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {scoreOutOf20} <span className="text-2xl text-slate-400">/ 20</span>
            </div>
          </div>

          {/* Feedback message */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-sm">
            {scoreOutOf20 >= 18 ? (
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                ما شاء الله تبارك الله! 🎉 أداء عبقري وتحكم كامل في مفاهيم المنهاج. أنت مرشح بقوة للعلامة الكاملة في BEM!
              </p>
            ) : scoreOutOf20 >= 14 ? (
              <p className="font-bold text-blue-600 dark:text-blue-400">
                أداء ممتاز جداً! 👏 إجاباتك تدل على استيعاب قوي، ركز على مراجعة بعض التفاصيل الصغيرة لتصل إلى 20/20.
              </p>
            ) : scoreOutOf20 >= 10 ? (
              <p className="font-bold text-amber-600 dark:text-amber-400">
                مستوى متوسط وجيد 👍 لقد اجتزت الاختبار بنجاح، ولكن تحتاج لمراجعة نقاط الضعف الموضحة أدناه لضمان معدل مرتفع.
              </p>
            ) : (
              <p className="font-bold text-red-600 dark:text-red-400">
                لا تقلق يا بطل! 📚 الغاية من الكويز هي اكتشاف الثغرات وتداركها قبل موعد الشهادة. راجع الدروس المقترحة بالأسفل ثم أعد المحاولة.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <span className="font-bold text-lg block">{correctCount}</span>
              <span>إجابات صحيحة</span>
            </div>
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
              <span className="font-bold text-lg block">{questions.length - correctCount}</span>
              <span>إجابات خاطئة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار بنموذج جديد</span>
            </button>

            <button
              onClick={() => {
                setIsCompleted(false);
                setIsQuizActive(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              العودة لقائمة الاختبارات
            </button>
          </div>
        </div>

        {/* Recommended Lessons based on mistakes */}
        {Object.keys(weakLessonsMap).length > 0 && (
          <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>دروس يُنصح بمراجعتها لسد الثغرات:</span>
            </h3>
            <div className="space-y-2">
              {Object.keys(weakLessonsMap).map((lessonId) => {
                const lesson = dataStore.getLessonById(lessonId);
                if (!lesson) return null;

                return (
                  <button
                    key={lessonId}
                    onClick={() => onNavigateToLesson(lessonId)}
                    className="w-full text-right p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-amber-800 flex items-center justify-between group hover:border-amber-400 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                        {lesson.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lesson.fieldId} - مراجعة مفاهيم هذا السؤال
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-amber-500 transform group-hover:-translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: ACTIVE QUIZ QUESTIONS
  // -------------------------------------------------------------
  if (isQuizActive && currentQ) {
    const isAnswered = selectedAnswers[currentQ.id] !== undefined;
    const selectedOption = selectedAnswers[currentQ.id];

    return (
      <div id="active-quiz-view" className="max-w-2xl mx-auto space-y-5 pb-12 animate-in fade-in duration-200">
        {/* Top Progress & Timer Bar */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span>السؤال</span>
            <span className="text-sm">{currentIndex + 1}</span>
            <span className="text-slate-400 font-normal">من {questions.length}</span>
          </div>

          {/* Countdown timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
              secondsRemaining < 60
                ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:border-red-800 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="font-mono">{formatTime(secondsRemaining)}</span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {currentQ.fieldId === 'electricity' && 'الظواهر الكهربائية'}
              {currentQ.fieldId === 'matter' && 'المادة وتحولاتها'}
              {currentQ.fieldId === 'mechanics' && 'الظواهر الميكانيكية'}
              {currentQ.fieldId === 'optics' && 'الظواهر الضوئية'}
            </span>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options list */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = currentQ.correctAnswerIndex === idx;

              let btnStyle =
                'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isChosen) {
                  btnStyle =
                    'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-700 text-red-800 dark:text-red-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-right p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center font-bold text-xs shrink-0">
                      {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && isChosen && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Explanation */}
          {showAnswerExplanation && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in duration-200">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">
                💡 تعليل الأستاذ النموذجي:
              </span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <span>{currentIndex < questions.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار وعرض النتيجة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: QUIZ LAUNCHER & CONFIGURATION
  // -------------------------------------------------------------
  return (
    <div id="quiz-launcher-view" className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 mb-1">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          محاكي كويزات واختبارات BEM
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          اختبر جاهزيتك لشهادة التعليم المتوسط مع تصحيح فوري وتحليل لنقاط الضعف
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        {/* Field Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            اختر الميدان للاختبار:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'شامل لجميع الميادين (نموذج BEM)', icon: '🏆' },
              { id: 'electricity', label: 'الظواهر الكهربائية', icon: '⚡' },
              { id: 'matter', label: 'المادة وتحولاتها', icon: '🧪' },
              { id: 'mechanics', label: 'الظواهر الميكانيكية', icon: '⚙️' },
              { id: 'optics', label: 'الظواهر الضوئية', icon: '🔦' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedField(f.id)}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition-all ${
                  selectedField === f.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950 dark:border-blue-500 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            عدد الأسئلة:
          </label>
          <div className="grid grid-cols-3 gap-2.5 text-xs font-semibold">
            {[5, 10, 15].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`p-2.5 rounded-xl border transition-all ${
                  questionCount === count
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {count} أسئلة
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Play className="w-4 h-4 fill-current ml-1" />
          <span>ابدأ الاختبار الآن ⏱️</span>
        </button>
      </div>
    </div>
  );
};
