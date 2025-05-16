import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuran } from '../../context/QuranContext';
import { QuranAPI } from '../../services/quranAPI';
import WebLayout from '../../components/web/WebLayout';
import { Card } from '../../components/web/Card';
import { Button } from '../../components/web/Button';
import { webTheme } from '../../styles/webTheme';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const WebHomeScreen = () => {
  const navigation = useNavigation();
  const { currentSurah, currentAyah, isDarkMode } = useQuran();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadSurahs();
  }, []);

  useEffect(() => {
    const filtered = surahs.filter(surah => 
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name.includes(searchQuery) ||
      surah.number.toString().includes(searchQuery)
    );
    setFilteredSurahs(filtered);
  }, [searchQuery, surahs]);

  const loadSurahs = async () => {
    try {
      const data = await QuranAPI.getAllSurahs();
      setSurahs(data || []);
      setFilteredSurahs(data || []);
    } catch (error) {
      console.error('Error loading surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSurahCard = (surah: Surah, index: number) => (
    <View
      key={surah.number}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('Reading' as never, { surahNumber: surah.number } as never)}
      >
        <Card
          style={{
            ...styles.surahCard,
            ...(viewMode === 'list' ? styles.listCard : {}),
          }}
          darkMode={isDarkMode}
          padding="md"
        >
          <View style={{
            ...styles.surahNumber,
            ...(isDarkMode ? styles.surahNumberDark : {})
          }}>
            <Text style={styles.numberText}>{surah.number}</Text>
          </View>
          <View style={styles.surahInfo}>
            <Text style={{
              ...styles.arabicName,
              ...(isDarkMode ? styles.darkText : {})
            }}>
              {surah.name}
            </Text>
            <Text style={{
              ...styles.englishName,
              ...(isDarkMode ? styles.darkText : {})
            }}>
              {surah.englishName}
            </Text>
            <Text style={{
              ...styles.translation,
              ...(isDarkMode ? styles.darkSubtext : {})
            }}>
              {surah.englishNameTranslation}
            </Text>
            <View style={styles.metaContainer}>
              <View style={{
                ...styles.metaBadge,
                ...(isDarkMode ? styles.metaBadgeDark : {})
              }}>
                <Text style={{
                  ...styles.metaText,
                  ...(isDarkMode ? styles.metaTextDark : {})
                }}>
                  {surah.numberOfAyahs} verses
                </Text>
              </View>
              <View style={{
                ...styles.metaBadge,
                ...(isDarkMode ? styles.metaBadgeDark : {})
              }}>
                <Text style={{
                  ...styles.metaText,
                  ...(isDarkMode ? styles.metaTextDark : {})
                }}>
                  {surah.revelationType}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <WebLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={webTheme.colors.primary} />
          <Text style={{
            ...styles.loadingText,
            ...(isDarkMode ? styles.darkText : {})
          }}>
            Loading Quran...
          </Text>
        </View>
      </WebLayout>
    );
  }

  return (
    <WebLayout>
      <ScrollView style={{
        ...styles.container,
        ...(isDarkMode ? styles.darkContainer : {})
      }}>
        {/* Hero Section */}
        <View style={{
          ...styles.hero,
          ...(isDarkMode ? styles.heroBack : {})
        }}>
          <View style={styles.heroContent}>
            <Text style={{
              ...styles.heroTitle,
              ...(isDarkMode ? styles.heroTitleDark : {})
            }}>
              The Holy Quran
            </Text>
            <Text style={{
              ...styles.heroSubtitle,
              ...(isDarkMode ? styles.heroSubtitleDark : {})
            }}>
              Read, Study, and Understand the Divine Guidance
            </Text>
            {currentSurah && currentAyah && (
              <Button
                title={`Continue: Surah ${currentSurah}, Ayah ${currentAyah}`}
                onPress={() => navigation.navigate('Reading' as never, { 
                  surahNumber: currentSurah, 
                  ayahNumber: currentAyah 
                } as never)}
                size="lg"
                darkMode={isDarkMode}
                style={styles.continueButton}
              />
            )}
          </View>
          <View style={styles.heroPattern} />
        </View>

        {/* Search and Controls */}
        <View style={{
          ...styles.controls,
          ...(isDarkMode ? styles.controlsDark : {})
        }}>
          <View style={{
            ...styles.searchContainer,
            ...(isDarkMode ? styles.searchContainerDark : {})
          }}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={{
                ...styles.searchInput,
                ...(isDarkMode ? styles.searchInputDark : {})
              }}
              placeholder="Search surahs by name or number..."
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={{
                ...styles.viewButton,
                ...(viewMode === 'grid' ? styles.activeViewButton : {}),
                ...(isDarkMode ? styles.viewButtonDark : {}),
              }}
              onPress={() => setViewMode('grid')}>
              <Text style={{
                ...styles.viewIcon,
                ...(viewMode === 'grid' ? styles.activeViewIcon : {})
              }}>⊞</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.viewButton,
                ...(viewMode === 'list' ? styles.activeViewButton : {}),
                ...(isDarkMode ? styles.viewButtonDark : {}),
              }}
              onPress={() => setViewMode('list')}>
              <Text style={{
                ...styles.viewIcon,
                ...(viewMode === 'list' ? styles.activeViewIcon : {})
              }}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={{
            ...styles.resultsText,
            ...(isDarkMode ? styles.darkSubtext : {})
          }}>
            {filteredSurahs.length} {filteredSurahs.length === 1 ? 'Surah' : 'Surahs'} found
          </Text>
        </View>

        {/* Surahs Grid/List */}
        <View style={{
          ...styles.surahsContainer,
          ...(viewMode === 'grid' ? styles.gridContainer : styles.listContainer)
        }}>
          {filteredSurahs.map(renderSurahCard)}
        </View>
      </ScrollView>
    </WebLayout>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: webTheme.colors.background,
  },
  darkContainer: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: webTheme.typography.body1.fontSize,
    color: webTheme.colors.textSecondary,
  },
  hero: {
    backgroundColor: webTheme.colors.primary,
    padding: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBack: {
    backgroundColor: webTheme.colors.primaryDark,
  },
  heroContent: {
    zIndex: 1,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitleDark: {
    color: 'white',
  },
  heroSubtitle: {
    fontSize: webTheme.typography.h4.fontSize,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 32,
    textAlign: 'center',
  },
  heroSubtitleDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  continueButton: {
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: webTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: webTheme.colors.border,
  },
  controlsDark: {
    backgroundColor: webTheme.colors.surfaceDark,
    borderBottomColor: webTheme.colors.borderDark,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: webTheme.colors.background,
    borderRadius: webTheme.borderRadius.lg,
    paddingHorizontal: 16,
    marginRight: 16,
    height: 48,
  },
  searchContainerDark: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: webTheme.typography.body1.fontSize,
    color: webTheme.colors.text,
  },
  searchInputDark: {
    color: webTheme.colors.textDark,
  },
  viewModeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: webTheme.borderRadius.md,
    backgroundColor: webTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonDark: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  activeViewButton: {
    backgroundColor: webTheme.colors.primary,
  },
  viewIcon: {
    fontSize: 20,
    color: webTheme.colors.textSecondary,
  },
  activeViewIcon: {
    color: 'white',
  },
  resultsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  resultsText: {
    fontSize: webTheme.typography.body2.fontSize,
    color: webTheme.colors.textSecondary,
  },
  surahsContainer: {
    padding: 24,
  },
  gridContainer: {
    // @ts-ignore
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 24,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // @ts-ignore
    transition: 'all 0.2s ease',
  },
  listCard: {
    marginBottom: 0,
  },
  surahNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: webTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    boxShadow: webTheme.shadows.md,
  },
  surahNumberDark: {
    backgroundColor: webTheme.colors.primaryDark,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  surahInfo: {
    flex: 1,
  },
  arabicName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    color: webTheme.colors.text,
  },
  englishName: {
    fontSize: webTheme.typography.h4.fontSize,
    fontWeight: webTheme.typography.h4.fontWeight,
    marginBottom: 4,
    color: webTheme.colors.text,
  },
  translation: {
    fontSize: webTheme.typography.body1.fontSize,
    color: webTheme.colors.textSecondary,
    marginBottom: 12,
  },
  darkText: {
    color: webTheme.colors.textDark,
  },
  darkSubtext: {
    color: webTheme.colors.textSecondaryDark,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    backgroundColor: webTheme.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: webTheme.borderRadius.md,
  },
  metaBadgeDark: {
    backgroundColor: webTheme.colors.backgroundDark,
  },
  metaText: {
    fontSize: webTheme.typography.caption.fontSize,
    color: webTheme.colors.textSecondary,
    fontWeight: '500',
  },
  metaTextDark: {
    color: webTheme.colors.textSecondaryDark,
  },
};

export default WebHomeScreen;