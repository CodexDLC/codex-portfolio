/**
 * CodexDLC Base Logic
 * Handles Header, Footer, Navigation, and Global Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CodexDLC Base: Initialized");
    initMobileMenu();
});

/* --- HEADER: LOGO ANIMATION --- */
let sloganAnimationStarted = false;

function typeSlogan() {
    if (sloganAnimationStarted) return;
    sloganAnimationStarted = true;

    const sloganEl = document.getElementById('brand-slogan');
    const brandText = document.getElementById('brand-logo');

    if (!sloganEl || !brandText) return;

    const isMobile = window.innerWidth <= 767;
    const initialDelay = isMobile ? 1500 : 3000;
    const charSpeed = isMobile ? 30 : 50;

    setTimeout(() => {
        brandText.style.opacity = '0';
        brandText.style.transition = 'opacity 0.5s';

        setTimeout(() => {
            brandText.style.display = 'none';
            sloganEl.style.display = 'inline-block';
            startTyping();
        }, 500);
    }, initialDelay);

    const parts = [
        { text: "[ ", color: "var(--color-ghost)" },
        { text: "Developer's", color: "var(--color-gold)" },
        { text: " ", color: "transparent" },
        { text: "Life", color: "var(--color-ivory)" },
        { text: " ", color: "transparent" },
        { text: "Cycle", color: "var(--color-blue)" },
        { text: " ]", color: "var(--color-ghost)" }
    ];

    let partIndex = 0;

    function startTyping() {
        function typeNextPart() {
            if (partIndex >= parts.length) return;

            const part = parts[partIndex];
            const span = document.createElement('span');
            span.style.color = part.color;
            sloganEl.appendChild(span);

            let charIndex = 0;
            const interval = setInterval(() => {
                if (charIndex < part.text.length) {
                    span.textContent += part.text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(interval);
                    partIndex++;
                    typeNextPart();
                }
            }, charSpeed);
        }
        typeNextPart();
    }
}

/* --- HEADER: MOBILE MENU OVERLAY --- */
function toggleMainMenu() {
    const overlay = document.getElementById('main-menu-overlay');
    if (!overlay) return;
    overlay.classList.toggle('active');
}

function initMobileMenu() {
    const overlay = document.getElementById('main-menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                toggleMainMenu();
            }
        });
    }
}

function toggleNavFolder(element) {
    const folderGroup = element.closest('.nav-folder-group');
    if (folderGroup) {
        folderGroup.classList.toggle('open');
    }
}

/* --- FOOTER: LANGUAGE SLIDER --- */
function toggleLangSlider(element) {
    element.classList.toggle('expanded');
}

document.addEventListener('click', function(event) {
    const slider = document.getElementById('lang-slider');
    if (slider && !slider.contains(event.target)) {
        slider.classList.remove('expanded');
    }
});

/* --- FOOTER: SYSTEM HUB & CONTACTS --- */

// Unified Toggle for System Hub (Desktop & Mobile)
function toggleSystemHub() {
    const isMobile = window.innerWidth <= 767;

    // Determine which hub to toggle
    const hub = isMobile
        ? document.getElementById('hub-mobile')
        : document.getElementById('hub-desktop');

    // Determine which contacts to close
    const contacts = isMobile
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

    // Toggle class based on type
    if (isMobile) {
        hub.classList.toggle('active');
    } else {
        hub.classList.toggle('open');
    }
}

// Unified Toggle for Contacts (Desktop & Mobile)
function toggleContactDrawer() {
    const isMobile = window.innerWidth <= 767;

    // Determine which contacts to toggle
    const contacts = isMobile
        ? document.getElementById('contact-mobile')
        : document.getElementById('contact-desktop');

    // Determine which hub to close
    const hub = isMobile
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

    // Toggle class based on type
    if (isMobile) {
        contacts.classList.toggle('active');
    } else {
        contacts.classList.toggle('open');
    }
}

// Deprecated functions (kept for compatibility if needed, but redirected)
function toggleNavDrawer() { toggleSystemHub(); }
