import { LessonLibraryItem, FieldId } from '../types';
import lessonsData from './lessonsLibrary.json';

export const LESSONS_LIBRARY_DATA: LessonLibraryItem[] = lessonsData as LessonLibraryItem[];

export const getAllLibraryLessons = (): LessonLibraryItem[] => {
  return LESSONS_LIBRARY_DATA;
};

export const getLibraryLessonById = (id: string): LessonLibraryItem | undefined => {
  return LESSONS_LIBRARY_DATA.find((item) => item.id === id);
};

export const getLibraryFields = () => {
  return [
    { id: 'all', title: 'جميع الميادين', icon: 'Layers' },
    { id: 'electricity', title: 'الظواهر الكهربائية', icon: 'Zap' },
    { id: 'matter', title: 'المادة وتحولاتها', icon: 'FlaskConical' },
    { id: 'mechanics', title: 'الظواهر الميكانيكية', icon: 'Cog' },
    { id: 'optics', title: 'الظواهر الضوئية', icon: 'Eye' },
  ];
};

export const getLibrarySubjects = () => {
  return [
    { id: 'all', title: 'جميع المواد' },
    { id: 'physics', title: 'العلوم الفيزيائية والتكنولوجيا' }
  ];
};

export const searchLibraryLessons = (
  query: string,
  fieldId: string = 'all',
  subject: string = 'all'
): LessonLibraryItem[] => {
  const cleanQuery = query.trim().toLowerCase();

  return LESSONS_LIBRARY_DATA.filter((lesson) => {
    // Filter by field
    if (fieldId !== 'all' && lesson.fieldId !== fieldId) {
      return false;
    }

    // Filter by subject
    if (subject !== 'all' && subject !== 'physics' && lesson.subject !== subject) {
      return false;
    }

    // Filter by search query
    if (!cleanQuery) return true;

    const matchesTitle = lesson.title.toLowerCase().includes(cleanQuery);
    const matchesFrench = lesson.frenchTitle?.toLowerCase().includes(cleanQuery) ?? false;
    const matchesDesc = lesson.description.toLowerCase().includes(cleanQuery);
    const matchesField = lesson.fieldTitle.toLowerCase().includes(cleanQuery);
    const matchesTeacher = lesson.videos.some(
      (v) =>
        v.teacherName.toLowerCase().includes(cleanQuery) ||
        v.channelName.toLowerCase().includes(cleanQuery)
    );

    return matchesTitle || matchesFrench || matchesDesc || matchesField || matchesTeacher;
  });
};
