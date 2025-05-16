import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuran } from '../context/QuranContext';
import { QuranAPI } from '../services/quranAPI';

interface TafseerData {
  tafseer_id: number;
  tafseer_name: string;
  ayah_number: number;
  text: string;
}

const TAFSEER_OPTIONS = [
  { id: 1, name: 'Ibn Kathir' },
  { id: 2, name: 'Jalalayn' },
  { id: 3, name: 'Qurtubi' },
  { id: 4, name: 'Muyassar' },
];

const TafseerScreen = () => {
  const route = useRoute();
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
      <View style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
          Surah {surahNumber}, Verse {ayahNumber}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tafseerSelector}>
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
                ]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text
            style={[
              styles.tafseerName,
              isDarkMode && styles.darkText,
            ]}>
            {tafseerData?.tafseer_name}
          </Text>
          <Text
            style={[
              styles.tafseerText,
              { fontSize },
              isDarkMode && styles.darkText,
            ]}>
            {tafseerData?.text}
          </Text>
        </View>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkHeader: {
    backgroundColor: '#2c2c2c',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  darkText: {
    color: 'white',
  },
  tafseerSelector: {
    flexDirection: 'row',
  },
  tafseerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  tafseerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  tafseerText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333',
    textAlign: 'justify',
  },
});

export default TafseerScreen;