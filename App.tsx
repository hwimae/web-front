import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChapterList from './components/ChapterList';
import LessonLayout from './components/LessonLayout';
import { levels, getUnlockedLessons } from './data/levels';

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const levelData = levels.find((l) => l.level === currentLevel);
  
  const handleChapterSelect = (chapterIndex: number) => {
    setCurrentChapter(chapterIndex);
  };
  
  const handleLessonComplete = () => {
    setActiveLessonId(null);
  };
  
  const handleLessonSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        currentLevel={currentLevel}
        onSelect={setCurrentLevel}
        unlockedLevels={levels.filter((l) => l.unlocked).map((l) => l.level)}
      />
      
      {activeLessonId && currentChapter !== null ? (
        <LessonLayout 
          lessons={getUnlockedLessons(currentLevel - 1, currentChapter)}
          initialLessonIndex={getUnlockedLessons(currentLevel - 1, currentChapter).findIndex(l => l.id === activeLessonId)}
          onComplete={handleLessonComplete}
          levelIndex={currentLevel - 1}
          chapterIndex={currentChapter}
        />
      ) : (
        <ChapterList 
          chapters={levelData?.chapters || []} 
          onSelect={handleChapterSelect}
          onLessonSelect={handleLessonSelect}
        />
      )}
    </div>
  );
};

export default App;