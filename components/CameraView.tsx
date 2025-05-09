"use client";
import React, { useRef, useState, useEffect } from "react";

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log("Đang khởi tạo camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Camera đã được khởi tạo thành công!");
        }
      } catch (err) {
        console.error("Lỗi khi truy cập camera:", err);
        setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full aspect-video bg-gray-800 flex items-center justify-center">
      {error ? (
        <div className="text-white text-center p-4 bg-red-500/70 rounded-md">
          {error}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}