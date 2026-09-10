import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  FileCheck2,
  Video,
  CheckCircle2,
  KeyRound,
  Download,
  ExternalLink,
  Clock,
  AlertCircle,
  Check,
  Search,
  Filter,
  LogOut,
  Save,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { dataStore } from '../services/store';
import { YOUTUBE_CONFIG } from '../data/youtubeConfig';
import { FieldId, DifficultyLevel, LessonLibraryItem } from '../types';
import {
  getAllLibraryLessons,
  getLibraryLessonById,
  updateLessonDownload,
  toggleVideoVerification,
  setVideoVerification,
  isLessonDownloadReal,
  subscribeLibrary,
  getLibraryFields
} from '../data/lessonsLibrary';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

type AdminTab = 'library' | 'lessons' | 'exercises' | 'youtube';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('library');

  // Authentication State - Verified against server /api/admin/verify
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('physique_4am_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Library tab states
  const [, setLibraryRefresh] = useState(0);
  useEffect(() => {
    return subscribeLibrary(() => setLibraryRefresh((c) => c + 1));
  }, []);

  const libraryLessons = getAllLibraryLessons();
  const [selectedLibraryField, setSelectedLibraryField] = useState<string>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => libraryLessons[0]?.id || 'elec-1-1');

  // Selected lesson to manage download & videos
  const activeLibraryLesson = useMemo(() => {
    return getLibraryLessonById(selectedLessonId) || libraryLessons[0];
  }, [selectedLessonId, libraryLessons]);

  // Download Form states for selected lesson
  const [editFileType, setEditFileType] = useState<'pdf' | 'word'>('pdf');
  const [editDownloadUrl, setEditDownloadUrl] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editFileSize, setEditFileSize] = useState('');
  const [editIsAvailable, setEditIsAvailable] = useState(false);
  const [downloadSavedToast, setDownloadSavedToast] = useState(false);
  const [videoActionToast, setVideoActionToast] = useState<string | null>(null);

  // Sync form when active library lesson changes
  useEffect(() => {
    if (activeLibraryLesson) {
      const d = activeLibraryLesson.download;
      const url = d.pdfUrl || d.wordUrl || '';
      setEditFileType(d.fileType === 'word' ? 'word' : 'pdf');
      setEditDownloadUrl(url);
      setEditFileName(d.fileName || `ملخص درس ${activeLibraryLesson.title}.${d.fileType === 'word' ? 'docx' : 'pdf'}`);
      setEditFileSize(d.fileSize || '1.5 MB');
      setEditIsAvailable(Boolean(d.isAvailable && !url.includes('example.com') && url.trim() !== ''));
    }
  }, [activeLibraryLesson?.id]);

  // Form states for new lesson (Curriculum)
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
  const libraryFields = getLibraryFields();

  // Handle Passcode Verification with server
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('يرجى إدخال كلمة مرور لوحة التحكم.');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('physique_4am_admin_auth', 'true');
        setPasscode('');
        setAuthError('');
      } else {
        setAuthError(result.error || 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Passcode verification failed:', error);
      setAuthError('تعذر الاتصال بالخادم للتحقق من كلمة المرور. تأكد من تشغيل الخادم.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('physique_4am_admin_auth');
    setPasscode('');
    setAuthError('');
  };

  // Filter library lessons for selection
  const filteredLibraryLessons = libraryLessons.filter((l) => {
    if (selectedLibraryField !== 'all' && l.fieldId !== selectedLibraryField) return false;
    if (!librarySearchQuery.trim()) return true;
    const q = librarySearchQuery.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.fieldTitle.toLowerCase().includes(q);
  });

  // Save download info for the active lesson
  const handleSaveDownloadInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLibraryLesson) return;

    const trimmedUrl = editDownloadUrl.trim();
    const containsExample = trimmedUrl.includes('example.com');
    const isActuallyAvailable = Boolean(editIsAvailable && trimmedUrl !== '' && !containsExample);

    updateLessonDownload(activeLibraryLesson.id, {
      fileType: editFileType,
      pdfUrl: editFileType === 'pdf' ? trimmedUrl : '',
      wordUrl: editFileType === 'word' ? trimmedUrl : '',
      fileName: editFileName.trim() || `ملخص درس ${activeLibraryLesson.title}.${editFileType === 'word' ? 'docx' : 'pdf'}`,
      fileSize: editFileSize.trim() || '1.5 MB',
      isAvailable: isActuallyAvailable,
    });

    onDataChanged();
    setDownloadSavedToast(true);
    setTimeout(() => setDownloadSavedToast(false), 3000);
  };

  // Toggle video verification
  const handleToggleVideoVerification = (vidId: string) => {
    if (!activeLibraryLesson) return;
    const newStatus = toggleVideoVerification(activeLibraryLesson.id, vidId);
    onDataChanged();
    setVideoActionToast(newStatus ? 'تم تأكيد صحة الفيديو بنجاح!' : 'تمت إعادة الفيديو إلى وضع قيد المراجعة.');
    setTimeout(() => setVideoActionToast(null), 3000);
  };

  // Verify all 5 videos at once for this lesson
  const handleVerifyAllVideos = () => {
    if (!activeLibraryLesson) return;
    activeLibraryLesson.videos.forEach((v) => {
      setVideoVerification(activeLibraryLesson.id, v.id, true);
    });
    onDataChanged();
    setVideoActionToast('تم تأكيد جميع فيديوهات هذا الدرس بنجاح (5/5)!');
    setTimeout(() => setVideoActionToast(null), 3000);
  };

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
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      dir="rtl"
    >
      <div
        id="admin-panel-container"
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg leading-tight">لوحة تحكم الأستاذ والمشرف</h2>
                {isAuthenticated ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>متحقق من الهوية</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-300" />
                    <span>محمي بكلمة مرور</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-purple-200 mt-0.5">
                إدارة روابط التحميل الحقيقية (PDF/Word)، التحقق من فيديوهات الدروس، وتعديل المنهاج
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                title="تسجيل الخروج وقفل اللوحة"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">قفل اللوحة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY GATE: If NOT authenticated, show ONLY Passcode verification prompt */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-inner border border-purple-200 dark:border-purple-800">
              <KeyRound className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                تأكيد هوية الأستاذ / المشرف التربوي
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                لوحة التحكم الإدارية محمية لضمان سلامة الدروس ومطابقة المحتوى. يرجى إدخال كلمة المرور للوصول إلى تعديل روابط التحميل ومراجعة الفيديوهات.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="أدخل كلمة مرور الإدارة..."
                  autoFocus
                  disabled={isVerifying}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-slate-400 font-mono text-center tracking-widest"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2 text-right animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري التحقق من الخادم...</span>
                    </span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>دخول للوحة التحكم</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* FULL AUTHENTICATED ADMIN CONTENT */
          <>
            {/* Tab Selection */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'library'
                    ? 'border-purple-600 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>مكتبة الدروس والتحقق (PDF / فيديوهات)</span>
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'lessons'
                    ? 'border-purple-600 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>إدارة الدروس الأساسية ({allLessons.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('exercises')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'exercises'
                    ? 'border-purple-600 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>إدارة التمارين ({allExercises.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'youtube'
                    ? 'border-purple-600 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4 text-red-500" />
                <span>إدارة YouTube والقناة</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* TAB 1: LIBRARY LESSONS (PDF/Word URLs & 5-Video Verification) */}
              {activeTab === 'library' && (
                <div className="space-y-6">
                  {/* Select Lesson Strip */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>اختر الدرس المراد إدخال رابط تحميله ومراجعة فيديوهاته ({libraryLessons.length} درس متوفر):</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">الميدان:</label>
                        <select
                          value={selectedLibraryField}
                          onChange={(e) => setSelectedLibraryField(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        >
                          {libraryFields.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">الدرس المحدد:</label>
                        <select
                          value={selectedLessonId}
                          onChange={(e) => setSelectedLessonId(e.target.value)}
                          className="w-full p-2 text-xs font-semibold rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-900 dark:text-purple-200 focus:ring-2 focus:ring-purple-500"
                        >
                          {filteredLibraryLessons.map((lesson) => {
                            const isReal = isLessonDownloadReal(lesson.download);
                            const verifiedCount = lesson.videos.filter((v) => v.isVerified).length;
                            return (
                              <option key={lesson.id} value={lesson.id}>
                                {lesson.title} ({lesson.fieldTitle}) - [{isReal ? '✅ تحميل متوفر' : '⚠️ تحميل غير متوفر'}] - [فيديوهات: {verifiedCount}/5 مؤكد]
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {activeLibraryLesson && (
                    <div className="space-y-6">
                      {/* Active Lesson Overview Strip */}
                      <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                              {activeLibraryLesson.fieldTitle}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {activeLibraryLesson.subject}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                            {activeLibraryLesson.title}
                          </h3>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          {isLessonDownloadReal(activeLibraryLesson.download) ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>رابط التحميل متوفر</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>التحميل: غير متوفر حاليًا</span>
                            </span>
                          )}

                          <span className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                            الفيديوهات المؤكدة: {activeLibraryLesson.videos.filter((v) => v.isVerified).length}/5
                          </span>
                        </div>
                      </div>

                      {/* SECTION A: EDIT REAL DOWNLOAD URL (PDF / Word) */}
                      <form
                        onSubmit={handleSaveDownloadInfo}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              إدخال رابط التحميل الحقيقي لملف الدرس (PDF / Word)
                            </h4>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            تحديث فوري ينعكس مباشرة للتلاميذ
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                              صيغة الملف:
                            </label>
                            <select
                              value={editFileType}
                              onChange={(e) => setEditFileType(e.target.value as 'pdf' | 'word')}
                              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                              <option value="pdf">ملف PDF (.pdf)</option>
                              <option value="word">ملف Word (.docx)</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                              رابط التحميل المباشر الحقيقي (Google Drive / رابط مباشر / موقع):
                            </label>
                            <input
                              type="url"
                              value={editDownloadUrl}
                              onChange={(e) => {
                                setEditDownloadUrl(e.target.value);
                                if (!editIsAvailable && e.target.value.trim() && !e.target.value.includes('example.com')) {
                                  setEditIsAvailable(true);
                                }
                              }}
                              placeholder="مثال: https://drive.google.com/uc?id=... أو https://site.dz/lesson.pdf"
                              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                              اسم الملف الظاهر للتلميذ:
                            </label>
                            <input
                              type="text"
                              value={editFileName}
                              onChange={(e) => setEditFileName(e.target.value)}
                              placeholder={`ملخص درس ${activeLibraryLesson.title}.pdf`}
                              className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                              حجم الملف التقريبي:
                            </label>
                            <input
                              type="text"
                              value={editFileSize}
                              onChange={(e) => setEditFileSize(e.target.value)}
                              placeholder="مثال: 1.8 MB"
                              className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Availability Checkbox & Rule Note */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="editIsAvailableCheck"
                              checked={editIsAvailable}
                              onChange={(e) => setEditIsAvailable(e.target.checked)}
                              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="editIsAvailableCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                              تفعيل زر التحميل لهذا الدرس
                            </label>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            💡 <strong>قاعدة الأمان:</strong> إذا كان الرابط فارغاً أو يحتوي على <code className="text-red-500 font-mono">example.com</code>، فسيتم اعتباره تلقائياً غير متوفر، وسيظهر للتلميذ بوضوح نص <strong>"الملف غير متوفر حاليًا"</strong> دون أزرار معطّلة.
                          </p>
                        </div>

                        {/* Save Download URL Action */}
                        <div className="flex items-center justify-between pt-2">
                          {downloadSavedToast ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تم حفظ وتحديث رابط التحميل بنجاح!</span>
                            </span>
                          ) : (
                            <span />
                          )}

                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>حفظ رابط تحميل هذا الدرس</span>
                          </button>
                        </div>
                      </form>

                      {/* SECTION B: VERIFY 5 VIDEOS FOR THIS LESSON */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <Video className="w-5 h-5 text-red-600" />
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                مراجعة وتأكيد صحة الفيديوهات الـ 5 لهذا الدرس
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              الفيديوهات التي لم تُؤكّد بعد تظهر للتلميذ مع شارة <strong>"قيد المراجعة"</strong>. اضغط على زر "تأكيد صحة الفيديو" لاعتماده.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleVerifyAllVideos}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تأكيد جميع الفيديوهات الـ 5 دفعة واحدة</span>
                          </button>
                        </div>

                        {videoActionToast && (
                          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{videoActionToast}</span>
                          </div>
                        )}

                        {/* List of the 5 videos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {activeLibraryLesson.videos.map((video, idx) => {
                            return (
                              <div
                                key={video.id || idx}
                                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                  video.isVerified
                                    ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-800/60'
                                    : 'bg-amber-50/30 dark:bg-amber-950/15 border-amber-200 dark:border-amber-800/60'
                                }`}
                              >
                                <div className="space-y-2">
                                  {/* Header badge & title */}
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                      فيديو {idx + 1}
                                    </span>

                                    {video.isVerified ? (
                                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>مؤكد ومتحقق منه</span>
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>قيد المراجعة</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex gap-3">
                                    {/* Thumbnail preview */}
                                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0 relative group">
                                      <img
                                        src={video.thumbnail}
                                        alt=""
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>

                                    {/* Video metadata */}
                                    <div className="min-w-0 flex-1 space-y-1">
                                      <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                                        {video.title || `شرح ${activeLibraryLesson.title}`}
                                      </h5>
                                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                                        👨‍🏫 الأستاذ: <strong>{video.teacherName}</strong>
                                      </div>
                                      <div className="text-[10px] text-slate-400 truncate">
                                        📺 {video.channelName} • معرف: <code className="font-mono">{video.videoId}</code>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Verification Action Button */}
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                                  <a
                                    href={video.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  >
                                    <span>مشاهدة الفيديو على YouTube</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>

                                  {video.isVerified ? (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleVideoVerification(video.id)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                      إلغاء التأكيد
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleVideoVerification(video.id)}
                                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>تأكيد صحة الفيديو</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LESSONS MANAGEMENT (CURRICULUM) */}
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
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-xs"
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

              {/* TAB 3: EXERCISES MANAGEMENT */}
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
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
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

              {/* TAB 4: YOUTUBE & CHANNEL SETTINGS */}
              {activeTab === 'youtube' && (
                <div className="space-y-6">
                  {/* Channel ID setting */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase">
                      إعدادات قناة YouTube للأستاذ
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                          معرف القناة الرسمي (Channel ID)
                        </label>
                        <input
                          type="text"
                          value={channelIdSetting}
                          onChange={(e) => setChannelIdSetting(e.target.value)}
                          placeholder="UC..."
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={handleSaveChannelId}
                          className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
                        >
                          {channelSavedMsg ? 'تم الحفظ بنجاح!' : 'حفظ معرف القناة'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add Video Form */}
                  <form
                    onSubmit={handleAddVideo}
                    className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-3"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase">
                      ربط فيديو YouTube إضافي بدرس محدد
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

                  {/* Extra Videos list */}
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
          </>
        )}
      </div>
    </div>
  );
};
