/**
 * CodexDLC Portfolio Logic
 * Handles File Tabs switching with Slide Animation
 */

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.file-tab');
    const sections = document.querySelectorAll('.island-section');
    const emptyState = document.querySelector('.empty-state');
    const footerFile = document.querySelector('.footer-left .copyright-text');
    const tabsBar = document.querySelector('.folder-tabs-bar');

    // --- 1. INTRO ANIMATION ---
    setTimeout(() => {
        if (tabsBar) {
            tabsBar.classList.add('slide-down');
        }
    }, 100);


    // --- 2. TABS LOGIC ---
    const tabMap = {
        '#clients': { id: 'business', index: 0 },
        '#products': { id: 'eco', index: 1 },
        '#opensource': { id: 'rnd', index: 2 },
        '#prototypes': { id: 'prototypes', index: 3 },
        '#configs': { id: 'configs', index: 4 }
    };

    let currentIndex = 0;
    let isAnimating = false;

    function switchTab(targetId) {
        if (isAnimating) return;

        const targetData = tabMap[targetId];
        if (!targetData) return;

        const targetIndex = targetData.index;
        const targetSectionId = targetData.id;

        if (targetIndex === currentIndex && document.getElementById(targetSectionId).classList.contains('active')) return;

        isAnimating = true;

        const direction = targetIndex > currentIndex ? 'next' : 'prev';

        // Update Tabs UI
        tabs.forEach(tab => {
            if (tab.getAttribute('href') === targetId) {
                tab.classList.add('active');
                const fileName = tab.querySelector('span:last-child').innerText;
                if (footerFile) footerFile.innerHTML = `<span class="file-icon">📄</span> ${fileName}`;
            } else {
                tab.classList.remove('active');
            }
        });

        // Animation Logic
        const currentSection = document.querySelector('.island-section.active');
        const nextSection = document.getElementById(targetSectionId);

        if (emptyState) emptyState.style.display = 'none';

        const isMobile = window.innerWidth <= 768;

        // STEP 1: HIDE CURRENT
        if (currentSection) {
            if (!isMobile) {
                if (direction === 'next') {
                    currentSection.classList.add('slide-out-left');
                } else {
                    currentSection.classList.add('slide-out-right');
                }
            } else {
                // Mobile: Fade Out
                currentSection.style.opacity = '0';
            }
            currentSection.classList.remove('active');
        }

        // STEP 2: SHOW NEXT (Adaptive Delay)
        // Desktop needs 400ms for slide transition
        // Mobile needs less (100ms) for snappy feel
        const delay = isMobile ? 100 : 350;

        setTimeout(() => {
            // Hide old completely
            if (currentSection) {
                currentSection.style.display = 'none';
                currentSection.classList.remove('slide-out-left', 'slide-out-right');
                currentSection.style.opacity = '';
                currentSection.style.transform = '';
            }

            // Show new
            if (nextSection) {
                nextSection.style.display = 'block';

                // Cleanup
                nextSection.classList.remove(
                    'slide-out-left', 'slide-out-right',
                    'slide-in-left', 'slide-in-right',
                    'mobile-fade-in', 'active'
                );

                if (!isMobile) {
                    if (direction === 'next') {
                        nextSection.classList.add('slide-in-right');
                    } else {
                        nextSection.classList.add('slide-in-left');
                    }
                } else {
                    // Mobile: Fade In
                    nextSection.style.opacity = '0';
                    void nextSection.offsetWidth; // Reflow
                    nextSection.classList.add('mobile-fade-in');
                }

                void nextSection.offsetWidth;

                if (!isMobile) {
                    nextSection.classList.remove('slide-in-right', 'slide-in-left');
                }

                nextSection.classList.add('active');
                nextSection.style.opacity = '1';

                initMobilePagination(nextSection);
            }

            // Finish animation flag
            setTimeout(() => {
                if (nextSection && isMobile) {
                    nextSection.classList.remove('mobile-fade-in');
                }
                isAnimating = false;
                currentIndex = targetIndex;
            }, 400);

        }, delay);
    }

    // --- 3. MOBILE PAGINATION LOGIC ---
    function initMobilePagination(section) {
        const isMobile = window.innerWidth <= 768;
        const isShort = window.innerHeight <= 740;

        if (!isMobile || !isShort) return;

        const cards = section.querySelectorAll('.project-card');
        if (cards.length <= 3) return;

        cards.forEach((card, index) => {
            if (index >= 3) {
                card.classList.add('hidden-mobile');
                card.style.display = 'none';
            } else {
                card.classList.remove('hidden-mobile');
                card.style.display = 'flex';
                card.style.animation = '';
            }
        });

        let loadBtn = section.querySelector('.load-more-btn');
        if (!loadBtn) {
            loadBtn = document.createElement('div');
            loadBtn.className = 'load-more-btn';
            loadBtn.innerText = '// SHOW_MORE_FILES';

            loadBtn.onclick = () => {
                const hiddenCards = section.querySelectorAll('.project-card.hidden-mobile');
                hiddenCards.forEach(card => {
                    card.classList.remove('hidden-mobile');
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                });
                loadBtn.style.display = 'none';
            };

            const content = section.querySelector('.island-content');
            if (content) content.appendChild(loadBtn);
            else section.appendChild(loadBtn);
        }

        loadBtn.style.display = 'block';
    }

    // Attach Click Listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href');
            switchTab(targetId);
        });
    });

    // Init
    const hash = window.location.hash;
    if (hash && tabMap[hash]) {
        const data = tabMap[hash];
        currentIndex = data.index;

        tabs.forEach(tab => {
            if (tab.getAttribute('href') === hash) tab.classList.add('active');
            else tab.classList.remove('active');
        });

        sections.forEach(sec => {
            if (sec.id === data.id) {
                sec.classList.add('active');
                sec.style.display = 'block';
                initMobilePagination(sec);
            } else {
                sec.classList.remove('active');
                sec.style.display = 'none';
            }
        });

        if (emptyState) emptyState.style.display = 'none';

    } else {
        switchTab('#clients');
    }
});
