import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuran } from '../context/QuranContext';
const Icon = Platform.OS === 'web' ? require('../components/Icon.web').default : require('react-native-vector-icons/MaterialIcons').default;

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark, isDarkMode } = useQuran();

  const renderBookmark = ({ item }: { item: { surah: number; ayah: number } }) => (
    <TouchableOpacity
      style={[styles.bookmarkItem, isDarkMode && styles.darkItem]}
      onPress={() => navigation.navigate('Reading', {
        surahNumber: item.surah,
        ayahNumber: item.ayah
      })}>
      <View style={styles.bookmarkInfo}>
        <Text style={[styles.bookmarkText, isDarkMode && styles.darkText]}>
          Surah {item.surah}, Ayah {item.ayah}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeBookmark(item.surah, item.ayah)}
        style={styles.deleteButton}>
        <Icon name="delete" size={24} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (bookmarks.length === 0) {
    return (
      <View style={[styles.emptyContainer, isDarkMode && styles.darkContainer]}>
        <Icon name="bookmark-border" size={64} color="#999" />
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
          No bookmarks yet
        </Text>
        <Text style={[styles.emptySubtext, isDarkMode && styles.darkSubtext]}>
          Bookmark verses while reading to find them here
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item) => `${item.surah}-${item.ayah}`}
        contentContainerStyle={styles.listContainer}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  darkText: {
    color: 'white',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  darkSubtext: {
    color: '#999',
  },
  listContainer: {
    padding: 16,
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
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
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 8,
  },
});

export default BookmarksScreen;