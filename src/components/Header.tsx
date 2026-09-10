import React from 'react';
import {
  Zap,
  Flame,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Award
} from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  userProgress: UserProgress;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userProgress,
  isDark,
  onToggleTheme,
  onOpenSearch,
  onOpenProfile,
  onOpenAdmin,
  isAdmin
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            id="header-brand-logo"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20"
          >
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                فيزياء 4 متوسط
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                BEM 2025
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Physique 4AM الجزائر
            </span>
          </div>
        </div>

        {/* Action Controls & Gamification Counters */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition-colors"
            title="بحث في الدروس والقوانين"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">بحث في المنهاج...</span>
            <kbd className="hidden md:inline-block text-[10px] px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 text-slate-400 font-mono">
              /
            </kbd>
          </button>

          {/* Streak Flame Counter */}
          <div
            id="header-streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/80 text-orange-700 dark:text-orange-400 font-semibold text-xs"
            title="أيام المراجعة المتتالية"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{userProgress.streakDays} د</span>
          </div>

          {/* XP Points Counter */}
          <div
            id="header-xp-badge"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 font-semibold text-xs"
            title="نقاط الخبرة XP"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>{userProgress.xp} XP</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            id="header-theme-toggle-btn"
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الليلي'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Teacher / Admin Dashboard Button */}
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isAdmin
                ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title="لوحة تحكم الأستاذ (إضافة وتعديل المحتوى)"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة الأستاذ</span>
          </button>

          {/* Student Profile Button */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 sm:px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="الملف الشخصي والإحصائيات"
          >
            <span className="text-xl leading-none">{userProgress.avatar || '👨‍🎓'}</span>
            <span className="hidden lg:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
              {userProgress.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
