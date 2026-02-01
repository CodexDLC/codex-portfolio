/**
 * CodexDLC Main Page Logic
 * Handles Boot Sequence, Hero Animation, Slide System, and Bento Grid
 */

document.addEventListener("DOMContentLoaded", () => {
    const logs = document.getElementById('terminal-logs');
    const initScreen = document.getElementById('init-screen');
    const finalScreen = document.getElementById('final-screen');
    const bentoItems = document.querySelectorAll('.bento-item');
    const navLinks = document.querySelectorAll('.header-nav .nav-link');
    const moduleTabs = document.querySelectorAll('.module-tab');
    const modulesStatus = document.querySelector('.modules-status');
    const modulesLine = document.querySelector('.modules-line');

    // --- CONFIG ---
    const SESSION_KEY = 'codex_intro_shown'; // Ключ для sessionStorage
    const SLIDE_COOLDOWN = 800; // ms between slide switches

    // --- SLIDE SYSTEM ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let isSliding = false;
    let lastSlideTime = 0;

    /**
     * Switch to a specific slide
     * @param {number} index - Slide index (0 = Hero, 1 = Bento)
     * @param {string} direction - 'up' or 'down'
     */
    function goToSlide(index, direction = 'down') {
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
    }

    /**
     * Handle wheel events for slide switching
     */
    function handleWheel(e) {
        if (isSliding) return;

        const delta = e.deltaY;
        const threshold = 30; // Minimum scroll to trigger

        if (Math.abs(delta) < threshold) return;

        if (delta > 0 && currentSlide < slides.length - 1) {
            // Scroll down
            goToSlide(currentSlide + 1, 'down');
        } else if (delta < 0 && currentSlide > 0) {
            // Scroll up
            goToSlide(currentSlide - 1, 'up');
        }
    }

    // Attach wheel listener
    if (slides.length > 0) {
        document.addEventListener('wheel', handleWheel, { passive: true });
    }

    /**
     * Handle module tab clicks - go to Bento slide
     */
    moduleTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(1, 'down'); // Go to Bento
        });
    });

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

    /**
     * Show module tab by index (synced with logs)
     */
    const showModuleTab = (index) => {
        if (moduleTabs[index]) {
            moduleTabs[index].classList.add('visible');
        }
    };

    /**
     * Update modules bar status to READY
     */
    const updateModulesStatus = () => {
        if (modulesStatus) {
            modulesStatus.innerHTML = '// SYSTEM_READY';
            modulesStatus.classList.add('status-ready');
        }
        if (modulesLine) {
            modulesLine.classList.add('line-ready');
        }
    };

    const updateSeparatorStatus = () => {
        // Desktop: bento-separator
        const separator = document.querySelector('.bento-separator');
        if (separator) {
            const textSpan = separator.querySelector('.bento-status');
            if (textSpan) {
                textSpan.innerHTML = '// SYSTEM_READY';
            }
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
        const isMobile = window.innerWidth <= 767;

        // Скрываем экран загрузки
        if (initScreen) initScreen.style.display = 'none';

        // Скрываем мобильный init screen
        const mobileInitScreen = document.querySelector('.mobile-init-screen');
        if (mobileInitScreen) mobileInitScreen.style.display = 'none';

        // Показываем финал
        if (finalScreen) {
            finalScreen.style.display = isMobile ? 'block' : 'grid';
            finalScreen.style.opacity = '1';
        }

        // Показываем все Bento карточки
        bentoItems.forEach(item => {
            item.classList.remove('bento-hidden');
            item.classList.add('bento-visible');
        });

        // Показываем все ссылки навигации (ВАЖНО для внутренних страниц)
        navLinks.forEach(link => {
            link.classList.remove('nav-hidden');
            link.classList.add('nav-visible');
        });

        // Показываем все module tabs
        moduleTabs.forEach(tab => {
            tab.classList.add('visible');
        });

        // Обновляем статус разделителя
        updateSeparatorStatus();
        updateModulesStatus(); // Update hero modules bar
        const separator = document.querySelector('.bento-separator');
        if (separator) separator.style.opacity = '1';

        // Показываем мобильный separator сразу с READY статусом
        showMobileSeparator();

        // На мобильных показываем tiles grid
        if (isMobile) {
            const mobileTilesGrid = document.querySelector('.mobile-tiles-grid');
            if (mobileTilesGrid) {
                mobileTilesGrid.classList.add('show-tiles');
            }
        } else {
            // Показываем мобильные порталы (для совместимости)
            showMobilePortals();
        }

        // Запускаем анимацию логотипа (функция из base.js)
        if (typeof typeSlogan === 'function') {
            typeSlogan();
        }
    };

    // --- TYPEWRITER FOR SLOGAN (REPLACEMENT LOGIC) ---
    // (Дублируем здесь или используем из base.js, но лучше вызывать из base.js)
    // В base.js функция глобальная, так что просто вызываем её.

    // --- MOBILE PIPELINE ANIMATION ---
    const runMobilePipelineAnimation = () => {
        const mobileInitScreen = document.querySelector('.mobile-init-screen');
        const mobileTilesGrid = document.querySelector('.mobile-tiles-grid');
        const mpNodes = document.querySelectorAll('.mp-node');
        const mpLines = document.querySelectorAll('.mp-line');

        if (!mobileInitScreen) return;

        // Animation sequence timing (ms)
        const sequence = [
            { delay: 300, action: () => document.querySelector('.mp-arch')?.classList.add('visible') },
            { delay: 600, action: () => document.querySelector('.mp-line-1')?.classList.add('drawn') },
            { delay: 900, action: () => document.querySelector('.mp-icon-1')?.classList.add('visible') },
            { delay: 1100, action: () => document.querySelector('.mp-icon-2')?.classList.add('visible') },
            { delay: 1300, action: () => document.querySelector('.mp-icon-3')?.classList.add('visible') },
            { delay: 1600, action: () => {
                document.querySelector('.mp-line-2')?.classList.add('drawn');
                document.querySelector('.mp-line-3')?.classList.add('drawn');
                document.querySelector('.mp-line-4')?.classList.add('drawn');
            }},
            { delay: 2200, action: () => document.querySelector('.mp-merge')?.classList.add('visible') },
            { delay: 2600, action: () => document.querySelector('.mp-line-5')?.classList.add('drawn') },
            { delay: 3000, action: () => document.querySelector('.mp-product')?.classList.add('visible') },
        ];

        // Run animation sequence
        sequence.forEach(({ delay, action }) => {
            setTimeout(action, delay);
        });

        // Transition to final screen
        setTimeout(() => {
            // Fade out init screen
            mobileInitScreen.classList.add('fade-out');

            setTimeout(() => {
                mobileInitScreen.classList.add('hidden');

                // Show final screen (hero + tiles)
                if (finalScreen) {
                    finalScreen.style.setProperty('display', 'block', 'important');
                    finalScreen.style.opacity = "1";
                }

                // Show tiles grid
                if (mobileTilesGrid) {
                    mobileTilesGrid.classList.add('show-tiles');
                }

                // Show separator
                showMobileSeparator();

                // Update status after delay
                setTimeout(() => {
                    updateSeparatorStatus();
                    updateModulesStatus();
                }, 500);

                // Start logo animation
                if (typeof typeSlogan === 'function') {
                    typeSlogan();
                }
            }, 800);
        }, 3800);
    };

    const runBootSequence = () => {
        // Скрываем контент для анимации
        bentoItems.forEach(item => item.classList.add('bento-hidden'));
        navLinks.forEach(link => link.classList.add('nav-hidden'));

        const isMobile = window.innerWidth <= 767;

        // На мобильных запускаем новую анимацию pipeline
        if (isMobile) {
            runMobilePipelineAnimation();
            return;
        }

        // Desktop animation (original)
        // Маппинг логов - triggerTab показывает таб в hero-modules-bar
        const messages = [
            { t: 500, m: "> Initializing Request...", triggerNav: 0, triggerTab: 0 },
            { t: 1200, m: "> R&D Process started...", c: "text-ghost", triggerBento: 1, triggerNav: 1, triggerTab: 1 },
            { t: 2200, m: "> Architecture defined.", c: "text-blue", triggerBento: 2, triggerNav: 2, triggerTab: 2 },
            { t: 3200, m: "> CORE: Python Engine Ready.", c: "text-gold", triggerBento: 0, triggerNav: 3, triggerTab: 3 },
            { t: 4500, m: "> CI/CD Pipeline active.", c: "text-gold" },
            { t: 6000, m: "> DEPLOYED TO PRODUCT.", c: "text-gold", triggerBento: 3 }
        ];

        messages.forEach((item) => {
            setTimeout(() => {
                const line = document.createElement('div');
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

        // Переход в финал
        const finalDelay = 7500;
        const transitionDuration = 0.8;

        setTimeout(() => {
            if (initScreen) {
                initScreen.style.transition = `opacity ${transitionDuration}s ease, transform ${transitionDuration}s ease`;
                initScreen.style.opacity = "0";
                initScreen.style.transform = "scale(0.98)";
            }

            // Скрываем картинку загрузки
            hideLoadingVisual();

            setTimeout(() => {
                // FIX: Используем setProperty с !important чтобы перебить CSS
                if (initScreen) initScreen.style.setProperty('display', 'none', 'important');

                if (finalScreen) {
                    finalScreen.style.setProperty('display', 'grid', 'important');
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
                                updateModulesStatus(); // Update hero modules bar
                            }, 1000);
                        }, 500);

                        // Запускаем анимацию логотипа
                        if (typeof typeSlogan === 'function') {
                            typeSlogan();
                        }
                    }, 50);
                }
            }, transitionDuration * 1000);
        }, finalDelay);
    };

    // --- MAIN LOGIC ---

    // ПРОВЕРКА: Если мы на главной странице (есть терминал)
    if (logs && initScreen) {
        // DEBUG: Временно отключена проверка sessionStorage - всегда показываем анимацию
        // const introShown = sessionStorage.getItem(SESSION_KEY);
        // if (introShown) {
        //     showAllContentImmediately();
        // } else {
        //     sessionStorage.setItem(SESSION_KEY, 'true');
        //     runBootSequence();
        // }

        // Всегда запускаем анимацию (для тестирования)
        runBootSequence();
    } else {
        // Если мы на внутренней странице (нет терминала), показываем всё сразу
        showAllContentImmediately();
    }
});