import React, { ReactNode } from 'react';
import { Camera, Film, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: 'gallery' | 'recorder' | 'player';
  onRecordClick: () => void;
  onGalleryClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView,
  onRecordClick, 
  onGalleryClick 
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="px-4 py-3 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-center">ShortVideo</h1>
      </header>
      
      <main className="flex-grow overflow-auto">
        {children}
      </main>
      
      {currentView !== 'player' && (
        <footer className="bg-gray-800 py-3 px-4">
          <nav className="flex justify-around items-center">
            <button 
              onClick={onGalleryClick}
              className={`flex flex-col items-center ${currentView === 'gallery' ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </button>
            
            <button 
              onClick={onRecordClick}
              className="flex flex-col items-center"
            >
              <div className="relative rounded-full bg-blue-500 p-3 transform transition-transform hover:scale-110">
                <Camera size={24} className="text-white" />
              </div>
            </button>
            
            <button 
              onClick={onGalleryClick}
              className={`flex flex-col items-center ${currentView === 'gallery' ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <Film size={24} />
              <span className="text-xs mt-1">Videos</span>
            </button>
          </nav>
        </footer>
      )}
    </div>
  );
};