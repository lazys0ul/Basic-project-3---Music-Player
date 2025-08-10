import React, { useState, useMemo } from 'react';
import { useMusic } from '../../hooks/useMusic';
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
  FaUpload
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const MusicLibrary = () => {
  const {
    playlist,
    currentTrack,
    isPlaying,
    playTrack,
    deleteMusic,
    fetchMusic,
    BACKEND_URL
  } = useMusic();

  const [sortBy, setSortBy] = useState('newest');

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
    const actualIndex = playlist.findIndex(t => t._id === track._id);
    playTrack(track, actualIndex);
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
          Your library is empty. Upload some music tracks to get started with your personal collection.
        </p>
        <button
          onClick={() => window.location.hash = '#upload'}
          className="neo-button text-lg px-8 py-4"
        >
          <FaUpload className="mr-2" />
          Upload Music
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Music Library</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <FaMusic className="mr-2 text-purple-400" />
              {playlist.length} {playlist.length === 1 ? 'Track' : 'Tracks'}
            </span>
            <span className="flex items-center">
              <FaHeadphones className="mr-2 text-green-400" />
              Ready to Stream
            </span>
          </div>
        </div>
        
        {/* Sort dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 pr-8 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none appearance-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
            <option value="artist">Artist (A-Z)</option>
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <FaSearch className="text-gray-400 text-xs" />
          </div>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search music by title or artist..." />
      
      {/* Enhanced Music List */}
      <div className="space-y-2 sm:space-y-3 mt-6">
        {sortedMusic.map((track, index) => {
          const isCurrentTrack = currentTrack?._id === track._id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;
          
          return (
            <div
              key={track._id}
              className={`group relative bg-gradient-to-r from-gray-800/80 via-gray-800/60 to-gray-800/40 
                backdrop-blur-sm border border-gray-700/50 rounded-xl transition-all duration-300 
                hover:from-gray-700/80 hover:via-gray-700/60 hover:to-gray-700/40 hover:border-gray-600/50 
                hover:shadow-lg glass-card fade-in cursor-pointer
                ${isCurrentTrack 
                  ? 'ring-2 ring-purple-500/50 border-purple-500/50 shadow-purple-500/10 shadow-lg' 
                  : 'hover:shadow-lg'
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handlePlayTrack(track)}
            >
              {/* Mobile Layout */}
              <div className="block sm:hidden p-3">
                <div className="flex items-start space-x-3">
                  {/* Album Cover with Play Button */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden shadow-md">
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
                        <FaMusic className="text-white text-lg" />
                      </div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-lg backdrop-blur-sm">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                        {isCurrentlyPlaying ? (
                          <FaPause className="text-black text-sm" />
                        ) : (
                          <FaPlay className="text-black text-sm ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Track Info - Full Details for Mobile */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className={`font-semibold text-base leading-tight ${
                          isCurrentTrack ? 'text-purple-400' : 'text-white'
                        }`}>
                          {track.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-tight mt-0.5">
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
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {formatDate(track.createdAt)}
                      </span>
                      {isCurrentlyPlaying && (
                        <span className="text-green-400 font-medium px-2 py-0.5 bg-green-400/10 rounded-full text-xs">
                          Playing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Mobile Actions Row */}
                <div className="flex items-center justify-center space-x-6 mt-3 pt-3 border-t border-gray-700/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Like functionality
                    }}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-all duration-200 text-xs"
                  >
                    <FaHeart size={12} />
                    <span>Like</span>
                  </button>
                  
                  <a
                    href={`${BACKEND_URL}/${track.filepath}`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-all duration-200 text-xs"
                  >
                    <FaDownload size={12} />
                    <span>Download</span>
                  </a>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTrack(track._id, track.title);
                    }}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-all duration-200 text-xs"
                  >
                    <FaTrash size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block p-4">
                <div className="flex items-center space-x-4">
                  {/* Enhanced Play Button & Cover */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden shadow-lg">
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayTrack(track);
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-xl backdrop-blur-sm"
                      aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                      title={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        {isCurrentlyPlaying ? (
                          <FaPause className="text-black text-sm" />
                        ) : (
                          <FaPlay className="text-black text-sm ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Enhanced Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold truncate text-lg ${
                        isCurrentTrack ? 'text-purple-400' : 'text-white'
                      }`}>
                        {track.title}
                      </h3>
                      {isCurrentlyPlaying && (
                        <div className="flex items-center space-x-2">
                          <div className="music-bars scale-75">
                            <div className="music-bar"></div>
                            <div className="music-bar"></div>
                            <div className="music-bar"></div>
                          </div>
                          <span className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full">
                            Playing
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 truncate mb-2">{track.artist}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {formatDate(track.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Like functionality
                      }}
                      className="p-3 text-gray-400 hover:text-red-400 transition-all duration-200 rounded-xl hover:bg-red-400/10"
                      title="Like"
                      aria-label={`Like ${track.title}`}
                    >
                      <FaHeart size={16} />
                    </button>

                    {/* Download */}
                    <a
                      href={`${BACKEND_URL}/${track.filepath}`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 text-gray-400 hover:text-blue-400 transition-all duration-200 rounded-xl hover:bg-blue-400/10"
                      title="Download"
                      aria-label={`Download ${track.title}`}
                    >
                      <FaDownload size={16} />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrack(track._id, track.title);
                      }}
                      className="p-3 text-gray-400 hover:text-red-400 transition-all duration-200 rounded-xl hover:bg-red-400/10"
                      title="Delete"
                      aria-label={`Delete ${track.title}`}
                    >
                      <FaTrash size={16} />
                    </button>
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
