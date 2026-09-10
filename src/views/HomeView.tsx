import React from 'react';
import {
  Zap,
  FlaskConical,
  Cog,
  Flashlight,
  Camera,
  Trophy,
  Binary,
  CalendarDays,
  Play,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Flame,
  HelpCircle,
  Video,
  Users,
  Download,
  FileText
} from 'lucide-react';
import { Field, UserProgress, VideoItem, Lesson } from '../types';
import { TabType } from '../components/BottomNav';
import { dataStore } from '../services/store';

interface HomeViewProps {
  curriculum: Field[];
  userProgress: UserProgress;
  onNavigateTab: (tab: TabType) => void;
  onSelectLesson: (lessonId: string) => void;
  onSelectField: (fieldId: string) => void;
  onPlayVideo: (video: VideoItem) => void;
  featuredTeacherVideo?: VideoItem;
}

const FIELD_ICONS: Record<string, React.ReactNode> = {
  electricity: <Zap className="w-6 h-6 text-amber-500" />,
  matter: <FlaskConical className="w-6 h-6 text-cyan-500" />,
  mechanics: <Cog className="w-6 h-6 text-purple-500" />,
  optics: <Flashlight className="w-6 h-6 text-emerald-500" />
};

export const HomeView: React.FC<HomeViewProps> = ({
  curriculum,
  userProgress,
  onNavigateTab,
  onSelectLesson,
  onSelectField,
  onPlayVideo,
  featuredTeacherVideo
}) => {
  // Find last viewed or recommended lesson
  const allLessons = curriculum.flatMap((f) => f.units.flatMap((u) => u.lessons));
  const continueLesson = allLessons.find(
    (l) => !userProgress.completedLessonIds.includes(l.id)
  ) || allLessons[0];

  return (
    <div id="home-view" className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome & Motivation Banner */}
      <section
        id="home-hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl"
      >
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>طريقك نحو العلامة 20/20 في شهادة BEM بإذن الله</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            مرحباً بك يا {userProgress.name} 👋
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            منهاج العلوم الفيزيائية والتكنولوجيا للسنة الرابعة متوسط منظم بالكامل، مع شروحات "دروسي على النت"، وبنك التمارين المحلولة، والأستاذ الذكي لمساعدتك على مدار الساعة.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="home-btn-continue"
              onClick={() => onSelectLesson(continueLesson.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>تابع التعلم: {continueLesson.title}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              id="home-btn-ask-ai"
              onClick={() => onNavigateTab('ai')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>صوّر تمرينك 📸</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Quick Action Shortcuts */}
      <section id="home-shortcuts" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigateTab('ai')}
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-700 flex flex-col items-start gap-2.5 text-right transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">صوّر تمرينك</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تحليل وتفكيك بالذكاء الاصطناعي</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('quiz')}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-200/80 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 flex flex-col items-start gap-2.5 text-right transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">كويز BEM التفاعلي</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تقييم /20 مع نصائح الأستاذ</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('formulas')}
          className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-200/80 dark:border-cyan-900/50 hover:border-cyan-400 dark:hover:border-cyan-700 flex flex-col items-start gap-2.5 text-right transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">بطاقات القوانين</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">كل العلاقات والوحدات الدولية</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('planner')}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-700 flex flex-col items-start gap-2.5 text-right transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">خطتي الذكية</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">جدول زمني منظم للمراجعة</div>
          </div>
        </button>
      </section>

      {/* NEW: 5-Video Lessons & Download Library Banner */}
      <section
        id="home-video-library-banner"
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5"
      >
        <div className="space-y-2 max-w-xl text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white border border-white/30">
            <Video className="w-3.5 h-3.5" />
            <span>جديد: مكتبة الفيديوهات والتحميل (BEM 2025)</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black">
            5 شروحات فيديو لكل درس + تحميل ملخصات (PDF/Word)
          </h2>
          <p className="text-xs sm:text-sm text-red-50 leading-relaxed">
            لكل درس في المنهاج 5 شروحات فيديو لأساتذة جزائريين مع مشغل مدمج في التطبيق، بالإضافة لروابط تحميل مباشرة للدروس.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('library')}
          className="px-6 py-3 rounded-2xl bg-white text-red-600 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-red-50 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Video className="w-4 h-4 text-red-600" />
          <span>تصفح مكتبة الفيديوهات الآن</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </section>

      {/* Featured Teacher Video ("شرح الأستاذ: دروسي على النت") */}
      {featuredTeacherVideo && (
        <section
          id="home-featured-teacher-video"
          className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <span>⭐ شرح الأستاذ الموصى به</span>
                <span>•</span>
                <span>دروسي على النت</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">{featuredTeacherVideo.title}</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                شرح فيديو مركز ومبسط يقدم لك أهم النقاط المنهجية والأخطاء التي يقع فيها أغلب التلاميذ في شهادة BEM.
              </p>
            </div>

            <div
              onClick={() => onPlayVideo(featuredTeacherVideo)}
              className="relative w-full md:w-72 aspect-video rounded-2xl overflow-hidden cursor-pointer group shrink-0 border border-slate-700 shadow-md"
            >
              <img
                src={featuredTeacherVideo.thumbnail}
                alt={featuredTeacherVideo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[11px] font-mono text-white">
                {featuredTeacherVideo.duration}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The 4 Core Fields Grid */}
      <section id="home-curriculum-fields" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              ميادين المنهاج الجزائري الأربعة
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              جميع الوحدات والدروس المقررة في العلوم الفيزيائية والتكنولوجيا
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('lessons')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>عرض جميع الدروس</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {curriculum.map((field) => {
            const fieldLessons = field.units.flatMap((u) => u.lessons);
            const completedCount = fieldLessons.filter((l) =>
              userProgress.completedLessonIds.includes(l.id)
            ).length;
            const percent = Math.round((completedCount / (fieldLessons.length || 1)) * 100);

            return (
              <div
                key={field.id}
                id={`field-card-${field.id}`}
                onClick={() => {
                  onSelectField(field.id);
                  onNavigateTab('lessons');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-md cursor-pointer space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/60 dark:border-slate-600/60 group-hover:scale-105 transition-transform">
                      {FIELD_ICONS[field.id] || <Zap className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {field.title}
                      </h3>
                      <div className="text-xs text-slate-400 font-medium">
                        {field.frenchTitle}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${field.badgeColor}`}>
                    {fieldLessons.length} دروس
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {field.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>نسبة الإنجاز</span>
                    <span>{percent}% ({completedCount}/{fieldLessons.length})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Multi-Teacher Showcase */}
      <section id="home-teachers-showcase" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <span>مختارات مرئية لنخبة أساتذة BEM</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              شروحات منتقاة من قنوات دروسي على النت، الأستاذ زوطاط، حمياني وغيرهم لجميع الدروس
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('lessons')}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>شاهد كل الفيديوهات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {dataStore.getVideos().slice(0, 4).map((video) => (
            <div
              key={video.id}
              onClick={() => onPlayVideo(video)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                    <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-white">
                    {video.duration}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span>{video.isTeacherChannel ? '⭐ دروسي على النت' : `👨‍🏫 ${video.channelTitle}`}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {video.title}
                </h4>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-red-600 dark:text-red-400 font-semibold">
                <span>مشاهدة الشرح الآن</span>
                <Play className="w-3 h-3 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
