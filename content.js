/**
 * YouTube Search Enter Fix
 * 
 * This extension fixes the YouTube search experience by ensuring the Enter key
 * triggers a proper search instead of selecting autocomplete suggestions.
 * 
 * @author Akshat Baranwal
 * @license MIT
 */

(function() {
  'use strict';

  const EXTENSION_NAME = 'YouTube Search Enter Fix';
  const DEBUG = false;

  class YouTubeSearchFix {
    constructor() {
      this.currentInput = null;
      this.boundHandleEnterKey = this.handleEnterKey.bind(this);
      this.observer = null;
      this.initialized = false;
    }

    /**
     * Logs debug messages if DEBUG is enabled
     */
    log(...args) {
      if (DEBUG) {
        console.log(`[${EXTENSION_NAME}]`, ...args);
      }
    }

    /**
     * Finds YouTube search elements using multiple selector strategies
     */
    findSearchElements() {
      // Try multiple selectors for the search input
      const input = 
        document.querySelector('input[name="search_query"]') ||
        document.querySelector('input#search') ||
        document.querySelector('input[placeholder="Search"]') ||
        document.querySelector('input[role="combobox"][aria-label*="Search"]') ||
        Array.from(document.querySelectorAll('input[type="text"]'))
          .find(el => {
            const className = (el.className || '').toLowerCase();
            const id = (el.id || '').toLowerCase();
            return className.includes('search') || id.includes('search');
          });

      // Try multiple selectors for the search button
      const button =
        document.querySelector('#search-icon-legacy') ||
        document.querySelector('button#search-icon-legacy') ||
        document.querySelector('button[aria-label="Search"]') ||
        document.querySelector('button[title="Search"]') ||
        document.querySelector('ytd-searchbox button[type="submit"]') ||
        Array.from(document.querySelectorAll('button'))
          .find(btn => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const title = (btn.getAttribute('title') || '').toLowerCase();
            const className = (btn.className || '').toLowerCase();
            const text = (btn.textContent || '').trim().toLowerCase();
            
            return ariaLabel.includes('search') || 
                   title.includes('search') || 
                   className.includes('search') ||
                   text === 'search';
          });

      return { input, button };
    }

    /**
     * Handles the Enter key press event
     */
    handleEnterKey(event) {
      // Only process plain Enter key (no modifiers)
      if (event.key !== 'Enter' || 
          event.shiftKey || 
          event.ctrlKey || 
          event.altKey || 
          event.metaKey) {
        return;
      }

      // Skip if user is composing text (IME)
      if (event.isComposing || event.keyCode === 229) {
        return;
      }

      // Find the search button dynamically
      const { button } = this.findSearchElements();
      
      if (button) {
        // Prevent default YouTube behavior
        event.preventDefault();
        event.stopImmediatePropagation();
        
        this.log('Intercepted Enter key, triggering search button click');
        
        // Click the search button directly - no extra events needed
        button.click();
        this.log('Search button clicked');
      } else {
        this.log('Search button not found, allowing default behavior');
      }
    }

    /**
     * Sets up the event listener on the search input
     */
    setupListener() {
      const { input } = this.findSearchElements();
      
      // Skip if no input found or already attached to this specific input
      if (!input || input === this.currentInput) {
        return;
      }

      // Clean up previous listener
      if (this.currentInput) {
        this.currentInput.removeEventListener('keydown', this.boundHandleEnterKey, true);
        this.log('Removed listener from previous input');
      }

      // Store reference and add new listener
      this.currentInput = input;
      input.addEventListener('keydown', this.boundHandleEnterKey, true);
      this.log('Added listener to search input');
    }

    /**
     * Sets up a MutationObserver to handle dynamic DOM changes
     */
    setupObserver() {
      if (this.observer) {
        return;
      }

      this.observer = new MutationObserver(() => {
        const { input } = this.findSearchElements();
        if (input && input !== this.currentInput) {
          this.log('Search input changed, reattaching listener');
          this.setupListener();
        }
      });

      // Observe with optimized settings
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });

      this.log('MutationObserver initialized');
    }

    /**
     * Initializes the extension
     */
    init() {
      if (this.initialized) {
        return;
      }

      this.initialized = true;
      this.log('Initializing extension');

      // Set up initial listener
      this.setupListener();

      // Set up observer for DOM changes
      this.setupObserver();

      // Handle YouTube's single-page application navigation
      window.addEventListener('yt-navigate-finish', () => {
        this.log('YouTube navigation detected');
        this.setupListener();
      });

      window.addEventListener('yt-page-data-updated', () => {
        this.log('YouTube page data updated');
        this.setupListener();
      });

      this.log('Extension initialized successfully');
    }

    /**
     * Cleans up the extension
     */
    destroy() {
      if (this.currentInput) {
        this.currentInput.removeEventListener('keydown', this.boundHandleEnterKey, true);
      }

      if (this.observer) {
        this.observer.disconnect();
      }

      this.initialized = false;
      this.log('Extension cleaned up');
    }
  }

  // Initialize when DOM is ready
  const searchFix = new YouTubeSearchFix();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => searchFix.init());
  } else {
    searchFix.init();
  }

  // Export for potential debugging
  if (DEBUG) {
    window.YouTubeSearchFix = searchFix;
  }
})();