import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useQuran } from '../../context/QuranContext';
import WebLayout from '../../components/web/WebLayout';

const WebSettingsScreen = () => {
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

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
  ];

  return (
    <WebLayout>
      <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
            Settings
          </Text>
          <Text style={[styles.headerSubtitle, isDarkMode && styles.darkSubtext]}>
            Customize your reading experience
          </Text>
        </View>

        {/* Theme Selection */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Theme
          </Text>
          <View style={styles.themeGrid}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  isDarkMode && styles.darkCard,
                  (theme.id === 'dark') === isDarkMode && styles.activeTheme,
                ]}
                onPress={() => setIsDarkMode(theme.id === 'dark')}>
                <Text style={styles.themeIcon}>{theme.icon}</Text>
                <Text style={[styles.themeName, isDarkMode && styles.darkText]}>
                  {theme.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Size */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Text Size
          </Text>
          <View style={styles.fontSizeContainer}>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}>
              <Text style={styles.fontButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.fontPreview}>
              <Text style={[styles.sampleText, { fontSize }, isDarkMode && styles.darkText]}>
                Sample Text • {fontSize}px
              </Text>
            </View>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() => setFontSize(Math.min(30, fontSize + 2))}>
              <Text style={styles.fontButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Translation Selection */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Translation
          </Text>
          <View style={styles.optionsGrid}>
            {translations.map((translation) => (
              <TouchableOpacity
                key={translation.id}
                style={[
                  styles.optionCard,
                  isDarkMode && styles.darkCard,
                  selectedTranslation === translation.id && styles.activeOption,
                ]}
                onPress={() => setSelectedTranslation(translation.id)}>
                <Text style={[
                  styles.optionText,
                  isDarkMode && styles.darkText,
                  selectedTranslation === translation.id && styles.activeOptionText,
                ]}>
                  {translation.name}
                </Text>
                {selectedTranslation === translation.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reciter Selection */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Reciter
          </Text>
          <View style={styles.optionsGrid}>
            {reciters.map((reciter) => (
              <TouchableOpacity
                key={reciter.id}
                style={[
                  styles.optionCard,
                  isDarkMode && styles.darkCard,
                  selectedReciter === reciter.id && styles.activeOption,
                ]}
                onPress={() => setSelectedReciter(reciter.id)}>
                <Text style={[
                  styles.optionText,
                  isDarkMode && styles.darkText,
                  selectedReciter === reciter.id && styles.activeOptionText,
                ]}>
                  {reciter.name}
                </Text>
                {selectedReciter === reciter.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            About
          </Text>
          <View style={[styles.aboutCard, isDarkMode && styles.darkCard]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, isDarkMode && styles.darkText]}>
                Version
              </Text>
              <Text style={[styles.aboutValue, isDarkMode && styles.darkSubtext]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, isDarkMode && styles.darkText]}>
                Developer
              </Text>
              <Text style={[styles.aboutValue, isDarkMode && styles.darkSubtext]}>
                Your Name
              </Text>
            </View>
            <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.aboutLabel, isDarkMode && styles.darkText]}>
                Contact
              </Text>
              <Text style={[styles.aboutValue, isDarkMode && styles.darkSubtext]}>
                contact@nur-e-hidayah.com
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  header: {
    backgroundColor: 'white',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  darkHeader: {
    backgroundColor: '#2d2d2d',
    borderBottomColor: '#444',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  darkText: {
    color: 'white',
  },
  darkSubtext: {
    color: '#999',
  },
  section: {
    backgroundColor: 'white',
    padding: 24,
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  darkSection: {
    backgroundColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  themeCard: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  darkCard: {
    backgroundColor: '#333',
  },
  activeTheme: {
    borderColor: '#007AFF',
  },
  themeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fontButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fontPreview: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  sampleText: {
    color: '#333',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  },
  optionCard: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e7f3ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  activeOptionText: {
    fontWeight: '600',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  aboutCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  aboutLabel: {
    fontSize: 16,
    color: '#333',
  },
  aboutValue: {
    fontSize: 16,
    color: '#666',
  },
};

export default WebSettingsScreen;