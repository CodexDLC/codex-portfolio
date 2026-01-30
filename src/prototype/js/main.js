/**
 * CodexDLC Prototype Logic
 * System: Vanilla JS (No Frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CodexDLC System: Initialized");

    // Запускаем улучшенный декодер с цветами
    initBrandDecoder();

    // --- MOBILE TABS LOGIC ---
    const navContainer = document.querySelector('.header-nav');

    if (navContainer) {
        // Делегирование клика
        navContainer.addEventListener('click', (e) => {
            // Проверяем, мобилка ли это (по ширине экрана)
            if (window.innerWidth <= 1024) {
                // Если меню закрыто -> открываем
                if (!navContainer.classList.contains('expanded')) {
                    navContainer.classList.add('expanded');
                    e.preventDefault(); // Предотвращаем переход по ссылке при первом клике (открытии)
                }
                // Если меню открыто -> даем клику пройти (переход по ссылке)
                // и закрываем меню через мгновение (визуальный эффект)
                else {
                    setTimeout(() => {
                        navContainer.classList.remove('expanded');
                    }, 200);
                }
            }
        });

        // Закрываем меню, если кликнули вне его
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target)) {
                navContainer.classList.remove('expanded');
            }
        });
    }
});

function initBrandDecoder() {
    const el = document.getElementById('brand-text');
    if (!el) return;

    // Начальное состояние
    const brandName = "CodexDLC";

    // Настройки
    const initialDelay = 2000; // Пауза перед стартом (2 сек)
    const deleteSpeed = 30;    // Скорость стирания
    const typeSpeed = 40;      // Скорость печати
    const pauseBeforeLoop = 5000; // Если захотим зациклить (пока не используется)

    // Цветовая схема для расшифровки (HTML-структура)
    // Используем CSS-переменные из base.css
    const parts = [
        { text: "[ ", color: "var(--color-ghost)" },
        { text: "Developer's", color: "var(--color-gold)" }, // Gold (Ты)
        { text: " ", color: "transparent" },
        { text: "Life", color: "var(--color-ivory)" },      // Life (Процесс)
        { text: " ", color: "transparent" },
        { text: "Cycle", color: "var(--color-blue)" },      // Cycle (Технология)
        { text: " ]", color: "var(--color-ghost)" }
    ];

    // Сценарий
    setTimeout(() => {
        // 1. Стираем "CodexDLC"
        deleteText(el, () => {
            // 2. Подготавливаем стили для новой фразы
            el.style.fontSize = "0.9rem"; // Чуть меньше, чтобы влезло
            el.style.letterSpacing = "1px";
            el.classList.remove('typing-cursor'); // Убираем курсор на секунду, чтобы сбросить стиль
            void el.offsetWidth; // Триггер рефлоу
            el.classList.add('typing-cursor');  // Возвращаем курсор

            // 3. Печатаем по кусочкам (цветная печать)
            typeColoredText(el, parts, 0, () => {
                console.log("Decoder sequence complete");
                // Анимация завершена. Курсор останется мигать в конце.
            });
        });
    }, initialDelay);
}

// Утилита: Стирание текста
function deleteText(element, callback) {
    let text = element.textContent;
    const interval = setInterval(() => {
        if (text.length > 0) {
            text = text.slice(0, -1);
            element.textContent = text;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 30);
}

// Утилита: Цветная печать
// Рекурсивно проходит по массиву частей (parts) и печатает их
function typeColoredText(container, parts, partIndex, callback) {
    if (partIndex >= parts.length) {
        if (callback) callback();
        return;
    }

    const part = parts[partIndex];

    // Создаем span для текущего цвета
    const span = document.createElement('span');
    span.style.color = part.color;
    container.appendChild(span);

    let charIndex = 0;
    const interval = setInterval(() => {
        if (charIndex < part.text.length) {
            span.textContent += part.text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(interval);
            // Переходим к следующему цветному куску
            typeColoredText(container, parts, partIndex + 1, callback);
        }
    }, 40); // Скорость печати
}

/* --- LANGUAGE TOGGLE --- */
function toggleLanguage(element) {
    // Добавляем/убираем класс 'active'
    element.classList.toggle('active');
}

/* --- DRAWER SYSTEM --- */
function toggleDrawer(sectionId, triggerBtn) {
    const drawer = document.getElementById('app-drawer');
    const sections = document.querySelectorAll('.drawer-section');
    const buttons = document.querySelectorAll('.sys-item'); // Все кнопки футера

    // 1. Если кликнули по уже активной кнопке -> ЗАКРЫВАЕМ
    if (triggerBtn.classList.contains('active-tab')) {
        drawer.classList.remove('open');
        triggerBtn.classList.remove('active-tab');
        return;
    }

    // 2. Сброс всех кнопок
    buttons.forEach(btn => btn.classList.remove('active-tab'));

    // 3. Скрываем все секции
    sections.forEach(sec => sec.classList.remove('active'));

    // 4. Активируем нужную
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        drawer.classList.add('open'); // Открываем ящик
        triggerBtn.classList.add('active-tab'); // Подсвечиваем кнопку
    }
}

// --- HANDEDNESS SWITCHER (Mobile Box Logic) ---

document.addEventListener('DOMContentLoaded', () => {
    const handBtn = document.getElementById('hand-switch-btn');
    const handText = document.getElementById('hand-text');
    const body = document.body;

    // Состояния: 0 = Center, 1 = Left, 2 = Right
    let currentMode = 0;
    const modes = ['Center', 'Left Mode', 'Right Mode'];
    const classes = ['', 'mode-left', 'mode-right'];

    if (handBtn) {
        handBtn.addEventListener('click', () => {
            // 1. Удаляем старый класс
            if (classes[currentMode]) {
                body.classList.remove(classes[currentMode]);
            }

            // 2. Переключаем счетчик (0 -> 1 -> 2 -> 0)
            currentMode = (currentMode + 1) % 3;

            // 3. Добавляем новый класс
            if (classes[currentMode]) {
                body.classList.add(classes[currentMode]);
            }

            // 4. Меняем текст кнопки
            handText.textContent = modes[currentMode];
        });
    }
});