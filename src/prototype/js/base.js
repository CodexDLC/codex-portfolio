/**
 * CodexDLC Base Logic
 * Handles Header, Footer, Navigation, and Global Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CodexDLC Base: Initialized");

    // Инициализация мобильного меню (если есть)
    initMobileMenu();
});

/* --- HEADER: LOGO ANIMATION --- */
let sloganAnimationStarted = false;

function typeSlogan() {
    // Защита от повторного вызова
    if (sloganAnimationStarted) return;
    sloganAnimationStarted = true;

    const sloganEl = document.getElementById('brand-slogan');
    // FIX: Changed ID from brand-text to brand-logo
    const brandText = document.getElementById('brand-logo');

    if (!sloganEl || !brandText) return;

    const isMobile = window.innerWidth <= 767;

    // Таймауты: на мобилке быстрее
    const initialDelay = isMobile ? 1500 : 3000;
    const charSpeed = isMobile ? 30 : 50;

    // 1. Ждем немного, потом скрываем логотип
    setTimeout(() => {
        brandText.style.opacity = '0';
        brandText.style.transition = 'opacity 0.5s';

        setTimeout(() => {
            brandText.style.display = 'none';
            sloganEl.style.display = 'inline-block';

            // 2. Печатаем слоган
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

    const isActive = overlay.classList.contains('active');
    if (isActive) {
        overlay.classList.remove('active');
    } else {
        overlay.classList.add('active');
    }
}

function initMobileMenu() {
    // Закрытие меню при клике на ссылку
    const overlay = document.getElementById('main-menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                toggleMainMenu();
            }
        });
    }
}

/* --- MOBILE MENU: Folder Toggle --- */
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

// Закрываем слайдер, если кликнули мимо
document.addEventListener('click', function(event) {
    const slider = document.getElementById('lang-slider');
    if (slider && !slider.contains(event.target)) {
        slider.classList.remove('expanded');
    }
});

/* --- FOOTER: DRAWERS (Navigation & Contacts) --- */

function toggleNavDrawer() {
    const isMobile = window.innerWidth <= 767;

    if (isMobile) {
        // Mobile: используем bottom-drawer с классом active
        const navDrawer = document.getElementById('nav-drawer');
        const contactDrawer = document.getElementById('contact-drawer');

        if (!navDrawer) return;

        // Если открыты контакты - закрываем их
        if (contactDrawer && contactDrawer.classList.contains('active')) {
            contactDrawer.classList.remove('active');
        }

        navDrawer.classList.toggle('active');
    } else {
        // Desktop: используем layout-drawer с классом open
        const drawerNav = document.getElementById('drawer-nav');

        if (!drawerNav) return;

        drawerNav.classList.toggle('open');
    }
}

function toggleContactDrawer() {
    const isMobile = window.innerWidth <= 767;

    if (isMobile) {
        // Mobile: используем bottom-drawer
        const contactDrawer = document.getElementById('contact-drawer');
        const navDrawer = document.getElementById('nav-drawer');

        if (!contactDrawer) return;

        // Если открыт Хаб - закрываем его
        if (navDrawer && navDrawer.classList.contains('active')) {
            navDrawer.classList.remove('active');
        }

        contactDrawer.classList.toggle('active');
    } else {
        // Desktop: пока открываем тот же drawer-nav (можно сделать отдельный позже)
        // Или показываем контакты в том же drawer
        const drawerNav = document.getElementById('drawer-nav');

        if (!drawerNav) return;

        drawerNav.classList.toggle('open');
    }
}
