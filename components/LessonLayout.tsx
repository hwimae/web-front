import React from "react";
import { useState, useEffect, useRef } from "react";
import LessonTitle from "./LessonTitle";
import SignLanguageDetector from "./SignLanguageDetector"; 
import CameraView from "./CameraView";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
}

interface LessonLayoutProps {
  lessons: Lesson[];
  initialLessonIndex?: number;
  onComplete: () => void;
  levelIndex: number;
  chapterIndex: number;
}

const LessonLayout: React.FC<LessonLayoutProps> = ({
  lessons,
  initialLessonIndex = 0,
  onComplete,
  levelIndex,
  chapterIndex,
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isCameraMode, setIsCameraMode] = useState<boolean>(false);
  
  const currentLesson = lessons[currentLessonIndex];

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setProgress(0);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setProgress(0);
    }
  };

  const handleRecognition = (text: string) => {
    setRecognizedText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onComplete} 
          className="mb-4 text-teal-600 hover:text-teal-800 flex items-center"
        >
          ← Quay lại danh sách
        </button>

        <LessonTitle
          title={currentLesson.title}
          description={currentLesson.description}
          progress={progress}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNextLesson={currentLessonIndex < lessons.length - 1}
          hasPreviousLesson={currentLessonIndex > 0}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Phần video hướng dẫn */}
          {currentLesson.videoUrl && (
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                src={currentLesson.videoUrl}
                controls
                className="w-full h-full object-cover"
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    const videoProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                    setProgress(Math.round(videoProgress));
                  }
                }}
              />
            </div>
          )}

          {/* Phần camera phát hiện ngôn ngữ ký hiệu */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {isCameraMode ? (
              <SignLanguageDetector onRecognition={handleRecognition} />
            ) : (
              <CameraView />
            )}
            
            <div className="mt-2 flex justify-center p-2">
              <button 
                onClick={() => setIsCameraMode(!isCameraMode)}
                className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                {isCameraMode ? 'Chuyển sang nhận diện khuôn mặt' : 'Chuyển sang nhận diện ngôn ngữ ký hiệu'}
              </button>
            </div>
          </div>
        </div>

        {/* Hiển thị kết quả nhận dạng ngôn ngữ ký hiệu */}
        {recognizedText && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Ngôn ngữ ký hiệu được nhận dạng:</h3>
            <p className="text-xl">{recognizedText}</p>
          </div>
        )}

        {/* Nội dung bài học */}
        <div className="mt-6 prose max-w-none">
          {currentLesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p>Hướng dẫn chi tiết sẽ xuất hiện ở đây.</p>
              <p className="text-sm text-gray-500 mt-2">
                Hãy xem video hướng dẫn và thực hành theo để hoàn thành bài học.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonLayout;