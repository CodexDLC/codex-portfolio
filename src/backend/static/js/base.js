/**
 * CodexDLC Base Logic
 * Handles Header, Footer, Navigation, and Global Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CodexDLC Base: Initialized");
    initMobileMenu();
});

/* --- HEADER: LOGO ANIMATION (LOOPED CLEAN) --- */
let sloganAnimationStarted = false;

function typeSlogan() {
    if (sloganAnimationStarted) return;
    sloganAnimationStarted = true;

    const sloganEl = document.getElementById('brand-slogan');
    const brandText = document.getElementById('brand-logo');

    if (!sloganEl || !brandText) return;

    const isMobile = window.innerWidth <= 767;

    // MOBILE OPTIMIZATION: No animation, just static logo
    if (isMobile) {
        brandText.style.display = 'inline-block';
        brandText.style.opacity = '1';
        sloganEl.style.display = 'none';
        return; // Exit function, no typing loop
    }

    const charSpeed = 60;
    const backspaceSpeed = 30;
    const pauseBeforeReset = 5000; // Пауза перед возвратом к логотипу

    // Курсор
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.color = 'var(--color-gold)';
    cursor.style.animation = 'blink 1s step-end infinite';

    // Добавляем стиль для мигания курсора, если его нет
    if (!document.getElementById('cursor-style')) {
        const style = document.createElement('style');
        style.id = 'cursor-style';
        style.textContent = `
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    // Функция для печати текста
    function typeText(text, color, callback) {
        const span = document.createElement('span');
        span.style.color = color;
        sloganEl.insertBefore(span, cursor);

        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                span.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, charSpeed);
    }

    // Функция для стирания всего текста
    function backspaceAll(callback) {
        const interval = setInterval(() => {
            const lastSpan = sloganEl.querySelector('span:not(:last-child)'); // Игнорируем курсор
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

    // Сценарий анимации
    function runSequence() {
        // 1. Скрываем лого, показываем слоган
        brandText.style.opacity = '0';
        setTimeout(() => {
            brandText.style.display = 'none';
            sloganEl.style.display = 'inline-block';
            sloganEl.innerHTML = ''; // Очистка
            sloganEl.appendChild(cursor);

            // 2. Печатаем: [ Developer's Life Cycle ]
            typeText("[ ", "var(--color-ghost)", () => {
                typeText("Developer's", "var(--color-gold)", () => {
                    typeText(" ", "transparent", () => {
                        typeText("Life", "var(--color-ivory)", () => {
                            typeText(" ", "transparent", () => {
                                typeText("Cycle", "var(--color-blue)", () => {
                                    typeText(" ]", "var(--color-ghost)", () => {

                                        // 3. Финальная пауза и сброс
                                        setTimeout(() => {
                                            // Стираем перед возвратом логотипа (опционально, можно просто переключить)
                                            backspaceAll(() => {
                                                sloganEl.style.display = 'none';
                                                brandText.style.display = 'inline-block';
                                                setTimeout(() => {
                                                    brandText.style.opacity = '1';

                                                    // 4. Рестарт цикла через паузу
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

    // Запуск (первый раз с задержкой)
    setTimeout(runSequence, 3000);
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

/* --- I18N FORM SUBMITTER --- */
function submitLanguage(langCode) {
    // Prevent event bubbling if clicked inside slider
    event.stopPropagation();

    const form = document.getElementById('language-form');
    if (!form) return;

    const input = form.querySelector('input[name="language"]');
    if (input) {
        input.value = langCode;
        form.submit();
    }
}