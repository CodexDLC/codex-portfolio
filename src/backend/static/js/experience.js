/**
 * CodexDLC Experience Page Logic
 * Handles specific slide system with internal scroll support
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIG ---
    const SLIDE_COOLDOWN = 800; // ms between slide switches

    // --- SLIDE SYSTEM ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let isSliding = false;
    let lastSlideTime = 0;

    /**
     * Switch to a specific slide
     * @param {number|string} indexOrDir - Slide index or 'next'/'prev'
     * @param {string} direction - 'up' or 'down' (visual only)
     */
    window.goToExpSlide = function(indexOrDir, direction = 'down') {
        let index;

        // Handle 'next'/'prev' strings
        if (indexOrDir === 'next') {
            index = currentSlide + 1;
            direction = 'down';
        } else if (indexOrDir === 'prev') {
            index = currentSlide - 1;
            direction = 'up';
        } else {
            index = indexOrDir;
        }

        if (index < 0 || index >= slides.length) return;
        if (index === currentSlide) return;

        const now = Date.now();
        if (now - lastSlideTime < SLIDE_COOLDOWN) return;
        lastSlideTime = now;

        isSliding = true;

        // Update slide classes
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'hidden-up', 'hidden-down');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('hidden-up');
            } else {
                slide.classList.add('hidden-down');
            }
        });

        currentSlide = index;

        // Reset sliding flag after transition
        setTimeout(() => {
            isSliding = false;
        }, 600);
    };

    /**
     * Handle wheel events for slide switching with Internal Scroll Support
     */
    function handleWheel(e) {
        if (isSliding) return;

        const delta = e.deltaY;
        const threshold = 30; // Minimum scroll to trigger

        if (Math.abs(delta) < threshold) return;

        // Check if we are inside a scrollable content area
        const scrollable = e.target.closest('.scrollable-content');

        if (scrollable) {
            // SCROLL DOWN
            if (delta > 0) {
                // Calculate if we are at the bottom
                // Use a small tolerance (2px) for float calculation errors
                const atBottom = Math.abs(scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight) < 2;

                if (!atBottom) {
                    // Allow internal scroll, DO NOT switch slide
                    // We stop propagation to prevent any parent handlers (though main.js ignores .exp-slide)
                    e.stopPropagation();
                    return;
                }
                // If at bottom, and there is a next slide, switch.
            }
            // SCROLL UP
            else if (delta < 0) {
                // If we are NOT at the top, allow internal scroll
                if (scrollable.scrollTop > 0) {
                    e.stopPropagation();
                    return;
                }
                // If at top (scrollTop === 0), allow slide switch UP
            }
        }

        // Standard Slide Logic
        if (delta > 0 && currentSlide < slides.length - 1) {
            // Scroll down
            goToExpSlide(currentSlide + 1, 'down');
        } else if (delta < 0 && currentSlide > 0) {
            // Scroll up
            goToExpSlide(currentSlide - 1, 'up');
        }
    }

    // Attach wheel listener
    if (slides.length > 0) {
        // Use passive: false if we wanted to preventDefault, but here we just rely on logic
        document.addEventListener('wheel', handleWheel, { passive: true });
    }
});
