import React from 'react';
import { useMusic } from '../../hooks/useMusic';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute,
  FaMusic,
  FaRandom,
  FaRedoAlt
} from 'react-icons/fa';

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    loading,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    formatTime,
    BACKEND_URL
  } = useMusic();

  // Don't render if no track is selected
  if (!currentTrack) return null;

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Music visualizer bars component
  const MusicVisualizer = () => (
    <div className="music-bars">
      <div className="music-bar"></div>
      <div className="music-bar"></div>
      <div className="music-bar"></div>
      <div className="music-bar"></div>
      <div className="music-bar"></div>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 md:left-80 right-0 bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 border-t border-gray-700/50 px-2 md:px-4 py-3 md:py-4 z-40 glass-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Track Info with Enhanced Design - Responsive */}
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
            <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg hover-lift">
              {currentTrack.imageFilepath ? (
                <img
                  src={`${BACKEND_URL}/uploads/${currentTrack.imageFilepath.replace(/^uploads[/\\]/, '')}`}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaMusic className="text-white text-xl" />
              )}
              {/* Overlay with music visualizer when playing */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <MusicVisualizer />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm md:text-base font-semibold text-white truncate mb-1">
                {currentTrack.title}
              </h4>
              <p className="text-xs md:text-sm text-gray-300 truncate">
                {currentTrack.artist}
              </p>
              {/* Now playing indicator - Hidden on very small screens */}
              {isPlaying && (
                <div className="hidden sm:flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Now Playing</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Player Controls - Responsive */}
          <div className="flex flex-col items-center space-y-2 md:space-y-3 flex-1 max-w-md">
            {/* Control Buttons */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={playPrevious}
                className="text-gray-300 hover:text-white transition-all duration-200 p-1 md:p-2 rounded-full hover:bg-white/10"
                aria-label="Previous track"
                title="Previous track"
              >
                <FaStepBackward size={16} className="md:w-[18px] md:h-[18px]" />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 md:p-4 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 shadow-lg neo-button"
                aria-label={isPlaying ? "Pause" : "Play"}
                title={isPlaying ? "Pause" : "Play"}
              >
                {loading ? (
                  <div className="loading-spinner w-4 h-4 md:w-5 md:h-5"></div>
                ) : isPlaying ? (
                  <FaPause size={16} className="md:w-5 md:h-5" />
                ) : (
                  <FaPlay size={16} className="md:w-5 md:h-5 ml-1" />
                )}
              </button>

              <button
                onClick={playNext}
                className="text-gray-300 hover:text-white transition-all duration-200 p-1 md:p-2 rounded-full hover:bg-white/10"
                aria-label="Next track"
                title="Next track"
              >
                <FaStepForward size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>

            {/* Enhanced Progress Bar - Hidden on very small screens */}
            <div className="hidden sm:flex items-center space-x-3 w-full">
              <span className="text-xs text-gray-400 w-10 text-right font-mono">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-2 bg-gray-600 rounded-full cursor-pointer group relative overflow-hidden progress-glow"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative transition-all duration-200 group-hover:from-purple-400 group-hover:to-pink-400"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
                </div>
              </div>
              <span className="text-xs text-gray-400 w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Enhanced Volume Control - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3 min-w-0 flex-1 justify-end">
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="text-gray-300 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              title={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
            </button>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 slider"
                aria-label="Volume control"
                title="Volume control"
              />
              <span className="text-xs text-gray-400 w-8 font-mono">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Mobile Volume Control */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="text-gray-300 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              title={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;