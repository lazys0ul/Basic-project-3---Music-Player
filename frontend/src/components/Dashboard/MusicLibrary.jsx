import React, { useState, useMemo } from 'react';
import { useMusic } from '../../hooks/useMusic';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from './SearchBar';
import { 
  FaPlay, 
  FaPause, 
  FaTrash, 
  FaMusic,
  FaSearch,
  FaClock,
  FaDownload,
  FaHeart,
  FaHeadphones,
  FaUpload,
  FaLock,
  FaSignInAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const MusicLibrary = ({ publicView = false }) => {
  const {
    playlist,
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    deleteMusic,
    fetchMusic,
    BACKEND_URL
  } = useMusic();

  const { user } = useAuth();
  const [sortBy, setSortBy] = useState('newest');
  const [previewTimers, setPreviewTimers] = useState(new Map());

  // Clean up timers on unmount or when currentTrack changes
  React.useEffect(() => {
    return () => {
      previewTimers.forEach(timer => clearTimeout(timer));
    };
  }, [previewTimers]);

  // Clean up preview timer when user switches tracks
  React.useEffect(() => {
    if (currentTrack) {
      previewTimers.forEach((timer, trackId) => {
        if (trackId !== currentTrack._id) {
          clearTimeout(timer);
          setPreviewTimers(prev => {
            const newTimers = new Map(prev);
            newTimers.delete(trackId);
            return newTimers;
          });
        }
      });
    }
  }, [currentTrack, previewTimers]);

  // Handle search from SearchBar component
  const handleSearch = async (searchTerm) => {
    if (searchTerm.trim()) {
      await fetchMusic({ search: searchTerm });
    } else {
      await fetchMusic();
    }
  };

  // Filter and sort music
  const sortedMusic = useMemo(() => {
    let sorted = [...playlist];

    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'artist':
        return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [playlist, sortBy]);

  const handlePlayTrack = (track) => {
    const publicViewActive = publicView && !user;
    
    if (publicViewActive) {
      // Clear any existing timer for this track
      const existingTimer = previewTimers.get(track._id);
      if (existingTimer) {
        clearTimeout(existingTimer);
        setPreviewTimers(prev => {
          const newTimers = new Map(prev);
          newTimers.delete(track._id);
          return newTimers;
        });
      }
      
      // Start preview with 15-second limit
      const actualIndex = playlist.findIndex(t => t._id === track._id);
      playTrack(track, actualIndex);
      
      // Set timer to pause after 15 seconds
      const timer = setTimeout(() => {
        pauseTrack();
        
        // Clear the timer from state
        setPreviewTimers(prev => {
          const newTimers = new Map(prev);
          newTimers.delete(track._id);
          return newTimers;
        });
        
        // Show notification
        toast.info(
          <div className="flex flex-col space-y-2">
            <span className="font-medium">🔒 Preview ended (15s limit)</span>
            <span className="text-sm text-gray-300">"{track.title}" preview completed</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => window.location.href = '/register'}
                className="px-3 py-1 bg-pink-600 hover:bg-pink-700 rounded text-sm font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>,
          { 
            autoClose: 8000,
            closeOnClick: false,
            draggable: false
          }
        );
      }, 15000); // 15 seconds
      
      // Store timer for cleanup
      setPreviewTimers(prev => {
        const newTimers = new Map(prev);
        newTimers.set(track._id, timer);
        return newTimers;
      });
    } else {
      // Full access for authenticated users
      const actualIndex = playlist.findIndex(t => t._id === track._id);
      playTrack(track, actualIndex);
    }
  };

  const handleDeleteTrack = async (trackId, trackTitle) => {
    if (window.confirm(`Are you sure you want to delete "${trackTitle}"?`)) {
      const result = await deleteMusic(trackId);
      if (result.success) {
        toast.success('Track deleted successfully!');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (playlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 fade-in">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-8">
          <FaMusic className="text-4xl text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-4">No music found</h3>
        <p className="text-gray-400 mb-8 max-w-md">
          {publicView 
            ? "No public music available at the moment. Check back later for new tracks!"
            : "Your library is empty. Upload some music tracks to get started with your personal collection."
          }
        </p>
        {!publicView && (
          <button
            onClick={() => window.location.hash = '#upload'}
            className="neo-button text-lg px-8 py-4"
          >
            <FaUpload className="mr-2" />
            Upload Music
          </button>
        )}
        {publicView && (
          <div className="flex space-x-4">
            <a 
              href="/login" 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors shadow-lg flex items-center"
            >
              <FaSignInAlt className="mr-2" />
              Login to Upload
            </a>
            <a 
              href="/register" 
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-medium transition-colors shadow-lg"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 px-1">
        <div className="mb-3 sm:mb-0 w-full sm:w-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">Music Library</h2>
          <div className="flex items-center space-x-3 lg:space-x-4 text-xs md:text-sm text-gray-400">
            <span className="flex items-center">
              <FaMusic className="mr-1 lg:mr-2 text-purple-400" />
              {playlist.length} {playlist.length === 1 ? 'Track' : 'Tracks'}
            </span>
            <span className="flex items-center">
              <FaHeadphones className="mr-1 lg:mr-2 text-green-400" />
              Ready to Stream
            </span>
          </div>
        </div>
        
        {/* Enhanced Sort dropdown - Mobile First */}
        <div className="relative w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl px-3 lg:px-4 py-2.5 pr-8 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 outline-none appearance-none cursor-pointer transition-all duration-200 hover:bg-gray-700/80 text-sm lg:text-base"
            aria-label="Sort music by"
            title="Sort music by different criteria"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="artist">Artist (A-Z)</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <FaSearch className="text-gray-400 text-xs" />
          </div>
        </div>
      </div>

      <div className="px-1">
        <SearchBar onSearch={handleSearch} placeholder="Search music by title or artist..." />
      </div>
      
      {/* Enhanced Music List - Mobile Optimized */}
      <div className="space-y-2 lg:space-y-3 mt-4 lg:mt-6 px-1">
        {sortedMusic.map((track, index) => {
          const isCurrentTrack = currentTrack?._id === track._id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;
          
          return (
            <div
              key={track._id}
              className={`group relative bg-gradient-to-r from-gray-800/90 via-gray-800/70 to-gray-800/50 
                backdrop-blur-sm border border-gray-700/50 rounded-xl lg:rounded-2xl transition-all duration-300 
                hover:from-gray-700/90 hover:via-gray-700/70 hover:to-gray-700/50 hover:border-gray-600/50 
                hover:shadow-lg glass-card fade-in cursor-pointer active:scale-[0.98] touch-manipulation
                ${isCurrentTrack 
                  ? 'ring-2 ring-purple-500/50 border-purple-500/50 shadow-purple-500/10 shadow-lg' 
                  : 'hover:shadow-lg'
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handlePlayTrack(track)}
            >
              {/* Enhanced Mobile Layout */}
              <div className="block lg:hidden p-4">
                <div className="flex items-start space-x-4">
                  {/* Enhanced Album Cover with Play Button */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden shadow-lg">
                      {track.imageFilepath ? (
                        <img
                          src={`${BACKEND_URL}/uploads/${track.imageFilepath.replace(/\\/g, '/')}`}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 ${track.imageFilepath ? 'hidden' : ''}`}>
                        <FaMusic className="text-white text-xl" />
                      </div>
                    </div>
                    
                    {/* Enhanced Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-200 flex items-center justify-center rounded-xl backdrop-blur-sm">
                      <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95">
                        {isCurrentlyPlaying ? (
                          <FaPause className="text-black text-sm md:text-base" />
                        ) : (
                          <FaPlay className="text-black text-sm md:text-base ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Track Info for Mobile */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className={`font-semibold text-base md:text-lg leading-tight line-clamp-1 ${
                          isCurrentTrack ? 'text-purple-400' : 'text-white'
                        }`}>
                          {track.title}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-tight mt-1 line-clamp-1">
                          {track.artist}
                        </p>
                      </div>
                      {isCurrentlyPlaying && (
                        <div className="flex items-center space-x-2">
                          <div className="music-bars scale-75">
                            <div className="music-bar"></div>
                            <div className="music-bar"></div>
                            <div className="music-bar"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mt-2">
                      <span className="flex items-center">
                        <FaClock className="mr-1.5 text-xs" />
                        {formatDate(track.createdAt)}
                      </span>
                      {isCurrentlyPlaying && (
                        <span className="text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full text-xs">
                          Playing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Mobile Actions Row */}
                <div className="flex items-center justify-center space-x-8 mt-4 pt-3 border-t border-gray-700/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Like functionality
                    }}
                    className="flex flex-col items-center space-y-1 text-gray-400 hover:text-red-400 active:text-red-500 transition-all duration-200 p-2 rounded-lg hover:bg-red-400/10 active:scale-95 touch-manipulation"
                  >
                    <FaHeart size={16} />
                    <span className="text-xs font-medium">Like</span>
                  </button>
                  
                  <a
                    href={`${BACKEND_URL}/${track.filepath}`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-400 active:text-blue-500 transition-all duration-200 p-2 rounded-lg hover:bg-blue-400/10 active:scale-95 touch-manipulation"
                  >
                    <FaDownload size={16} />
                    <span className="text-xs font-medium">Download</span>
                  </a>
                  
                  {/* Delete button - only show to owners or admins, not in public view */}
                  {!publicView && (user?.role === 'admin' || track.uploadedBy?._id === user?.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrack(track._id, track.title);
                      }}
                      className="flex flex-col items-center space-y-1 text-gray-400 hover:text-red-400 active:text-red-500 transition-all duration-200 p-2 rounded-lg hover:bg-red-400/10 active:scale-95 touch-manipulation"
                    >
                      <FaTrash size={16} />
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Desktop Layout */}
              <div className="hidden lg:block p-5">
                <div className="flex items-center space-x-5">
                  {/* Enhanced Play Button & Cover */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
                      {track.imageFilepath ? (
                        <img
                          src={`${BACKEND_URL}/uploads/${track.imageFilepath.replace(/\\/g, '/')}`}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 ${track.imageFilepath ? 'hidden' : ''}`}>
                        <FaMusic className="text-white text-2xl" />
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayTrack(track);
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-2xl backdrop-blur-sm hover:scale-105 active:scale-95"
                      aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                      title={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl transform transition-transform hover:scale-110">
                        {isCurrentlyPlaying ? (
                          <FaPause className="text-black text-lg" />
                        ) : (
                          <FaPlay className="text-black text-lg ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Enhanced Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold text-xl leading-tight ${
                        isCurrentTrack ? 'text-purple-400' : 'text-white'
                      }`}>
                        {track.title}
                      </h3>
                      {isCurrentlyPlaying && (
                        <div className="flex items-center space-x-3">
                          <div className="music-bars">
                            <div className="music-bar"></div>
                            <div className="music-bar"></div>
                            <div className="music-bar"></div>
                          </div>
                          <span className="text-sm text-green-400 font-medium px-3 py-1 bg-green-400/10 rounded-full">
                            Playing
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-base mb-3">{track.artist}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FaClock className="mr-2" />
                        {formatDate(track.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Like functionality
                      }}
                      className="p-3 text-gray-400 hover:text-red-400 active:text-red-500 transition-all duration-200 rounded-xl hover:bg-red-400/10 hover:scale-110 active:scale-95"
                      title="Like"
                      aria-label={`Like ${track.title}`}
                    >
                      <FaHeart size={18} />
                    </button>

                    {/* Download */}
                    <a
                      href={`${BACKEND_URL}/${track.filepath}`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 text-gray-400 hover:text-blue-400 active:text-blue-500 transition-all duration-200 rounded-xl hover:bg-blue-400/10 hover:scale-110 active:scale-95"
                      title="Download"
                      aria-label={`Download ${track.title}`}
                    >
                      <FaDownload size={18} />
                    </a>

                    {/* Delete - only show to owners or admins, not in public view */}
                    {!publicView && (user?.role === 'admin' || track.uploadedBy?._id === user?.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrack(track._id, track.title);
                        }}
                        className="p-3 text-gray-400 hover:text-red-400 active:text-red-500 transition-all duration-200 rounded-xl hover:bg-red-400/10 hover:scale-110 active:scale-95"
                        title="Delete"
                        aria-label={`Delete ${track.title}`}
                      >
                        <FaTrash size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicLibrary;
