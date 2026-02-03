document.addEventListener('DOMContentLoaded', () => {
    const codeElement = document.getElementById('code-animation');
    if (!codeElement) return;

    const animationPlayedKey = 'codex.experience.animationPlayed';
    const originalHTML = codeElement.innerHTML; // Keep the styled HTML
    const cursorSpan = '<span class="cursor"></span>';

    // This is the core of the new logic.
    // It splits the HTML by tags, keeping the tags in the resulting array.
    // This gives us a flat list of text nodes and HTML tags to iterate through.
    const tokens = originalHTML.split(/(<[^>]+>)/).filter(Boolean);

    const runAnimation = () => {
        let tokenIndex = 0;
        let charIndex = 0;
        codeElement.innerHTML = ''; // Clear for animation

        const typeToken = () => {
            if (tokenIndex >= tokens.length) {
                codeElement.innerHTML += cursorSpan; // Animation finished, add cursor
                return;
            }

            const token = tokens[tokenIndex];

            // If the token is a tag (like <span...>), add it instantly.
            if (token.startsWith('<')) {
                codeElement.innerHTML += token;
                tokenIndex++;
                typeToken(); // Move to the next token immediately
            } else {
                // If it's a text node, type it out character by character.
                if (charIndex < token.length) {
                    codeElement.innerHTML += token[charIndex];
                    charIndex++;
                    setTimeout(typeToken, 15); // Typing speed
                } else {
                    // Finished with this text node, move to the next token.
                    tokenIndex++;
                    charIndex = 0;
                    typeToken();
                }
            }
        };

        typeToken();
    };

    // If animation was already played, just show the final state.
    if (sessionStorage.getItem(animationPlayedKey) === 'true') {
        codeElement.innerHTML = originalHTML + cursorSpan;
        return;
    }

    // Use IntersectionObserver to trigger the animation when it becomes visible.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sessionStorage.setItem(animationPlayedKey, 'true');
                runAnimation();
                observer.unobserve(entry.target); // No need to observe anymore
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% is visible
    });

    observer.observe(codeElement);
});
