import React from "react";
import { useState, useEffect, useRef } from "react";
import LessonTitle from "./LessonTitle";
import SignLanguageDetector from "./SignLanguageDetector";
import { Button } from "./ui/Button";

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
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex);
  const [progress, setProgress] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentLesson = lessons[currentLessonIndex];

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setProgress(0);
      setCustomVideoUrl(null);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setProgress(0);
      setCustomVideoUrl(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        setCustomVideoUrl(url);
      } else {
        alert("Vui lòng tải lên tệp video.");
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (customVideoUrl) {
        URL.revokeObjectURL(customVideoUrl);
      }
    };
  }, [customVideoUrl]);

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
          {/* Video instruction with upload option */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                src={customVideoUrl || currentLesson.videoUrl}
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
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Video hướng dẫn</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/*"
                  className="hidden"
                />
                <Button 
                  onClick={triggerFileInput}
                  variant="outline"
                  className="text-sm"
                >
                  Tải lên video
                </Button>
              </div>
            </div>
          </div>

          {/* Camera for practice (automatically starts) */}
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
            <SignLanguageDetector />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Hướng dẫn:</h3>
          <p className="text-gray-700">
            Phần hướng dẫn
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonLayout;