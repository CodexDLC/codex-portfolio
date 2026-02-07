/**
 * CodexDLC Main Page Logic
 * Handles Boot Sequence, Hero Animation, Slide System, and Bento Grid
 */

window.Codex = window.Codex || {};

document.addEventListener("DOMContentLoaded", function () {
    var logs = document.getElementById('terminal-logs');
    var initScreen = document.getElementById('init-screen');
    var finalScreen = document.getElementById('final-screen');
    var bentoItems = document.querySelectorAll('.bento-item');
    var navLinks = document.querySelectorAll('.header-nav .nav-link');
    var moduleTabs = document.querySelectorAll('.module-tab');
    var modulesStatus = document.querySelector('.modules-status');
    var modulesLine = document.querySelector('.modules-line');

    // --- CONFIG ---
    var SESSION_KEY = 'codex_intro_shown';
    var SLIDE_COOLDOWN = 800;

    // --- SLIDE SYSTEM ---
    var slides = document.querySelectorAll('.slide');
    var currentSlide = 0;
    var isSliding = false;
    var lastSlideTime = 0;

    /**
     * Switch to a specific slide
     * @param {number} index - Slide index (0 = Hero, 1 = Bento)
     * @param {string} direction - 'up' or 'down'
     */
    function goToSlide(index, direction) {
        direction = direction || 'down';
        if (index < 0 || index >= slides.length) return;
        if (index === currentSlide) return;

        var now = Date.now();
        if (now - lastSlideTime < SLIDE_COOLDOWN) return;
        lastSlideTime = now;

        isSliding = true;

        slides.forEach(function (slide, i) {
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

        setTimeout(function () {
            isSliding = false;
        }, 600);
    }

    // Register on namespace
    Codex.home = {
        goToSlide: goToSlide
    };

    // Handle wheel events for slide switching
    function handleWheel(e) {
        if (isSliding) return;

        // Skip if inside a scroll-locked area
        if (e.target.closest('.stop-global-scroll')) return;

        var delta = e.deltaY;
        var threshold = 30;

        if (Math.abs(delta) < threshold) return;

        if (delta > 0 && currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1, 'down');
        } else if (delta < 0 && currentSlide > 0) {
            goToSlide(currentSlide - 1, 'up');
        }
    }

    if (slides.length > 0) {
        document.addEventListener('wheel', handleWheel, { passive: true });
    }

    // Module tab clicks -> go to Bento slide
    moduleTabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            goToSlide(1, 'down');
        });
    });

    // --- HELPER FUNCTIONS ---

    function showBentoItem(index) {
        if (bentoItems[index]) {
            bentoItems[index].classList.remove('bento-hidden');
            bentoItems[index].classList.add('bento-visible');
        }
    }

    function showNavLink(index) {
        if (navLinks[index]) {
            navLinks[index].classList.remove('nav-hidden');
            navLinks[index].classList.add('nav-visible');
        }
    }

    function showModuleTab(index) {
        if (moduleTabs[index]) {
            moduleTabs[index].classList.add('visible');
        }
    }

    function updateModulesStatus() {
        if (modulesStatus) {
            modulesStatus.innerHTML = '// SYSTEM_READY';
            modulesStatus.classList.add('status-ready');
        }
        if (modulesLine) {
            modulesLine.classList.add('line-ready');
        }
    }

    function updateSeparatorStatus() {
        // Desktop
        var separator = document.querySelector('.bento-separator');
        if (separator) {
            var textSpan = separator.querySelector('.bento-status');
            if (textSpan) {
                textSpan.innerHTML = '<span class="text-green">//</span> SYSTEM_READY';
            }
            separator.classList.add('separator-success');
        }

        // Mobile
        var mobileSep = document.querySelector('.mobile-separator');
        if (mobileSep) {
            var sepText = mobileSep.querySelector('.separator-text');
            if (sepText) {
                sepText.innerHTML = '// SYSTEM_READY';
            }
            mobileSep.classList.add('separator-ready');
        }
    }

    function showMobileSeparator() {
        var mobileSep = document.querySelector('.mobile-separator');
        if (mobileSep) {
            mobileSep.classList.add('show-separator');
        }
    }

    function showLoadingVisual() {
        var visual = document.querySelector('.mobile-loading-visual');
        if (visual) {
            visual.classList.add('show-visual');
        }
    }

    function hideLoadingVisual() {
        var visual = document.querySelector('.mobile-loading-visual');
        if (visual) {
            visual.classList.add('fade-out');
            setTimeout(function () {
                visual.classList.add('hidden');
            }, 800);
        }
    }

    function showMobilePortals() {
        var portals = document.querySelector('.mobile-portals-stack');
        if (portals) {
            portals.classList.add('show-buttons');
        }
    }

    function showPortalCard(index) {
        var portalCards = document.querySelectorAll('.mobile-portals-stack .portal-card');
        if (portalCards[index]) {
            portalCards[index].classList.add('portal-visible');
        }
    }

    function showAllContentImmediately() {
        var isMobile = window.innerWidth <= 767;

        // Hide loading screens
        if (initScreen) initScreen.style.setProperty('display', 'none', 'important');

        var mobileInitScreen = document.querySelector('.mobile-init-screen');
        if (mobileInitScreen) mobileInitScreen.style.setProperty('display', 'none', 'important');

        // Show final screen
        if (finalScreen) {
            finalScreen.style.display = isMobile ? 'flex' : 'grid';
            finalScreen.style.opacity = '1';
        }

        // Show all bento items
        bentoItems.forEach(function (item) {
            item.classList.remove('bento-hidden');
            item.classList.add('bento-visible');
        });

        // Show all nav links
        navLinks.forEach(function (link) {
            link.classList.remove('nav-hidden');
            link.classList.add('nav-visible');
        });

        // Show all module tabs
        moduleTabs.forEach(function (tab) {
            tab.classList.add('visible');
        });

        updateSeparatorStatus();
        updateModulesStatus();

        var separator = document.querySelector('.bento-separator');
        if (separator) separator.style.opacity = '1';

        showMobileSeparator();

        if (isMobile) {
            showMobilePortals();
        }

        // Start logo animation (from base.js)
        if (Codex.header && Codex.header.typeSlogan) {
            Codex.header.typeSlogan();
        }
    }

    function runBootSequence() {
        bentoItems.forEach(function (item) { item.classList.add('bento-hidden'); });
        navLinks.forEach(function (link) { link.classList.add('nav-hidden'); });

        var isMobile = window.innerWidth <= 767;

        // Mobile: show content immediately (LCP optimization)
        if (isMobile) {
            showAllContentImmediately();
            return;
        }

        // Load translations from JSON data
        var translations = {};
        try {
            var scriptTag = document.getElementById('terminal-messages-data');
            if (scriptTag) {
                translations = JSON.parse(scriptTag.textContent);
            }
        } catch (e) {
            // Use defaults if translations unavailable
        }

        // Desktop boot animation
        var messages = [
            { t: 500, m: translations.msg1 || "> Initializing Request...", triggerNav: 0, triggerTab: 0 },
            { t: 1200, m: translations.msg2 || "> R&D Process started...", c: "text-ghost", triggerBento: 1, triggerNav: 1, triggerTab: 1 },
            { t: 2200, m: translations.msg3 || "> Architecture defined.", c: "text-blue", triggerBento: 2, triggerNav: 2, triggerTab: 2 },
            { t: 3200, m: translations.msg4 || "> CORE: Python Engine Ready.", c: "text-gold", triggerBento: 0, triggerNav: 3, triggerTab: 3 },
            { t: 4500, m: translations.msg8 || "> CI/CD Pipeline active.", c: "text-gold" },
            { t: 6000, m: translations.msg9 || "> DEPLOYED TO PRODUCT.", c: "text-gold", triggerBento: 3 }
        ];

        messages.forEach(function (item) {
            setTimeout(function () {
                var line = document.createElement('div');
                line.className = item.c ? item.c : '';
                line.textContent = item.m;
                if (logs) {
                    logs.appendChild(line);
                    logs.scrollTop = logs.scrollHeight;
                }

                if (item.triggerBento !== undefined) showBentoItem(item.triggerBento);
                if (item.triggerNav !== undefined) showNavLink(item.triggerNav);
                if (item.triggerTab !== undefined) showModuleTab(item.triggerTab);

            }, item.t);
        });

        // Transition to final screen
        var finalDelay = 7500;
        var transitionDuration = 0.8;

        setTimeout(function () {
            if (initScreen) {
                initScreen.style.transition = 'opacity ' + transitionDuration + 's ease, transform ' + transitionDuration + 's ease';
                initScreen.style.opacity = "0";
                initScreen.style.transform = "scale(0.98)";
            }

            hideLoadingVisual();

            setTimeout(function () {
                if (initScreen) initScreen.style.setProperty('display', 'none', 'important');

                if (finalScreen) {
                    finalScreen.style.setProperty('display', 'grid', 'important');
                    setTimeout(function () {
                        finalScreen.style.opacity = "1";

                        showMobileSeparator();

                        setTimeout(function () {
                            showMobilePortals();

                            setTimeout(function () {
                                updateSeparatorStatus();
                                updateModulesStatus();
                            }, 1000);
                        }, 500);

                        // Start logo animation (from base.js)
                        if (Codex.header && Codex.header.typeSlogan) {
                            Codex.header.typeSlogan();
                        }
                    }, 50);
                }
            }, transitionDuration * 1000);
        }, finalDelay);
    }

    // --- MAIN LOGIC ---

    if (logs && initScreen) {
        // Show boot animation once per session
        var introShown = sessionStorage.getItem(SESSION_KEY);
        if (introShown) {
            showAllContentImmediately();
        } else {
            sessionStorage.setItem(SESSION_KEY, 'true');
            runBootSequence();
        }
    } else {
        // Internal page (no terminal) - show everything immediately
        showAllContentImmediately();
    }
});
