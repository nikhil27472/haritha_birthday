document.addEventListener('DOMContentLoaded', () => {
    const letterImage = document.querySelector('.letter-image');
    const body = document.body;
    const audio = document.getElementById('background-music'); // Song for lyrics
    const bgMusic1 = document.getElementById('bg-music-1'); // Background for typewriter-p
    const bgMusic2 = document.getElementById('bg-music-2'); // Background for p2, h3, signature
    let clickCount = 0;

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

    // Function to display lyrics with precise timing (adds lines one by one)
    function displayLyrics(lyricsElement, lyricsData) {
        return new Promise((resolve) => {
            lyricsElement.style.opacity = '1';
            lyricsElement.textContent = ''; // Clear any existing content
            let timeouts = [];

            // Stop background music 1 before playing the song
            if (bgMusic1) {
                bgMusic1.pause();
                bgMusic1.currentTime = 0;
            }

            // Start playing the song
            if (audio) {
                audio.play().catch(err => console.log('Audio play failed:', err));
            }

            // Schedule each lyric based on its time
            lyricsData.forEach((lyric, index) => {
                // Show lyric at specified time
                const showTimeout = setTimeout(() => {
                    // Add the lyric as a new line
                    if (index > 0) {
                        lyricsElement.textContent += '\n';
                    }
                    lyricsElement.textContent += lyric.text;
                }, lyric.time);
                timeouts.push(showTimeout);

                // If it's the last lyric, schedule the end
                if (index === lyricsData.length - 1) {
                    const endTimeout = setTimeout(() => {
                        // Stop the music but keep lyrics visible
                        if (audio) {
                            audio.pause();
                            audio.currentTime = 0;
                        }
                        
                        resolve();
                    }, 12700); // 12.7 seconds total song duration
                    timeouts.push(endTimeout);
                }
            });
        });
    }



    // Function to start typewriter effect sequence
    function startTypewriterSequence() {
        const h1Element = document.getElementById('typewriter-h1');
        const pElement = document.getElementById('typewriter-p');
        const lyricsElement = document.getElementById('song-lyrics');
        const p2Element = document.getElementById('typewriter-p2');
        const h3Element = document.getElementById('typewriter-h3');
        const signatureElement = document.getElementById('typewriter-signature');
        
        if (h1Element && pElement && h3Element && signatureElement) {
            const h1Text = h1Element.getAttribute('data-text');
            const pText = pElement.getAttribute('data-text');
            const h3Text = h3Element.getAttribute('data-text');
            const signatureText = signatureElement.getAttribute('data-text');
            
            // Get lyrics data if available
            let lyricsData = [];
            if (lyricsElement) {
                try {
                    lyricsData = JSON.parse(lyricsElement.getAttribute('data-lyrics') || '[]');
                } catch (e) {
                    console.log('No lyrics data found');
                }
            }
            
            const p2Text = p2Element ? p2Element.getAttribute('data-text') : '';
            
            // Hide all elements initially
            h1Element.style.opacity = '0';
            pElement.style.opacity = '0';
            if (lyricsElement) lyricsElement.style.opacity = '0';
            if (p2Element) p2Element.style.opacity = '0';
            h3Element.style.opacity = '0';
            signatureElement.style.opacity = '0';
            
            // Sequence: h1 → p → lyrics (with song) → p2 → h3 → signature
            // Start with h1 element (120ms per character)
            typeWriter(h1Element, h1Text, 120, () => {
                // After h1 is complete, start p (70ms per character)
                // Start background music 1 for typewriter-p
                if (bgMusic1) {
                    bgMusic1.volume = 0.3;
                    bgMusic1.play().catch(err => console.log('BG Music 1 play failed:', err));
                }
                
                typeWriter(pElement, pText, 70, () => {
                    // After p is complete, show lyrics with song
                    if (lyricsData.length > 0 && lyricsElement) {
                        displayLyrics(lyricsElement, lyricsData).then(() => {
                            // After lyrics/song complete, continue with p2
                            continueAfterSong();
                        });
                    } else {
                        // No lyrics, continue directly
                        continueAfterSong();
                    }
                });
            });

            function continueAfterSong() {
                // Start background music 2 for p2, h3, signature
                if (bgMusic2) {
                    bgMusic2.volume = 0.3;
                    bgMusic2.play().catch(err => console.log('BG Music 2 play failed:', err));
                }
                
                // Type p2 if it exists
                if (p2Element && p2Text) {
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
                } else {
                    // No p2, go straight to h3
                    typeWriter(h3Element, h3Text, 100, () => {
                        typeWriter(signatureElement, signatureText, 80, () => {
                            h3Element.style.animation = 'pulse 1.5s infinite ease-in-out';
                        });
                    });
                }
            }
        }
    }

    if (letterImage) {
        letterImage.addEventListener('click', () => {
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
