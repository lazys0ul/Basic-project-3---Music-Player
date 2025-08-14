import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMusic } from '../../hooks/useMusic';
import Sidebar from './Sidebar';
import MusicLibrary from './MusicLibrary';
import UploadMusic from './UploadMusic';
import AdminPanel from './AdminPanel';
import { ResonaBanner } from '../../assets/resona-brand.jsx';
import { FaBars, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const Dashboard = ({ publicView = false }) => {
  const [activeTab, setActiveTab] = useState('library');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const { user } = useAuth();
  const { fetchMusic, playlist } = useMusic();

  useEffect(() => {
    // Fetch music on component mount
    fetchMusic();
  }, [fetchMusic]);

  // Handle scroll to collapse/expand header
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('main');
      if (!mainContent) return;
      
      const currentScrollY = mainContent.scrollTop;
      
      // Only trigger on library tab with instant response
      if (activeTab === 'library') {
        if (currentScrollY > 10) {
          // Any scroll down - collapse header instantly
          setHeaderCollapsed(true);
        } else {
          // At the very top - expand header
          setHeaderCollapsed(false);
        }
      }
    };

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true });
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab]);

  // Reset header when switching tabs
  useEffect(() => {
    if (activeTab !== 'library') {
      setHeaderCollapsed(false);
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return <MusicLibrary publicView={publicView} />;
      case 'upload':
        return <UploadMusic />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <MusicLibrary publicView={publicView} />;
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
          publicView={publicView}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden overscroll-none w-full md:w-auto">
        {/* Enhanced Mobile Header with Menu Button */}
        <div className="md:hidden sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl text-white hover:bg-gray-700/50 transition-all duration-200 active:scale-95"
              aria-label="Open sidebar menu"
              title="Open sidebar menu"
            >
              <FaBars size={18} />
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-white">
                {activeTab === 'library' ? 'Music Library' : 
                 activeTab === 'upload' ? 'Upload Music' : 
                 activeTab === 'admin' ? 'Admin Panel' : 'Music Library'}
              </h1>
            </div>
            
            {publicView ? (
              <div className="flex space-x-2">
                <a 
                  href="/login" 
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 shadow-lg"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  className="px-3 py-2 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 shadow-lg"
                >
                  Sign Up
                </a>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Collapsible Header Content */}
          {activeTab === 'library' && (
            <div className={`transition-all duration-400 ease-in-out overflow-hidden ${
              headerCollapsed ? 'max-h-0 opacity-0' : 'max-h-32 opacity-100'
            }`}>
              <div className="px-4 pb-3 border-t border-gray-700/30">
                <div className="flex items-center justify-between mt-3">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">
                      {publicView 
                        ? "Discover amazing music" 
                        : `Welcome back, ${user?.username}`
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setHeaderCollapsed(!headerCollapsed)}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 active:scale-95"
                    title={headerCollapsed ? "Expand header" : "Collapse header"}
                  >
                    {headerCollapsed ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Desktop Header - Collapsible on scroll */}
        <header className={`hidden md:block glass-card border-b border-gray-700/50 px-4 lg:px-6 relative overflow-hidden transition-all duration-500 ease-in-out ${
          headerCollapsed ? 'py-3 opacity-75 scale-98' : 'py-4 lg:py-6 opacity-100 scale-100'
        }`}>
          {/* Background decoration */}
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 transition-opacity duration-500 ${
            headerCollapsed ? 'opacity-0' : 'opacity-100'
          }`}></div>
          
          <div className="relative z-10">
            {/* Banner Section */}
            <div className={`transition-all duration-500 ease-in-out ${
              headerCollapsed ? 'mb-2 transform scale-90 opacity-80' : 'mb-3 lg:mb-4 transform scale-100 opacity-100'
            }`}>
              <ResonaBanner />
            </div>
            
            {/* Collapsible Content */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              headerCollapsed ? 'max-h-0 opacity-0 transform -translate-y-4' : 'max-h-96 opacity-100 transform translate-y-0'
            }`}>
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  {!publicView && (
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-lg lg:text-2xl font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {activeTab === 'library' ? 'Music Library' : 
                       activeTab === 'upload' ? 'Upload Music' :
                       activeTab === 'admin' ? 'Admin Panel' : 'Music Library'}
                    </h1>
                    <p className="text-gray-300 text-base lg:text-lg">
                      {publicView 
                        ? "Discover amazing music • Login for full access" 
                        : (
                          <>
                            Welcome back, {' '}
                            <span className="font-semibold gradient-text">
                              {user?.username || 'User'}
                            </span>
                          </>
                        )
                      }
                    </p>
                  </div>
                </div>
                
                {/* Stats and Auth buttons - Responsive */}
                <div className="hidden md:flex lg:flex items-center space-x-4 lg:space-x-6">
                  {publicView ? (
                    <div className="flex space-x-2 lg:space-x-3">
                      <a 
                        href="/login" 
                        className="px-3 lg:px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg text-sm lg:text-base"
                      >
                        Login
                      </a>
                      <a 
                        href="/register" 
                        className="px-3 lg:px-4 py-2 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg text-sm lg:text-base"
                      >
                        Sign Up
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-white">{playlist?.length || 0}</div>
                        <div className="text-xs lg:text-sm text-gray-400">Tracks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl lg:text-2xl font-bold text-white">∞</div>
                        <div className="text-xs lg:text-sm text-gray-400">Hours</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Collapse/Expand Toggle - Only show on library tab */}
            {activeTab === 'library' && (
              <div className="absolute right-4 lg:right-6 flex flex-col items-center">
                <button
                  onClick={() => setHeaderCollapsed(!headerCollapsed)}
                  className={`transition-all duration-300 ease-in-out p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50 hover:scale-110 active:scale-95 ${
                    headerCollapsed ? 'top-3' : 'top-4 lg:top-6'
                  }`}
                  title={headerCollapsed ? "Expand header" : "Collapse header"}
                  aria-label={headerCollapsed ? "Expand header" : "Collapse header"}
                >
                  {headerCollapsed ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronUp size={14} />
                  )}
                </button>
                
                {/* Scroll hint text - only show when expanded */}
                {!headerCollapsed && (
                  <div className="mt-2 text-xs text-gray-500 text-center opacity-70 hover:opacity-100 transition-opacity hidden lg:block">
                    <div className="whitespace-nowrap">Scroll to collapse</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Enhanced Content Area - Mobile and Desktop Optimized */}
        <main className="flex-1 overflow-auto bg-transparent pb-20 md:pb-24 overscroll-none">
          <div className="fade-in p-3 md:p-4 lg:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;