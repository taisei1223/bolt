import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { VideoRecorder } from './components/VideoRecorder';
import { VideoGallery } from './components/VideoGallery';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'gallery' | 'recorder' | 'player'>('gallery');
  const [videos, setVideos] = useState<VideoType[]>(() => {
    const savedVideos = localStorage.getItem('videos');
    return savedVideos ? JSON.parse(savedVideos) : [];
  });
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);

  const addVideo = (video: VideoType) => {
    const updatedVideos = [...videos, video];
    setVideos(updatedVideos);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
    setCurrentView('gallery');
  };

  const playVideo = (video: VideoType) => {
    setCurrentVideo(video);
    setCurrentView('player');
  };

  const handleBackToGallery = () => {
    setCurrentView('gallery');
  };

  return (
    <Layout 
      currentView={currentView}
      onRecordClick={() => setCurrentView('recorder')}
      onGalleryClick={() => setCurrentView('gallery')}
    >
      {currentView === 'gallery' && (
        <VideoGallery videos={videos} onVideoClick={playVideo} />
      )}
      {currentView === 'recorder' && (
        <VideoRecorder onVideoSaved={addVideo} onCancel={handleBackToGallery} />
      )}
      {currentView === 'player' && currentVideo && (
        <VideoPlayer video={currentVideo} onClose={handleBackToGallery} />
      )}
    </Layout>
  );
}

export default App;