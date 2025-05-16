# Debug Guide for Quran App

## Troubleshooting Steps

### 1. Tafseer Not Showing

Check these in the browser console:
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try selecting a tafseer option
4. Look for these API calls:
   - `https://quran-tafsir.api.spa5k.com/tafsirs/*`
   - `https://api.quran-tafseer.com/tafseer/*`
   - `https://api.alquran.cloud/v1/ayah/*`

Common issues:
- CORS errors - The API might be blocking cross-origin requests
- 404 errors - The tafseer ID might not exist
- Network errors - Check internet connection

### 2. Audio Not Playing

Check these in the browser console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Click the audio play button
4. Look for error messages about:
   - "Failed to load because no supported source was found"
   - CORS policy errors
   - Network errors

Test these CDN URLs directly in your browser:
- `https://download.quranicaudio.com/quran/Alafasy_128kbps/001.mp3`
- `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/001.mp3`
- `https://everyayah.com/data/Alafasy_128kbps/001.mp3`

### 3. Quick Debug Test

1. Open the test page: `/web/test-api.html`
2. This will test all APIs and CDNs
3. Check which ones are working

### 4. Browser-Specific Issues

Different browsers may have different CORS policies:
- Chrome: Strictest CORS enforcement
- Firefox: May allow some cross-origin requests
- Safari: Different audio codec support

### 5. Local Testing

If APIs are blocked by CORS, you may need to:
1. Use a proxy server
2. Deploy to a server with proper CORS headers
3. Use a browser extension to disable CORS (development only)

## API Status Check

### Working APIs (as of testing):
- ✓ alquran.cloud - Main Quran API
- ? spa5k - May have CORS issues
- ? quran-tafseer.com - May have CORS issues

### Working Audio CDNs:
- ✓ quranicaudio.com - Primary CDN
- ? islamic.network - May have CORS issues
- ? everyayah.com - Alternative CDN

## Solution Approaches

1. **For Tafseer**: Use alquran.cloud translations as fallback
2. **For Audio**: Use multiple CDN fallbacks
3. **For CORS**: Consider using a proxy or server-side API calls