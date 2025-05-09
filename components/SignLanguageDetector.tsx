import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface SignLanguageDetectorProps {
  onRecognition?: (text: string) => void; 
}

const SignLanguageDetector: React.FC<SignLanguageDetectorProps> = ({ onRecognition }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false); 
  const [recognizedText, setRecognizedText] = useState<string[]>([]); 
  const [isConnected, setIsConnected] = useState(false); 
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout | null>(null); 
  
  const startCapture = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        
        const interval = setInterval(sendFrameToBackend, 1000); 
        setCaptureInterval(interval);
      } catch (err) {
        console.error("Lỗi khi truy cập camera:", err);
        alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      }
    }
  };
  
  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());

      videoRef.current.srcObject = null;
      setIsCapturing(false);
      
      if (captureInterval) {
        clearInterval(captureInterval);
        setCaptureInterval(null);
      }
    }
  };

  const sendFrameToBackend = async () => {
    if (videoRef.current && isCapturing) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        try {
          const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
          });
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.confidence > 0.7 && result.prediction !== 'none') {
              setRecognizedText(prev => {

                if (prev.length === 0 || prev[prev.length - 1] !== result.prediction) {
                  const newText = [...prev, result.prediction].slice(-3); 
                  return newText;
                }
                return prev;
              });
            }
          }
        } catch (err) {
          console.error("Lỗi khi gửi khung hình đến backend:", err);
        }
      }
    }
  };
  
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        setIsConnected(response.ok);
      } catch (err) {
        setIsConnected(false);
      }
    };
    
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (recognizedText.length > 0 && onRecognition) {
      onRecognition(recognizedText.join(' '));
    }
  }, [recognizedText, onRecognition]);
  
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* Phần hiển thị video */}
        <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              Backend Python chưa được kết nối
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
        
        {/* Các nút điều khiển */}
        <div className="flex justify-between">
          <Button 
            onClick={isCapturing ? stopCapture : startCapture}
            className={isCapturing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
          >
            {isCapturing ? "Dừng Camera" : "Bắt đầu Camera"}
          </Button>
          
          <Button 
            onClick={() => setRecognizedText([])}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Xóa Văn Bản
          </Button>
        </div>
        
        {/* Phần hiển thị văn bản được nhận dạng */}
        <div className="p-3 min-h-16 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-lg font-medium">
            {recognizedText.length > 0 ? recognizedText.join(' ') : 'Chưa nhận dạng được ngôn ngữ ký hiệu'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignLanguageDetector;