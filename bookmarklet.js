javascript:(function() {
    // Version number
    const version = '0.1.48';
    console.log(`Voice Input Bookmarklet v${version} loaded`);

    let targetElement;

    function findTargetElement() {
        return document.querySelector('textarea[placeholder="Ask anything..."]');
    }

    function simulateUserInteraction() {
        targetElement = findTargetElement();
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }

        // Simulate mouse events
        targetElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        targetElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Focus the element
        targetElement.focus();

        console.log('Simulated user interaction with text area');
    }

    function simulateTyping(text) {
        console.group('Voice Input Processing');
        if (!targetElement) {
            console.error('Target element not found');
            console.groupEnd();
            return;
        }

        console.log('Input text:', text);
        
        // Clear the existing content
        targetElement.value = '';
        targetElement.dispatchEvent(new Event('input', { bubbles: true }));

        const typeCharacter = (index) => {
            if (index < text.length) {
                const char = text[index];
                targetElement.value += char;
                targetElement.dispatchEvent(new Event('input', { bubbles: true }));
                targetElement.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                targetElement.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                targetElement.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                
                const delay = Math.floor(Math.random() * 50) + 25; // Random delay between 25-75ms
                setTimeout(() => typeCharacter(index + 1), delay);
            } else {
                targetElement.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(triggerSearch, 500);
            }
        };

        typeCharacter(0);
        console.groupEnd();
    }

    function triggerSearch() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (submitButton) {
            console.log('Submit button found, starting monitoring');
            monitorButtonState(submitButton);
            triggerPotentialValidations();

            // Wait a bit to allow for potential async validations
            setTimeout(() => {
                if (!submitButton.disabled) {
                    console.log('Attempting to click button');
                    submitButton.click();
                    console.log('Button click executed');
                } else {
                    console.error('Button still disabled after waiting');
                }
            }, 1000);
        } else {
            console.log('Submit button not found');
            // ... (existing textarea fallback logic)
        }
    }

    function monitorButtonState(button, duration = 5000, interval = 100) {
        console.log('Starting button state monitoring');
        const startTime = Date.now();
        const check = () => {
            const elapsed = Date.now() - startTime;
            console.log(`Button state at ${elapsed}ms:`, {
                disabled: button.disabled,
                classList: Array.from(button.classList),
                ariaLabel: button.getAttribute('aria-label')
            });
            if (elapsed < duration) {
                setTimeout(check, interval);
            } else {
                console.log('Button monitoring completed');
            }
        };
        check();
    }

    function triggerPotentialValidations() {
        console.log('Triggering potential validations');
        const inputArea = document.querySelector('textarea[placeholder="Ask anything..."]');
        if (inputArea) {
            inputArea.dispatchEvent(new Event('input', { bubbles: true }));
            inputArea.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Input events dispatched');
        }
    }

    function waitForButtonToBeEnabled(button, maxAttempts = 10, interval = 100) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const check = () => {
                attempts++;
                if (!button.disabled) {
                    console.log('Button is now enabled');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.log(`Button still disabled after ${maxAttempts} attempts`);
                    reject(new Error('Button remained disabled'));
                } else {
                    console.log(`Button still disabled, attempt ${attempts}`);
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

    // Initialize speech recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.continuous = true;

    let isListening = false;

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        console.log('Voice input received:', transcript);
        simulateTyping(transcript);
    };

    function stopListening() {
        if (isListening) {
            recognition.stop();
            isListening = false;
            console.log('Listening stopped');
        }
    }

    // Create a UI element for the microphone
    const micUI = document.createElement('button');
    micUI.style.position = 'fixed';
    micUI.style.bottom = '20px';
    micUI.style.right = '20px';
    micUI.style.width = '50px';
    micUI.style.height = '50px';
    micUI.style.borderRadius = '50%';
    micUI.style.backgroundColor = '#4CAF50';
    micUI.style.color = 'white';
    micUI.style.border = 'none';
    micUI.style.fontSize = '24px';
    micUI.style.cursor = 'pointer';
    micUI.style.zIndex = '9999';
    micUI.innerHTML = '🎤';
    document.body.appendChild(micUI);

    micUI.addEventListener('click', () => {
        if (!isListening) {
            simulateUserInteraction();
            recognition.start();
            isListening = true;
            micUI.style.backgroundColor = '#F44336';
            console.log('Listening started');
        } else {
            stopListening();
            micUI.style.backgroundColor = '#4CAF50';
        }
    });

    function traceSubmitButton() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (!submitButton) {
            console.log('Submit button not found');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    console.log(`Attribute '${mutation.attributeName}' changed`);
                    console.trace();
                }
            });
        });

        observer.observe(submitButton, { attributes: true });
        console.log('Submit button observer set up');

        // Add click event listener to trace submit action
        submitButton.addEventListener('click', function(event) {
            console.log('Submit button clicked');
            console.trace();
        });
    }

    // Call traceSubmitButton after setting up the voice recognition
    traceSubmitButton();

    // ... (rest of the existing code)

    // ... (rest of the existing code)

    // Call traceSubmitButton after setting up the voice recognition
    traceSubmitButton();

    // ... (rest of the existing code)

})();