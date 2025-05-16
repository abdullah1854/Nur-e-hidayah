import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuran } from '../../context/QuranContext';
import { QuranAPI } from '../../services/quranAPI';
import WebLayout from '../../components/web/WebLayout';

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

const WebSearchScreen = () => {
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

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} style={{ backgroundColor: '#ffeaa7', fontWeight: 'bold' }}>{part}</span> : 
        part
    );
  };

  const renderSearchResult = (result: SearchResult) => (
    <View key={result.surah.number} style={[styles.resultCard, isDarkMode && styles.darkCard]}>
      <View style={styles.surahHeader}>
        <Text style={[styles.surahTitle, isDarkMode && styles.darkText]}>
          {result.surah.englishName}
        </Text>
        <Text style={[styles.arabicTitle, isDarkMode && styles.darkText]} className="arabic-text">
          {result.surah.name}
        </Text>
      </View>
      
      {result.ayahs.map((ayah) => (
        <TouchableOpacity
          key={ayah.number}
          style={styles.ayahResult}
          onPress={() => navigation.navigate('Reading' as never, {
            surahNumber: result.surah.number,
            ayahNumber: ayah.numberInSurah
          } as never)}>
          <View style={styles.ayahNumber}>
            <Text style={styles.numberText}>{ayah.numberInSurah}</Text>
          </View>
          <Text style={[styles.ayahText, isDarkMode && styles.darkText]}>
            {highlightText(ayah.text, searchQuery)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <WebLayout>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Search Header */}
        <View style={[styles.searchHeader, isDarkMode && styles.darkHeader]}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            Search the Quran
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.darkSubtext]}>
            Find verses by keywords or meanings
          </Text>
          
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.searchInput, isDarkMode && styles.darkInput]}
              placeholder="Enter keywords to search..."
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === 'keyword' && styles.activeModeButton
              ]}
              onPress={() => setSearchMode('keyword')}>
              <Text style={[
                styles.modeText,
                searchMode === 'keyword' && styles.activeModeText
              ]}>
                Keyword Search
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === 'semantic' && styles.activeModeButton
              ]}
              onPress={() => setSearchMode('semantic')}>
              <Text style={[
                styles.modeText,
                searchMode === 'semantic' && styles.activeModeText
              ]}>
                Semantic Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        <ScrollView style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
                Searching...
              </Text>
            </View>
          ) : searchResults.length > 0 ? (
            searchResults.map(renderSearchResult)
          ) : searchQuery && !loading ? (
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
                No results found for "{searchQuery}"
              </Text>
            </View>
          ) : null}
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
  searchHeader: {
    backgroundColor: 'white',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  darkHeader: {
    backgroundColor: '#2d2d2d',
    borderBottomColor: '#444',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  darkText: {
    color: 'white',
  },
  darkSubtext: {
    color: '#999',
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#333',
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    color: '#666',
    fontWeight: '500',
  },
  activeModeText: {
    color: 'white',
  },
  resultsContainer: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  darkCard: {
    backgroundColor: '#2d2d2d',
  },
  surahHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 12,
    marginBottom: 16,
  },
  surahTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  arabicTitle: {
    fontSize: 24,
    marginTop: 4,
    color: '#333',
  },
  ayahResult: {
    flexDirection: 'row',
    paddingVertical: 12,
    cursor: 'pointer',
  },
  ayahNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ayahText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  noResults: {
    alignItems: 'center',
    marginTop: 48,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
  },
};

export default WebSearchScreen;