import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

// Platform-specific imports
let storage: any;
if (Platform.OS === 'web') {
  storage = require('../services/webStorage').default;
} else {
  storage = require('@react-native-async-storage/async-storage').default;
}

interface QuranContextType {
  currentSurah: number;
  currentAyah: number;
  setCurrentSurah: (surah: number) => void;
  setCurrentAyah: (ayah: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  selectedTranslation: string;
  setSelectedTranslation: (translation: string) => void;
  selectedReciter: string;
  setSelectedReciter: (reciter: string) => void;
  bookmarks: Array<{ surah: number; ayah: number }>;
  addBookmark: (surah: number, ayah: number) => void;
  removeBookmark: (surah: number, ayah: number) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};

interface QuranProviderProps {
  children: ReactNode;
}

export const QuranProvider: React.FC<QuranProviderProps> = ({ children }) => {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');
  const [selectedReciter, setSelectedReciter] = useState('Abdul_Basit_Murattal_128kbps');
  const [bookmarks, setBookmarks] = useState<Array<{ surah: number; ayah: number }>>([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await storage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize || 18);
        setIsDarkMode(settings.isDarkMode || false);
        setSelectedTranslation(settings.selectedTranslation || 'en.sahih');
        setSelectedReciter(settings.selectedReciter || 'Abdul_Basit_Murattal_128kbps');
      }

      const savedBookmarks = await storage.getItem('bookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      const savedPosition = await storage.getItem('position');
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        setCurrentSurah(position.surah || 1);
        setCurrentAyah(position.ayah || 1);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await storage.setItem('settings', JSON.stringify({
        fontSize,
        isDarkMode,
        selectedTranslation,
        selectedReciter
      }));
      await storage.setItem('bookmarks', JSON.stringify(bookmarks));
      await storage.setItem('position', JSON.stringify({
        surah: currentSurah,
        ayah: currentAyah
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addBookmark = (surah: number, ayah: number) => {
    const newBookmark = { surah, ayah };
    setBookmarks(prev => [...prev, newBookmark]);
    saveSettings();
  };

  const removeBookmark = (surah: number, ayah: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surah === surah && b.ayah === ayah)));
    saveSettings();
  };

  useEffect(() => {
    saveSettings();
  }, [fontSize, isDarkMode, selectedTranslation, selectedReciter, currentSurah, currentAyah]);

  return (
    <QuranContext.Provider value={{
      currentSurah,
      currentAyah,
      setCurrentSurah,
      setCurrentAyah,
      fontSize,
      setFontSize,
      isDarkMode,
      setIsDarkMode,
      selectedTranslation,
      setSelectedTranslation,
      selectedReciter,
      setSelectedReciter,
      bookmarks,
      addBookmark,
      removeBookmark
    }}>
      {children}
    </QuranContext.Provider>
  );
};