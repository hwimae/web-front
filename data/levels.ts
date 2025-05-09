import { Level, Chapter } from '../types';

const sampleVideoSrcs = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'%3E%3Crect width='320' height='240' fill='%23068484'/%3E%3Ctext x='160' y='120' font-family='sans-serif' font-size='80' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E1%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'%3E%3Crect width='320' height='240' fill='%23068484'/%3E%3Ctext x='160' y='120' font-family='sans-serif' font-size='80' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E2%3C/text%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'%3E%3Crect width='320' height='240' fill='%23068484'/%3E%3Ctext x='160' y='120' font-family='sans-serif' font-size='80' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E3%3C/text%3E%3C/svg%3E",
];

export const levels: Level[] = Array.from({ length: 10 }, (_, levelIdx) => {
  const level = levelIdx + 1;
  const unlocked = level === 1; 

  const chapterCounts = [5, 4, 4, 7, 5, 4]; 

  const chapters: Chapter[] =
    level === 1
      ? chapterCounts.map((lessonCount, chapterIdx) => {
          const chapterNum = chapterIdx + 1;
          return {
            id: `chapter-${chapterNum}`,
            title: `Chapter ${chapterNum}`,
            lessons: lessonCount,
            completed: 0,
            lessonGroups: [],
            lessonList: Array.from({ length: lessonCount }, (_, i) => {
              const lessonNum = i + 1;
              return {
                title: `Lesson ${lessonNum}`,
                completed: false, 
                locked: i !== 0, 
                id: `level-${level}-chapter-${chapterNum}-lesson-${lessonNum}`,
                videoSrc: sampleVideoSrcs[i % sampleVideoSrcs.length],
                duration: 30, 
              };
            }),
          };
        })
      : [];

  return { level, title: `Level ${level}`, unlocked, chapters };
});


export const completeLesson = (levelIndex: number, chapterIndex: number, lessonIndex: number): boolean => {
  if (levelIndex < 0 || levelIndex >= levels.length) return false;
  if (!levels[levelIndex].unlocked) return false;

  const level = levels[levelIndex];
  if (chapterIndex < 0 || chapterIndex >= level.chapters.length) return false;

  const chapter = level.chapters[chapterIndex];
  if (lessonIndex < 0 || lessonIndex >= chapter.lessonList.length) return false;

  const lesson = chapter.lessonList[lessonIndex];
  if (lesson.locked || lesson.completed) return false;

  lesson.completed = true;
  chapter.completed += 1;

  if (lessonIndex + 1 < chapter.lessonList.length) {
    chapter.lessonList[lessonIndex + 1].locked = false;
  } else if (chapterIndex + 1 < level.chapters.length) {

    const nextChapter = level.chapters[chapterIndex + 1];
    if (nextChapter.lessonList.length > 0) {
      nextChapter.lessonList[0].locked = false;
    }
  } else if (levelIndex + 1 < levels.length) {
    const nextLevel = levels[levelIndex + 1];
    nextLevel.unlocked = true;
  }

  return true;
};

export const getLessonById = (lessonId: string) => {
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    const level = levels[levelIndex];
    for (let chapterIndex = 0; chapterIndex < level.chapters.length; chapterIndex++) {
      const chapter = level.chapters[chapterIndex];
      for (let lessonIndex = 0; lessonIndex < chapter.lessonList.length; lessonIndex++) {
        const lesson = chapter.lessonList[lessonIndex];
        if (lesson.id === lessonId) {
          return { lesson, levelIndex, chapterIndex, lessonIndex };
        }
      }
    }
  }
  return null;
};

export const getUnlockedLessons = (levelIndex: number, chapterIndex: number) => {
  if (levelIndex < 0 || levelIndex >= levels.length) return [];
  
  const level = levels[levelIndex];
  if (!level.unlocked || chapterIndex < 0 || chapterIndex >= level.chapters.length) return [];
  
  const chapter = level.chapters[chapterIndex];
  return chapter.lessonList
    .filter(lesson => !lesson.locked)
    .map(lesson => ({
      id: lesson.id || "",
      title: lesson.title,
      videoUrl: lesson.videoSrc || "",
      duration: lesson.duration || 30
    }));
};