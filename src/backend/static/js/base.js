/**
 * CodexDLC Base Logic
 * Global namespace, Header, Footer, Drawers, Action Dispatcher
 */

/* ============================================
   0. NAMESPACE INIT
   ============================================ */
window.Codex = window.Codex || {};


/* ============================================
   1. HEADER: Logo Animation, Mobile Menu, Nav Folders
   ============================================ */
Codex.header = (function () {
    var sloganAnimationStarted = false;

    function typeSlogan() {
        if (sloganAnimationStarted) return;
        sloganAnimationStarted = true;

        var sloganEl = document.getElementById('brand-slogan');
        var brandText = document.getElementById('brand-logo');

        if (!sloganEl || !brandText) return;

        var isMobile = window.innerWidth <= 767;

        // Mobile: static logo, no animation
        if (isMobile) {
            brandText.style.display = 'inline-block';
            brandText.style.opacity = '1';
            sloganEl.style.display = 'none';
            return;
        }

        var charSpeed = 60;
        var backspaceSpeed = 30;
        var pauseBeforeReset = 5000;

        // Blinking cursor
        var cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.color = 'var(--color-gold)';
        cursor.style.animation = 'blink 1s step-end infinite';

        if (!document.getElementById('cursor-style')) {
            var style = document.createElement('style');
            style.id = 'cursor-style';
            style.textContent = '@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
            document.head.appendChild(style);
        }

        function typeText(text, color, callback) {
            var span = document.createElement('span');
            span.style.color = color;
            sloganEl.insertBefore(span, cursor);

            var i = 0;
            var interval = setInterval(function () {
                if (i < text.length) {
                    span.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, charSpeed);
        }

        function backspaceAll(callback) {
            var interval = setInterval(function () {
                var lastSpan = sloganEl.querySelector('span:not(:last-child)');
                if (lastSpan) {
                    if (lastSpan.textContent.length > 0) {
                        lastSpan.textContent = lastSpan.textContent.slice(0, -1);
                    } else {
                        lastSpan.remove();
                    }
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, backspaceSpeed);
        }

        function runSequence() {
            brandText.style.opacity = '0';
            setTimeout(function () {
                brandText.style.display = 'none';
                sloganEl.style.display = 'inline-block';
                sloganEl.innerHTML = '';
                sloganEl.appendChild(cursor);

                // Type: [ Developer's Life Cycle ]
                typeText("[ ", "var(--color-ghost)", function () {
                    typeText("Developer's", "var(--color-gold)", function () {
                        typeText(" ", "transparent", function () {
                            typeText("Life", "var(--color-ivory)", function () {
                                typeText(" ", "transparent", function () {
                                    typeText("Cycle", "var(--color-blue)", function () {
                                        typeText(" ]", "var(--color-ghost)", function () {
                                            setTimeout(function () {
                                                backspaceAll(function () {
                                                    sloganEl.style.display = 'none';
                                                    brandText.style.display = 'inline-block';
                                                    setTimeout(function () {
                                                        brandText.style.opacity = '1';
                                                        setTimeout(runSequence, 3000);
                                                    }, 100);
                                                });
                                            }, pauseBeforeReset);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }, 500);
        }

        // Start with initial delay
        setTimeout(runSequence, 3000);
    }

    function toggleMainMenu() {
        var overlay = document.getElementById('main-menu-overlay');
        if (!overlay) return;
        overlay.classList.toggle('active');
    }

    function toggleNavFolder(element) {
        if (!element) return;
        var folderGroup = element.closest('.nav-folder-group');
        if (!folderGroup) return;
        folderGroup.classList.toggle('open');
    }

    function initMobileMenu() {
        var overlay = document.getElementById('main-menu-overlay');
        if (!overlay) return;
        overlay.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                toggleMainMenu();
            }
        });
    }

    return {
        typeSlogan: typeSlogan,
        toggleMainMenu: toggleMainMenu,
        toggleNavFolder: toggleNavFolder,
        initMobileMenu: initMobileMenu
    };
})();


/* ============================================
   2. FOOTER: Language Switcher
   ============================================ */
Codex.footer = (function () {

    function toggleLangSlider(element) {
        if (!element) return;
        element.classList.toggle('expanded');
    }

    function submitLanguage(langCode) {
        var form = document.getElementById('language-form');
        if (!form) return;
        var input = form.querySelector('input[name="language"]');
        if (!input) return;
        input.value = langCode;
        form.submit();
    }

    function initOutsideClick() {
        document.addEventListener('click', function (event) {
            var slider = document.getElementById('lang-slider');
            if (slider && !slider.contains(event.target)) {
                slider.classList.remove('expanded');
            }
        });
    }

    return {
        toggleLangSlider: toggleLangSlider,
        submitLanguage: submitLanguage,
        initOutsideClick: initOutsideClick
    };
})();


/* ============================================
   3. DRAWERS: System Hub & Contact Panels
   ============================================ */
Codex.drawers = (function () {

    function toggleSystemHub() {
        var isMobile = window.innerWidth <= 767;

        var hub = isMobile
            ? document.getElementById('hub-mobile')
            : document.getElementById('hub-desktop');

        var contacts = isMobile
            ? document.getElementById('contact-mobile')
            : document.getElementById('contact-desktop');

        if (!hub) return;

        // Close contacts if open
        if (contacts) {
            if (isMobile && contacts.classList.contains('active')) {
                contacts.classList.remove('active');
            } else if (!isMobile && contacts.classList.contains('open')) {
                contacts.classList.remove('open');
            }
        }

        if (isMobile) {
            hub.classList.toggle('active');
        } else {
            hub.classList.toggle('open');
        }
    }

    function toggleContactDrawer() {
        var isMobile = window.innerWidth <= 767;

        var contacts = isMobile
            ? document.getElementById('contact-mobile')
            : document.getElementById('contact-desktop');

        var hub = isMobile
            ? document.getElementById('hub-mobile')
            : document.getElementById('hub-desktop');

        if (!contacts) return;

        // Close hub if open
        if (hub) {
            if (isMobile && hub.classList.contains('active')) {
                hub.classList.remove('active');
            } else if (!isMobile && hub.classList.contains('open')) {
                hub.classList.remove('open');
            }
        }

        if (isMobile) {
            contacts.classList.toggle('active');
        } else {
            contacts.classList.toggle('open');
        }
    }

    return {
        toggleSystemHub: toggleSystemHub,
        toggleContactDrawer: toggleContactDrawer
    };
})();


/* ============================================
   4. ACTION DISPATCHER (replaces all onclick)
   ============================================ */
document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-action]');
    if (!target) return;

    var action = target.dataset.action;

    switch (action) {
        // Header
        case 'toggle-main-menu':
            Codex.header.toggleMainMenu();
            break;
        case 'toggle-nav-folder':
            Codex.header.toggleNavFolder(target);
            break;

        // Footer
        case 'toggle-lang-slider':
            Codex.footer.toggleLangSlider(target);
            break;
        case 'submit-language':
            e.stopPropagation();
            Codex.footer.submitLanguage(target.dataset.lang);
            break;

        // Drawers
        case 'toggle-system-hub':
            Codex.drawers.toggleSystemHub();
            break;
        case 'toggle-contact-drawer':
            Codex.drawers.toggleContactDrawer();
            break;

        // Page-specific (only work if page JS loaded)
        case 'go-to-slide':
            if (Codex.home) Codex.home.goToSlide(Number(target.dataset.index), target.dataset.dir || 'down');
            break;
        case 'go-to-exp-slide':
            if (Codex.experience) Codex.experience.goToExpSlide(target.dataset.direction);
            break;
    }
});


/* ============================================
   5. INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
    Codex.header.initMobileMenu();
    Codex.footer.initOutsideClick();
});
