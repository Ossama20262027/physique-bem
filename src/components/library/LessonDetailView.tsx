import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Download,
  FileText,
  Video,
  Play,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Printer,
  Sparkles,
  Users,
  Eye,
  BookOpen
} from 'lucide-react';
import { LessonLibraryItem, LessonVideoItem } from '../../types';

interface LessonDetailViewProps {
  lesson: LessonLibraryItem;
  onBack: () => void;
  onOpenAiTutor?: (lessonTitle: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  onBack,
  onOpenAiTutor
}) => {
  // Currently active video in embedded player (defaults to first video)
  const [activeVideo, setActiveVideo] = useState<LessonVideoItem>(lesson.videos[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    // Reset active video when lesson changes
    if (lesson.videos.length > 0) {
      setActiveVideo(lesson.videos[0]);
      setIsPlaying(false);
    }
  }, [lesson]);

  const handleDownloadClick = (url?: string, fileName?: string) => {
    if (!url) return;
    
    // Open in new tab or trigger download
    window.open(url, '_blank', 'noopener,noreferrer');
    setDownloadSuccessToast(`جارٍ بدء تحميل: ${fileName || 'ملف الدرس'}`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const hasDownloadFile = Boolean(
    lesson.download.isAvailable && (lesson.download.pdfUrl || lesson.download.wordUrl)
  );

  const downloadUrl = lesson.download.pdfUrl || lesson.download.wordUrl || '';
  const fileTypeLabel = lesson.download.fileType === 'word' ? 'Word (.docx)' : 'PDF (.pdf)';

  return (
    <div className="space-y-6 animate-in fade-in duration-200" dir="rtl">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى مكتبة الدروس</span>
        </button>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto">
          <span>{lesson.fieldTitle}</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{lesson.subject}</span>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[180px] sm:max-w-none">
            {lesson.title}
          </span>
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              {lesson.fieldTitle}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              {lesson.subject}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 text-xs">
              4 متوسط (BEM)
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {lesson.title}
            </h1>
            {lesson.frenchTitle && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans" dir="ltr">
                {lesson.frenchTitle}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
            {lesson.description}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {onOpenAiTutor && (
              <button
                type="button"
                onClick={() => onOpenAiTutor(lesson.title)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>سؤال الأستاذ الذكي عن الدرس</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintSummary}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة / حفظ ملخص الدرس</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: DOWNLOAD LESSON (PDF / Word) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                تحميل درس الفيزياء (PDF / Word)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ملخصات ونصوص الدروس المعتمدة وفق منهاج الجيل الثاني لتحضير شهادة التعليم المتوسط
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Download State: Available vs Not Available */}
        {hasDownloadFile ? (
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {lesson.download.fileName || `درس ${lesson.title}`}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                    صيغة {fileTypeLabel}
                  </span>
                  {lesson.download.fileSize && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      الحجم: {lesson.download.fileSize}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  ملف جاهز للمراجعة والطباعة يحتوي على المفاهيم، القوانين الفيزيائية ونماذج BEM
                </p>
              </div>
            </div>

            {/* Active Download Button */}
            <button
              type="button"
              onClick={() => handleDownloadClick(downloadUrl, lesson.download.fileName)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الدرس ({fileTypeLabel})</span>
            </button>
          </div>
        ) : (
          /* "غير متوفر حاليًا" State - Requirement #2 */
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300">
                    ملف تحميل الدرس: غير متوفر حاليًا
                  </span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  جاري إعداد وتدقيق ملف الـ PDF المعتمد لهذا الدرس من طرف أساتذة الفيزياء. يمكنك الاستفادة من الشروحات المرئية أدناه أو طباعة الملخص الفوري.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrintSummary}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors border border-amber-300 dark:border-amber-700/60 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة ملخص الدرس كبديل</span>
            </button>
          </div>
        )}

        {downloadSuccessToast && (
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}
      </div>

      {/* SECTION 2: IN-APP YOUTUBE EMBED PLAYER */}
      {activeVideo && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-400">مشغّل يوتيوب المدمج داخل التطبيق</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {activeVideo.teacherName}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-xl">
                  {activeVideo.title || `شرح ${lesson.title}`}
                </h3>
              </div>
            </div>

            <a
              href={activeVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 self-start sm:self-auto"
            >
              <span>مشاهدة على YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 16:9 Responsive Embed Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&playsinline=1&rel=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Playing Video Details Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                الأستاذ: <strong className="text-white">{activeVideo.teacherName}</strong>
              </span>
              <span>•</span>
              <span>القناة: {activeVideo.channelName}</span>
              {activeVideo.duration && (
                <>
                  <span>•</span>
                  <span>المدة: {activeVideo.duration}</span>
                </>
              )}
            </div>

            <div className="text-[11px] text-slate-500">
              يمكنك التبديل بين الأساتذة الخمسة بالضغط على أي بطاقة أدناه
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: THE 5 VIDEO CARDS (مكتبة فيديوهات الدرس - 5 فيديوهات لكل درس) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-600" />
              <span>مكتبة شروحات الفيديو المقترحة (5 فيديوهات لأساتذة متنوعين)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر الأستاذ والأسلوب الأنسب لك لفهم الدرس من زوايا متعددة
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 self-start sm:self-auto">
            {lesson.videos.length} شروحات متوفرة
          </span>
        </div>

        {/* The 5 Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lesson.videos.map((video, index) => {
            const isCurrent = activeVideo.id === video.id;

            return (
              <div
                key={video.id || index}
                id={`video-card-${video.id}`}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 group bg-white dark:bg-slate-900 ${
                  isCurrent
                    ? 'border-red-500 ring-2 ring-red-500/20 shadow-md bg-red-50/20 dark:bg-red-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-600 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Video Thumbnail Container */}
                  <div
                    onClick={() => {
                      setActiveVideo(video);
                      setIsPlaying(true);
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                    className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer group/thumb"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                    />

                    {/* Dark overlay with Play button */}
                    <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/15 flex items-center justify-center transition-colors">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-110 ${
                          isCurrent ? 'bg-red-600 text-white' : 'bg-white/90 text-red-600'
                        }`}
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-xs rounded text-[10px] font-mono text-white">
                        {video.duration}
                      </div>
                    )}

                    {/* Video Number Pill */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white rounded-md text-[10px] font-bold">
                      فيديو {index + 1}
                    </div>

                    {isCurrent && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>يشتغل الآن</span>
                      </div>
                    )}
                  </div>

                  {/* Teacher & Channel Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <span>👨‍🏫</span>
                        <span>{video.teacherName}</span>
                      </span>

                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                        📺 {video.channelName}
                      </span>
                    </div>

                    {/* Video Title */}
                    <h4
                      onClick={() => {
                        setActiveVideo(video);
                        setIsPlaying(true);
                        window.scrollTo({ top: 320, behavior: 'smooth' });
                      }}
                      className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors leading-relaxed"
                    >
                      {video.title || `شرح درس ${lesson.title} - الأستاذ ${video.teacherName}`}
                    </h4>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideo(video);
                      setIsPlaying(true);
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCurrent ? 'معروض الآن' : 'مشاهدة في المشغل'}</span>
                  </button>

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="فتح الرابط في YouTube"
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: LESSON CONCEPTS & SUMMARY FOR PRINTING/STUDY */}
      {lesson.concepts && lesson.concepts.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>المفاهيم العلمية الأساسية للدرس</span>
            </h3>
            <button
              type="button"
              onClick={handlePrintSummary}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الملخص</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {lesson.concepts.map((concept, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5"
              >
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px]">
                    {i + 1}
                  </span>
                  <span>{concept.title}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {concept.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
