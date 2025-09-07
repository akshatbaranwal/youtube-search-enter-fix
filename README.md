# YouTube Search Enter Fix

A Firefox/Zen Browser extension that fixes YouTube's search behavior by making the Enter key properly trigger search instead of selecting autocomplete suggestions.

## Problem This Solves

When typing in YouTube's search box, pressing Enter often selects an autocomplete suggestion instead of searching for what you actually typed. This extension intercepts the Enter key and clicks the search button instead, ensuring your exact search query is used.

## Features

- ✅ Makes Enter key trigger actual search on YouTube
- ✅ Works with YouTube's dynamic page updates
- ✅ Lightweight and performant
- ✅ No permissions required
- ✅ Works on all YouTube domains (youtube.com, m.youtube.com)

## Installation

### From Firefox Add-ons Store (Recommended)
1. Visit the extension page on [Firefox Add-ons](#) (link coming soon)
2. Click "Add to Firefox"
3. The extension will start working automatically on YouTube

### Manual Installation (Development)
1. Clone this repository
2. Open Firefox/Zen Browser
3. Navigate to `about:debugging`
4. Click "This Firefox" (or "This Zen Browser")
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from this project

## Building from Source

### Generate Icons
If you need to regenerate the icons:
```bash
cd icons
./generate-icons.sh  # Requires ImageMagick
```

### Package for Distribution
```bash
npm run build  # Creates youtube-search-enter-fix.zip
```

## Development

### Project Structure
```
youtube-search-enter-fix/
├── manifest.json      # Extension manifest
├── content.js         # Main content script
├── icons/            # Extension icons
│   ├── icon.svg      # Source SVG icon
│   └── icon-*.png    # Generated PNG icons
├── README.md         # This file
├── LICENSE           # MIT License
└── package.json      # NPM package info
```

### Debug Mode
To enable debug logging, edit `content.js` and set:
```javascript
const DEBUG = true;
```

## Browser Compatibility

- Firefox 109.0+
- Zen Browser (all versions)
- Other Firefox-based browsers

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