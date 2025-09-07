// YouTube Enter key override - robust approach with multiple fallbacks
(function () {
	let currentInput = null;
	let currentHandler = null;

	function findSearchElements() {
		// Multiple fallback selectors for input
		const input = 
			document.querySelector('input[name="search_query"]') ||
			document.querySelector('input#search') ||
			document.querySelector('input[placeholder="Search"]') ||
			document.querySelector('input[role="combobox"]') ||
			Array.from(document.querySelectorAll('input[type="text"]'))
				.find(input => input.className.toLowerCase().includes('search'));

		// Multiple fallback selectors for button
		const button =
			document.querySelector('#search-icon-legacy') ||
			document.querySelector('button[aria-label="Search"]') ||
			document.querySelector('button[title="Search"]') ||
			document.querySelector('button[type="submit"]') ||
			Array.from(document.querySelectorAll('button'))
				.find(btn =>
					(btn.textContent && btn.textContent.trim().toLowerCase() === 'search') ||
					btn.className.toLowerCase().includes('search')
				);

		return { input, button };
	}

	function handleEnterKey(e) {
		// Only process Enter key without modifiers
		if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
			return;
		}

		// Skip if composing (IME)
		if (e.isComposing || e.keyCode === 229) return;

		// Find the search button at the time of the event
		const { button } = findSearchElements();
		
		if (button) {
			// Prevent default Enter behavior
			e.preventDefault();
			e.stopImmediatePropagation();
			
			// Trigger input event first to ensure YouTube processes the value
			e.target.dispatchEvent(new Event('input', { bubbles: true }));
			
			// Small delay then click the search button
			setTimeout(() => button.click(), 10);
		} else {
			// Fallback: let the default Enter behavior happen
			console.log('YouTube Search Fix: Could not find search button, using default behavior');
		}
	}

	function setupListener() {
		const { input } = findSearchElements();
		
		// Skip if no input found or already attached to this input
		if (!input || input === currentInput) return;

		// Remove old listener if exists
		if (currentInput && currentHandler) {
			currentInput.removeEventListener('keydown', currentHandler, true);
		}

		// Store references
		currentInput = input;
		currentHandler = handleEnterKey;

		// Add new listener (capture phase to intercept before YouTube)
		input.addEventListener('keydown', currentHandler, true);
	}

	// Set up initial listener
	function initialize() {
		setupListener();

		// Use a single mutation observer to watch for DOM changes
		const observer = new MutationObserver(() => {
			// Check if search input has changed
			const { input } = findSearchElements();
			if (input && input !== currentInput) {
				setupListener();
			}
		});

		// Observe with minimal scope for performance
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		});
	}

	// Wait for DOM to be ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize);
	} else {
		initialize();
	}

	// Handle YouTube's SPA navigation
	window.addEventListener('yt-navigate-finish', setupListener);
	window.addEventListener('yt-page-data-updated', setupListener);
})();
