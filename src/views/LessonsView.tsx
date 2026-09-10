import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Video,
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  Binary,
  Bot,
  Play,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ExternalLink,
  Users,
  Eye,
  Plus,
  Trash2,
  Check,
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Field, Lesson, VideoItem, Exercise, UserProgress, FieldId } from '../types';
import { dataStore } from '../services/store';
import { triggerConfetti } from '../utils/confetti';
import { AddVideoModal } from '../components/AddVideoModal';
import { getLibraryLessonById } from '../data/lessonsLibrary';

interface LessonsViewProps {
  curriculum: Field[];
  userProgress: UserProgress;
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string | null) => void;
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
  onPlayVideo: (video: VideoItem) => void;
  onAskAiAboutLesson: (lessonTitle: string) => void;
  onRefresh: () => void;
}

type LessonTab = 'concepts' | 'formulas' | 'videos' | 'exercises' | 'mistakes';

export const LessonsView: React.FC<LessonsViewProps> = ({
  curriculum,
  userProgress,
  selectedLessonId,
  onSelectLesson,
  selectedFieldId,
  onSelectField,
  onPlayVideo,
  onAskAiAboutLesson,
  onRefresh
}) => {
  const [activeLessonTab, setActiveLessonTab] = useState<LessonTab>('concepts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('all');
  const [revealedExerciseSolutions, setRevealedExerciseSolutions] = useState<Record<string, boolean>>({});
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [selectedLessonForVideoAdd, setSelectedLessonForVideoAdd] = useState<{ id: string; title: string } | null>(null);
  const [storeVersion, setStoreVersion] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to dataStore changes so added/deleted videos update in real-time
  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setStoreVersion((v) => v + 1);
    });
    return () => {
      unsub();
    };
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const allLessons = useMemo(() => {
    return curriculum.flatMap((f) => f.units.flatMap((u) => u.lessons));
  }, [curriculum]);

  const currentLesson = useMemo(() => {
    if (!selectedLessonId) return null;
    return allLessons.find((l) => l.id === selectedLessonId) || null;
  }, [selectedLessonId, allLessons]);

  const lessonVideos = useMemo(() => {
    if (!currentLesson) return [];
    return dataStore.getVideosForLesson(currentLesson.id);
  }, [currentLesson, storeVersion]);

  const lessonExercises = useMemo(() => {
    if (!currentLesson) return [];
    return dataStore.getExercisesForLesson(currentLesson.id);
  }, [currentLesson, storeVersion]);

  // Filter lessons for list view
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      if (selectedFieldId && selectedFieldId !== 'all' && lesson.fieldId !== selectedFieldId) {
        return false;
      }
      if (filterDifficulty !== 'all' && lesson.difficulty !== filterDifficulty) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          lesson.title.toLowerCase().includes(q) ||
          (lesson.frenchTitle && lesson.frenchTitle.toLowerCase().includes(q)) ||
          lesson.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allLessons, selectedFieldId, filterDifficulty, searchQuery]);

  const toggleSolution = (exId: string) => {
    setRevealedExerciseSolutions((prev) => ({
      ...prev,
      [exId]: !prev[exId]
    }));
  };

  const handleToggleComplete = (lessonId: string) => {
    const isAlready = userProgress.completedLessonIds.includes(lessonId);
    dataStore.toggleLessonCompleted(lessonId);
    if (!isAlready) {
      triggerConfetti();
    }
    onRefresh();
  };

  const handleToggleBookmark = (lessonId: string) => {
    dataStore.toggleLessonBookmark(lessonId);
    onRefresh();
  };

  // -------------------------------------------------------------
  // VIEW: SINGLE LESSON DETAIL VIEW
  // -------------------------------------------------------------
  if (currentLesson) {
    const isCompleted = userProgress.completedLessonIds.includes(currentLesson.id);
    const isBookmarked = userProgress.bookmarkedLessonIds.includes(currentLesson.id);

    return (
      <div id="lesson-detail-view" className="space-y-6 pb-12 animate-in fade-in duration-200">
        {/* Top Back Nav & Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => onSelectLesson(null)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة الدروس</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="lesson-bookmark-btn"
              onClick={() => handleToggleBookmark(currentLesson.id)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBookmarked ? 'محفوظ' : 'حفظ في المفضلة'}</span>
            </button>

            <button
              id="lesson-complete-toggle-btn"
              onClick={() => handleToggleComplete(currentLesson.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleted ? '✓ درس مكتمل (+50 XP)' : 'أكملت هذا الدرس (+50 XP)'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Header Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {currentLesson.fieldId === 'electricity' && '⚡ الظواهر الكهربائية'}
              {currentLesson.fieldId === 'matter' && '🧪 المادة وتحولاتها'}
              {currentLesson.fieldId === 'mechanics' && '⚙️ الظواهر الميكانيكية'}
              {currentLesson.fieldId === 'optics' && '🔦 الظواهر الضوئية'}
            </span>
            {currentLesson.frenchTitle && (
              <span className="text-xs text-slate-400 font-mono">
                {currentLesson.frenchTitle}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {currentLesson.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentLesson.description}
          </p>

          {/* Actions: Ask AI & Download Lesson PDF/Word */}
          {(() => {
            const libLesson = getLibraryLessonById(currentLesson.id);
            const hasDownload = Boolean(
              libLesson?.download.isAvailable &&
              (libLesson?.download.pdfUrl || libLesson?.download.wordUrl)
            );
            const downloadUrl = libLesson?.download.pdfUrl || libLesson?.download.wordUrl;
            const fileType = libLesson?.download.fileType === 'word' ? 'Word' : 'PDF';

            return (
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={() => onAskAiAboutLesson(currentLesson.title)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>اسأل الأستاذ الذكي حول هذا الدرس 🤖</span>
                </button>

                {hasDownload && downloadUrl ? (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الدرس ({fileType})</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>تحميل الدرس: غير متوفر حاليًا</span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Interactive Tabs for Lesson Content */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveLessonTab('concepts')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeLessonTab === 'concepts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 الشرح والمفاهيم</span>
          </button>

          {currentLesson.formulas.length > 0 && (
            <button
              onClick={() => setActiveLessonTab('formulas')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                activeLessonTab === 'formulas'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Binary className="w-4 h-4" />
              <span>📐 القوانين والوحدات ({currentLesson.formulas.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveLessonTab('videos')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeLessonTab === 'videos'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>🎥 شروحات الفيديو ({lessonVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveLessonTab('exercises')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeLessonTab === 'exercises'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>✍️ تمارين الدرس ({lessonExercises.length})</span>
          </button>

          <button
            onClick={() => setActiveLessonTab('mistakes')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeLessonTab === 'mistakes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>⚠️ أخطاء BEM الشائعة</span>
          </button>
        </div>

        {/* TAB 1: CONCEPTS & OBJECTIVES */}
        {activeLessonTab === 'concepts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Learning Objectives */}
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/50 space-y-2">
              <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span>أهداف التعلم لشهادة BEM</span>
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentLesson.objectives.map((obj, i) => (
                  <li key={i} className="leading-relaxed">{obj}</li>
                ))}
              </ul>
            </div>

            {/* Concepts Breakdown */}
            <div className="space-y-4">
              {currentLesson.concepts.map((conc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5"
                >
                  <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span>{conc.title}</span>
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {conc.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Teacher Notes */}
            {currentLesson.importantNotes.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>توجيهات الأستاذ الهامة</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {currentLesson.importantNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FORMULAS */}
        {activeLessonTab === 'formulas' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {currentLesson.formulas.map((formula) => (
              <div
                key={formula.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {formula.name}
                  </h4>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-xl font-bold font-mono-formula text-blue-600 dark:text-blue-400">
                    {formula.expression}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{formula.explanation}</div>
                </div>

                {/* Units Table */}
                {formula.units.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                          <th className="py-1.5 px-2">الرمز</th>
                          <th className="py-1.5 px-2">المعنى الفيزيائي</th>
                          <th className="py-1.5 px-2">الوحدة الدولية (SI)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {formula.units.map((u, i) => (
                          <tr key={i} className="text-slate-700 dark:text-slate-300">
                            <td className="py-1.5 px-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {u.symbol}
                            </td>
                            <td className="py-1.5 px-2">{u.meaning}</td>
                            <td className="py-1.5 px-2 font-semibold text-emerald-600 dark:text-emerald-400">
                              {u.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {formula.example && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">مثال تطبيقي: </span>
                    <span className="font-mono-formula">{formula.example}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: VIDEOS */}
        {activeLessonTab === 'videos' && (() => {
          // Compute teacher options
          const teacherMap = new Map<string, number>();
          lessonVideos.forEach((v) => {
            const name = v.channelTitle;
            teacherMap.set(name, (teacherMap.get(name) || 0) + 1);
          });
          const teacherOptions = Array.from(teacherMap.entries()).map(([name, count]) => ({ name, count }));

          const displayedVideos = selectedTeacherFilter === 'all'
            ? lessonVideos
            : lessonVideos.filter((v) => v.channelTitle === selectedTeacherFilter);

          const teacherSearches = [
            {
              label: '⭐ دروسي على النت',
              query: `دروسي على النت ${currentLesson.title} 4 متوسط`
            },
            {
              label: '🔥 الأستاذ زوطاط يونس',
              query: `الاستاذ زوطاط يونس ${currentLesson.title} 4 متوسط`
            },
            {
              label: '🎓 الاستاذ حمياني للفيزياء',
              query: `الاستاذ حمياني للفيزياء ${currentLesson.title} 4 متوسط`
            },
            {
              label: '📘 الأستاذ دقيش إبراهيم',
              query: `الاستاذ دقيش ابراهيم ${currentLesson.title} 4 متوسط`
            },
            {
              label: '🔍 بحث شامل في YouTube',
              query: `شرح درس ${currentLesson.title} فيزياء 4 متوسط بيام`
            }
          ];

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Info & Filter */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 border border-red-100 dark:border-red-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>شروحات مرئية مقترحة لنخبة من أساتذة المادة ({lessonVideos.length} فيديو)</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      فيديوهات منتقاة بعناية لأساتذة متميزين لشرح هذا الدرس من زوايا متعددة
                    </p>
                  </div>

                  {/* Badge highlight */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-700/50 text-[11px] font-medium text-amber-700 dark:text-amber-300 self-start sm:self-auto shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>تنوع في الشرح والأسلوب</span>
                  </div>
                </div>

                {/* Filter Pills by Teacher */}
                {teacherOptions.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-1 shrink-0 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      الأستاذ:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedTeacherFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                        selectedTeacherFilter === 'all'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      جميع الأساتذة ({lessonVideos.length})
                    </button>
                    {teacherOptions.map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedTeacherFilter(t.name)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                          selectedTeacherFilter === t.name
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {t.name} ({t.count})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Grid */}
              {displayedVideos.length === 0 ? (
                <div className="p-8 text-center text-slate-500 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <Video className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm">لا توجد فيديوهات مطابقة لهذا الفلتر.</p>
                  <button
                    onClick={() => setSelectedTeacherFilter('all')}
                    className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    عرض جميع الفيديوهات
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="space-y-2.5">
                        {/* Thumbnail Container */}
                        <div
                          onClick={() => onPlayVideo(video)}
                          className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 flex items-center justify-center transition-colors">
                            <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-xs rounded text-[10px] font-mono text-white">
                            {video.duration}
                          </div>
                        </div>

                        {/* Teacher & Badge */}
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              video.isTeacherChannel
                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {video.isTeacherChannel ? '⭐ ' : '👨‍🏫 '}
                            {video.channelTitle}
                          </span>

                          {video.views && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Eye className="w-3 h-3" />
                              {video.views}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => onPlayVideo(video)}
                          className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-relaxed hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                        >
                          {video.title}
                        </h4>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onPlayVideo(video)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>تشغيل فوري</span>
                        </button>

                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="فتح مباشرة في YouTube"
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* YouTube Extended Search Tray */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Search className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold">
                    هل تبحث عن شرح إضافي أو أستاذ مفضل لدرس "{currentLesson.title}"؟
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  تصفح فوراً نتائج البحث المجهزة بدقة لشروحات هذا الدرس على YouTube بنقرة واحدة:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {teacherSearches.map((s, idx) => (
                    <a
                      key={idx}
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s.query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600 hover:border-red-300 transition-all text-xs font-medium group"
                    >
                      <span>{s.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-red-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: EXERCISES */}
        {activeLessonTab === 'exercises' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {lessonExercises.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">لا توجد تمارين مخصصة لهذا الدرس حالياً.</p>
              </div>
            ) : (
              lessonExercises.map((ex) => {
                const isRevealed = Boolean(revealedExerciseSolutions[ex.id]);

                return (
                  <div
                    key={ex.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {ex.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                        {ex.difficulty === 'bem' ? 'مستوى BEM' : ex.difficulty}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                      {ex.text}
                    </div>

                    {/* Hints */}
                    {ex.hints.length > 0 && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60">
                        <span className="font-bold">💡 إرشادات الحل: </span>
                        <span>{ex.hints.join(' | ')}</span>
                      </div>
                    )}

                    {/* Reveal Solution Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => toggleSolution(ex.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
                      >
                        {isRevealed ? 'إخفاء الحل النموذجي' : 'عرض الحل النموذجي المفصل'}
                      </button>

                      <button
                        onClick={() => onAskAiAboutLesson(`${currentLesson.title} - تمرين: ${ex.title}`)}
                        className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline"
                      >
                        حل هذا التمرين معي خطوة بخطوة 🤖
                      </button>
                    </div>

                    {/* Detailed Solution Accordion */}
                    {isRevealed && (
                      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs animate-in fade-in duration-150">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                          ✓ الحل النموذجي وفق سلم تنقيط BEM:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">1. المعطيات: </span>
                            {ex.fullSolution.givens.join(', ')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">2. المطلوب: </span>
                            {ex.fullSolution.required.join(', ')}
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">3. القانون والتعويض:</div>
                          <div className="font-mono-formula text-blue-600 dark:text-blue-400 my-1">
                            {ex.fullSolution.formula}
                          </div>
                          <div className="font-mono-formula text-slate-600 dark:text-slate-400">
                            {ex.fullSolution.substitution}
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 font-bold text-emerald-700 dark:text-emerald-300">
                          النتيجة النهائية: {ex.fullSolution.result}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 5: COMMON BEM MISTAKES */}
        {activeLessonTab === 'mistakes' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800/60 space-y-3">
              <h3 className="font-bold text-sm text-red-900 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>احذر من هذه الأخطاء القاتلة في شهادة التعليم المتوسط!</span>
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400">
                هذه النقاط يتم التركيز عليها أثناء تصحيح أوراق BEM الرسمية وتتسبب في ضياع أغلب نقاط التلاميذ:
              </p>

              <div className="space-y-2 pt-1">
                {currentLesson.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                  >
                    <span className="text-red-500 font-bold">❌</span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: ALL LESSONS LIST WITH FIELD FILTERS
  // -------------------------------------------------------------
  return (
    <div id="lessons-list-view" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            دروس العلوم الفيزيائية (4AM)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            المقرر الكامل مقسماً حسب الميادين الأربعة ومواضيع الشهادة
          </p>
        </div>

        {/* Search & Filter inputs */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الدروس..."
              className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 w-44 sm:w-56"
            />
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="p-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">كل المستويات</option>
            <option value="easy">سهل</option>
            <option value="medium">متوسط</option>
            <option value="hard">صعب</option>
          </select>
        </div>
      </div>

      {/* Field Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        <button
          onClick={() => onSelectField('all')}
          className={`px-3.5 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
            !selectedFieldId || selectedFieldId === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          جميع الميادين ({allLessons.length})
        </button>

        {curriculum.map((field) => {
          const isSelected = selectedFieldId === field.id;
          return (
            <button
              key={field.id}
              onClick={() => onSelectField(field.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {field.title}
            </button>
          );
        })}
      </div>

      {/* Lessons Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredLessons.map((lesson) => {
          const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
          const isBookmarked = userProgress.bookmarkedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              onClick={() => onSelectLesson(lesson.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between gap-3 group ${
                isCompleted
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-blue-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {lesson.fieldId === 'electricity' && '⚡ كهرباء'}
                    {lesson.fieldId === 'matter' && '🧪 مادة'}
                    {lesson.fieldId === 'mechanics' && '⚙️ ميكانيك'}
                    {lesson.fieldId === 'optics' && '🔦 ضوء'}
                  </span>

                  <div className="flex items-center gap-1">
                    {isBookmarked && (
                      <BookmarkCheck className="w-4 h-4 text-amber-500 fill-current" />
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>مكتمل</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lesson.title}
                </h3>

                {lesson.frenchTitle && (
                  <div className="text-xs text-slate-400 font-medium">
                    {lesson.frenchTitle}
                  </div>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80 text-slate-500">
                <span>{lesson.concepts.length} مفاهيم • {lesson.formulas.length} قوانين</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  فتح الدرس ←
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
