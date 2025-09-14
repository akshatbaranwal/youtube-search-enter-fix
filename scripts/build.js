#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const BROWSERS = {
  firefox: {
    manifest: 'manifest.firefox.json',
    outputName: 'youtube-search-fix-firefox.zip'
  },
  chrome: {
    manifest: 'manifest.chrome.json',
    outputName: 'youtube-search-fix-chrome.zip'
  },
  edge: {
    manifest: 'manifest.edge.json',
    outputName: 'youtube-search-fix-edge.zip'
  }
};

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const MANIFESTS_DIR = path.join(SRC_DIR, 'manifests');
const CORE_DIR = path.join(SRC_DIR, 'core');
const ASSETS_DIR = path.join(SRC_DIR, 'assets');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function buildForBrowser(browser) {
  console.log(`Building for ${browser}...`);

  const browserConfig = BROWSERS[browser];
  if (!browserConfig) {
    throw new Error(`Unknown browser: ${browser}`);
  }

  const browserDir = path.join(DIST_DIR, browser);

  // Clean previous build
  try {
    await fs.rm(browserDir, { recursive: true, force: true });
  } catch (err) {
    // Directory might not exist
  }

  await ensureDir(browserDir);

  // Copy manifest
  const manifestSrc = path.join(MANIFESTS_DIR, browserConfig.manifest);
  const manifestDest = path.join(browserDir, 'manifest.json');
  await copyFile(manifestSrc, manifestDest);

  // Copy content script
  const contentSrc = path.join(CORE_DIR, 'content.js');
  const contentDest = path.join(browserDir, 'content.js');
  await copyFile(contentSrc, contentDest);

  // Copy icons
  const iconsSrc = path.join(ASSETS_DIR, 'icons');
  const iconsDest = path.join(browserDir, 'icons');
  await copyDir(iconsSrc, iconsDest);

  // Copy LICENSE and README for distribution
  try {
    await copyFile(
      path.join(__dirname, '..', 'LICENSE'),
      path.join(browserDir, 'LICENSE')
    );
  } catch (err) {
    console.warn('LICENSE file not found, skipping...');
  }

  // Create ZIP file
  const zipPath = path.join(DIST_DIR, browserConfig.outputName);
  const zipCommand = process.platform === 'win32'
    ? `powershell Compress-Archive -Path "${browserDir}/*" -DestinationPath "${zipPath}" -Force`
    : `cd "${browserDir}" && zip -r "${zipPath}" . -x "*.DS_Store" -x "__MACOSX/*"`;

  try {
    await execPromise(zipCommand);
    console.log(`✓ Built ${browser}: ${browserConfig.outputName}`);
  } catch (err) {
    console.error(`Failed to create ZIP for ${browser}:`, err);
    throw err;
  }
}

async function buildAll() {
  console.log('Building for all browsers...\n');

  await ensureDir(DIST_DIR);

  const results = await Promise.allSettled(
    Object.keys(BROWSERS).map(browser => buildForBrowser(browser))
  );

  console.log('\nBuild Summary:');
  results.forEach((result, index) => {
    const browser = Object.keys(BROWSERS)[index];
    if (result.status === 'fulfilled') {
      console.log(`  ✓ ${browser}`);
    } else {
      console.log(`  ✗ ${browser}: ${result.reason.message}`);
    }
  });
}

async function watch() {
  console.log('Watching for changes...');

  const chokidar = require('chokidar');

  const watcher = chokidar.watch([
    path.join(SRC_DIR, '**/*'),
    '!' + path.join(DIST_DIR, '**/*')
  ], {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', async (filePath) => {
    console.log(`\nFile changed: ${path.relative(process.cwd(), filePath)}`);
    await buildAll();
  });

  watcher.on('add', async (filePath) => {
    console.log(`\nFile added: ${path.relative(process.cwd(), filePath)}`);
    await buildAll();
  });

  watcher.on('unlink', async (filePath) => {
    console.log(`\nFile removed: ${path.relative(process.cwd(), filePath)}`);
    await buildAll();
  });

  // Initial build
  await buildAll();
  console.log('\nWatching for changes... (Press Ctrl+C to stop)');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  try {
    switch (command) {
      case 'all':
        await buildAll();
        break;
      case 'watch':
        await watch();
        break;
      case 'firefox':
      case 'chrome':
      case 'edge':
        await buildForBrowser(command);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.log('Usage: node build.js [all|firefox|chrome|edge|watch]');
        process.exit(1);
    }
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}