import React, { useRef, useState, useEffect } from 'react';
import { X, CheckCircle, Video, StopCircle } from 'lucide-react';
import { VideoType } from '../types';

interface VideoRecorderProps {
  onVideoSaved: (video: VideoType) => void;
  onCancel: () => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoSaved, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_RECORDING_TIME = 10; // Maximum recording time in seconds

  useEffect(() => {
    let timer: number | undefined;
    
    if (isRecording) {
      timer = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 720 },
            height: { ideal: 1280 }
          },
          audio: true
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Camera access denied. Please allow access to your camera and microphone.');
        console.error('Error accessing camera:', err);
      }
    }
    
    setupCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
      
      // Generate thumbnail from the recorded video
      const thumbnailCanvas = document.createElement('canvas');
      const video = document.createElement('video');
      video.src = videoUrl;
      
      video.onloadeddata = () => {
        video.currentTime = 0;
      };
      
      video.onseeked = () => {
        thumbnailCanvas.width = video.videoWidth;
        thumbnailCanvas.height = video.videoHeight;
        const ctx = thumbnailCanvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
        const thumbnailUrl = thumbnailCanvas.toDataURL('image/jpeg');
        
        // Convert blob to base64 for storage
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          
          // Save the video
          onVideoSaved({
            id: Date.now().toString(),
            blob: base64data,
            thumbnail: thumbnailUrl,
            duration: recordingTime,
            createdAt: Date.now()
          });
        };
      };
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-red-500 mb-4">
          <Video size={48} />
        </div>
        <h2 className="text-xl font-bold mb-2">Camera Access Required</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={onCancel} 
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      {!recordedVideo ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="h-full w-full object-cover"
          />
          
          <div className="absolute top-4 left-4">
            <button 
              onClick={onCancel} 
              className="p-2 bg-gray-800 bg-opacity-70 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center bg-gray-800 bg-opacity-70 px-3 py-1 rounded-full">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
              <span>{recordingTime}s / {MAX_RECORDING_TIME}s</span>
            </div>
          )}
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            {!isRecording ? (
              <button 
                onClick={startRecording} 
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full"></div>
              </button>
            ) : (
              <button 
                onClick={stopRecording} 
                className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center"
              >
                <StopCircle size={40} className="text-red-500" />
              </button>
            )}
          </div>
          
          {/* Recording progress bar */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0">
              <div 
                className="h-1 bg-red-500"
                style={{ width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%` }}
              ></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col h-full">
          <video 
            src={recordedVideo} 
            autoPlay 
            playsInline 
            controls
            loop
            className="h-full w-full object-cover"
          />
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-6">
            <button 
              onClick={resetRecording} 
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"
            >
              <X size={24} />
            </button>
            <button 
              onClick={() => {
                if (recordedVideo) {
                  const video = document.querySelector('video');
                  if (video) {
                    // Use the actual video duration if available
                    const duration = video.duration || recordingTime;
                    onVideoSaved({
                      id: Date.now().toString(),
                      blob: recordedVideo,
                      thumbnail: '', // This would be generated in a real implementation
                      duration,
                      createdAt: Date.now()
                    });
                  }
                }
              }} 
              className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};