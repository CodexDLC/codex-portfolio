/**
 * Experience Page Logic
 * Handles slide navigation and mobile tabs
 */

window.Codex = window.Codex || {};

document.addEventListener("DOMContentLoaded", function () {

    // --- SLIDE NAVIGATION ---
    var slides = document.querySelectorAll('.slide');
    var currentSlide = 0;
    var isSliding = false;
    var SLIDE_COOLDOWN = 800;
    var lastSlideTime = 0;

    function goToExpSlide(direction) {
        if (!slides || slides.length === 0) return;

        var now = Date.now();
        if (now - lastSlideTime < SLIDE_COOLDOWN) return;

        var nextIndex = currentSlide;
        if (direction === 'next' || direction === 'down') {
            nextIndex = Math.min(currentSlide + 1, slides.length - 1);
        } else if (direction === 'prev' || direction === 'up') {
            nextIndex = Math.max(currentSlide - 1, 0);
        }

        if (nextIndex !== currentSlide) {
            lastSlideTime = now;
            isSliding = true;

            slides.forEach(function (slide, i) {
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
            setTimeout(function () { isSliding = false; }, 600);
        }
    }

    // Register on namespace
    Codex.experience = {
        goToExpSlide: goToExpSlide
    };

    // Wheel event for desktop/tablet
    document.addEventListener('wheel', function (e) {
        if (isSliding) return;

        var delta = e.deltaY;
        if (Math.abs(delta) < 30) return;

        if (delta > 0) goToExpSlide('next');
        else goToExpSlide('prev');
    }, { passive: true });


    // --- MOBILE TABS (CODE | SPECS) ---
    var tabs = document.querySelectorAll('.exp-tab');
    var panelCode = document.getElementById('panel-code');
    var panelSpecs = document.getElementById('panel-specs');

    if (tabs.length > 0 && panelCode && panelSpecs) {
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');

                var target = tab.getAttribute('data-target');

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
