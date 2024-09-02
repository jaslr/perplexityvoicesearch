javascript:(function() {
    // Version number
    const version = '0.1.19';
    console.log(`Voice Input Bookmarklet v${version} loaded`);

    // Create a container for the UI elements
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '50px';
    uiContainer.style.left = '50%';
    uiContainer.style.transform = 'translateX(-50%)';
    uiContainer.style.display = 'flex';
    uiContainer.style.alignItems = 'center';
    uiContainer.style.zIndex = '9999';
    document.body.appendChild(uiContainer);

    // Create a UI element for the microphone
    const micUI = document.createElement('button');
    micUI.style.width = '50px';
    micUI.style.height = '50px';
    micUI.style.backgroundColor = '#635bff';
    micUI.style.borderRadius = '50%';
    micUI.style.display = 'flex';
    micUI.style.justifyContent = 'center';
    micUI.style.alignItems = 'center';
    micUI.style.color = 'white';
    micUI.style.fontSize = '24px';
    micUI.style.border = 'none';
    micUI.style.cursor = 'pointer';
    micUI.innerText = '🎤';
    micUI.style.boxShadow = '0 0 0 0 rgba(99, 91, 255, 1)';
    micUI.style.animation = 'pulse 2s infinite';
    uiContainer.appendChild(micUI);

    // Create a UI element for the close button
    const closeUI = document.createElement('button');
    closeUI.style.width = '30px';
    closeUI.style.height = '30px';
    closeUI.style.backgroundColor = '#ff4136';
    closeUI.style.borderRadius = '50%';
    closeUI.style.display = 'flex';
    closeUI.style.justifyContent = 'center';
    closeUI.style.alignItems = 'center';
    closeUI.style.color = 'white';
    closeUI.style.fontSize = '16px';
    closeUI.style.border = 'none';
    closeUI.style.cursor = 'pointer';
    closeUI.style.marginLeft = '10px';
    closeUI.innerText = 'X';
    uiContainer.appendChild(closeUI);

    // Add the pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(99, 91, 255, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(99, 91, 255, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(99, 91, 255, 0);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize speech recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let isListening = false;
    let lastInputText = '';

    function simulateMouseEvents(element) {
        const events = ['mousedown', 'mouseup', 'click'];
        events.forEach(eventType => {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: element.getBoundingClientRect().left,
                clientY: element.getBoundingClientRect().top
            });
            element.dispatchEvent(event);
            console.log(`Dispatched ${eventType} event`);
        });
    }

    function simulateTyping(text) {
        console.group('Voice Input Processing');
        const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
        if (!inputField) {
            console.error('Input field not found');
            console.groupEnd();
            return;
        }

        console.log('Simulating mouse click on input field');
        simulateMouseEvents(inputField);
        inputField.focus();

        console.log('Input text:', text);
        lastInputText = text;
        inputField.value = text;

        ['input', 'keydown', 'keyup', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            inputField.dispatchEvent(event);
            console.log(`Dispatched ${eventType} event`);
        });

        // Simulate pressing Enter
        console.log('Simulating Enter keypress');
        const keypressEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });
        inputField.dispatchEvent(keypressEvent);

        console.log('Finished typing, waiting for submit button to become clickable');
        waitForSubmitButton();
    }

    function waitForSubmitButton() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (!submitButton) {
            console.error('Submit button not found');
            console.groupEnd();
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    const computedStyle = window.getComputedStyle(submitButton);
                    const backgroundColor = computedStyle.backgroundColor;
                    console.log('Submit button background color:', backgroundColor);
                    if (backgroundColor === 'rgb(99, 91, 255)' || backgroundColor === '#635bff') {
                        observer.disconnect();
                        console.log('Submit button is now clickable');
                        triggerSearch();
                    }
                }
            });
        });

        observer.observe(submitButton, { attributes: true });
    }

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Voice input received:', transcript);
        simulateTyping(transcript);
    };

    function triggerSearch() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        console.log('Submit button:', submitButton);
        console.log('Submit button disabled:', submitButton ? submitButton.disabled : 'N/A');
        if (submitButton && !submitButton.disabled) {
            console.log('Clicking submit button');
            simulateMouseEvents(submitButton);
            console.log('Search triggered after voice input');
        } else {
            console.log('Submit button not found or is disabled');
        }
        console.groupEnd();
    }

    function stopListening() {
        if (isListening) {
            recognition.stop();
            isListening = false;
            micUI.style.backgroundColor = '#635bff';
            micUI.style.animation = 'none';
            console.log('Listening stopped');
        }
    }

    micUI.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            micUI.style.backgroundColor = '#ff4136';
            micUI.style.animation = 'pulse 2s infinite';
            console.log('Listening started');
        } else {
            stopListening();
        }
    });

    closeUI.addEventListener('click', () => {
        stopListening();
        uiContainer.remove();
        console.log('Voice input UI removed');
    });

    // Monitor changes to the textarea
    const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
    if (inputField) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    console.log('Textarea value changed:', inputField.value);
                    if (inputField.value === '' && lastInputText !== '') {
                        console.log('Textarea cleared unexpectedly, restoring text');
                        inputField.value = lastInputText;
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            });
        });

        observer.observe(inputField, { characterData: true, childList: true, subtree: true });
        console.log('Textarea observer set up');
    } else {
        console.error('Textarea not found');
    }

})(); // Version 0.1.19