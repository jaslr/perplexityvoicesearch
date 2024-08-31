javascript:(function() {
    // Version number
    const version = '0.1.9';

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

    function simulateTyping(text) {
        const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
        if (!inputField) return;

        let i = 0;
        function typeChar() {
            if (i < text.length) {
                inputField.value += text[i];
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new KeyboardEvent('keydown', { key: text[i], bubbles: true }));
                inputField.dispatchEvent(new KeyboardEvent('keyup', { key: text[i], bubbles: true }));
                i++;
                setTimeout(typeChar, 50); // Adjust typing speed here
            } else {
                triggerSearch();
            }
        }
        typeChar();
    }

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Voice input received:', transcript);
        simulateTyping(transcript);
    };

    function triggerSearch() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (submitButton && !submitButton.disabled) {
            submitButton.click();
            console.log('Search triggered after voice input');
        } else {
            console.log('Submit button not found or is disabled');
        }
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

    // Prevent text from disappearing when textarea is focused
    document.addEventListener('focusin', function(e) {
        if (e.target.tagName.toLowerCase() === 'textarea') {
            e.preventDefault();
            e.stopPropagation();
            const value = e.target.value;
            setTimeout(() => {
                e.target.value = value;
                e.target.dispatchEvent(new Event('input', { bubbles: true }));
            }, 0);
        }
    }, true);

    // Focus on the input field
    const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
    if (inputField) {
        inputField.focus();
    } else {
        console.log('Textarea not found');
    }
})(); // Version 0.1.9