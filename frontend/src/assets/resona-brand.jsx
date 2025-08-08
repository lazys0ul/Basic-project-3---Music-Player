// Custom Resona Logo and Brand Assets
import React from 'react';
import logoResona from './logo_resona.png';
import resona from './resona.png';

export const ResonaLogo = ({ size = 40, className = "" }) => (
  <img
    src={logoResona}
    alt="Resona Logo"
    width={size}
    height={size}
    className={`object-contain ${className}`}
    style={{ width: size, height: size }}
  />
);

export const ResonaBanner = ({ className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20"></div>
    <div className="relative z-10 flex items-center justify-center py-8">
      <img
        src={resona}
        alt="Resona Banner"
        className="max-w-full max-h-16 object-contain"
      />
    </div>
  </div>
);

// Keep the existing icon components for other UI elements
export const MusicWaveIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path
      d="M3 12h2l2-6 4 12 4-9 2 3h4"
      stroke="url(#waveGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlayIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path
      d="M8 5v14l11-7L8 5z"
      fill="url(#playGradient)"
    />
  </svg>
);
