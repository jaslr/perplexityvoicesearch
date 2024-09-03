javascript:(function() {
    // Version number
    const version = '0.1.39';
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

        // Simulate a keyboard event (e.g., pressing and releasing a space key)
        targetElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        targetElement.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));

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
                setTimeout(monitorSubmitButton, 500);
            }
        };

        typeCharacter(0);
        console.groupEnd();
    }

    function monitorSubmitButton() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (submitButton) {
            console.log('Submit button found. Monitoring state...');
            let checkInterval = setInterval(() => {
                console.log('Checking submit button state...');
                console.log('Button disabled:', submitButton.disabled);
                console.log('Button classes:', submitButton.className);
                
                if (!submitButton.disabled && !submitButton.className.includes('opacity-50')) {
                    console.log('Submit button appears to be enabled. Attempting to click...');
                    clearInterval(checkInterval);
                    submitButton.click();
                    submitButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    submitButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    console.log('Click events dispatched on submit button');
                }
            }, 500); // Check every 500ms

            // Stop checking after 5 seconds and try Enter key if button is still disabled
            setTimeout(() => {
                clearInterval(checkInterval);
                console.log('Stopped monitoring submit button after 5 seconds');
                if (submitButton.disabled || submitButton.className.includes('opacity-50')) {
                    console.log('Submit button still disabled. Attempting to use Enter key...');
                    simulateEnterKey();
                }
            }, 5000);
        } else {
            console.log('Submit button not found. Attempting to use Enter key...');
            simulateEnterKey();
        }
    }

    function simulateEnterKey() {
        if (targetElement) {
            targetElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            targetElement.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
            targetElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
            console.log('Simulated pressing Enter key');
        } else {
            console.error('Target element not found for Enter key simulation');
        }
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

})(); // Version 0.1.39