javascript:(function() {
    // Create a UI element for the microphone
    const micUI = document.createElement('div');
    micUI.style.position = 'fixed';
    micUI.style.top = '50px';
    micUI.style.left = '50%';
    micUI.style.transform = 'translateX(-50%)';
    micUI.style.width = '50px';
    micUI.style.height = '50px';
    micUI.style.backgroundColor = '#635bff'; // Stripe's primary color
    micUI.style.borderRadius = '50%';
    micUI.style.display = 'flex';
    micUI.style.justifyContent = 'center';
    micUI.style.alignItems = 'center';
    micUI.style.color = 'white';
    micUI.style.fontSize = '24px';
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
    recognition.continuous = true; // Allow continuous recognition

    let timeout;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        const inputField = document.querySelector('input[placeholder="Ask follow-up"], textarea[placeholder="Ask follow-up"], input[placeholder="Ask anything..."], textarea[placeholder="Ask anything..."]');
        if (inputField) {
            inputField.value = transcript;
            
            // Simulate keyboard input
            const inputEvent = new Event('input', { bubbles: true });
            inputField.dispatchEvent(inputEvent);
            
            const keyEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
            inputField.dispatchEvent(keyEvent);
            
            if (transcript.toLowerCase() === 'submit') {
                inputField.form.submit();
            }
        }

        // Clear the timeout if the user is still speaking
        clearTimeout(timeout);
    };

    recognition.onspeechend = () => {
        // Set a timeout to simulate pressing the "Enter" key after a 5-second pause
        timeout = setTimeout(() => {
            const inputField = document.querySelector('input[placeholder="Ask follow-up"], textarea[placeholder="Ask follow-up"], input[placeholder="Ask anything..."], textarea[placeholder="Ask anything..."]');
            if (inputField) {
                const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
                inputField.dispatchEvent(event);
            }
        }, 5000); // 5 seconds
    };

    recognition.start();

    // Focus on the input field
    const inputField = document.querySelector('input[placeholder="Ask follow-up"], textarea[placeholder="Ask follow-up"], input[placeholder="Ask anything..."], textarea[placeholder="Ask anything..."]');
    if (inputField) {
        inputField.focus();
    } else {
        alert('Input field or textarea not found');
    }
})();
