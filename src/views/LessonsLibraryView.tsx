import React, { useState, useEffect } from 'react';
import { FieldBrowser } from '../components/library/FieldBrowser';
import { LessonDetailView } from '../components/library/LessonDetailView';
import { LessonLibraryItem } from '../types';
import { getLibraryLessonById } from '../data/lessonsLibrary';

interface LessonsLibraryViewProps {
  initialLessonId?: string | null;
  onOpenAiTutor?: (lessonTitle: string) => void;
}

export const LessonsLibraryView: React.FC<LessonsLibraryViewProps> = ({
  initialLessonId,
  onOpenAiTutor
}) => {
  const [selectedLesson, setSelectedLesson] = useState<LessonLibraryItem | null>(() => {
    if (initialLessonId) {
      return getLibraryLessonById(initialLessonId) || null;
    }
    return null;
  });

  // Keep synced if initialLessonId changes from outside
  useEffect(() => {
    if (initialLessonId) {
      const found = getLibraryLessonById(initialLessonId);
      if (found) {
        setSelectedLesson(found);
      }
    }
  }, [initialLessonId]);

  return (
    <div className="w-full">
      {selectedLesson ? (
        <LessonDetailView
          lesson={selectedLesson}
          onBack={() => setSelectedLesson(null)}
          onOpenAiTutor={onOpenAiTutor}
        />
      ) : (
        <FieldBrowser onSelectLesson={(lesson) => setSelectedLesson(lesson)} />
      )}
    </div>
  );
};
