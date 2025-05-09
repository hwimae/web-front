import React, { useState } from 'react';
import { Chapter } from '../types';
import { CheckCircle, Lock, ChevronLeft, ChevronRight } from 'react-feather';

interface Props {
  chapters: Chapter[];
  onSelect: (chapterIndex: number) => void;
  onLessonSelect: (lessonId: string) => void;
}

const ChapterList: React.FC<Props> = ({ chapters, onSelect, onLessonSelect }) => {
  const [openChapterIndex, setOpenChapterIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const LESSONS_PER_PAGE = 5;

  const toggleChapter = (index: number) => {
    if (openChapterIndex === index) {
      setOpenChapterIndex(null);
    } else {
      setOpenChapterIndex(index);
      setCurrentPage(1); 
    }
    onSelect(index); 
  };

  const handleNextPage = () => {
    if (openChapterIndex === null) return;
    
    const chapter = chapters[openChapterIndex];
    const totalPages = Math.ceil(chapter.lessonList.length / LESSONS_PER_PAGE);
    
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentPageLessons = (chapter: Chapter) => {
    const startIdx = (currentPage - 1) * LESSONS_PER_PAGE;
    const endIdx = startIdx + LESSONS_PER_PAGE;
    return chapter.lessonList.slice(startIdx, endIdx);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-teal-800">Chọn chương để học</h1>
      {chapters.map((chapter, chIndex) => (
        <div key={chIndex} className="mb-4">
          <button
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-teal-500"
            onClick={() => toggleChapter(chIndex)}
          >
            <div>
              <span className="font-medium">{chapter.title}</span>
              <div className="text-sm text-gray-500 mt-1">
                {chapter.completed}/{chapter.lessons} bài học hoàn thành
              </div>
            </div>
            <div className="text-teal-600">
              {openChapterIndex === chIndex ? "▲" : "▼"}
            </div>
          </button>

          {openChapterIndex === chIndex && (
            <div className="bg-white mt-1 p-4 rounded-lg shadow-sm border border-gray-200">
              {/* Hiển thị các bài học của trang hiện tại */}
              {getCurrentPageLessons(chapter).map((lesson, lIndex) => (
                <div
                  key={lIndex}
                  className={`p-3 mb-2 flex items-center justify-between rounded-md ${
                    lesson.locked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : lesson.completed
                      ? "bg-green-50 cursor-pointer hover:bg-green-100"
                      : "bg-white border border-gray-200 cursor-pointer hover:bg-teal-50"
                  }`}
                  onClick={() => !lesson.locked && onLessonSelect(lesson.id || "")}
                >
                  <span>{lesson.title}</span>
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : lesson.locked ? (
                    <Lock className="h-5 w-5" />
                  ) : null}
                </div>
              ))}
              
              {/* Hiển thị điều khiển phân trang nếu có nhiều bài học */}
              {chapter.lessonList.length > LESSONS_PER_PAGE && (
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Trang {currentPage} / {Math.ceil(chapter.lessonList.length / LESSONS_PER_PAGE)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= Math.ceil(chapter.lessonList.length / LESSONS_PER_PAGE)}
                      className={`p-1 rounded ${
                        currentPage >= Math.ceil(chapter.lessonList.length / LESSONS_PER_PAGE)
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChapterList;