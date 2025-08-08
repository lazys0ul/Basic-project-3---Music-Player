// Custom SVG Icons for Harmony Hub
import React from 'react';

export const HarmonyLogo = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    
    {/* Outer ring */}
    <circle
      cx="50"
      cy="50"
      r="45"
      stroke="url(#logoGradient)"
      strokeWidth="3"
      fill="none"
    />
    
    {/* Inner musical elements */}
    <path
      d="M35 35c0-5 5-10 15-10s15 5 15 10v30c0 5-5 10-15 10s-15-5-15-10V35z"
      fill="url(#logoGradient)"
      opacity="0.3"
    />
    
    {/* Music note */}
    <circle cx="40" cy="60" r="6" fill="url(#logoGradient)" />
    <circle cx="60" cy="55" r="6" fill="url(#logoGradient)" />
    <path
      d="M46 60v-25h14v20"
      stroke="url(#logoGradient)"
      strokeWidth="3"
      fill="none"
    />
    
    {/* Sound waves */}
    <path
      d="M20 45c5-10 5-10 10 0s5 10-10 0"
      stroke="url(#logoGradient)"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M70 45c5-10 5-10 10 0s5 10-10 0"
      stroke="url(#logoGradient)"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

export const WaveformIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 12h2l2-8 4 16 4-12 2 4h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UploadCloudIcon = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path
      d="M16 16l-4-4-4 4"
      stroke="url(#uploadGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12v9"
      stroke="url(#uploadGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"
      stroke="url(#uploadGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
