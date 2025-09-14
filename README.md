# YouTube Search Enter Fix

A cross-browser extension that fixes YouTube's search behavior by making the Enter key properly trigger search instead of selecting autocomplete suggestions. Supports Firefox, Chrome, Edge, and other Chromium-based browsers.

> **Note**: This extension uses a clean, single-method approach that works identically across all supported browsers.

## Problem This Solves

When typing in YouTube's search box, pressing Enter often selects an autocomplete suggestion instead of searching for what you actually typed. This extension intercepts the Enter key and clicks the search button instead, ensuring your exact search query is used.

## Features

- ✅ Makes Enter key trigger actual search on YouTube
- ✅ Works with YouTube's dynamic page updates
- ✅ Lightweight and performant
- ✅ No permissions required
- ✅ Works on all YouTube domains (youtube.com, m.youtube.com)

## Installation

### From Extension Stores (Recommended)

#### Firefox / Zen Browser
1. Visit the extension page on [Firefox Add-ons](#) (link coming soon)
2. Click "Add to Firefox"
3. The extension will start working automatically on YouTube

#### Chrome / Chromium Browsers
1. Visit the extension page on [Chrome Web Store](#) (link coming soon)
2. Click "Add to Chrome"
3. The extension will start working automatically on YouTube

#### Microsoft Edge
1. Visit the extension page on [Edge Add-ons](#) (link coming soon)
2. Click "Get"
3. The extension will start working automatically on YouTube

### Manual Installation (Development)

#### Firefox / Zen Browser
1. Clone this repository and build: `npm install && npm run build:firefox`
2. Open Firefox/Zen Browser
3. Navigate to `about:debugging`
4. Click "This Firefox" (or "This Zen Browser")
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from `dist/firefox/`

#### Chrome / Chromium Browsers
1. Clone this repository and build: `npm install && npm run build:chrome`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist/chrome/` directory

#### Microsoft Edge
1. Clone this repository and build: `npm install && npm run build:edge`
2. Open Edge and navigate to `edge://extensions/`
3. Enable "Developer mode" (toggle in left sidebar)
4. Click "Load unpacked"
5. Select the `dist/edge/` directory

## Building from Source

### Prerequisites
- Node.js 14.0.0 or higher
- npm

### Quick Start
```bash
# Install dependencies
npm install

# Build for all browsers
npm run build

# Extensions will be in dist/ directory:
# - dist/youtube-search-fix-firefox.zip
# - dist/youtube-search-fix-chrome.zip
# - dist/youtube-search-fix-edge.zip
```

### Build Commands
```bash
# Build for all browsers
npm run build

# Build for specific browser
npm run build:firefox
npm run build:chrome
npm run build:edge

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build artifacts
npm run clean
```

### Generate Icons
If you need to regenerate the icons:
```bash
cd src/assets/icons
./generate-icons.sh  # Requires ImageMagick
```

### Build Output
Built extensions are created in the `dist/` directory:
- `dist/firefox/` - Firefox extension files
- `dist/chrome/` - Chrome extension files
- `dist/edge/` - Edge extension files
- `dist/youtube-search-fix-[browser].zip` - Packaged extensions ready for distribution

## How It Works

The extension intercepts the Enter key in YouTube's search box and triggers a proper form submission instead of allowing YouTube's autocomplete to take over. It uses a clean, cross-browser compatible approach that:

1. Detects Enter key press in the search input
2. Prevents the default autocomplete selection behavior
3. Creates a temporary hidden submit button inside the form
4. Triggers form submission using the native `requestSubmit()` API
5. Cleans up immediately after submission

## Development

### Project Structure
```
youtube-search-enter-fix/
├── src/
│   ├── core/
│   │   └── content.js        # Main content script (shared)
│   ├── manifests/
│   │   ├── manifest.firefox.json  # Firefox-specific manifest
│   │   ├── manifest.chrome.json   # Chrome-specific manifest
│   │   └── manifest.edge.json     # Edge-specific manifest
│   └── assets/
│       └── icons/            # Extension icons
├── dist/                     # Build output (gitignored)
├── scripts/
│   └── build.js              # Build script for all browsers
├── README.md                 # This file
├── LICENSE                   # MIT License
└── package.json              # NPM package info
```

### Debug Mode
To enable debug logging, edit `src/core/content.js` and set:
```javascript
const DEBUG = true;
```

Then rebuild and reload the extension. Check the browser console on YouTube for debug messages prefixed with `[YouTube Search Enter Fix]`.

## Browser Compatibility

### Fully Supported
- Firefox 109.0+
- Chrome 88+
- Microsoft Edge 88+
- Zen Browser (all versions)
- Brave Browser
- Vivaldi
- Opera 74+
- Other Chromium-based browsers (88+)

### Technical Details
- Uses Manifest V3 for modern browser compatibility
- Single codebase for all browsers (no browser-specific logic needed)
- Minimal permissions required (no host permissions needed)
- Lightweight implementation (~200 lines of code)
- Works with YouTube's dynamic single-page application architecture

## Privacy

This extension:
- Does not collect any user data
- Does not make any network requests
- Does not require any special permissions
- Only runs on YouTube domains

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

If you encounter any issues or have suggestions:
1. Check the [Issues](https://github.com/AkshatBaranwal/youtube-search-enter-fix/issues) page
2. Create a new issue with details about the problem
3. Include your browser version and any error messages from the console

## Author

Akshat Baranwal - [GitHub Profile](https://github.com/AkshatBaranwal)

## Acknowledgments

- Thanks to the Firefox extension community for documentation and examples
- Inspired by the need for a better YouTube search experience