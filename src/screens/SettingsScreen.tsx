import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { useQuran } from '../context/QuranContext';
const Icon = Platform.OS === 'web' ? require('../components/Icon.web').default : require('react-native-vector-icons/MaterialIcons').default;

const SettingsScreen = () => {
  const {
    fontSize,
    setFontSize,
    isDarkMode,
    setIsDarkMode,
    selectedTranslation,
    setSelectedTranslation,
    selectedReciter,
    setSelectedReciter,
  } = useQuran();

  const translations = [
    { id: 'en.sahih', name: 'Sahih International' },
    { id: 'en.yusufali', name: 'Yusuf Ali' },
    { id: 'en.pickthall', name: 'Pickthall' },
    { id: 'ur.ahmedali', name: 'Ahmed Ali (Urdu)' },
    { id: 'ur.jalandhry', name: 'Jalandhry (Urdu)' },
  ];

  const reciters = [
    { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit' },
    { id: 'ar.alafasy', name: 'Mishary Alafasy' },
    { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
    { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
  ];

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Display</Text>
        
        <View style={[styles.settingItem, isDarkMode && styles.darkItem]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, isDarkMode && styles.darkItem]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Font Size</Text>
          <View style={styles.fontSizeControls}>
            <TouchableOpacity
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}
              style={styles.fontButton}>
              <Icon name="remove" size={24} color={isDarkMode ? 'white' : '#333'} />
            </TouchableOpacity>
            <Text style={[styles.fontSizeText, isDarkMode && styles.darkText]}>
              {fontSize}
            </Text>
            <TouchableOpacity
              onPress={() => setFontSize(Math.min(30, fontSize + 2))}
              style={styles.fontButton}>
              <Icon name="add" size={24} color={isDarkMode ? 'white' : '#333'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Translation</Text>
        {translations.map((translation) => (
          <TouchableOpacity
            key={translation.id}
            style={[styles.settingItem, isDarkMode && styles.darkItem]}
            onPress={() => setSelectedTranslation(translation.id)}>
            <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>
              {translation.name}
            </Text>
            {selectedTranslation === translation.id && (
              <Icon name="check" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Reciter</Text>
        {reciters.map((reciter) => (
          <TouchableOpacity
            key={reciter.id}
            style={[styles.settingItem, isDarkMode && styles.darkItem]}
            onPress={() => setSelectedReciter(reciter.id)}>
            <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>
              {reciter.name}
            </Text>
            {selectedReciter === reciter.id && (
              <Icon name="check" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>About</Text>
        <View style={[styles.settingItem, isDarkMode && styles.darkItem]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Version</Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSubtext]}>1.0.0</Text>
        </View>
        <View style={[styles.settingItem, isDarkMode && styles.darkItem]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Developer</Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSubtext]}>Your Name</Text>
        </View>
      </View>
    </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  darkText: {
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 1,
    borderRadius: 8,
  },
  darkItem: {
    backgroundColor: '#2c2c2c',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  darkSubtext: {
    color: '#999',
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fontButton: {
    padding: 4,
  },
  fontSizeText: {
    fontSize: 16,
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
});

export default SettingsScreen;