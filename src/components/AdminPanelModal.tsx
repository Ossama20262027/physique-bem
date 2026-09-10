import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Video,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { dataStore } from '../services/store';
import { YOUTUBE_CONFIG } from '../data/youtubeConfig';
import { FieldId, DifficultyLevel } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

type AdminTab = 'lessons' | 'exercises' | 'quizzes' | 'youtube';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('lessons');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default accessible in prototype
  const [passcode, setPasscode] = useState('');

  // Form states for new lesson
  const [lessonField, setLessonField] = useState<FieldId>('electricity');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonFrenchTitle, setLessonFrenchTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonConcept, setLessonConcept] = useState('');
  const [lessonDifficulty, setLessonDifficulty] = useState<DifficultyLevel>('medium');

  // Form states for new exercise
  const [exField, setExField] = useState<FieldId>('electricity');
  const [exTitle, setExTitle] = useState('');
  const [exText, setExText] = useState('');
  const [exDifficulty, setExDifficulty] = useState<DifficultyLevel>('bem');
  const [exFormula, setExFormula] = useState('');
  const [exSolution, setExSolution] = useState('');

  // Form states for new video
  const [videoTitle, setVideoTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoChannel, setVideoChannel] = useState(YOUTUBE_CONFIG.teacherChannelTitle);
  const [isTeacherChannel, setIsTeacherChannel] = useState(true);
  const [videoLessonId, setVideoLessonId] = useState('elec-1-1');

  // Channel ID state
  const [channelIdSetting, setChannelIdSetting] = useState(YOUTUBE_CONFIG.teacherChannelId);
  const [channelSavedMsg, setChannelSavedMsg] = useState(false);

  if (!isOpen) return null;

  const curriculum = dataStore.getCurriculum();
  const allLessons = dataStore.getAllLessons();
  const allExercises = dataStore.getExercises();
  const allVideos = dataStore.getVideos();

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    dataStore.addLesson(lessonField, 'u-general', {
      unitId: 'u-general',
      fieldId: lessonField,
      order: allLessons.length + 1,
      title: lessonTitle,
      frenchTitle: lessonFrenchTitle,
      description: lessonDescription || 'درس جديد مضاف من لوحة تحكم الأستاذ.',
      objectives: ['استيعاب المفاهيم الأساسية للدرس وتطبيقها في BEM.'],
      concepts: [{ title: 'مفاهيم أساسية', content: lessonConcept || 'محتوى الدرس.' }],
      formulas: [],
      commonMistakes: ['الانتباه للدقة في التعويض بالوحدات الدولية.'],
      importantNotes: ['ملاحظة الأستاذ: ركز على الربط بين الفهم النظري والتجربة المخبرية.'],
      youtubeKeywords: [lessonTitle, 'فيزياء 4 متوسط'],
      difficulty: lessonDifficulty
    });

    setLessonTitle('');
    setLessonFrenchTitle('');
    setLessonDescription('');
    setLessonConcept('');
    onDataChanged();
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exTitle.trim() || !exText.trim()) return;

    dataStore.addExercise({
      lessonId: allLessons[0]?.id || 'elec-1-1',
      fieldId: exField,
      title: exTitle,
      difficulty: exDifficulty,
      text: exText,
      hints: ['ابدأ بتحديد المعطيات والمقدار المطلوب حسابه.'],
      expectedFormulas: [exFormula || 'P = m × g'],
      points: 20,
      fullSolution: {
        givens: ['المعطيات المذكورة في نص المسألة'],
        required: ['المطلوب إيجاده في السؤال'],
        formula: exFormula || 'القانون المناسب',
        substitution: 'التعويض العددي في القانون',
        calculation: 'العمليات الحسابية',
        result: exSolution || 'النتيجة النهائية',
        unit: 'الوحدة الدولية (SI)',
        verification: 'التحقق المنطقي من صحة النتيجة'
      }
    });

    setExTitle('');
    setExText('');
    setExFormula('');
    setExSolution('');
    onDataChanged();
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoId.trim()) return;

    // clean youtube ID if user pasted full URL
    let cleanId = videoId.trim();
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1]?.split('&')[0] || cleanId;
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1]?.split('?')[0] || cleanId;
    }

    dataStore.addVideo({
      lessonId: videoLessonId,
      title: videoTitle,
      channelTitle: videoChannel,
      isTeacherChannel,
      videoId: cleanId,
      duration: 'شرح فيديو',
      thumbnail: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
      views: 'جديد'
    });

    setVideoTitle('');
    setVideoId('');
    onDataChanged();
  };

  const handleSaveChannelId = () => {
    YOUTUBE_CONFIG.teacherChannelId = channelIdSetting;
    setChannelSavedMsg(true);
    setTimeout(() => setChannelSavedMsg(false), 2500);
  };

  return (
    <div
      id="admin-panel-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="admin-panel-container"
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight">لوحة تحكم الأستاذ</h2>
              <p className="text-[11px] text-purple-200">إدارة الدروس، التمارين، الفيديوهات وقناة YouTube</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'lessons'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>إدارة الدروس ({allLessons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'exercises'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>إدارة التمارين ({allExercises.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'youtube'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>إدارة YouTube والقناة</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* LESSONS MANAGEMENT */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              {/* Add New Lesson Form */}
              <form
                onSubmit={handleAddLesson}
                className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase">
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>إضافة درس جديد إلى المنهاج</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">الميدان</label>
                    <select
                      value={lessonField}
                      onChange={(e) => setLessonField(e.target.value as FieldId)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="electricity">الظواهر الكهربائية</option>
                      <option value="matter">المادة وتحولاتها</option>
                      <option value="mechanics">الظواهر الميكانيكية</option>
                      <option value="optics">الظواهر الضوئية</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">عنوان الدرس (بالعربية)</label>
                    <input
                      type="text"
                      required
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="مثال: خصائص التوتر الكهربائي"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">العنوان بالفرنسية</label>
                    <input
                      type="text"
                      value={lessonFrenchTitle}
                      onChange={(e) => setLessonFrenchTitle(e.target.value)}
                      placeholder="Ex: Tension alternative"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">محتوى والشرح الأساسي</label>
                  <textarea
                    rows={2}
                    value={lessonConcept}
                    onChange={(e) => setLessonConcept(e.target.value)}
                    placeholder="شرح المفاهيم والقواعد..."
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    حفظ ونشر الدرس
                  </button>
                </div>
              </form>

              {/* Current Lessons List */}
              <div>
                <div className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">
                  الدروس المسجلة حالياً ({allLessons.length})
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allLessons.map((l) => (
                    <div
                      key={l.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{l.title}</div>
                        <div className="text-[11px] text-slate-500">{l.fieldId} - {l.difficulty}</div>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف درس: ${l.title}؟`)) {
                            dataStore.deleteLesson(l.id);
                            onDataChanged();
                          }
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                        title="حذف الدرس"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EXERCISES MANAGEMENT */}
          {activeTab === 'exercises' && (
            <div className="space-y-6">
              {/* Add New Exercise Form */}
              <form
                onSubmit={handleAddExercise}
                className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs uppercase">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>إضافة تمرين جديد مع الحل النموذجي</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">الميدان</label>
                    <select
                      value={exField}
                      onChange={(e) => setExField(e.target.value as FieldId)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="electricity">الظواهر الكهربائية</option>
                      <option value="matter">المادة وتحولاتها</option>
                      <option value="mechanics">الظواهر الميكانيكية</option>
                      <option value="optics">الظواهر الضوئية</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">المستوى</label>
                    <select
                      value={exDifficulty}
                      onChange={(e) => setExDifficulty(e.target.value as DifficultyLevel)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="easy">سهل</option>
                      <option value="medium">متوسط</option>
                      <option value="hard">صعب</option>
                      <option value="bem">مستوى BEM شهادة</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">عنوان التمرين</label>
                    <input
                      type="text"
                      required
                      value={exTitle}
                      onChange={(e) => setExTitle(e.target.value)}
                      placeholder="مثال: مسألة دافعة أرخميدس وطفو الأجسام"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">نص المسألة أو التمرين</label>
                  <textarea
                    rows={3}
                    required
                    value={exText}
                    onChange={(e) => setExText(e.target.value)}
                    placeholder="اكتب نص التمرين هنا مع المعطيات الرقمية..."
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">القانون المتوقع</label>
                    <input
                      type="text"
                      value={exFormula}
                      onChange={(e) => setExFormula(e.target.value)}
                      placeholder="مثال: P = m × g"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">الحل النموذجي والنتيجة</label>
                    <input
                      type="text"
                      value={exSolution}
                      onChange={(e) => setExSolution(e.target.value)}
                      placeholder="مثال: Fa = 1.5 N بعد التعويض"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    إضافة التمرين لبنك التمارين
                  </button>
                </div>
              </form>

              {/* Current Exercises List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allExercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{ex.title}</div>
                      <div className="text-[11px] text-slate-500">{ex.fieldId} - صعوبة: {ex.difficulty}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`حذف تمرين: ${ex.title}؟`)) {
                          dataStore.deleteExercise(ex.id);
                          onDataChanged();
                        }
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YOUTUBE SETTINGS & VIDEO MANAGEMENT */}
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              {/* Channel ID setting */}
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white text-xs uppercase flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-500" />
                  <span>تعديل معرف قناة YouTube الرسمية للأستاذ</span>
                </div>
                <p className="text-xs text-slate-500">
                  فيديوهات هذه القناة تظهر دائماً في المرتبة الأولى للتلميذ تحت وسم "⭐ شرح الأستاذ: دروسي على النت".
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={channelIdSetting}
                    onChange={(e) => setChannelIdSetting(e.target.value)}
                    placeholder="أدخل Channel ID للقناة..."
                    className="flex-1 p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <button
                    onClick={handleSaveChannelId}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                  >
                    حفظ المعرّف
                  </button>
                </div>
                {channelSavedMsg && (
                  <div className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم حفظ إعدادات القناة بنجاح!</span>
                  </div>
                )}
              </div>

              {/* Add Custom Video */}
              <form
                onSubmit={handleAddVideo}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase">
                  ربط فيديو YouTube جديد بدرس محدد
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">الدرس المرتبط</label>
                    <select
                      value={videoLessonId}
                      onChange={(e) => setVideoLessonId(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      {allLessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">عنوان الفيديو</label>
                    <input
                      type="text"
                      required
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="مثال: شرح التيار المتناوب بالتفصيل"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">معرف أو رابط الفيديو (Video ID or URL)</label>
                    <input
                      type="text"
                      required
                      value={videoId}
                      onChange={(e) => setVideoId(e.target.value)}
                      placeholder="مثال: wYk3_Qj2f14 أو رابط كامل"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">اسم القناة</label>
                    <input
                      type="text"
                      value={videoChannel}
                      onChange={(e) => setVideoChannel(e.target.value)}
                      placeholder="دروسي على النت"
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isTeacherCheck"
                    checked={isTeacherChannel}
                    onChange={(e) => setIsTeacherChannel(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  <label htmlFor="isTeacherCheck" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    تثبيت كـ "⭐ شرح الأستاذ (دروسي على النت)" بأعلى الأولوية
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                  >
                    حفظ وربط الفيديو
                  </button>
                </div>
              </form>

              {/* Videos list */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allVideos.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={v.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{v.title}</div>
                        <div className="text-[10px] text-slate-400">{v.channelTitle} {v.isTeacherChannel && '⭐'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        dataStore.deleteVideo(v.id);
                        onDataChanged();
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
