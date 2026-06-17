document.addEventListener('DOMContentLoaded', () => {
    const letterImage = document.querySelector('.letter-image');
    const body = document.body;
    const bgMusic = document.getElementById('bg-music'); // Single background music
    let clickCount = 0;

    console.log('Script loaded');
    console.log('letterImage:', letterImage);
    console.log('bgMusic:', bgMusic);

    // Typewriter effect function
    function typeWriter(element, text, speed, callback) {
        let i = 0;
        element.textContent = ''; // Clear existing text
        element.style.opacity = '1'; // Make visible
        element.classList.add('typing'); // Add typing class for cursor
        
        function type() {
            if (i < text.length) {
                const currentChar = text.charAt(i);
                element.textContent += currentChar;
                i++;
                
                // Auto-scroll to keep the typing in view
                element.scrollIntoView({ behavior: 'smooth', block: 'end' });
                
                // Check if current character is a newline
                if (currentChar === '\n') {
                    // Pause for 800ms after line break
                    setTimeout(type, 800);
                }
                // Check if current character is 🤔 emoji
                else if (currentChar === '🤔') {
                    // Pause for 2000ms (2 seconds) after thinking emoji
                    setTimeout(type, 2000);
                }
                else {
                    setTimeout(type, speed);
                }
            } else {
                // Text finished typing, remove cursor
                element.classList.remove('typing');
                
                // Call callback if provided
                if (callback) {
                    setTimeout(callback, 300); // Small delay before starting next element
                }
            }
        }
        
        type();
    }







    // Function to start typewriter effect sequence
    function startTypewriterSequence() {
        const h1Element = document.getElementById('typewriter-h1');
        const p2Element = document.getElementById('typewriter-p2');
        const h3Element = document.getElementById('typewriter-h3');
        const signatureElement = document.getElementById('typewriter-signature');
        
        if (h1Element && p2Element && h3Element && signatureElement) {
            const h1Text = h1Element.getAttribute('data-text');
            const p2Text = p2Element.getAttribute('data-text');
            const h3Text = h3Element.getAttribute('data-text');
            const signatureText = signatureElement.getAttribute('data-text');
            
            // Hide all elements initially
            h1Element.style.opacity = '0';
            p2Element.style.opacity = '0';
            h3Element.style.opacity = '0';
            signatureElement.style.opacity = '0';
            
            // Sequence: h1 → p2 → h3 → signature (with single background music throughout)
            // Start with h1 element (120ms per character)
            typeWriter(h1Element, h1Text, 120, () => {
                // After h1 is complete, start background music
                if (bgMusic) {
                    bgMusic.volume = 0.3;
                    bgMusic.play().catch(err => console.log('BG Music play failed:', err));
                }
                
                // Start p2 (70ms per character)
                typeWriter(p2Element, p2Text, 70, () => {
                    // After p2, start h3 (100ms per character)
                    typeWriter(h3Element, h3Text, 100, () => {
                        // After h3 is complete, start signature (80ms per character)
                        typeWriter(signatureElement, signatureText, 80, () => {
                            // Keep pulse animation on h3
                            h3Element.style.animation = 'pulse 1.5s infinite ease-in-out';
                        });
                    });
                });
            });
        }
    }

    if (letterImage) {
        console.log('Adding click listener to letter');
        letterImage.addEventListener('click', () => {
            console.log('Letter clicked! clickCount:', clickCount);
            if (clickCount === 0) {
                // First click: Open the envelope
                letterImage.classList.add('opened');
                clickCount = 1;
            } else if (clickCount === 1) {
                // Second click: Reveal the love message
                body.classList.add('love-revealed');
                clickCount = 2; // Prevent further clicks from doing anything
                
                // Start typewriter effect after a short delay
                setTimeout(startTypewriterSequence, 1000);
            }
            // If clickCount is 2 or more, do nothing
        });
    } else {
        console.error("Element with class '.letter-image' not found.");
    }
});
