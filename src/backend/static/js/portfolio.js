document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SIDE SWITCHER LOGIC (Mobile) ---
    const switchBtn = document.getElementById('switch-side-btn');
    const wrapper = document.querySelector('.portfolio-page-wrapper');
    const STORAGE_KEY = 'portfolio_layout_side';

    if (switchBtn && wrapper) {
        const savedSide = localStorage.getItem(STORAGE_KEY);
        if (savedSide === 'left') {
            wrapper.classList.add('layout-left');
        }

        switchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.toggle('layout-left');
            if (wrapper.classList.contains('layout-left')) {
                localStorage.setItem(STORAGE_KEY, 'left');
            } else {
                localStorage.setItem(STORAGE_KEY, 'right');
            }
        });
    }

    // --- 2. HTMX PAGINATION CONTROLLER ---

    let isNavigating = false;
    const NAV_COOLDOWN = 800; // ms

    function triggerPageChange(direction) {
        if (isNavigating) return;

        let btnId = direction === 'next' ? 'slide-next-btn' : 'slide-prev-btn';
        const btn = document.getElementById(btnId);

        // Check if button exists and is not disabled
        if (btn && !btn.hasAttribute('disabled')) {
            isNavigating = true;

            // FIX: Use htmx.trigger instead of btn.click() for hidden elements
            if (typeof htmx !== 'undefined') {
                htmx.trigger(btn, 'click');
            } else {
                btn.click(); // Fallback
            }

            setTimeout(() => {
                isNavigating = false;
            }, NAV_COOLDOWN);
        }
    }

    // --- 3. INPUT HANDLERS ---

    // Wheel Event (Desktop)
    let scrollAccumulator = 0;
    const SCROLL_THRESHOLD = 50;

    window.addEventListener('wheel', (e) => {
        if (isNavigating) return;

        scrollAccumulator += e.deltaY;

        if (scrollAccumulator > SCROLL_THRESHOLD) {
            triggerPageChange('next');
            scrollAccumulator = 0;
        } else if (scrollAccumulator < -SCROLL_THRESHOLD) {
            triggerPageChange('prev');
            scrollAccumulator = 0;
        }

        setTimeout(() => { scrollAccumulator = 0; }, 200);

    }, { passive: true });

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        if (isNavigating) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') triggerPageChange('next');
        if (e.key === 'ArrowUp' || e.key === 'PageUp') triggerPageChange('prev');
    });

    // Touch Navigation (Mobile/Tablet Swipe)
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isNavigating) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) { // Swipe threshold
            if (diff > 0) triggerPageChange('next'); // Swipe Up -> Next Page
            else triggerPageChange('prev'); // Swipe Down -> Prev Page
        }
    }, { passive: true });
});
