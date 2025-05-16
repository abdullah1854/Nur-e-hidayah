import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuran } from '../../context/QuranContext';
import { QuranAPI } from '../../services/quranAPI';
import WebLayout from '../../components/web/WebLayout';

interface TafseerData {
  tafseer_id: number;
  tafseer_name: string;
  ayah_number: number;
  text: string;
}

const TAFSEER_OPTIONS = [
  { id: 1, name: 'English - Sahih International' },
  { id: 2, name: 'Arabic - Muyassar' },
];

const WebTafseerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { fontSize, isDarkMode } = useQuran();
  const { surahNumber, ayahNumber } = route.params;
  
  const [tafseerData, setTafseerData] = useState<TafseerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTafseer, setSelectedTafseer] = useState(1);

  useEffect(() => {
    loadTafseer();
  }, [selectedTafseer]);

  const loadTafseer = async () => {
    setLoading(true);
    try {
      const data = await QuranAPI.getTafseer(surahNumber, ayahNumber, selectedTafseer);
      setTafseerData(data);
    } catch (error) {
      console.error('Error loading tafseer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <WebLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
            Loading Tafseer...
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
            onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={[styles.backText, isDarkMode && styles.darkText]}>
              Back to Reading
            </Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>
              Tafseer
            </Text>
            <Text style={[styles.reference, isDarkMode && styles.darkSubtext]}>
              Surah {surahNumber}, Verse {ayahNumber}
            </Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        {/* Tafseer Selection */}
        <View style={[styles.tafseerSelector, isDarkMode && styles.darkSelector]}>
          {TAFSEER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.tafseerOption,
                selectedTafseer === option.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedTafseer(option.id)}>
              <Text
                style={[
                  styles.optionText,
                  selectedTafseer === option.id && styles.selectedOptionText,
                  isDarkMode && styles.darkText,
                ]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tafseer Content */}
        <ScrollView style={styles.content}>
          <View style={[styles.tafseerCard, isDarkMode && styles.darkCard]}>
            <Text style={[styles.tafseerName, isDarkMode && styles.darkText]}>
              {tafseerData?.tafseer_name}
            </Text>
            <Text
              style={[
                styles.tafseerText,
                { fontSize: fontSize + 2 },
                isDarkMode && styles.darkText,
              ]}>
              {tafseerData?.text}
            </Text>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  reference: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  darkText: {
    color: 'white',
  },
  darkSubtext: {
    color: '#999',
  },
  placeholder: {
    width: 120, // Match back button width for centering
  },
  tafseerSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    gap: 12,
  },
  darkSelector: {
    backgroundColor: '#2d2d2d',
    borderBottomColor: '#444',
  },
  tafseerOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedOptionText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  tafseerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  darkCard: {
    backgroundColor: '#2d2d2d',
  },
  tafseerName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  tafseerText: {
    lineHeight: 32,
    color: '#333',
    textAlign: 'justify',
  },
};

export default WebTafseerScreen;