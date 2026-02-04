/**
 * Contact Page Mobile Layout Injection
 *
 * On mobile devices, this script takes the contact methods from the
 * right-hand panel, reformats them into a grid, and injects them
 * into the main terminal view for a single-column layout.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Run only on mobile
    if (window.innerWidth > 767) {
        return;
    }

    const contactOutput = document.querySelector('.contact-output');
    const channelsPanel = document.querySelector('.contact-channels');
    const channelCards = document.querySelectorAll('.contact-channel-card');
    const profileBlock = document.querySelector('.contact-line-profile');

    if (!contactOutput || !channelsPanel || !channelCards.length || !profileBlock) {
        return;
    }

    // 1. Create a new container for the channel icons
    const channelsGrid = document.createElement('div');
    channelsGrid.className = 'contact-channels-grid-mobile';

    // 2. Clone each channel card into the new grid
    channelCards.forEach(card => {
        const clone = card.cloneNode(true);
        channelsGrid.appendChild(clone);
    });

    // 3. Inject the new grid into the terminal output, after the profile
    // insertAdjacentElement is a good way to place it relative to the profile
    profileBlock.insertAdjacentElement('afterend', channelsGrid);

    // 4. Add a separator line for visual clarity
    const separator = document.createElement('div');
    separator.className = 'contact-line contact-line-sep';
    separator.innerHTML = '<span class="contact-line-text">──────────────────────────────────</span>';
    profileBlock.insertAdjacentElement('afterend', separator);


    // 5. Hide the original channels panel on mobile
    channelsPanel.style.display = 'none';
});
