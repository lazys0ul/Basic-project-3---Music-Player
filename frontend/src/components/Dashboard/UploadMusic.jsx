import React, { useState } from 'react';
import { useMusic } from '../../hooks/useMusic';
import { FaImage, FaCheck } from 'react-icons/fa';
import { UploadCloudIcon, WaveformIcon } from '../../assets/icons.jsx';
import { MusicWaveIcon } from '../../assets/resona-brand.jsx';

const UploadMusic = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: ''
  });
  const [musicFile, setMusicFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState({ music: false, image: false });

  const { uploadMusic } = useMusic();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (file, type) => {
    if (type === 'music') {
      setMusicFile(file);
      if (errors.musicFile) {
        setErrors(prev => ({ ...prev, musicFile: '' }));
      }
    } else {
      setImageFile(file);
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist name is required';
    }

    if (!musicFile) {
      newErrors.musicFile = 'Music file is required';
    } else {
      const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/flac'];
      if (!allowedAudioTypes.includes(musicFile.type)) {
        newErrors.musicFile = 'Please select a valid audio file (MP3, WAV, FLAC)';
      }
    }

    if (!imageFile) {
      newErrors.imageFile = 'Cover image is required';
    } else {
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedImageTypes.includes(imageFile.type)) {
        newErrors.imageFile = 'Please select a valid image file (JPG, PNG, GIF, WebP)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setUploading(true);
    
    try {
      const result = await uploadMusic(
        formData.title.trim(),
        formData.artist.trim(),
        musicFile,
        imageFile
      );

      if (result.success) {
        // Reset form
        setFormData({ title: '', artist: '' });
        setMusicFile(null);
        setImageFile(null);
        setErrors({});
      }
    } finally {
      setUploading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const FileUploadArea = ({ type, file, icon: Icon, title, accept, description }) => (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
        dragOver[type] 
          ? 'border-purple-500 bg-purple-500/10' 
          : file 
            ? 'border-green-500 bg-green-500/10' 
            : errors[`${type}File`] 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-gray-600 hover:border-gray-500'
      }`}
      onDragOver={(e) => handleDragOver(e, type)}
      onDragLeave={(e) => handleDragLeave(e, type)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0], type)}
        className="hidden"
        id={`${type}Upload`}
      />
      
      <label htmlFor={`${type}Upload`} className="cursor-pointer block">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          file ? 'bg-green-500' : 'bg-gray-700'
        }`}>
          {file ? <FaCheck className="text-2xl text-white" /> : <Icon className="text-2xl text-gray-400" />}
        </div>
        
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        
        {file ? (
          <div>
            <p className="text-green-400 font-medium mb-1">{file.name}</p>
            <p className="text-sm text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleFileSelect(null, type);
              }}
              className="mt-2 text-sm text-red-400 hover:text-red-300"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-2">{description}</p>
            <p className="text-sm text-purple-400">
              Click to browse or drag and drop
            </p>
          </div>
        )}
      </label>
      
      {errors[`${type}File`] && (
        <p className="mt-2 text-sm text-red-500">{errors[`${type}File`]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UploadCloudIcon size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Upload New Track
          </h2>
          <p className="text-gray-400">Share your music with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Song Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter song title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Artist Name *
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                  errors.artist ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter artist name"
              />
              {errors.artist && <p className="mt-1 text-sm text-red-500">{errors.artist}</p>}
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileUploadArea
              type="music"
              file={musicFile}
              icon={MusicWaveIcon}
              title="Music File"
              accept="audio/*"
              description="Upload your audio file (MP3, WAV, FLAC)"
            />

            <FileUploadArea
              type="image"
              file={imageFile}
              icon={FaImage}
              title="Cover Image"
              accept="image/*"
              description="Upload cover art (JPG, PNG, GIF, WebP)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] shadow-lg"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Music'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMusic;