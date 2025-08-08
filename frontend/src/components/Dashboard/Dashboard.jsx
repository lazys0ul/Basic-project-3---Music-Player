import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMusic } from '../../context/MusicContext';
import Sidebar from './Sidebar';
import MusicLibrary from './MusicLibrary';
import UploadMusic from './UploadMusic';
import { ResonaBanner } from '../../assets/resona-brand.jsx';
import { FaBars, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { fetchMusic, playlist } = useMusic();

  useEffect(() => {
    // Fetch music on component mount
    fetchMusic();
  }, [fetchMusic]);

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return <MusicLibrary />;
      case 'upload':
        return <UploadMusic />;
      default:
        return <MusicLibrary />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white overscroll-none relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Hidden on mobile, slide in when open */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 md:z-auto`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden overscroll-none w-full md:w-auto">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Open sidebar menu"
            title="Open sidebar menu"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">
            {activeTab === 'library' ? 'Music Library' : 'Upload Music'}
          </h1>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Enhanced Header - Hidden on mobile */}
        <header className="hidden md:block glass-card border-b border-gray-700/50 px-6 py-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10"></div>
          
          <div className="relative z-10">
            {/* Banner Section */}
            <div className="mb-4">
              <ResonaBanner />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {activeTab === 'library' ? 'Music Library' : 'Upload Music'}
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Welcome back, <span className="font-semibold gradient-text">{user?.username}</span>
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{playlist?.length || 0}</div>
                  <div className="text-sm text-gray-400">Tracks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-gray-400">Hours</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-transparent pb-20 md:pb-24 overscroll-none">
          <div className="fade-in p-4 md:p-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;