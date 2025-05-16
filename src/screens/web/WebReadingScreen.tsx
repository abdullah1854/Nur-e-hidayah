import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuran } from '../../context/QuranContext';
import { QuranAPI } from '../../services/quranAPI';
import WebLayout from '../../components/web/WebLayout';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

const WebReadingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    fontSize,
    isDarkMode,
    selectedTranslation,
    selectedReciter,
    setCurrentSurah,
    setCurrentAyah,
    bookmarks,
    addBookmark,
    removeBookmark,
  } = useQuran();

  const [surah, setSurah] = useState<Surah | null>(null);
  const [translation, setTranslation] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafseer, setShowTafseer] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  
  const { surahNumber, ayahNumber } = route.params || { surahNumber: 1, ayahNumber: 1 };

  useEffect(() => {
    loadSurah();
    setCurrentSurah(surahNumber);
    if (ayahNumber) {
      setCurrentAyah(ayahNumber);
      // Scroll to specific ayah after loading
      setTimeout(() => {
        const element = document.getElementById(`ayah-${ayahNumber}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [surahNumber]);

  const loadSurah = async () => {
    setLoading(true);
    try {
      const [arabicData, translationData] = await Promise.all([
        QuranAPI.getSurah(surahNumber),
        QuranAPI.getSurah(surahNumber, selectedTranslation),
      ]);
      setSurah(arabicData);
      setTranslation(translationData);
    } catch (error) {
      console.error('Error loading surah:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (ayahNumber: number) => {
    const isBookmarked = bookmarks.some(
      (b) => b.surah === surahNumber && b.ayah === ayahNumber
    );
    
    if (isBookmarked) {
      removeBookmark(surahNumber, ayahNumber);
    } else {
      addBookmark(surahNumber, ayahNumber);
    }
  };
  
  const playAyahAudio = async (ayahNumber: number) => {
    try {
      console.log('Playing audio for ayah:', ayahNumber, 'surah:', surahNumber);
      
      // Stop current audio if playing
      if (audioPlayer) {
        audioPlayer.pause();
        setAudioPlayer(null);
      }
      
      // If clicking on the same ayah that's playing, just stop
      if (playingAyah === ayahNumber) {
        setPlayingAyah(null);
        return;
      }
      
      // Get audio URL for this ayah
      const audioUrl = await QuranAPI.getAyahAudio(
        `${surahNumber}:${ayahNumber}`,
        selectedReciter
      );
      
      console.log('Audio URL:', audioUrl);
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
        });
        audio.addEventListener('ended', () => {
          setPlayingAyah(null);
          setAudioPlayer(null);
        });
        
        await audio.play();
        setAudioPlayer(audio);
        setPlayingAyah(ayahNumber);
      } else {
        console.error('No audio URL received');
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAyah(null);
    }
  };

  const renderAyah = (ayah: Ayah, index: number) => {
    const isBookmarked = bookmarks.some(
      (b) => b.surah === surahNumber && b.ayah === ayah.numberInSurah
    );
    const translationAyah = translation?.ayahs[index];
    const isSelected = selectedAyah === ayah.numberInSurah;
    
    // For Surah Al-Fatiha (1), we need to handle the first ayah specially
    // because the API includes Bismillah in the first ayah text
    let displayText = ayah.text;
    if (surahNumber === 1 && ayah.numberInSurah === 1) {
      // Remove the Bismillah part from the first verse text to prevent duplication
      displayText = displayText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
    }

    return (
      <View
        key={ayah.number}
        id={`ayah-${ayah.numberInSurah}`}
        style={[
          styles.ayahContainer,
          isDarkMode && styles.darkAyahContainer,
          isSelected && styles.selectedAyah,
        ]}
        className="fade-in">
        <View style={styles.ayahHeader}>
          <View style={styles.ayahNumber}>
            <Text style={styles.numberText}>{ayah.numberInSurah}</Text>
          </View>
          <View style={styles.ayahActions}>
            <TouchableOpacity
              onPress={() => toggleBookmark(ayah.numberInSurah)}
              style={styles.actionButton}>
              <Text style={styles.actionIcon}>
                {isBookmarked ? '🔖' : '📑'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedAyah(ayah.numberInSurah);
                navigation.navigate('Tafseer' as never, {
                  surahNumber,
                  ayahNumber: ayah.numberInSurah
                } as never);
              }}
              style={styles.actionButton}>
              <Text style={styles.actionIcon}>📖</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => playAyahAudio(ayah.numberInSurah)}
              style={styles.actionButton}>
              <Text style={styles.actionIcon}>
                {playingAyah === ayah.numberInSurah ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text
          style={[
            styles.arabicText,
            { fontSize: fontSize + 10 },
            isDarkMode && styles.darkText,
          ]}
          className="arabic-text">
          {displayText}
        </Text>
        
        {showTranslation && translationAyah && (
          <Text
            style={[
              styles.translationText,
              { fontSize },
              isDarkMode && styles.darkText,
            ]}>
            {translationAyah.text}
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <WebLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading Surah...
          </Text>
        </View>
      </WebLayout>
    );
  }

  return (
    <WebLayout>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Header */}
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home' as never)}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={[styles.backText, isDarkMode && styles.darkText]}>
              Back to Surahs
            </Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.surahName, isDarkMode && styles.darkText]}>
              {surah?.englishName}
            </Text>
            <Text style={[styles.arabicName, isDarkMode && styles.darkText]} className="arabic-text">
              {surah?.name}
            </Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setShowTranslation(!showTranslation)}
              style={[styles.controlButton, !showTranslation && styles.inactiveButton]}>
              <Text style={styles.controlIcon}>
                {showTranslation ? '👁️' : '🚫'}
              </Text>
              <Text style={[styles.controlText, isDarkMode && styles.darkText]}>
                Translation
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ayahs */}
        <ScrollView style={styles.content}>
          {/* Show Basmala for all surahs except 1 (Al-Fatihah) and 9 (At-Tawbah) */}
          {surahNumber !== 1 && surahNumber !== 9 && (
            <View style={styles.bismillah}>
              <Text style={[styles.bismillahText, isDarkMode && styles.darkText]} className="arabic-text">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </Text>
            </View>
          )}
          {surah?.ayahs.map((ayah, index) => renderAyah(ayah, index))}
        </ScrollView>
      </View>
    </WebLayout>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkHeader: {
    backgroundColor: '#2d2d2d',
    borderBottomColor: '#444',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    marginRight: 8,
    color: '#007AFF',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerInfo: {
    alignItems: 'center',
  },
  surahName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  arabicName: {
    fontSize: 28,
    marginTop: 4,
    color: '#333',
  },
  darkText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  inactiveButton: {
    opacity: 0.6,
  },
  controlIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  controlText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  bismillah: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  bismillahText: {
    fontSize: 32,
    color: '#333',
  },
  ayahContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  darkAyahContainer: {
    backgroundColor: '#2d2d2d',
  },
  selectedAyah: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ayahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ayahActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  arabicText: {
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 56,
    color: '#333',
  },
  translationText: {
    lineHeight: 28,
    color: '#666',
  },
};

export default WebReadingScreen;