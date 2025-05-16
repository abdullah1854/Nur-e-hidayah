import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuran } from '../context/QuranContext';
import { QuranAPI } from '../services/quranAPI';
const Icon = Platform.OS === 'web' ? require('../components/Icon.web').default : require('react-native-vector-icons/MaterialIcons').default;
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import WebAudioRecorderPlayer from '../services/webAudioPlayer';

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

const ReadingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    fontSize,
    isDarkMode,
    selectedTranslation,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  
  const audioRecorderPlayer = Platform.OS === 'web' ? new (WebAudioRecorderPlayer as any)() : new AudioRecorderPlayer();
  const { surahNumber, ayahNumber } = route.params || { surahNumber: 1, ayahNumber: 1 };

  useEffect(() => {
    loadSurah();
    setCurrentSurah(surahNumber);
    if (ayahNumber) {
      setCurrentAyah(ayahNumber);
    }
  }, [surahNumber]);

  const loadSurah = async () => {
    setLoading(true);
    try {
      console.log('Loading surah', surahNumber);
      const [arabicData, translationData] = await Promise.all([
        QuranAPI.getSurah(surahNumber), // Get default (Arabic) text
        QuranAPI.getSurah(surahNumber, selectedTranslation),
      ]);
      console.log('Arabic data:', arabicData);
      console.log('Translation data:', translationData);
      setSurah(arabicData);
      setTranslation(translationData);
    } catch (error) {
      console.error('Error loading surah:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAyah = async (ayah: Ayah) => {
    try {
      if (isPlaying && currentPlayingAyah === ayah.number) {
        await audioRecorderPlayer.stopPlayer();
        setIsPlaying(false);
        setCurrentPlayingAyah(null);
      } else {
        if (isPlaying) {
          await audioRecorderPlayer.stopPlayer();
        }
        if (ayah.audio) {
          await audioRecorderPlayer.startPlayer(ayah.audio);
          setIsPlaying(true);
          setCurrentPlayingAyah(ayah.number);
          
          audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
              setIsPlaying(false);
              setCurrentPlayingAyah(null);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
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

  const renderAyah = (ayah: Ayah, index: number) => {
    const isBookmarked = bookmarks.some(
      (b) => b.surah === surahNumber && b.ayah === ayah.numberInSurah
    );
    const translationAyah = translation?.ayahs[index];
    
    // Handle Bismillah duplication
    let displayText = ayah.text;
    // For all surahs EXCEPT Al-Fatiha (1) and At-Tawbah (9), remove Bismillah from first verse
    if (surahNumber !== 1 && surahNumber !== 9 && ayah.numberInSurah === 1) {
      // Remove the Bismillah part from the first verse text to prevent duplication
      // Create a more flexible regex that matches any Bismillah variation at the start of the text
      displayText = displayText.replace(/^.*?(?:بسم|بِسْمِ|بِسۡمِ).*?(?:الله|اللَّهِ|ٱللَّهِ).*?(?:الرحمن|الرَّحْمَٰنِ|ٱلرَّحۡمَـٰنِ).*?(?:الرحيم|الرَّحِيمِ|ٱلرَّحِیمِ)/, '').trim();
    }

    return (
      <View key={ayah.number} style={styles.ayahContainer}>
        <View style={styles.ayahHeader}>
          <Text style={[styles.ayahNumber, isDarkMode && styles.darkText]}>
            {ayah.numberInSurah}
          </Text>
          <View style={styles.ayahActions}>
            <TouchableOpacity
              onPress={() => toggleBookmark(ayah.numberInSurah)}
              style={styles.actionButton}>
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                size={20}
                color={isBookmarked ? '#007AFF' : '#666'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => playAyah(ayah)}
              style={styles.actionButton}>
              <Icon
                name={
                  isPlaying && currentPlayingAyah === ayah.number
                    ? 'pause'
                    : 'play-arrow'
                }
                size={20}
                color="#007AFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Tafseer', {
                surahNumber,
                ayahNumber: ayah.numberInSurah
              })}
              style={styles.actionButton}>
              <Icon name="menu-book" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={[
            styles.arabicText,
            { fontSize: fontSize + 8 },
            isDarkMode && styles.darkText,
          ]}>
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
      <View style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.surahName, isDarkMode && styles.darkText]}>
          {surah?.englishName} ({surah?.name})
        </Text>
        <TouchableOpacity
          onPress={() => setShowTranslation(!showTranslation)}
          style={styles.translationToggle}>
          <Icon
            name={showTranslation ? 'visibility' : 'visibility-off'}
            size={24}
            color={isDarkMode ? 'white' : '#333'}
          />
          <Text style={[styles.toggleText, isDarkMode && styles.darkText]}>
            Translation
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {surah?.ayahs.map((ayah, index) => renderAyah(ayah, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1c1c1c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkHeader: {
    backgroundColor: '#2c2c2c',
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: 'white',
  },
  translationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  ayahContainer: {
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ayahNumber: {
    backgroundColor: '#007AFF',
    color: 'white',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
  },
  ayahActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 40,
    textAlign: 'right',
    fontFamily: 'Arial',
    marginBottom: 12,
    color: '#333',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default ReadingScreen;