"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/Card"; // Sửa đường dẫn import

interface VideoReferenceProps {
  videoSrc: string;
}

export default function VideoReference({ videoSrc }: VideoReferenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (
      videoSrc.startsWith("data:image") ||
      videoSrc.endsWith(".jpg") ||
      videoSrc.endsWith(".jpeg") ||
      videoSrc.endsWith(".png") ||
      videoSrc.endsWith(".svg")
    ) {
      setIsImage(true);
      return;
    }

    setIsImage(false);

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      videoElement.play().catch((error) => {
        console.error("Error playing the video:", error);
      });
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      videoElement.currentTime = 0;
      videoElement.play().catch((error) => {
        console.error("Error replaying the video:", error);
      });
    };

    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handleEnded);

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [videoSrc]);

  const togglePlayPause = () => {
    if (isImage) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play().catch((error) => {
        console.error("Error playing the video:", error);
      });
    } else {
      videoElement.pause();
    }
  };

  return (
    <Card className="w-32 h-32 md:w-48 md:h-48 overflow-hidden relative cursor-pointer">
      {isImage ? (
        <img
          ref={imgRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          alt="Video reference"
        />
      ) : (
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
          onClick={togglePlayPause}
        />
      )}
      
      {!isImage && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-10 h-10"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      
      {/* Biểu tượng phóng to video */}
      <div className="absolute bottom-2 right-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M15 3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l-3.97 3.97a.75.75 0 11-1.06-1.06l3.97-3.97h-2.69a.75.75 0 01-.75-.75zm-12 0A.75.75 0 013.75 3h4.5a.75.75 0 010 1.5H5.56l3.97 3.97a.75.75 0 01-1.06 1.06L4.5 5.56v2.69a.75.75 0 01-1.5 0v-4.5zm11.47 14.72a.75.75 0 111.06 1.06l-3.97 3.97h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97zm-4.94-1.06a.75.75 0 010 1.06L5.56 22.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97a.75.75 0 011.06 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Card>
  );
}