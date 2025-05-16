import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';
const TAFSEER_API = 'https://api.qurancdn.com';
const TAFSEER_API_V2 = 'https://api.quran-tafseer.com'; // Changed from http to https
const TAFSIR_API_SPA5K = 'https://quran-tafsir.api.spa5k.com';

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

  // Get available tafseers - priority to spa5k API
  getAvailableTafseers: async () => {
    try {
      // Try spa5k API first (priority)
      const response = await axios.get(`${TAFSIR_API_SPA5K}/tafsirs`);
      if (response.data && response.data.tafsirs) {
        // Format spa5k tafsirs
        return response.data.tafsirs.map((t: any) => ({
          id: t.id,
          name: t.name,
          language: t.language,
          author: t.author
        }));
      }
    } catch (error) {
      console.error('Error fetching from spa5k API:', error);
      
      // Try secondary API
      try {
        const response = await axios.get(`${TAFSEER_API_V2}/tafseer/`);
        return response.data;
      } catch (secondError) {
        console.error('Error fetching from secondary API:', secondError);
      }
    }
    
    // Fallback to default list
    return [
      { id: 'en-tafisr-ibn-kathir', name: 'Ibn Kathir (English)', language: 'en' },
      { id: 'ar-tafsir-ibn-kathir', name: 'Ibn Kathir (Arabic)', language: 'ar' },
      { id: 'en-tafsir-maarif-ul-quran', name: 'Maarif ul Quran (English)', language: 'en' },
      { id: 'ur-tafseer-ibn-kaseer', name: 'Ibn Kathir (Urdu)', language: 'ur' },
      { id: 'hi.hindi', name: 'Hindi Translation', language: 'hi' },
    ];
  },

  // Get tafseer for an ayah
  getTafseer: async (surahNumber: number, ayahNumber: number, tafsirId: string | number) => {
    console.log(`Getting tafseer: surah ${surahNumber}, ayah ${ayahNumber}, tafsir ${tafsirId}`);
    
    try {
      // If tafsirId is string (spa5k format), try spa5k API first
      if (typeof tafsirId === 'string' && tafsirId.includes('-')) {
        try {
          const url = `${TAFSIR_API_SPA5K}/tafsirs/${tafsirId}/ayat/${surahNumber}:${ayahNumber}`;
          console.log('Trying spa5k API:', url);
          const response = await axios.get(url);
          console.log('spa5k response:', response.data);
          
          if (response.data && response.data.text) {
            return {
              tafseer_id: tafsirId,
              tafseer_name: response.data?.tafsir?.name || tafsirId,
              ayah_number: ayahNumber,
              text: response.data.text
            };
          }
        } catch (spa5kError) {
          console.error('Error from spa5k API:', spa5kError.message);
        }
      }
      
      // Try secondary API for numeric IDs
      if (typeof tafsirId === 'number') {
        try {
          const url = `${TAFSEER_API_V2}/tafseer/${tafsirId}/${surahNumber}/${ayahNumber}`;
          console.log('Trying secondary API:', url);
          const response = await axios.get(url);
          console.log('Secondary API response:', response.data);
          
          if (response.data && response.data.text) {
            return {
              tafseer_id: tafsirId,
              tafseer_name: response.data.tafseer_name || `Tafseer ${tafsirId}`,
              ayah_number: ayahNumber,
              text: response.data.text
            };
          }
        } catch (apiError) {
          console.error('Error from secondary API:', apiError.message);
        }
      }
      
      // Fallback to alquran.cloud translations
      console.log('Falling back to alquran.cloud translations');
      
      const editions: { [key: string | number]: string } = {
        1: 'en.sahih',
        2: 'ar.muyassar',
        3: 'ur.ahmedali',
        4: 'hi.hindi',
        'en-tafisr-ibn-kathir': 'en.sahih',
        'ar-tafsir-ibn-kathir': 'ar.muyassar',
        'ur-tafseer-ibn-kaseer': 'ur.ahmedali',
        'en-tafsir-saadi': 'en.sahih',
        'hi.hindi': 'hi.hindi'
      };
      
      // Map tafsir ID to edition
      let edition = editions[tafsirId] || 'en.sahih';
      
      // Extract language from string IDs
      if (typeof tafsirId === 'string' && !editions[tafsirId]) {
        const langPart = tafsirId.split('-')[0];
        if (langPart === 'ur') edition = 'ur.ahmedali';
        else if (langPart === 'hi') edition = 'hi.hindi';
        else if (langPart === 'ar') edition = 'ar.muyassar';
      }
      
      const url = `${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${edition}`;
      console.log('Using alquran.cloud fallback:', url);
      
      const response = await axios.get(url);
      console.log('Alquran.cloud response:', response.data);
      
      const tafseerNames: { [key: string | number]: string } = {
        1: 'English - Sahih International',
        2: 'Arabic - Taiseer',
        3: 'Urdu - Ahmed Ali',
        4: 'Hindi Translation',
        'en-tafisr-ibn-kathir': 'Ibn Kathir (English Translation)',
        'ar-tafsir-ibn-kathir': 'Ibn Kathir (Arabic Translation)',
        'ur-tafseer-ibn-kaseer': 'Ibn Kathir (Urdu Translation)',
        'en-tafsir-saadi': 'Tafsir Sa\'di (English Translation)',
        'en.sahih': 'English - Sahih International',
        'ar.muyassar': 'Arabic - Taiseer',
        'ur.ahmedali': 'Urdu - Ahmed Ali',
        'hi.hindi': 'Hindi Translation'
      };
      
      return {
        tafseer_id: tafsirId,
        tafseer_name: tafseerNames[tafsirId] || tafseerNames[edition] || 'Translation',
        ayah_number: ayahNumber,
        text: response.data.data.text
      };
    } catch (error) {
      console.error('Error fetching tafseer (final catch):', error);
      console.error('Error details:', {
        surahNumber,
        ayahNumber,
        tafsirId,
        errorMessage: error.message,
        errorResponse: error.response?.data
      });
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
  
  // Get audio for full surah
  getSurahAudio: async (surahNumber: number, reciter: string = 'ar.alafasy') => {
    try {
      const reciterMap: { [key: string]: string } = {
        'Abdul_Basit_Murattal_128kbps': 'ar.abdulbasitmurattal',
        'Alafasy_128kbps': 'ar.alafasy',
        'Husary_128kbps': 'ar.husary',
        'Minshawy_Murattal_128kbps': 'ar.minshawi'
      };
      
      const actualReciter = reciterMap[reciter] || reciter;
      
      // Map to multiple CDN patterns to try
      const cdnPatterns = [
        // Pattern 1: download.quranicaudio.com (most common)
        {
          url: 'https://download.quranicaudio.com/quran/',
          reciters: {
            'ar.alafasy': 'Alafasy_128kbps',
            'ar.abdulbasitmurattal': 'Abdul_Basit_Murattal_128kbps',
            'ar.husary': 'Husary_128kbps',
            'ar.minshawi': 'Minshawy_Murattal_128kbps'
          }
        },
        // Pattern 2: cdn.islamic.network (alternative)
        {
          url: 'https://cdn.islamic.network/quran/audio-surah/128/',
          reciters: {
            'ar.alafasy': 'ar.alafasy',
            'ar.abdulbasitmurattal': 'ar.abdulbasitmurattal',
            'ar.husary': 'ar.husary',
            'ar.minshawi': 'ar.minshawi'
          }
        },
        // Pattern 3: everyayah.com (another alternative)
        {
          url: 'https://everyayah.com/data/',
          reciters: {
            'ar.alafasy': 'Alafasy_128kbps',
            'ar.abdulbasitmurattal': 'Abdul_Basit_Murattal_128kbps',
            'ar.husary': 'Husary_128kbps',
            'ar.minshawi': 'Minshawy_Murattal_128kbps'
          }
        }
      ];
      
      const paddedSurahNumber = String(surahNumber).padStart(3, '0');
      
      for (const pattern of cdnPatterns) {
        const cdnReciter = pattern.reciters[actualReciter] || pattern.reciters['ar.alafasy'];
        const surahAudioUrl = `${pattern.url}${cdnReciter}/${paddedSurahNumber}.mp3`;
        
        console.log('Trying Surah audio URL:', surahAudioUrl);
        
        // For everyayah.com, they use a different pattern
        if (pattern.url.includes('everyayah.com')) {
          const everyayahUrl = `${pattern.url}${cdnReciter}/${paddedSurahNumber}.mp3`;
          console.log('Using EveryAyah URL:', everyayahUrl);
          return everyayahUrl;
        }
        
        // Return the URL to try - the audio element will handle validation
        return surahAudioUrl;
      }
      
      // Final fallback - use alquran.cloud pattern
      console.warn('All CDN attempts failed, using fallback pattern');
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${paddedSurahNumber}.mp3`;
      
    } catch (error) {
      console.error('Error fetching surah audio:', error);
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