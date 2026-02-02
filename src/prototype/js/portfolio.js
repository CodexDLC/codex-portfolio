/**
 * CodexDLC Portfolio Logic
 * Handles File Tabs switching with Slide Animation
 * Visual DNA system integration
 */

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.file-tab');
    const sections = document.querySelectorAll('.island-section');
    const emptyState = document.querySelector('.empty-state');
    const footerFile = document.querySelector('.footer-left .copyright-text');
    const tabsBar = document.querySelector('.folder-tabs-bar');
    const breadcrumbCategory = document.getElementById('breadcrumb-category');

    // --- 1. INTRO ANIMATION ---
    setTimeout(() => {
        if (tabsBar) {
            tabsBar.classList.add('slide-down');
        }
    }, 100);


    // --- 2. TABS LOGIC (Updated for new href structure) ---
    const tabMap = {
        '#business': { id: 'business', index: 0, dna: 'business', category: 'CLIENTS' },
        '#eco': { id: 'eco', index: 1, dna: 'ecosystem', category: 'PRODUCTS' },
        '#rnd': { id: 'rnd', index: 2, dna: 'rnd', category: 'OPENSOURCE' },
        '#prototypes': { id: 'prototypes', index: 3, dna: 'rnd', category: 'PROTOTYPES' },
        '#configs': { id: 'configs', index: 4, dna: 'rnd', category: 'CONFIGS' }
    };

    // --- 2.1 DNA & BREADCRUMB UPDATE ---
    function updateDNAAndBreadcrumb(targetId) {
        const data = tabMap[targetId];
        if (!data) return;

        // Update tabs bar DNA attribute
        if (tabsBar) {
            tabsBar.setAttribute('data-active-dna', data.dna);
        }

        // Update breadcrumb category
        if (breadcrumbCategory) {
            breadcrumbCategory.textContent = data.category;
        }
    }

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

        // Update DNA styling and breadcrumb
        updateDNAAndBreadcrumb(targetId);

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

        // Initialize DNA and breadcrumb for initial state
        updateDNAAndBreadcrumb(hash);

        if (emptyState) emptyState.style.display = 'none';

    } else {
        // Default to business/clients tab
        switchTab('#business');
    }
});
