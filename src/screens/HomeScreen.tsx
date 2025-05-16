import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuran } from '../context/QuranContext';
import { QuranAPI } from '../services/quranAPI';
const Icon = Platform.OS === 'web' ? require('../components/Icon.web').default : require('react-native-vector-icons/MaterialIcons').default;

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const HomeScreen = () => {
  console.log('HomeScreen rendering');
  const navigation = useNavigation();
  const { currentSurah, currentAyah, isDarkMode } = useQuran();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('HomeScreen useEffect - loading surahs');
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      console.log('Loading surahs from API...');
      const data = await QuranAPI.getAllSurahs();
      console.log('Surahs loaded:', data?.length);
      setSurahs(data || []);
      setError(null);
    } catch (error) {
      console.error('Error loading surahs:', error);
      setError('Failed to load surahs. Please check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSurahs();
  };

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={[styles.surahItem, isDarkMode && styles.darkItem]}
      onPress={() => navigation.navigate('Reading', { surahNumber: item.number })}>
      <View style={styles.surahNumber}>
        <Text style={[styles.numberText, isDarkMode && styles.darkText]}>
          {item.number}
        </Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={[styles.arabicName, isDarkMode && styles.darkText]}>
          {item.name}
        </Text>
        <Text style={[styles.englishName, isDarkMode && styles.darkSubtext]}>
          {item.englishName} - {item.englishNameTranslation}
        </Text>
        <Text style={[styles.surahMeta, isDarkMode && styles.darkSubtext]}>
          {item.numberOfAyahs} verses • {item.revelationType}
        </Text>
      </View>
      {item.number === currentSurah && (
        <Icon name="bookmark" size={20} color="#007AFF" style={styles.bookmarkIcon} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>Loading Surahs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSurahs}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('Rendering main content with', surahs.length, 'surahs');
  
  // Web-specific fallback to ScrollView
  if (Platform.OS === 'web' && surahs.length > 0) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
            Last Read: Surah {currentSurah}, Ayah {currentAyah}
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Reading', { 
              surahNumber: currentSurah, 
              ayahNumber: currentAyah 
            })}>
            <Text style={styles.continueText}>Continue Reading</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {surahs.map((item) => (
            <TouchableOpacity
              key={item.number}
              style={[styles.surahItem, isDarkMode && styles.darkItem]}
              onPress={() => navigation.navigate('Reading', { surahNumber: item.number })}>
              <View style={styles.surahNumber}>
                <Text style={[styles.numberText, isDarkMode && styles.darkText]}>
                  {item.number}
                </Text>
              </View>
              <View style={styles.surahInfo}>
                <Text style={[styles.arabicName, isDarkMode && styles.darkText]}>
                  {item.name}
                </Text>
                <Text style={[styles.englishName, isDarkMode && styles.darkSubtext]}>
                  {item.englishName} - {item.englishNameTranslation}
                </Text>
                <Text style={[styles.surahMeta, isDarkMode && styles.darkSubtext]}>
                  {item.numberOfAyahs} verses • {item.revelationType}
                </Text>
              </View>
              {item.number === currentSurah && (
                <Icon name="bookmark" size={20} color="#007AFF" style={styles.bookmarkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
          Last Read: Surah {currentSurah}, Ayah {currentAyah}
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Reading', { 
            surahNumber: currentSurah, 
            ayahNumber: currentAyah 
          })}>
          <Text style={styles.continueText}>Continue Reading</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={surahs}
        renderItem={renderSurah}
        keyExtractor={(item) => item.number.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  darkHeader: {
    backgroundColor: '#2c2c2c',
  },
  headerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  darkText: {
    color: 'white',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
  },
  surahItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  darkItem: {
    backgroundColor: '#2c2c2c',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  arabicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  englishName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  darkSubtext: {
    color: '#999',
  },
  surahMeta: {
    fontSize: 12,
    color: '#999',
  },
  bookmarkIcon: {
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;