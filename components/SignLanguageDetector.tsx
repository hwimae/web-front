import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface SignLanguageDetectorProps {
  onRecognition?: (text: string) => void;
}

const SignLanguageDetector: React.FC<SignLanguageDetectorProps> = ({ onRecognition }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Start camera automatically when component mounts
  useEffect(() => {
    startCapture();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  const startCapture = async () => {
    if (videoRef.current) {
      try {
        console.log("Starting camera capture...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi truy cập camera:", err);
        setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      }
    }
  };
  
  const toggleCapture = () => {
    if (isCapturing) {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCapturing(false);
      }
    } else {
      // Restart camera
      startCapture();
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* Video display area */}
        <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <p className="font-medium text-center px-4">{error}</p>
            </div>
          )}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={toggleCapture}
            className={isCapturing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
          >
            {isCapturing ? "Tắt Camera" : "Bật Camera"}
          </Button>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-center text-gray-600">
            Luyện tập ngôn ngữ ký hiệu theo video mẫu
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignLanguageDetector;