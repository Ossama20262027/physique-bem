import React, { useState } from 'react';
import {
  X,
  Award,
  Flame,
  BookCheck,
  Trophy,
  History,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { UserProgress } from '../types';
import { dataStore } from '../services/store';
import { triggerConfetti } from '../utils/confetti';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onRefresh: () => void;
}

const AVATARS = ['👨‍🎓', '👩‍🎓', '🔬', '⚡', '🚀', '💡', '🦁', '🦉', '🎯', '🥇'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onRefresh
}) => {
  const [name, setName] = useState(userProgress.name);
  const [avatar, setAvatar] = useState(userProgress.avatar);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const totalLessons = dataStore.getAllLessons().length;
  const completedPercent = Math.round(
    (userProgress.completedLessonIds.length / (totalLessons || 1)) * 100
  );

  const handleSave = () => {
    dataStore.updateUserProfile({ name, avatar });
    setIsEditing(false);
    triggerConfetti();
    onRefresh();
  };

  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع بيانات التقدم والنتائج؟')) {
      dataStore.resetToDefaults();
      onRefresh();
      onClose();
    }
  };

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="profile-modal-container"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base sm:text-lg">الملف الشخصي وإنجازاتي</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* User Profile Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-5xl p-2 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600 shrink-0">
              {avatar}
            </div>
            <div className="text-center sm:text-right flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                    placeholder="اسم التلميذ"
                  />
                  <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`text-lg p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 ${
                          avatar === av ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : ''
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {userProgress.gradeLevel}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-xs text-slate-500 hover:text-blue-600 underline"
                  >
                    تعديل الاسم والأيقونة
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <Award className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <div className="text-lg font-bold text-amber-900 dark:text-amber-300">
                {userProgress.xp}
              </div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400">نقاط الخبرة XP</div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-center">
              <Flame className="w-5 h-5 mx-auto text-orange-500 mb-1" />
              <div className="text-lg font-bold text-orange-900 dark:text-orange-300">
                {userProgress.streakDays}
              </div>
              <div className="text-[11px] text-orange-700 dark:text-orange-400">أيام متتالية 🔥</div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <BookCheck className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="text-lg font-bold text-blue-900 dark:text-blue-300">
                {userProgress.completedLessonIds.length} / {totalLessons}
              </div>
              <div className="text-[11px] text-blue-700 dark:text-blue-400">دروس مكتملة</div>
            </div>
          </div>

          {/* Curriculum Completion Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>نسبة التقدم في منهاج 4AM</span>
              <span>{completedPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${completedPercent}%` }}
              />
            </div>
          </div>

          {/* Badges Showcase */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>أوسمة الإنجاز ({userProgress.badges.filter((b) => b.unlocked).length} / {userProgress.badges.length})</span>
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {userProgress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                    badge.unlocked
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                      badge.unlocked
                        ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {badge.unlocked ? '🏆' : '🔒'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {badge.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {badge.description}
                    </div>
                    {badge.unlocked && badge.unlockedAt && (
                      <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        ✓ مكتمل
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz History List */}
          {userProgress.quizHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                <History className="w-4 h-4 text-blue-500" />
                <span>سجل الاختبارات والكويزات السابقة</span>
              </h4>
              <div className="space-y-1.5">
                {userProgress.quizHistory.slice(0, 4).map((q) => (
                  <div
                    key={q.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        اختبار فيزياء ({q.correctAnswersCount}/{q.totalQuestions} إجابات صحيحة)
                      </span>
                      <div className="text-[10px] text-slate-400">{q.date}</div>
                    </div>
                    <div
                      className={`px-2.5 py-1 rounded-lg font-bold text-sm ${
                        q.score >= 15
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.score >= 10
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {q.score} / 20
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone: Reset */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">إعادة ضبط البيانات المحلية</span>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط التقدم</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
