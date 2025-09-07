# Publishing to Firefox Add-ons Store

## Prerequisites

1. **Firefox Developer Account**
   - Create an account at https://addons.mozilla.org/developers/
   - Verify your email address

2. **Generate Icons**
   ```bash
   cd icons
   ./generate-icons.sh  # Requires ImageMagick
   ```

3. **Update Metadata**
   - Edit `manifest.json`:
     - Update `author` field with your name
     - Update `homepage_url` with your GitHub repo
     - Update `browser_specific_settings.gecko.id` with a unique ID
   
4. **Update Documentation**
   - Update author information in:
     - `content.js`
     - `README.md`
     - `LICENSE`
     - `package.json`

## Build the Extension

```bash
npm run build
```

This creates `youtube-search-enter-fix.zip` ready for upload.

## Submission Process

1. **Login to AMO (addons.mozilla.org)**
   - Go to https://addons.mozilla.org/developers/
   - Click "Submit a New Add-on"

2. **Upload Package**
   - Select "On this site" for distribution
   - Upload the `youtube-search-enter-fix.zip` file
   - The extension will be validated automatically

3. **Fill in Listing Details**
   
   **Name**: YouTube Search Enter Fix
   
   **Summary** (250 chars max):
   > Fixes YouTube search by making the Enter key trigger actual search instead of selecting autocomplete suggestions.
   
   **Description**:
   > This extension solves a common YouTube annoyance where pressing Enter in the search box selects an autocomplete suggestion instead of searching for what you actually typed.
   >
   > Features:
   > • Makes Enter key trigger real search
   > • Works seamlessly with YouTube's dynamic updates
   > • Lightweight with no performance impact
   > • No special permissions required
   > • Privacy-focused: no data collection
   
   **Categories**: 
   - Productivity
   - Search Tools
   
   **Tags**: youtube, search, productivity, enter key, fix
   
   **Support Email**: your-email@example.com
   
   **Support Site**: https://github.com/yourusername/youtube-search-enter-fix

4. **Add Screenshots** (Optional but recommended)
   - Before: Show autocomplete being selected
   - After: Show actual search being performed

5. **Privacy Policy**
   ```
   This extension does not collect, store, or transmit any user data.
   It only modifies the behavior of the Enter key on YouTube.com domains.
   No analytics, no tracking, no external connections.
   ```

6. **Additional Details**
   - License: MIT
   - This add-on is not experimental
   - This add-on does not require payment

7. **Submit for Review**
   - Review all information
   - Accept the Developer Agreement
   - Submit for review

## Review Process

- **Typical review time**: 1-5 business days
- **Common issues to avoid**:
  - Ensure all URLs in manifest work
  - Make sure icons are present
  - Code should be readable (not minified)
  - No external script loading
  - Clear description of functionality

## After Approval

1. **Get your extension URL**
   - Will be something like: https://addons.mozilla.org/firefox/addon/youtube-search-enter-fix/

2. **Update README**
   - Add the official Firefox Add-ons link
   - Add installation badge

3. **Announce**
   - Share on social media
   - Post in relevant forums/communities
   - Create a GitHub release

## Version Updates

When updating the extension:

1. Increment version in `manifest.json` and `package.json`
2. Update CHANGELOG (create one if needed)
3. Build new package: `npm run build`
4. Upload through AMO developer dashboard
5. Add version notes explaining changes

## Self-Distribution (Alternative)

If you prefer to self-distribute:

1. **Sign the extension**
   - Use web-ext: `npm install -g web-ext`
   - Run: `web-ext sign --api-key=<key> --api-secret=<secret>`

2. **Host the .xpi file**
   - Upload to GitHub releases
   - Users can install directly

Note: Self-distributed extensions show warnings in Firefox.