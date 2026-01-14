# PWA Setup Documentation

## Overview
This project now includes full Progressive Web App (PWA) support, allowing users to install the app on their devices and use it offline.

## Files Created/Modified

### New Files Created:

1. **`public/manifest.json`**
   - Defines app metadata (name, icons, theme colors, screenshots)
   - Specifies app display mode as standalone
   - Includes app shortcuts and categories

2. **`public/service-worker.js`**
   - Handles caching strategy (Cache First with Network Fallback)
   - Manages app installation and updates
   - Enables offline functionality

3. **`src/utils/pwaUtils.js`**
   - `registerServiceWorker()` - Registers the service worker
   - `unregisterServiceWorker()` - Unregisters all service workers
   - `checkServiceWorkerUpdates()` - Checks for and notifies about updates

4. **`src/components/PWAInstallPrompt.jsx`**
   - Displays install prompt popup
   - Handles both Android/Desktop and iOS installation flows
   - Uses localStorage to prevent duplicate prompts
   - Supports Framer Motion animations

### Modified Files:

1. **`index.html`**
   - Added PWA meta tags:
     - `theme-color`
     - `mobile-web-app-capable`
     - `apple-mobile-web-app-*` tags for iOS support
   - Linked `manifest.json`

2. **`src/main.jsx`**
   - Added service worker registration on app load
   - Added update checking functionality

3. **`src/App.jsx`**
   - Imported and rendered `PWAInstallPrompt` component

4. **`vite.config.js`**
   - Updated build configuration for proper service worker handling
   - Added server configuration for dev environment

## Features

### Installation Prompt
- **Automatic Detection**: Detects when PWA can be installed
- **iOS Support**: Shows special instructions for iOS users (Add to Home Screen)
- **Smart Timing**: Shows prompt after 3-5 seconds of app interaction
- **User Control**: Option to dismiss and not show again (stored in localStorage)
- **Beautiful UI**: Animated popup with gradient background using Framer Motion

### Service Worker
- **Offline Support**: App works offline using cached assets
- **Auto Update**: Automatically updates when new version is available
- **Cache Strategy**: Cache First with Network Fallback
  - Serves cached content immediately if available
  - Falls back to network for fresh data
  - Caches successful responses

### App Metadata
- Displays as standalone app (no browser UI)
- Custom theme colors and icons
- App shortcuts for quick access
- Responsive to different screen sizes

## How to Use

### For Users

**Desktop/Android:**
1. Visit the app in a compatible browser (Chrome, Edge, Firefox)
2. Wait for the install prompt popup to appear
3. Click "Install Now"
4. The app will be installed as a standalone app

**iOS:**
1. Open the app in Safari on an iOS device
2. Wait for the install prompt popup to appear
3. Tap the Share button (↑)
4. Select "Add to Home Screen"
5. Tap "Add" to confirm

### For Developers

#### Register Service Worker Manually
```javascript
import { registerServiceWorker } from './utils/pwaUtils'

registerServiceWorker()
```

#### Check for Updates
```javascript
import { checkServiceWorkerUpdates } from './utils/pwaUtils'

window.addEventListener('sw-update-ready', (event) => {
  console.log('Update available:', event.detail.registration)
  // Prompt user to reload
})
```

#### Unregister Service Worker (if needed)
```javascript
import { unregisterServiceWorker } from './utils/pwaUtils'

unregisterServiceWorker()
```

## Testing

### In Development
1. Build the frontend: `npm run build`
2. Preview the build: `npm run preview`
3. Open in Chrome DevTools → Application → Service Workers
4. Check "Offline" to test offline functionality

### Browser DevTools
- **Chrome**: DevTools → Application tab
  - Service Workers section
  - Cache Storage
  - Manifest tab
- **Firefox**: DevTools → Storage tab
  - Cache Storage
  - Cookies/Local Storage

## Customization

### Update App Name/Icons
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "icons": [
    {
      "src": "path/to/icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Change Theme Colors
Update `public/manifest.json` and `index.html`:
```html
<meta name="theme-color" content="#your-color" />
```

### Modify Install Prompt
Edit `src/components/PWAInstallPrompt.jsx` for custom styling and behavior.

### Update Service Worker Cache
Modify `public/service-worker.js`:
```javascript
const CACHE_NAME = 'smart-reply-v2'; // Increment version
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Add more assets
];
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ | Full PWA support |
| Edge | ✅ | Full PWA support |
| Firefox | ✅ | Full PWA support |
| Safari (iOS) | ⚠️ | Limited (Add to Home Screen only) |
| Safari (macOS) | ✅ | Full PWA support |
| Opera | ✅ | Full PWA support |

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure app is served over HTTPS (required for PWA)
- Check `public/service-worker.js` is accessible

### Prompt Not Showing
- Check `localStorage` for `pwa-install-dismissed` key
- Open DevTools → Application → Manifest to verify manifest.json is loaded
- Try incognito/private window (sometimes helps)

### App Not Caching Offline Content
- Verify service worker is active (DevTools → Service Workers)
- Check Cache Storage in DevTools → Application
- Ensure cache names match in `service-worker.js`

### On iOS
- Use Safari browser
- Check if "Add to Home Screen" option is available
- For PWA features, install app must be added to home screen

## Performance Notes

- Service worker adds minimal overhead
- Initial install adds ~50KB to app bundle
- Cached files significantly improve load times on repeat visits
- Background sync ready for future enhancements

## Security

- Service worker only operates over HTTPS in production
- HTTP works in development and localhost
- All cache operations are controlled
- No sensitive data is cached by default
