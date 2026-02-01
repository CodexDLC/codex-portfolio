/**
 * CodexDLC Main Page Logic
 * Handles Boot Sequence, Hero Animation, and Bento Grid
 */

document.addEventListener("DOMContentLoaded", () => {
    const logs = document.getElementById('terminal-logs');
    const initScreen = document.getElementById('init-screen');
    const finalScreen = document.getElementById('final-screen');
    const bentoItems = document.querySelectorAll('.bento-item');
    const navLinks = document.querySelectorAll('.header-nav .nav-link');

    // --- CONFIG ---
    const ANIMATION_TTL = 30 * 60 * 1000; // 30 минут
    const STORAGE_KEY = 'codex_last_visit';

    // --- FUNCTIONS ---

    const showBentoItem = (index) => {
        if (bentoItems[index]) {
            bentoItems[index].classList.remove('bento-hidden');
            bentoItems[index].classList.add('bento-visible');
        }
    };

    const showNavLink = (index) => {
        if (navLinks[index]) {
            navLinks[index].classList.remove('nav-hidden');
            navLinks[index].classList.add('nav-visible');
        }
    };

    const updateSeparatorStatus = () => {
        // Desktop: bento-separator
        const separator = document.querySelector('.bento-separator');
        if (separator) {
            const textSpan = separator.querySelector('span');
            textSpan.innerHTML = '// SYSTEM_READY';
            separator.classList.add('separator-success');
        }

        // Mobile: mobile-separator
        const mobileSep = document.querySelector('.mobile-separator');
        if (mobileSep) {
            const sepText = mobileSep.querySelector('.separator-text');
            if (sepText) {
                sepText.innerHTML = '// SYSTEM_READY';
            }
            mobileSep.classList.add('separator-ready');
        }
    };

    // Показать мобильный separator
    const showMobileSeparator = () => {
        const mobileSep = document.querySelector('.mobile-separator');
        if (mobileSep) {
            mobileSep.classList.add('show-separator');
        }
    };

    // Показать картинку загрузки (мобилка)
    const showLoadingVisual = () => {
        const visual = document.querySelector('.mobile-loading-visual');
        if (visual) {
            visual.classList.add('show-visual');
        }
    };

    // Скрыть картинку загрузки (мобилка)
    const hideLoadingVisual = () => {
        const visual = document.querySelector('.mobile-loading-visual');
        if (visual) {
            visual.classList.add('fade-out');
            setTimeout(() => {
                visual.classList.add('hidden');
            }, 800);
        }
    };

    const showMobilePortals = () => {
        const portals = document.querySelector('.mobile-portals-stack');
        if (portals) {
            portals.classList.add('show-buttons');
        }
    };

    // Показать отдельную портальную карточку по индексу (для мобилки)
    const showPortalCard = (index) => {
        const portalCards = document.querySelectorAll('.mobile-portals-stack .portal-card');
        if (portalCards[index]) {
            portalCards[index].classList.add('portal-visible');
        }
    };

    const showAllContentImmediately = () => {
        // Скрываем экран загрузки
        if (initScreen) initScreen.style.display = 'none';

        // Показываем финал
        if (finalScreen) {
            finalScreen.style.display = 'grid';
            finalScreen.style.opacity = '1';
        }

        // Показываем все Bento карточки
        bentoItems.forEach(item => {
            item.classList.remove('bento-hidden');
            item.classList.add('bento-visible');
        });

        // Показываем все ссылки навигации
        navLinks.forEach(link => {
            link.classList.remove('nav-hidden');
            link.classList.add('nav-visible');
        });

        // Обновляем статус разделителя
        updateSeparatorStatus();
        const separator = document.querySelector('.bento-separator');
        if (separator) separator.style.opacity = '1';

        // Показываем мобильный separator сразу с READY статусом
        showMobileSeparator();

        // Показываем мобильные порталы
        showMobilePortals();

        // Запускаем анимацию логотипа (функция из base.js)
        if (typeof typeSlogan === 'function') {
            typeSlogan();
        }
    };

    // --- TYPEWRITER FOR SLOGAN (REPLACEMENT LOGIC) ---
    // (Дублируем здесь или используем из base.js, но лучше вызывать из base.js)
    // В base.js функция глобальная, так что просто вызываем её.

    const runBootSequence = () => {
        // Скрываем контент для анимации
        bentoItems.forEach(item => item.classList.add('bento-hidden'));
        navLinks.forEach(link => link.classList.add('nav-hidden'));

        // Маппинг логов
        const messages = [
            { t: 500,  m: "> Initializing Request...", triggerNav: 0 },
            { t: 1500, m: "> R&D Process started...", c: "text-ghost", triggerBento: 1, triggerNav: 1 },
            { t: 3000, m: "> Architecture defined.", c: "text-blue", triggerBento: 2, triggerNav: 2 },
            { t: 4500, m: "> CORE: Python Engine Ready.", c: "text-gold" },
            { t: 6000, m: "> Clusters live.", c: "text-gold", triggerBento: 0 },
            { t: 7500, m: "> CI/CD Pipeline active." },
            { t: 9000, m: "> DEPLOYED TO PRODUCT.", c: "text-gold", triggerBento: 3 }
        ];

        messages.forEach((item) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = item.c ? item.c : '';
                line.textContent = item.m;
                logs.appendChild(line);
                logs.scrollTop = logs.scrollHeight;

                if (item.triggerBento !== undefined) showBentoItem(item.triggerBento);
                if (item.triggerNav !== undefined) showNavLink(item.triggerNav);

            }, item.time || item.t);
        });

        // Переход в финал
        setTimeout(() => {
            initScreen.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            initScreen.style.opacity = "0";
            initScreen.style.transform = "scale(0.98)";

            // Скрываем картинку загрузки
            hideLoadingVisual();

            setTimeout(() => {
                // FIX: Используем setProperty с !important чтобы перебить CSS
                initScreen.style.setProperty('display', 'none', 'important');

                // На мобилке используем block вместо grid
                const isMobile = window.innerWidth <= 767;
                finalScreen.style.setProperty('display', isMobile ? 'block' : 'grid', 'important');
                setTimeout(() => {
                    finalScreen.style.opacity = "1";

                    // Показываем мобильный separator (LOADING)
                    showMobileSeparator();

                    // Через 500ms показываем порталы с анимацией
                    setTimeout(() => {
                        showMobilePortals();

                        // Через 1 сек меняем статус на READY
                        setTimeout(() => {
                            updateSeparatorStatus();
                        }, 1000);
                    }, 500);

                    // Запускаем анимацию логотипа
                    if (typeof typeSlogan === 'function') {
                        typeSlogan();
                    }
                }, 50);
            }, 800);
        }, 10500);
    };

    // --- MAIN LOGIC ---
    const now = Date.now();
    const lastVisit = localStorage.getItem(STORAGE_KEY);
    // const isMobile = window.innerWidth <= 768;

    // FIX: Анимация работает на всех устройствах (включая мобилку)
    // if (!lastVisit || (now - parseInt(lastVisit) > ANIMATION_TTL)) {
        localStorage.setItem(STORAGE_KEY, now);
        runBootSequence();
    // } else {
    //     showAllContentImmediately();
    // }
});