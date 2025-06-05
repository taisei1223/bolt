import React from 'react';
import { Clock } from 'lucide-react';
import { VideoType } from '../types';

interface VideoGalleryProps {
  videos: VideoType[];
  onVideoClick: (video: VideoType) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, onVideoClick }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="mb-4 text-gray-400">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">No Videos Yet</h2>
        <p className="text-gray-400 mb-6">Tap the camera button to create your first video!</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2">
      {videos.map((video) => (
        <div 
          key={video.id} 
          className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => onVideoClick(video)}
        >
          {video.thumbnail ? (
            <img 
              src={video.thumbnail} 
              alt="Video thumbnail" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-400">Video</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
            <div className="flex items-center text-xs">
              <Clock size={12} className="mr-1" />
              <span>{Math.round(video.duration)}s</span>
            </div>
            <div className="text-xs opacity-80 mt-1">
              {formatDate(video.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};