import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';
const TAFSEER_API = 'https://quran-tafseer-api.herokuapp.com';

export const QuranAPI = {
  // Get all surahs
  getAllSurahs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/surah`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  },

  // Get specific surah with Arabic text
  getSurah: async (surahNumber: number, edition?: string) => {
    try {
      if (!edition) {
        // Get Arabic text without edition parameter
        console.log(`Fetching surah ${surahNumber} (Arabic)`);
        const response = await axios.get(`${BASE_URL}/surah/${surahNumber}`);
        console.log('API response (Arabic):', response.data);
        return response.data.data;
      } else {
        console.log(`Fetching surah ${surahNumber} with edition ${edition}`);
        const response = await axios.get(`${BASE_URL}/surah/${surahNumber}/${edition}`);
        console.log('API response for', edition, ':', response.data);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching surah:', error);
      throw error;
    }
  },

  // Get specific ayah
  getAyah: async (reference: string, translation: string = 'en.sahih') => {
    try {
      const response = await axios.get(`${BASE_URL}/ayah/${reference}/${translation}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ayah:', error);
      throw error;
    }
  },

  // Search in Quran
  search: async (keyword: string, surah?: number, language: string = 'en') => {
    try {
      const response = await axios.get(`${BASE_URL}/search/${keyword}/${surah || 'all'}/${language}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  // Get tafseer for an ayah
  getTafseer: async (surahNumber: number, ayahNumber: number, tafsirId: number = 1) => {
    try {
      const response = await axios.get(
        `${TAFSEER_API}/tafseer/${tafsirId}/${surahNumber}/${ayahNumber}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tafseer:', error);
      throw error;
    }
  },

  // Get available recitations
  getRecitations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/edition/format/audio`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recitations:', error);
      throw error;
    }
  },

  // Get audio for ayah
  getAyahAudio: async (reference: string, reciter: string = 'ar.alafasy') => {
    try {
      const response = await axios.get(`${BASE_URL}/ayah/${reference}/${reciter}`);
      return response.data.data.audio;
    } catch (error) {
      console.error('Error fetching audio:', error);
      throw error;
    }
  },

  // Get available translations
  getTranslations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/edition/type/translation`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  },
};