import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface AudioWithFallbackProps {
  surahNumber: number;
  reciter: string;
  onComplete?: () => void;
}

const AudioWithFallback: React.FC<AudioWithFallbackProps> = ({ 
  surahNumber, 
  reciter = 'ar.alafasy',
  onComplete 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  // Multiple CDN URLs to try
  const getAudioUrls = () => {
    const paddedSurahNumber = String(surahNumber).padStart(3, '0');
    
    // Map reciters to different CDN formats
    const reciterMappings: { [key: string]: string[] } = {
      'ar.alafasy': ['Alafasy_128kbps', 'alafasy', 'Alafasy_64kbps'],
      'ar.abdulbasitmurattal': ['Abdul_Basit_Murattal_128kbps', 'abdulbasit', 'Abdulbasit_Murattal_192kbps'],
      'ar.husary': ['Husary_128kbps', 'husary', 'Husary_64kbps'],
      'ar.minshawi': ['Minshawy_Murattal_128kbps', 'minshawi', 'Minshawy_Mujawwad_192kbps']
    };

    const reciterNames = reciterMappings[reciter] || ['Alafasy_128kbps'];
    
    const urls: string[] = [];
    
    // Add multiple CDN patterns
    reciterNames.forEach(reciterName => {
      urls.push(
        `https://download.quranicaudio.com/quran/${reciterName}/${paddedSurahNumber}.mp3`,
        `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${paddedSurahNumber}.mp3`,
        `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${paddedSurahNumber}.mp3`,
        `https://everyayah.com/data/${reciterName}/${paddedSurahNumber}.mp3`,
        `https://server8.mp3quran.net/${reciterName.toLowerCase()}/${paddedSurahNumber}.mp3`
      );
    });
    
    return urls;
  };

  const audioUrls = getAudioUrls();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setLoading(false);
      setError('');
      console.log('Audio loaded successfully from:', audioUrls[currentUrlIndex]);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    const handleError = (e: Event) => {
      console.error(`Audio error for URL ${currentUrlIndex}:`, audioUrls[currentUrlIndex], e);
      
      // Try next URL
      if (currentUrlIndex < audioUrls.length - 1) {
        console.log('Trying next URL:', audioUrls[currentUrlIndex + 1]);
        setCurrentUrlIndex(currentUrlIndex + 1);
      } else {
        setError('Unable to load audio. Please check your internet connection.');
        setLoading(false);
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set the source
    audio.src = audioUrls[currentUrlIndex];
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentUrlIndex, audioUrls, onComplete]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || loading) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Play error:', err);
        setError('Failed to play audio. Please try again.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio || loading) return;

    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error('Play error:', err);
      setError('Failed to play audio. Please try again.');
    });
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <audio ref={audioRef} preload="auto" />
      
      {loading && (
        <Text style={styles.loadingText}>Loading audio...</Text>
      )}
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]} 
              onPress={togglePlayPause}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : (isPlaying ? 'Pause' : 'Play')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]} 
              onPress={restart}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  timeText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
});

export default AudioWithFallback;