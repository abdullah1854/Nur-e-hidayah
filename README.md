# Nur-e-Hidayah

A comprehensive Quran mobile application built with React Native that provides complete Quranic text with translations, tafseer (commentary), and AI-powered search capabilities.

## Features

- 📖 Complete Quran with Arabic text
- 🌐 Multiple translations (English, Urdu)
- 📚 Comprehensive Tafseer (Ibn Kathir, Jalalayn, Qurtubi, Muyassar)
- 🔍 Advanced search functionality (keyword and semantic)
- 🎵 Audio recitation by multiple renowned Qaris
- 🔖 Bookmarking system
- 🌙 Dark mode support
- ⚙️ Customizable settings (font size, translations, reciters)
- 📱 Offline access

## Installation

### Prerequisites

- Node.js (v18 or higher)
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and Android SDK

### Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nur-e-hidayah.git
cd NurEHidayah
```

2. Install dependencies:
```bash
npm install
```

3. iOS setup:
```bash
cd ios
pod install
cd ..
```

4. Run the application:

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

For Web:
```bash
npm run web
```

## Technologies Used

- React Native
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for local storage
- React Native Vector Icons
- React Native Audio Recorder Player

## API Integration

The app integrates with multiple Quran APIs:

- **Al Quran Cloud API**: For Quranic text and translations
- **Quran Tafseer API**: For comprehensive tafseer data

## Project Structure

```
NurEHidayah/
├── src/
│   ├── components/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── ReadingScreen.tsx
│   │   ├── TafseerScreen.tsx
│   │   ├── BookmarksScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/
│   │   └── quranAPI.ts
│   ├── context/
│   │   └── QuranContext.tsx
│   ├── utils/
│   └── constants/
├── App.tsx
├── package.json
└── README.md
```

## Future Enhancements

- [ ] Implement AI-powered semantic search
- [ ] Add word-by-word translation
- [ ] Include prayer times integration
- [ ] Add note-taking functionality
- [ ] Implement social sharing features
- [ ] Add more language translations
- [ ] Include tajweed rules highlighting
- [ ] Implement offline audio download

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Al Quran Cloud API for providing comprehensive Quranic data
- All the open-source libraries used in this project
- The Muslim community for continuous support and feedback

## Contact

For questions or suggestions, please reach out to [your.email@example.com](mailto:your.email@example.com)
