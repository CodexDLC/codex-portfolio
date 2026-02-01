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
function typeSlogan() {
    const sloganEl = document.getElementById('brand-slogan');
    const brandText = document.getElementById('brand-text');

    if (!sloganEl || !brandText) return;

    // 1. Ждем немного, потом скрываем логотип
    setTimeout(() => {
        brandText.style.opacity = '0'; // Плавное исчезновение
        brandText.style.transition = 'opacity 0.5s';

        setTimeout(() => {
            brandText.style.display = 'none'; // Убираем из потока
            sloganEl.style.display = 'inline-block'; // Показываем контейнер слогана

            // 2. Печатаем слоган
            startTyping();
        }, 500);
    }, 3000); // Задержка перед началом замены

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
            }, 50);
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
    const navDrawer = document.getElementById('nav-drawer');
    const contactDrawer = document.getElementById('contact-drawer');

    if (!navDrawer) return;

    // Если открыты контакты - закрываем их
    if (contactDrawer && contactDrawer.classList.contains('active')) {
        contactDrawer.classList.remove('active');
    }

    // Переключаем сам Хаб
    navDrawer.classList.toggle('active');
}

function toggleContactDrawer() {
    const contactDrawer = document.getElementById('contact-drawer');
    const navDrawer = document.getElementById('nav-drawer');

    if (!contactDrawer) return;

    // Если открыт Хаб - закрываем его
    if (navDrawer && navDrawer.classList.contains('active')) {
        navDrawer.classList.remove('active');
    }

    contactDrawer.classList.toggle('active');
}
