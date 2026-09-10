import React from 'react';
import {
  Home,
  BookOpen,
  FileCheck2,
  Bot,
  Trophy,
  CalendarDays,
  Binary,
  Video
} from 'lucide-react';

export type TabType = 'home' | 'library' | 'lessons' | 'exercises' | 'ai' | 'quiz' | 'planner' | 'formulas';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'library', label: 'مكتبة الفيديوهات', icon: Video, isHighlighted: true },
    { id: 'lessons', label: 'الدروس', icon: BookOpen },
    { id: 'exercises', label: 'التمارين', icon: FileCheck2 },
    { id: 'ai', label: 'الأستاذ الذكي', icon: Bot },
    { id: 'quiz', label: 'كويز BEM', icon: Trophy },
    { id: 'planner', label: 'خطتي', icon: CalendarDays }
  ];

  return (
    <nav
      id="app-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              onClick={() => onChangeTab(tab.id as TabType)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all relative ${
                isActive
                  ? tab.isHighlighted
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.isHighlighted && (
                <div className="absolute -top-1 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              )}
              <div
                className={`p-1 rounded-lg ${
                  isActive
                    ? tab.isHighlighted
                      ? 'bg-blue-100 dark:bg-blue-900/50'
                      : 'bg-blue-50 dark:bg-slate-800'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
