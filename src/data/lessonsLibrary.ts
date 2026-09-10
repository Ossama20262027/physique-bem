import { LessonLibraryItem, LessonDownloadItem, LessonVideoItem, FieldId } from '../types';
import lessonsData from './lessonsLibrary.json';

const STORAGE_KEY_LIBRARY = 'physique_4am_lessons_library';

/**
 * Validates whether a lesson's download is genuinely available.
 * If pdfUrl or wordUrl contains example.com or is empty, it is considered NOT available.
 */
export const isLessonDownloadReal = (download?: LessonDownloadItem): boolean => {
  if (!download) return false;
  const pdf = (download.pdfUrl || '').trim();
  const word = (download.wordUrl || '').trim();
  const validPdf = pdf !== '' && !pdf.toLowerCase().includes('example.com');
  const validWord = word !== '' && !word.toLowerCase().includes('example.com');
  return Boolean(download.isAvailable && (validPdf || validWord));
};

// Initialize in-memory library data from localStorage or seed JSON
let libraryData: LessonLibraryItem[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LIBRARY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure every item respects the real download rule and video verification flag
        return parsed.map((lesson: LessonLibraryItem) => ({
          ...lesson,
          download: {
            ...lesson.download,
            isAvailable: isLessonDownloadReal(lesson.download),
          },
          videos: (lesson.videos || []).map((v) => ({
            ...v,
            isVerified: Boolean(v.isVerified),
          })),
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to load library data from storage:', e);
  }

  return (lessonsData as LessonLibraryItem[]).map((lesson) => ({
    ...lesson,
    download: {
      ...lesson.download,
      isAvailable: isLessonDownloadReal(lesson.download),
    },
    videos: (lesson.videos || []).map((v) => ({
      ...v,
      isVerified: Boolean(v.isVerified),
    })),
  }));
})();

const listeners: Set<() => void> = new Set();

const saveLibraryData = () => {
  try {
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(libraryData));
  } catch (e) {
    console.warn('Failed to save library data to localStorage:', e);
  }
  listeners.forEach((fn) => fn());
};

export const subscribeLibrary = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getAllLibraryLessons = (): LessonLibraryItem[] => {
  return libraryData;
};

export const getLibraryLessonById = (id: string): LessonLibraryItem | undefined => {
  return libraryData.find((item) => item.id === id);
};

export const updateLessonDownload = (
  lessonId: string,
  downloadUpdates: Partial<LessonDownloadItem>
) => {
  const lesson = libraryData.find((l) => l.id === lessonId);
  if (!lesson) return;

  const mergedDownload: LessonDownloadItem = {
    ...lesson.download,
    ...downloadUpdates,
  };

  // Rule: if pdfUrl or wordUrl contains example.com or is empty, isAvailable is automatically false
  mergedDownload.isAvailable = isLessonDownloadReal(mergedDownload);

  lesson.download = mergedDownload;
  saveLibraryData();
};

export const setVideoVerification = (
  lessonId: string,
  videoIdOrId: string,
  isVerified: boolean
) => {
  const lesson = libraryData.find((l) => l.id === lessonId);
  if (!lesson) return;

  const video = lesson.videos.find((v) => v.id === videoIdOrId || v.videoId === videoIdOrId);
  if (!video) return;

  video.isVerified = isVerified;
  saveLibraryData();
};

export const toggleVideoVerification = (
  lessonId: string,
  videoIdOrId: string
): boolean => {
  const lesson = libraryData.find((l) => l.id === lessonId);
  if (!lesson) return false;

  const video = lesson.videos.find((v) => v.id === videoIdOrId || v.videoId === videoIdOrId);
  if (!video) return false;

  video.isVerified = !video.isVerified;
  saveLibraryData();
  return video.isVerified;
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
    { id: 'physics', title: 'العلوم الفيزيائية والتكنولوجيا' },
  ];
};

export const searchLibraryLessons = (
  query: string,
  fieldId: string = 'all',
  subject: string = 'all'
): LessonLibraryItem[] => {
  const cleanQuery = query.trim().toLowerCase();

  return libraryData.filter((lesson) => {
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

