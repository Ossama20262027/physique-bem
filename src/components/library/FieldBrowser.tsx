import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Layers,
  Zap,
  FlaskConical,
  Cog,
  Eye,
  Video,
  Download,
  FileText,
  FileCheck2,
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { LessonLibraryItem } from '../../types';
import {
  getAllLibraryLessons,
  getLibraryFields,
  getLibrarySubjects,
  searchLibraryLessons,
  isLessonDownloadReal,
  subscribeLibrary
} from '../../data/lessonsLibrary';

interface FieldBrowserProps {
  onSelectLesson: (lesson: LessonLibraryItem) => void;
}

export const FieldBrowser: React.FC<FieldBrowserProps> = ({ onSelectLesson }) => {
  const [, setRerender] = useState(0);

  useEffect(() => {
    return subscribeLibrary(() => setRerender((v) => v + 1));
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [onlyAvailableDownload, setOnlyAvailableDownload] = useState<boolean>(false);

  const fields = getLibraryFields();
  const subjects = getLibrarySubjects();

  // Filter lessons based on search and selected options
  const filteredLessons = useMemo(() => {
    let list = searchLibraryLessons(searchQuery, selectedField, selectedSubject);

    if (onlyAvailableDownload) {
      list = list.filter((l) => isLessonDownloadReal(l.download));
    }

    return list;
  }, [searchQuery, selectedField, selectedSubject, onlyAvailableDownload]);

  // Field stats
  const allLessons = getAllLibraryLessons();
  const totalVideos = allLessons.reduce((acc, l) => acc + l.videos.length, 0);
  const totalDownloads = allLessons.filter((l) => isLessonDownloadReal(l.download)).length;


  const getFieldIcon = (fieldId: string) => {
    switch (fieldId) {
      case 'electricity':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'matter':
        return <FlaskConical className="w-4 h-4 text-emerald-500" />;
      case 'mechanics':
        return <Cog className="w-4 h-4 text-blue-500" />;
      case 'optics':
        return <Eye className="w-4 h-4 text-purple-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const getFieldBadgeStyle = (fieldId: string) => {
    switch (fieldId) {
      case 'electricity':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'matter':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'mechanics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'optics':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white border border-white/30 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>المكتبة الشاملة للجيل الثاني 4AM</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
              5 فيديوهات لكل درس ⭐
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              مكتبة فيديوهات وتحميل دروس الفيزياء (4 متوسط)
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
              تصفح الدروس وفق الميادين الأربعة: لكل درس 5 شروحات فيديو منتقاة لنخبة من أساتذة المادة في الجزائر، مع روابط تحميل ملخصات ونصوص الدروس بصيغتي (PDF / Word) للتحضير لشهادة BEM.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-blue-100 font-medium">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{allLessons.length} درساً مبرمجاً</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-red-400" />
              <span>{totalVideos} فيديو شرح مدمج (5 لكل درس)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-300" />
              <span>{totalDownloads} ملف جاهز للتحميل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search Input & Subject Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن درس باسمه، أستاذ الشرح، أو مفاهيم الدرس..."
              className="w-full pr-10 pl-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subject Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium hidden md:inline">
              المادة:
            </span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field Filter Pills (تصفية حسب الميدان) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <span>تصفية حسب الميدان الدراسي:</span>
            </span>

            {/* Toggle only available downloads */}
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailableDownload}
                onChange={(e) => setOnlyAvailableDownload(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>إظهار الدروس المتاح تحميلها فقط</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {fields.map((f) => {
              const count =
                f.id === 'all'
                  ? allLessons.length
                  : allLessons.filter((l) => l.fieldId === f.id).length;
              const isSelected = selectedField === f.id;

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedField(f.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {getFieldIcon(f.id)}
                  <span>{f.title}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          عرض <strong>{filteredLessons.length}</strong> من أصل {allLessons.length} درساً
          {selectedField !== 'all' && (
            <> في ميدان {fields.find((f) => f.id === selectedField)?.title}</>
          )}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:underline"
          >
            إلغاء البحث
          </button>
        )}
      </div>

      {/* Lessons Cards Grid */}
      {filteredLessons.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            لم يتم العثور على أي درس يطابق البحث
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            تأكد من كتابة اسم الدرس بشكل صحيح أو اختر "جميع الميادين" لعرض كافة الدروس المقررة.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedField('all');
              setSelectedSubject('all');
              setOnlyAvailableDownload(false);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => {
            const hasDownload = isLessonDownloadReal(lesson.download);
            const fileTypeLabel =
              lesson.download.fileType === 'word' ? 'Word' : 'PDF';
            const verifiedCount = lesson.videos.filter((v) => v.isVerified).length;

            return (
              <div
                key={lesson.id}
                id={`library-card-${lesson.id}`}
                onClick={() => onSelectLesson(lesson)}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between gap-3.5 group cursor-pointer"
              >
                <div className="space-y-2.5">
                  {/* Field & Subject Tag */}
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getFieldBadgeStyle(
                        lesson.fieldId
                      )}`}
                    >
                      {lesson.fieldTitle}
                    </span>

                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {lesson.subject}
                    </span>
                  </div>

                  {/* Lesson Title */}
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lesson.title}
                    </h3>
                    {lesson.frenchTitle && (
                      <p
                        className="text-[11px] text-slate-400 font-sans line-clamp-1"
                        dir="ltr"
                      >
                        {lesson.frenchTitle}
                      </p>
                    )}
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>

                  {/* 5-Videos Indicator Strip */}
                  <div className="p-2 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-[11px]">
                      <Video className="w-3.5 h-3.5" />
                      <span>{lesson.videos.length} شروحات فيديو متوفرة</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      {verifiedCount === lesson.videos.length ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                          متحقق منها كلها
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium border border-amber-300 dark:border-amber-800">
                          {verifiedCount}/{lesson.videos.length} متحقق منه
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Download Status Badge */}
                  <div>
                    {hasDownload ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل الدرس متوفر ({fileTypeLabel})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>الملف غير متوفر حاليًا</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    4 متوسط • شهادة BEM
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                    <span>فتح الدرس والفيديوهات</span>
                    <span>←</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
