import React, { useState, useEffect } from 'react';
import { X, Youtube, Plus, Check, Play, Sparkles, Video, AlertCircle } from 'lucide-react';
import { VideoItem } from '../types';
import { dataStore } from '../services/store';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
  onVideoAdded?: (video: VideoItem) => void;
}

export const extractYouTubeId = (urlOrId: string): string | null => {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Full URL or shortened youtu.be
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
};

const TEACHER_PRESETS = [
  { name: '⭐ دروسي على النت', isOfficial: true },
  { name: '🔥 الأستاذ زوطاط يونس', isOfficial: false },
  { name: '🎓 الأستاذ حمياني للفيزياء', isOfficial: false },
  { name: '📘 الأستاذ دقيش إبراهيم', isOfficial: false },
  { name: '🔬 الأستاذ عبد الرزاق', isOfficial: false },
  { name: '📺 قناة تعليمية أخرى', isOfficial: false }
];

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  onVideoAdded
}) => {
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [channelTitle, setChannelTitle] = useState('⭐ دروسي على النت');
  const [duration, setDuration] = useState('15:00');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Set default title when lesson changes
  useEffect(() => {
    if (lessonTitle) {
      setVideoTitle(`شرح درس ${lessonTitle} - فيزياء 4 متوسط`);
    }
    setVideoUrlInput('');
    setErrorMsg('');
    setPreviewOpen(false);
  }, [lessonTitle, isOpen]);

  if (!isOpen) return null;

  const extractedId = extractYouTubeId(videoUrlInput);
  const isValidId = Boolean(extractedId);
  const thumbnailUrl = isValidId ? `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg` : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedId) {
      setErrorMsg('يرجى إدخال رابط يوتيوب صالح (مثال: https://www.youtube.com/watch?v=... أو معرف الفيديو)');
      return;
    }

    if (!videoTitle.trim()) {
      setErrorMsg('يرجى كتابة عنوان للفيديو');
      return;
    }

    const isTeacher = channelTitle.includes('دروسي على النت');
    const newVideo = dataStore.addVideo({
      lessonId,
      title: videoTitle.trim(),
      channelTitle: channelTitle.trim(),
      isTeacherChannel: isTeacher,
      videoId: extractedId,
      duration: duration.trim() || '15:00',
      thumbnail: thumbnailUrl,
      views: 'مضاف حديثاً'
    });

    if (onVideoAdded) {
      onVideoAdded(newVideo);
    }

    onClose();
  };

  return (
    <div
      id="add-video-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="add-video-modal-dialog"
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">إضافة فيديو يوتيوب للدرس</h3>
              <p className="text-xs text-red-100 line-clamp-1">
                الدرس: {lessonTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* YouTube URL or ID */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>رابط أو معرّف فيديو اليوتيوب:</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (رابط كامل أو معرّف 11 حرفاً)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => {
                  setVideoUrlInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="مثال: https://www.youtube.com/watch?v=abc123xyz89 أو معرف الفيديو"
                className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs font-mono"
                dir="ltr"
                required
              />
              <Youtube className="w-4 h-4 text-red-500 absolute right-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              يمكنك نسخ رابط الفيديو من تطبيق YouTube أو المتصفح ولصقه هنا مباشرة.
            </p>
          </div>

          {/* Real-time Video Thumbnail Preview */}
          {isValidId && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  تم التعرف على معرّف الفيديو: <code className="font-mono">{extractedId}</code>
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{previewOpen ? 'إخفاء المعاينة' : 'تشغيل تجريبي'}</span>
                </button>
              </div>

              {previewOpen ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractedId}?autoplay=1`}
                    title="معاينة الفيديو"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden bg-slate-900 mx-auto group">
                  <img
                    src={thumbnailUrl}
                    alt="معاينة الصورة المصغرة"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              عنوان الفيديو:
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="مثال: شرح درس التكهرب والشحنة الكهربائية"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
              required
            />
          </div>

          {/* Teacher / Channel Preset Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              الأستاذ أو القناة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TEACHER_PRESETS.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setChannelTitle(t.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    channelTitle === t.name
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={channelTitle}
              onChange={(e) => setChannelTitle(e.target.value)}
              placeholder="أو اكتب اسم الأستاذ هنا..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs mt-1"
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>المدة التقريبية:</span>
              <span className="text-[11px] text-slate-400 font-normal">اختياري</span>
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="15:30"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs font-mono"
              dir="ltr"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={!isValidId}
              className={`px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md ${
                isValidId
                  ? 'bg-red-600 hover:bg-red-700 active:scale-95 text-white cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>حفظ وإضافة الفيديو للدرس</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
