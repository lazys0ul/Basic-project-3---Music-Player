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
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-8 float">
          <FaMusic className="text-5xl text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 gradient-text">No Music Yet</h2>
        <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
          Start building your music library by uploading your first track and create your personal soundtrack.
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
    <div className="p-6 space-y-6 fade-in">
      {/* Enhanced Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FaHeadphones className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Music Library</h2>
              <p className="text-gray-400">
                {sortedMusic.length} track{sortedMusic.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} placeholder="Search music by title or artist..." />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white backdrop-blur-sm"
            aria-label="Sort music by"
            title="Sort music by"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="artist">Artist A-Z</option>
          </select>
        </div>
      </div>

      {/* Music List */}
      <div className="space-y-3">
        {sortedMusic.map((track, index) => {
          const isCurrentTrack = currentTrack && currentTrack._id === track._id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;

          return (
            <div
              key={track._id}
              className={`group music-card p-4 transition-all duration-300 scale-in ${
                isCurrentTrack
                  ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 shadow-lg shadow-purple-500/20'
                  : 'hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                {/* Enhanced Play Button & Cover */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden shadow-lg">
                    {track.imageFilepath ? (
                      <img
                        src={`${BACKEND_URL}/uploads/${track.imageFilepath}`}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                        <FaMusic className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlayTrack(track, index)}
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
                    className="p-3 text-gray-400 hover:text-blue-400 transition-all duration-200 rounded-xl hover:bg-blue-400/10"
                    title="Download"
                    aria-label={`Download ${track.title}`}
                  >
                    <FaDownload size={16} />
                  </a>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteTrack(track._id, track.title)}
                    className="p-3 text-gray-400 hover:text-red-400 transition-all duration-200 rounded-xl hover:bg-red-400/10"
                    title="Delete"
                    aria-label={`Delete ${track.title}`}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedMusic.length === 0 && (
        <div className="text-center py-16 fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaSearch className="text-3xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Music Found</h3>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Try searching with different keywords or upload some music to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;