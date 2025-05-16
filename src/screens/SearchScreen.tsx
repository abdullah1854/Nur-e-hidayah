import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuran } from '../context/QuranContext';
import { QuranAPI } from '../services/quranAPI';
const Icon = Platform.OS === 'web' ? require('../components/Icon.web').default : require('react-native-vector-icons/MaterialIcons').default;

interface SearchResult {
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  ayahs: Array<{
    number: number;
    text: string;
    numberInSurah: number;
  }>;
}

const SearchScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useQuran();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>('keyword');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await QuranAPI.search(searchQuery);
      // Group results by surah
      const groupedResults: SearchResult[] = results.matches.reduce((acc: SearchResult[], match: any) => {
        const surahIndex = acc.findIndex(item => item.surah.number === match.surah.number);
        if (surahIndex > -1) {
          acc[surahIndex].ayahs.push(match);
        } else {
          acc.push({
            surah: match.surah,
            ayahs: [match]
          });
        }
        return acc;
      }, []);
      setSearchResults(groupedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <View style={[styles.resultContainer, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.surahTitle, isDarkMode && styles.darkText]}>
        {item.surah.englishName} ({item.surah.name})
      </Text>
      {item.ayahs.map((ayah) => (
        <TouchableOpacity
          key={ayah.number}
          style={styles.ayahContainer}
          onPress={() => navigation.navigate('Reading', {
            surahNumber: item.surah.number,
            ayahNumber: ayah.numberInSurah
          })}>
          <Text style={[styles.ayahNumber, isDarkMode && styles.darkSubtext]}>
            Verse {ayah.numberInSurah}
          </Text>
          <Text style={[styles.ayahText, isDarkMode && styles.darkText]} numberOfLines={2}>
            {ayah.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkInput]}
            placeholder="Search in Quran..."
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              searchMode === 'keyword' && styles.selectedMode
            ]}
            onPress={() => setSearchMode('keyword')}>
            <Text style={[
              styles.modeText,
              searchMode === 'keyword' && styles.selectedModeText
            ]}>
              Keyword
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              searchMode === 'semantic' && styles.selectedMode
            ]}
            onPress={() => setSearchMode('semantic')}>
            <Text style={[
              styles.modeText,
              searchMode === 'semantic' && styles.selectedModeText
            ]}>
              Semantic
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => `${item.surah.number}-${index}`}
          contentContainerStyle={styles.resultsContainer}
        />
      )}
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
  searchHeader: {
    backgroundColor: 'white',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  darkInput: {
    color: 'white',
    backgroundColor: '#333',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedMode: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedModeText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  surahTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  darkText: {
    color: 'white',
  },
  ayahContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ayahNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  darkSubtext: {
    color: '#999',
  },
  ayahText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default SearchScreen;