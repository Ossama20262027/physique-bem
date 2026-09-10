import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { ProfileModal } from './components/ProfileModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AdminPanelModal } from './components/AdminPanelModal';

import { HomeView } from './views/HomeView';
import { LessonsView } from './views/LessonsView';
import { ExercisesView } from './views/ExercisesView';
import { AiTutorView } from './views/AiTutorView';
import { QuizView } from './views/QuizView';
import { PlannerView } from './views/PlannerView';
import { FormulasSummaryView } from './views/FormulasSummaryView';
import { LessonsLibraryView } from './views/LessonsLibraryView';

import { dataStore } from './services/store';
import { VideoItem } from './types';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [userProgress, setUserProgress] = useState(() => dataStore.getUserProgress());
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Navigation & Sub-views states
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // AI Prompt transfer state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiMode, setAiMode] = useState<'solve' | 'guide'>('guide');

  // Sync theme with HTML root class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Refresh user data callback
  const refreshData = useCallback(() => {
    setUserProgress(dataStore.getUserProgress());
  }, []);

  // Keyboard shortcut '/' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const curriculum = dataStore.getCurriculum();
  const allVideos = dataStore.getVideos();
  const featuredTeacherVideo = allVideos.find((v) => v.isTeacherChannel) || allVideos[0];

  // Navigation handlers
  const handleOpenLesson = (lessonId: string | null) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('lessons');
  };

  const handleOpenExercise = (exerciseId: string) => {
    setCurrentTab('exercises');
  };

  const handleAskAiAboutLesson = (lessonTitle: string) => {
    setAiPrompt(`أريد فهم درس: "${lessonTitle}" بشكل مفصل ومبسط وفق المقرر الجزائري BEM.`);
    setAiMode('guide');
    setCurrentTab('ai');
  };

  const handleAskAiToSolveExercise = (exerciseText: string, mode: 'solve' | 'guide') => {
    setAiPrompt(`نص المسألة:\n${exerciseText}\n\nأرجو مساعدتي في تحليل هذه المسألة وحلها.`);
    setAiMode(mode);
    setCurrentTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-150">
      {/* Top Application Header */}
      <Header
        userProgress={userProgress}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdmin={false}
      />

      {/* Desktop Main Navigation Bar */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1 py-1.5 overflow-x-auto text-xs font-bold">
            {[
              { id: 'home', label: 'الرئيسية', icon: Home },
              { id: 'library', label: 'مكتبة الفيديوهات والتحميل 🎥', icon: Video, isHighlighted: true },
              { id: 'lessons', label: 'الدروس المقررة', icon: BookOpen },
              { id: 'exercises', label: 'بنك التمارين', icon: FileCheck2 },
              { id: 'ai', label: 'الأستاذ الذكي 🤖', icon: Bot },
              { id: 'quiz', label: 'كويز BEM', icon: Trophy },
              { id: 'formulas', label: 'بطاقات القوانين', icon: Binary },
              { id: 'planner', label: 'خطتي 📅', icon: CalendarDays }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`desktop-nav-${tab.id}`}
                  onClick={() => {
                    setCurrentTab(tab.id as TabType);
                    if (tab.id !== 'lessons') {
                      setSelectedLessonId(null);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                    isActive
                      ? tab.isHighlighted
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {currentTab === 'home' && (
          <HomeView
            curriculum={curriculum}
            userProgress={userProgress}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onSelectLesson={handleOpenLesson}
            onSelectField={(fieldId) => {
              setSelectedFieldId(fieldId);
              setSelectedLessonId(null);
            }}
            onPlayVideo={(video) => setActiveVideo(video)}
            featuredTeacherVideo={featuredTeacherVideo}
          />
        )}

        {currentTab === 'library' && (
          <LessonsLibraryView
            initialLessonId={selectedLessonId}
            onOpenAiTutor={handleAskAiAboutLesson}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsView
            curriculum={curriculum}
            userProgress={userProgress}
            selectedLessonId={selectedLessonId}
            onSelectLesson={setSelectedLessonId}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
            onPlayVideo={(video) => setActiveVideo(video)}
            onAskAiAboutLesson={handleAskAiAboutLesson}
            onRefresh={refreshData}
          />
        )}

        {currentTab === 'exercises' && (
          <ExercisesView
            userProgress={userProgress}
            onAskAiToSolve={handleAskAiToSolveExercise}
            onRefresh={refreshData}
          />
        )}

        {currentTab === 'ai' && (
          <AiTutorView
            initialPrompt={aiPrompt}
            initialMode={aiMode}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizView
            userProgress={userProgress}
            onNavigateToLesson={handleOpenLesson}
            onRefresh={refreshData}
          />
        )}

        {currentTab === 'formulas' && (
          <FormulasSummaryView
            onNavigateToLesson={handleOpenLesson}
          />
        )}

        {currentTab === 'planner' && (
          <PlannerView
            userProgress={userProgress}
            onRefresh={refreshData}
            onNavigateToLesson={handleOpenLesson}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'lessons') {
            setSelectedLessonId(null);
          }
        }}
      />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleOpenLesson}
        onSelectExercise={handleOpenExercise}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProgress={userProgress}
        onRefresh={refreshData}
      />

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={refreshData}
      />
    </div>
  );
}
