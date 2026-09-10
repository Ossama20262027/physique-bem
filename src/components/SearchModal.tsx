import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  Binary,
  FileCheck2,
  Video,
  ArrowLeft
} from 'lucide-react';
import { dataStore } from '../services/store';
import { Lesson, Exercise, VideoItem, Formula } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectExercise: (exerciseId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectExercise
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allLessons = useMemo(() => dataStore.getAllLessons(), []);
  const allExercises = useMemo(() => dataStore.getExercises(), []);
  const allVideos = useMemo(() => dataStore.getVideos(), []);

  // Filtered results
  const results = useMemo(() => {
    if (!query.trim()) return { lessons: [], formulas: [], exercises: [], videos: [] };
    const q = query.trim().toLowerCase();

    const matchedLessons: Lesson[] = [];
    const matchedFormulas: { formula: Formula; lessonTitle: string; lessonId: string }[] = [];

    for (const lesson of allLessons) {
      const matchLesson =
        lesson.title.toLowerCase().includes(q) ||
        (lesson.frenchTitle && lesson.frenchTitle.toLowerCase().includes(q)) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.youtubeKeywords.some((k) => k.toLowerCase().includes(q)) ||
        lesson.concepts.some((c) => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q));

      if (matchLesson) {
        matchedLessons.push(lesson);
      }

      for (const form of lesson.formulas) {
        if (
          form.name.toLowerCase().includes(q) ||
          form.expression.toLowerCase().includes(q) ||
          form.explanation.toLowerCase().includes(q)
        ) {
          matchedFormulas.push({ formula: form, lessonTitle: lesson.title, lessonId: lesson.id });
        }
      }
    }

    const matchedExercises = allExercises.filter(
      (ex) =>
        ex.title.toLowerCase().includes(q) ||
        ex.text.toLowerCase().includes(q) ||
        ex.expectedFormulas.some((f) => f.toLowerCase().includes(q))
    );

    const matchedVideos = allVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.channelTitle.toLowerCase().includes(q)
    );

    return {
      lessons: matchedLessons.slice(0, 5),
      formulas: matchedFormulas.slice(0, 5),
      exercises: matchedExercises.slice(0, 5),
      videos: matchedVideos.slice(0, 4)
    };
  }, [query, allLessons, allExercises, allVideos]);

  const totalResults =
    results.lessons.length +
    results.formulas.length +
    results.exercises.length +
    results.videos.length;

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto sm:my-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن درس، قانون (P=m.g, Umax), تمرين, فيديو..."
            autoFocus
            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            إغلاق
          </button>
        </div>

        {/* Search Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm">اكتب كلمة مفتاحية للبحث في كامل المنهاج والقوانين والتمارين</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['الثقل P=m.g', 'التيار المتناوب', 'دافعة أرخميدس', 'التحليل الكهربائي', 'الأمن الكهربائي', 'المرآة المستوية'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="py-8 text-center text-slate-500">
              <p>لم يتم العثور على نتائج تطابق: "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">جرب كلمات أخرى مثل: "تكهرب"، "قوة"، "ثقل"، "كلور الزنك"</p>
            </div>
          )}

          {/* Lessons Results */}
          {results.lessons.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>الدروس المقررة ({results.lessons.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    id={`search-res-lesson-${lesson.id}`}
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {lesson.title}
                      </div>
                      {lesson.frenchTitle && (
                        <div className="text-[11px] text-slate-400">{lesson.frenchTitle}</div>
                      )}
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transform -translate-x-1 group-hover:translate-x-0 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Formulas Results */}
          {results.formulas.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Binary className="w-3.5 h-3.5" />
                <span>القوانين الفيزيائية ({results.formulas.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.formulas.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectLesson(item.lessonId);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-sm text-amber-900 dark:text-amber-200">
                        {item.formula.name}
                      </div>
                      <div className="text-xs font-mono-formula font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                        {item.formula.expression}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        تابع لدرس: {item.lessonTitle}
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-amber-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercises Results */}
          {results.exercises.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>التمارين التطبيقية ({results.exercises.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.exercises.map((ex) => (
                  <button
                    key={ex.id}
                    id={`search-res-ex-${ex.id}`}
                    onClick={() => {
                      onSelectExercise(ex.id);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {ex.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {ex.text}
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Results */}
          {results.videos.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Video className="w-3.5 h-3.5" />
                <span>فيديوهات الشرح ({results.videos.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      onSelectLesson(vid.lessonId);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-10 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {vid.title}
                      </div>
                      <div className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                        {vid.isTeacherChannel && <span>⭐</span>}
                        <span>{vid.channelTitle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
