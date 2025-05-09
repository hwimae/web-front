export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
}

export interface LessonGroup {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Chapter {
    id: string;
    title: string;
    lessons: number;
    completed: number;
    lessonGroups: any[];
    lessonList: {
      title: string;
      completed: boolean;
      locked: boolean;
      id: string;
      videoSrc: string;
      duration: number;
    }[];
  }

export interface Level {
    level: number;
    title: string;       
    description?: string; 
    unlocked: boolean;
    chapters: Chapter[];
  }

export interface Props {
    chapters: Chapter[];
    onSelect: (chapterIndex: number) => void;
  }