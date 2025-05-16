# Nur-e-Hidayah - Web Application

A beautiful, modern web application for reading and studying the Holy Quran with translations, tafseer, and advanced search capabilities.

![Nur-e-Hidayah](screenshot.png)

## Features

- 📖 Complete Quran with Arabic text
- 🌐 Multiple translations (English, Urdu)
- 📚 Comprehensive Tafseer (Ibn Kathir, Jalalayn, Qurtubi, Muyassar)
- 🔍 Advanced search functionality
- 🌙 Dark mode support
- ⚙️ Customizable settings (font size, translations)
- 💾 Persistent bookmarks and reading position
- 🎨 Beautiful, responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nur-e-hidayah.git
cd NurEHidayah
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run web
```

The application will open automatically in your browser at http://localhost:3001

### Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `web-build` directory.

## Technology Stack

- React Native Web
- TypeScript
- React Navigation
- Axios for API calls
- CSS for styling

## API Integration

This application uses the following APIs:

- **Al Quran Cloud API**: For Quranic text and translations
- **Quran Tafseer API**: For comprehensive tafseer data

## Project Structure

```
NurEHidayah/
├── src/
│   ├── components/
│   │   └── web/
│   │       └── WebLayout.tsx
│   ├── screens/
│   │   └── web/
│   │       ├── WebHomeScreen.tsx
│   │       ├── WebReadingScreen.tsx
│   │       ├── WebSearchScreen.tsx
│   │       ├── WebTafseerScreen.tsx
│   │       └── WebSettingsScreen.tsx
│   ├── services/
│   │   └── quranAPI.ts
│   ├── context/
│   │   └── QuranContext.tsx
│   └── styles/
│       └── webStyles.css
├── public/
│   └── index.html
├── App.web.tsx
├── index.web.js
├── webpack.config.js
└── package.json
```

## Features Overview

### Beautiful Interface
- Modern, clean design with careful attention to typography
- Smooth animations and transitions
- Responsive layout that works on all screen sizes

### Reading Experience
- Clear Arabic text with optimized fonts
- Side-by-side translation display
- Adjustable font sizes for comfortable reading
- Dark mode for night reading

### Navigation
- Easy navigation between surahs
- Quick jump to specific verses
- Bookmark management
- Continue reading from where you left off

### Search
- Fast keyword search across the entire Quran
- Search in translations
- Highlighted search results

### Tafseer
- Multiple tafseer options
- Easy switching between different commentaries
- Contextual access from any verse

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Al Quran Cloud API for providing comprehensive Quranic data
- The Muslim community for continuous support and feedback

## Contact

For questions or suggestions, please reach out to contact@nur-e-hidayah.com