/**
 * CodexDLC Prototype Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CodexDLC System: Initialized");

    initDLCDecoder();
    initAccordions();
    initSmartFooter();
    initStickyHeader(); // Новая функция
});

/**
 * Sticky Shrink Header
 * Уменьшает высоту хедера при скролле
 */
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.remove('h-20');
            header.classList.add('h-14');
            header.classList.add('bg-spaceNavy/95'); // Более плотный фон
        } else {
            header.classList.add('h-20');
            header.classList.remove('h-14');
            header.classList.remove('bg-spaceNavy/95');
        }
    });
}

function initDLCDecoder() {
    const tagline = document.getElementById('dlc-tagline');
    if (!tagline) return;
    tagline.style.opacity = '0';
    tagline.style.transition = 'opacity 2s ease-in-out';
    setTimeout(() => { tagline.style.opacity = '1'; }, 1000);
}

function initAccordions() {
    const triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (window.innerWidth >= 768) return;
            const item = trigger.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');
            const isOpen = item.classList.contains('is-open');

            if (isOpen) {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                if(icon) icon.style.transform = 'rotate(0deg)';
                item.classList.remove('is-open');
            } else {
                content.style.maxHeight = '1000px';
                content.style.opacity = '1';
                if(icon) icon.style.transform = 'rotate(45deg)';
                item.classList.add('is-open');
            }
        });
    });
}

function initSmartFooter() {
    const footer = document.getElementById('smart-footer');
    const expanded = document.getElementById('footer-expanded');
    if (!footer || !expanded) return;

    footer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        const isOpen = footer.classList.contains('is-expanded');
        if (isOpen) {
            expanded.style.maxHeight = '0px';
            expanded.style.opacity = '0';
            footer.classList.remove('is-expanded');
        } else {
            expanded.style.maxHeight = '600px';
            expanded.style.opacity = '1';
            footer.classList.add('is-expanded');
            setTimeout(() => {
                 window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    });
}