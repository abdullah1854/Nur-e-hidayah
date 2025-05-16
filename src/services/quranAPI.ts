import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';
const TAFSEER_API = 'https://api.qurancdn.com';

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
      // Using alquran.cloud API for tafseer
      const response = await axios.get(
        `${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/editions/en.sahih,ar.muyassar`
      );
      
      // Format the response to match expected format
      const tafseerData = {
        tafseer_id: tafsirId,
        tafseer_name: tafsirId === 1 ? 'English - Sahih International' : 'Arabic - Muyassar',
        ayah_number: ayahNumber,
        text: tafsirId === 1 ? response.data.data[0].text : response.data.data[1].text
      };
      
      return tafseerData;
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
      // If the reciter is the old format, convert it
      const reciterMap: { [key: string]: string } = {
        'Abdul_Basit_Murattal_128kbps': 'ar.abdulbasitmurattal',
        'Alafasy_128kbps': 'ar.alafasy',
        'Husary_128kbps': 'ar.husary',
        'Minshawy_Murattal_128kbps': 'ar.minshawi'
      };
      
      const actualReciter = reciterMap[reciter] || reciter;
      
      console.log('Fetching audio for:', reference, 'with reciter:', actualReciter);
      const response = await axios.get(`${BASE_URL}/ayah/${reference}/${actualReciter}`);
      console.log('Audio API response:', response.data);
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        // For audio editions, the response includes the audio URL
        const audioUrl = data.audio || data.audioSecondary?.[0];
        console.log('Available fields:', Object.keys(data));
        console.log('Audio URL from response:', audioUrl);
        return audioUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching audio:', error);
      // If not found, we might need to check available audio editions
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