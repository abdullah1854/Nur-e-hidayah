import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { authService } from '../services/authService';

// Platform-specific imports
let storage: any;
if (Platform.OS === 'web') {
  storage = require('../services/webStorage').default;
} else {
  storage = require('@react-native-async-storage/async-storage').default;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
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
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load user data
      const savedUser = await storage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedSettings = await storage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize || 18);
        setIsDarkMode(settings.isDarkMode || false);
        setSelectedTranslation(settings.selectedTranslation || 'en.sahih');
        setSelectedReciter(settings.selectedReciter || 'ar.abdulbasitmurattal');
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
      const settings = {
        fontSize,
        isDarkMode,
        selectedTranslation,
        selectedReciter
      };
      
      await storage.setItem('settings', JSON.stringify(settings));
      await storage.setItem('bookmarks', JSON.stringify(bookmarks));
      await storage.setItem('position', JSON.stringify({
        surah: currentSurah,
        ayah: currentAyah
      }));
      
      // Sync with backend if user is logged in
      if (user) {
        try {
          await authService.updateSettings(settings);
          await authService.updatePosition(currentSurah, currentAyah);
        } catch (error) {
          console.error('Error syncing with backend:', error);
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addBookmark = async (surah: number, ayah: number) => {
    const newBookmark = { surah, ayah };
    setBookmarks(prev => [...prev, newBookmark]);
    saveSettings();
    
    // Sync with backend if user is logged in
    if (user) {
      try {
        await authService.addBookmark(surah, ayah);
      } catch (error) {
        console.error('Error syncing bookmark:', error);
      }
    }
  };

  const removeBookmark = async (surah: number, ayah: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surah === surah && b.ayah === ayah)));
    saveSettings();
    
    // Sync with backend if user is logged in
    if (user) {
      try {
        await authService.removeBookmark(surah, ayah);
      } catch (error) {
        console.error('Error removing bookmark:', error);
      }
    }
  };

  const logout = () => {
    // Clear user data
    setUser(null);
    storage.removeItem('user');
    storage.removeItem('authToken');
    // Clear user-specific data
    setBookmarks([]);
    setCurrentSurah(1);
    setCurrentAyah(1);
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
      removeBookmark,
      user,
      setUser,
      logout
    }}>
      {children}
    </QuranContext.Provider>
  );
};