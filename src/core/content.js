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
     * Finds the YouTube search input
     */
    findSearchInput() {
      return document.querySelector('input[name="search_query"]');
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

      const input = event.target;
      const form = input.closest('form');

      if (!form) {
        this.log('Form not found, allowing default behavior');
        return;
      }

      // Prevent default to stop autocomplete selection
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.log('Intercepted Enter key, triggering search');

      // Create a hidden submit button inside the form
      const hiddenButton = document.createElement('button');
      hiddenButton.type = 'submit';
      hiddenButton.style.display = 'none';
      form.appendChild(hiddenButton);

      // Submit the form using the hidden button
      try {
        if (form.requestSubmit) {
          form.requestSubmit(hiddenButton);
        } else {
          // Fallback for older browsers
          hiddenButton.click();
        }
        this.log('Search triggered successfully');
      } catch (error) {
        this.log('Error submitting form:', error);
      } finally {
        // Clean up the hidden button
        hiddenButton.remove();
      }
    }

    /**
     * Sets up the event listener on the search input
     */
    setupListener() {
      const input = this.findSearchInput();

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
        const input = this.findSearchInput();
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