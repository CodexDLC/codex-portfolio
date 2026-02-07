/**
 * Experience Page Logic
 * Handles slide navigation and mobile tabs
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- SLIDE NAVIGATION ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let isSliding = false;
    const SLIDE_COOLDOWN = 800;
    let lastSlideTime = 0;

    window.goToExpSlide = function(direction) {
        const now = Date.now();
        if (now - lastSlideTime < SLIDE_COOLDOWN) return;

        let nextIndex = currentSlide;
        if (direction === 'next' || direction === 'down') {
            nextIndex = Math.min(currentSlide + 1, slides.length - 1);
        } else if (direction === 'prev' || direction === 'up') {
            nextIndex = Math.max(currentSlide - 1, 0);
        }

        if (nextIndex !== currentSlide) {
            lastSlideTime = now;
            isSliding = true;

            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'hidden-up', 'hidden-down');
                if (i === nextIndex) {
                    slide.classList.add('active');
                } else if (i < nextIndex) {
                    slide.classList.add('hidden-up');
                } else {
                    slide.classList.add('hidden-down');
                }
            });

            currentSlide = nextIndex;
            setTimeout(() => isSliding = false, 600);
        }
    };

    // Wheel event for desktop/tablet
    document.addEventListener('wheel', (e) => {
        // Prevent scroll if inside code or logs (unless at boundaries)
        const target = e.target;
        if (target.closest('.ide-code') || target.closest('.experience-changelog')) {
            // Simple check: if scrolling up at top or down at bottom, allow page slide
            // For now, let's just block global slide if inside scrollable area
            // return;
        }

        if (isSliding) return;

        const delta = e.deltaY;
        if (Math.abs(delta) < 30) return;

        if (delta > 0) goToExpSlide('next');
        else goToExpSlide('prev');
    }, { passive: true });


    // --- MOBILE TABS (CODE | SPECS) ---
    const tabs = document.querySelectorAll('.exp-tab');
    const panelCode = document.getElementById('panel-code');
    const panelSpecs = document.getElementById('panel-specs');

    if (tabs.length > 0 && panelCode && panelSpecs) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');

                const target = tab.getAttribute('data-target');

                // Toggle panels
                if (target === 'code') {
                    panelCode.classList.add('active-panel');
                    panelSpecs.classList.remove('active-panel');
                } else {
                    panelCode.classList.remove('active-panel');
                    panelSpecs.classList.add('active-panel');
                }
            });
        });
    }
});
