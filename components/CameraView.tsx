"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!isModelLoaded) return;

    const startVideo = async () => {
      const video = videoRef.current;
      if (!video) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        video.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startVideo();

    return () => {
      const video = videoRef.current;
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        for (const track of tracks) {
          track.stop();
        }
      }
    };
  }, [isModelLoaded]);

  useEffect(() => {
    if (!isModelLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;

    const detectFace = async () => {
      if (video.readyState !== 4) {
        animationFrameId = requestAnimationFrame(detectFace);
        return;
      }

      const displaySize = {
        width: video.offsetWidth,
        height: video.offsetHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const detection of resizedDetections) {
          if (detection.landmarks) {
            const landmarks = detection.landmarks.positions;
            
            ctx.fillStyle = "#000000";
            for (const landmark of landmarks) {
              ctx.beginPath();
              ctx.arc(landmark.x, landmark.y, 5, 0, 2 * Math.PI);
              ctx.fill();
            }
            
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            
            const leftEye = landmarks.slice(36, 42);
            const rightEye = landmarks.slice(42, 48);
            
            drawConnections(ctx, leftEye);
            drawConnections(ctx, rightEye);
            
            const nose = landmarks.slice(27, 36);
            drawConnections(ctx, nose);
            
            const mouth = landmarks.slice(48, 60);
            drawConnections(ctx, mouth);
            
            ctx.beginPath();
            ctx.moveTo(landmarks[39].x, landmarks[39].y); 
            ctx.lineTo(landmarks[30].x, landmarks[30].y); 
            ctx.lineTo(landmarks[42].x, landmarks[42].y); 
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(landmarks[30].x, landmarks[30].y); 
            ctx.lineTo(landmarks[51].x, landmarks[51].y); 
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectFace);
    };

    const drawConnections = (
      ctx: CanvasRenderingContext2D,
      points: faceapi.Point[]
    ) => {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      if (points.length > 2) {
        ctx.lineTo(points[0].x, points[0].y);
      }
      ctx.stroke();
    };

    video.addEventListener("play", detectFace);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isModelLoaded]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover mirror-mode"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover mirror-mode"
      />
      
      {!isModelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          Đang tải mô hình...
        </div>
      )}
    </div>
  );
}