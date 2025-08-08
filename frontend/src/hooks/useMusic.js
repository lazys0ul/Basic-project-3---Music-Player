import { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
