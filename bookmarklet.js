javascript:(function() {
    // Version number
    const version = '0.1.6';

    // Create a UI element for the microphone
    const micUI = document.createElement('button');
    micUI.style.position = 'fixed';
    micUI.style.top = '50px';
    micUI.style.right = '5%';
    micUI.style.transform = 'translateX(-50%)';
    micUI.style.width = '50px';
    micUI.style.height = '50px';
    micUI.style.backgroundColor = '#000000';
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
    document.body.appendChild(micUI);

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

    let timeout;
    let isListening = false;

    function simulateTyping(text) {
        const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
        if (!inputField) return;

        let i = 0;
        function typeChar() {
            if (i < text.length) {
                inputField.value += text[i];
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
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

    micUI.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            micUI.style.backgroundColor = '#ff4136'; // Change color to indicate active listening
            console.log('Listening started');
        } else {
            recognition.stop();
            isListening = false;
            micUI.style.backgroundColor = '#635bff'; // Change color back to original
            console.log('Listening stopped');
        }
    });

    // Focus on the input field
    const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
    if (inputField) {
        inputField.focus();
    } else {
        console.log('Textarea not found');
    }
})(); // Version 0.1.6
