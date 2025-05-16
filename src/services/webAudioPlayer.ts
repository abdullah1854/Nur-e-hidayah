// Web-specific audio player implementation
class WebAudioRecorderPlayer {
  private audio: HTMLAudioElement | null = null;
  private listeners: ((state: any) => void)[] = [];

  startPlayer = async (uri: string): Promise<void> => {
    try {
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(uri);
      this.audio.play();
      
      this.audio.addEventListener('timeupdate', () => {
        this.notifyListeners({
          currentPosition: this.audio!.currentTime * 1000,
          duration: this.audio!.duration * 1000
        });
      });

      this.audio.addEventListener('ended', () => {
        this.notifyListeners({
          currentPosition: this.audio!.duration * 1000,
          duration: this.audio!.duration * 1000
        });
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  stopPlayer = async (): Promise<void> => {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  };

  addPlayBackListener = (listener: (state: any) => void): void => {
    this.listeners.push(listener);
  };

  private notifyListeners = (state: any): void => {
    this.listeners.forEach(listener => listener(state));
  };
}

export default WebAudioRecorderPlayer;
export { WebAudioRecorderPlayer };