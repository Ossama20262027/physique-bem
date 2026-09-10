import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Bot,
  Filter,
  Search,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { Exercise, UserProgress, FieldId, DifficultyLevel } from '../types';
import { dataStore } from '../services/store';
import { triggerConfetti } from '../utils/confetti';

interface ExercisesViewProps {
  userProgress: UserProgress;
  onAskAiToSolve: (exerciseText: string, mode: 'solve' | 'guide') => void;
  onRefresh: () => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  userProgress,
  onAskAiToSolve,
  onRefresh
}) => {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const allExercises = useMemo(() => dataStore.getExercises(), []);

  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      if (selectedField !== 'all' && ex.fieldId !== selectedField) return false;
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ex.title.toLowerCase().includes(q) ||
          ex.text.toLowerCase().includes(q) ||
          ex.expectedFormulas.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allExercises, selectedField, selectedDifficulty, searchQuery]);

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMarkCompleted = (id: string) => {
    dataStore.markExerciseCompleted(id);
    triggerConfetti();
    onRefresh();
  };

  return (
    <div id="exercises-view" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            بنك التمارين والوضعيات المحلولة
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تمارين نموذجية ومسائل BEM مع خطوات الحل المنهجية وسلم التنقيط
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في التمارين والقوانين..."
            className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Field Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-semibold">
          {[
            { id: 'all', label: 'جميع التمارين' },
            { id: 'electricity', label: 'الظواهر الكهربائية' },
            { id: 'matter', label: 'المادة وتحولاتها' },
            { id: 'mechanics', label: 'الظواهر الميكانيكية' },
            { id: 'optics', label: 'الظواهر الضوئية' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedField(item.id)}
              className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                selectedField === item.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="p-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
        >
          <option value="all">كل مستويات الصعوبة</option>
          <option value="easy">سهل</option>
          <option value="medium">متوسط</option>
          <option value="hard">صعب</option>
          <option value="bem">مستوى BEM شهادة</option>
        </select>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {filteredExercises.map((ex) => {
          const isRevealed = Boolean(revealedSolutions[ex.id]);
          const isCompleted = userProgress.completedExerciseIds.includes(ex.id);

          return (
            <div
              key={ex.id}
              id={`exercise-card-${ex.id}`}
              className={`p-5 rounded-2xl border transition-all space-y-4 shadow-sm ${
                isCompleted
                  ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Exercise Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        ex.difficulty === 'bem'
                          ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                          : ex.difficulty === 'hard'
                          ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {ex.difficulty === 'bem' ? '⭐ موضوع شهادة BEM' : ex.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">
                      {ex.fieldId === 'electricity' && 'الظواهر الكهربائية'}
                      {ex.fieldId === 'matter' && 'المادة وتحولاتها'}
                      {ex.fieldId === 'mechanics' && 'الظواهر الميكانيكية'}
                      {ex.fieldId === 'optics' && 'الظواهر الضوئية'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {ex.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleMarkCompleted(ex.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isCompleted ? '✓ تم حل التمرين' : 'تحديد كـ "محلول" (+30 XP)'}</span>
                </button>
              </div>

              {/* Text content */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {ex.text}
              </div>

              {/* Hints */}
              {ex.hints && ex.hints.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <span className="font-bold">💡 تلميح:</span>
                  <span>{ex.hints.join(' • ')}</span>
                </div>
              )}

              {/* Actions: Reveal Solution & Ask AI Socratic Mode */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => toggleSolution(ex.id)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {isRevealed ? 'إخفاء خطوات الحل' : 'عرض خطوات الحل النموذجي بالكامل'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskAiToSolve(ex.text, 'guide')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors"
                  >
                    <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>الأستاذ الذكي: حل معي خطوة بخطوة 🤝</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Solution Breakdown */}
              {isRevealed && (
                <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-4 animate-in fade-in duration-200 text-xs sm:text-sm">
                  <div className="font-bold text-emerald-900 dark:text-emerald-300 text-sm border-b border-emerald-200 dark:border-emerald-800 pb-2">
                    ✓ سلم التنقيط والحل النموذجي لشهادة BEM:
                  </div>

                  {/* 1 & 2: Givens & Required */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200/60 dark:border-emerald-900">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">1. المعطيات المستخرجة:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                        {ex.fullSolution.givens.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200/60 dark:border-emerald-900">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">2. المطلوب:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                        {ex.fullSolution.required.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3 & 4: Formula & Calculation */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200/60 dark:border-emerald-900 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white">3. القانون المعتمد والتعويض العددي:</div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono-formula text-blue-600 dark:text-blue-400 font-bold">
                      {ex.fullSolution.formula}
                    </div>
                    <div className="font-mono-formula text-slate-700 dark:text-slate-300">
                      {ex.fullSolution.substitution}
                    </div>
                  </div>

                  {/* 5 & 6: Result with unit & Verification */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 space-y-1">
                    <div className="text-xs text-slate-400">النتيجة النهائية المصادق عليها:</div>
                    <div className="font-extrabold text-base text-emerald-700 dark:text-emerald-300">
                      {ex.fullSolution.result}
                    </div>
                    <div className="text-xs text-slate-500 pt-1">
                      التحقق المنطقي: {ex.fullSolution.verification}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
