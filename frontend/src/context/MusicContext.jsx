import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const audioRef = useRef(new Audio());

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_BASE = `${BACKEND_URL}/api`;

  // Define playTrack first
  const playTrack = useCallback(async (track, index) => {
    setLoading(true);
    const filename = track.filepath.replace(/^uploads[/\\]/, '').replace(/\\/g, '/');
    const audioUrl = `${BACKEND_URL}/stream/${encodeURIComponent(filename)}`;
    
    try {
      if (currentTrack && currentTrack._id === track._id && !audioRef.current.paused) {
        // If same track is playing, just pause/resume
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      setCurrentTrack(track);
      setCurrentIndex(index);
      
      audioRef.current.src = audioUrl;
      
      await audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error playing track:', error);
        console.error('Failed audio URL:', audioUrl);
        console.error('Track filepath:', track.filepath);
        console.error('Audio element state:', {
          src: audioRef.current.src,
          networkState: audioRef.current.networkState,
          readyState: audioRef.current.readyState,
          error: audioRef.current.error
        });
      }
      toast.error(`Failed to play track: ${error.message}`);
      setLoading(false);
    }
  }, [currentTrack, BACKEND_URL]);

  // Now define playNext that uses playTrack
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    if (playlist[nextIndex]) {
      playTrack(playlist[nextIndex], nextIndex);
    }
  }, [playlist, currentIndex, playTrack]);

  // Audio event listeners  
  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };

    const handleCanPlayThrough = () => {
      setLoading(false);
    };

    const handleWaiting = () => {
      setLoading(true);
    };

    const handleError = (e) => {
      console.error('Audio playback error:', e);
      console.error('Audio source:', audioRef.current.src);
      console.error('Audio networkState:', audioRef.current.networkState);
      console.error('Audio readyState:', audioRef.current.readyState);
      setLoading(false);
      setIsPlaying(false);
      toast.error('Audio playback failed. Please check the file format.');
    };

    const handleLoadStart = () => {
      setLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [playNext]);

  // Update audio volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Fetch all music tracks with optional search
  const fetchMusic = useCallback(async (searchParams = {}) => {
    try {
      const params = new URLSearchParams(searchParams).toString()
      const url = params ? `${API_BASE}/music?${params}` : `${API_BASE}/music`
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setPlaylist(response.data.music);
        return response.data.music;
      } else {
        toast.error('Failed to load music: ' + (response.data.message || 'Unknown error'));
        return [];
      }
    } catch (error) {
      console.error('Error fetching music:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load music';
      toast.error(errorMessage);
      return [];
    }
  }, [API_BASE]);

  // Upload new music
  const uploadMusic = async (title, artist, musicFile, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('music', musicFile);
      formData.append('image', imageFile);

      const response = await axios.post(`${API_BASE}/music/add-music`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Music uploaded successfully!');
        await fetchMusic(); // Refresh the playlist
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Upload failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete music
  const deleteMusic = async (musicId) => {
    try {
      const response = await axios.delete(`${API_BASE}/music/delete-music/${musicId}`);
      if (response.data.success) {
        toast.success('Music deleted successfully!');
        await fetchMusic(); // Refresh the playlist
        
        // If currently playing track was deleted, stop playing
        if (currentTrack && currentTrack._id === musicId) {
          stop();
        }
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Delete failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Play/pause current track
  const togglePlayPause = async () => {
    if (!currentTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      toast.error('Playback error');
    }
  };

  // Pause
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Stop
  const stop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    if (playlist[prevIndex]) {
      playTrack(playlist[prevIndex], prevIndex);
    }
  }, [playlist, currentIndex, playTrack]);

  // Seek to specific time
  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    playlist,
    currentTrack,
    currentIndex,
    isPlaying,
    duration,
    currentTime,
    volume,
    loading,
    fetchMusic,
    uploadMusic,
    deleteMusic,
    playTrack,
    togglePlayPause,
    pause,
    stop,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    formatTime,
    BACKEND_URL
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext };