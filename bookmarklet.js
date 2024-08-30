javascript:(function() {
    // Check if the current domain is https://www.perplexity.ai/
    if (window.location.hostname === 'www.perplexity.ai') {
        // Create a UI element for the microphone
        const micUI = document.createElement('div');
        micUI.style.position = 'fixed';
        micUI.style.bottom = '20px';
        micUI.style.right = '20px';
        micUI.style.width = '50px';
        micUI.style.height = '50px';
        micUI.style.backgroundColor = 'black';
        micUI.style.borderRadius = '50%';
        micUI.style.display = 'flex';
        micUI.style.justifyContent = 'center';
        micUI.style.alignItems = 'center';
        micUI.style.color = 'white';
        micUI.style.fontSize = '24px';
        micUI.innerText = '🎤';
        document.body.appendChild(micUI);

        // Initialize speech recognition
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true; // Allow continuous recognition

        let timeout;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            const inputField = document.querySelector('input[placeholder="Ask follow-up"], textarea[placeholder="Ask follow-up"]');
            if (inputField) {
                inputField.value = transcript;
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
                const inputField = document.querySelector('input[placeholder="Ask follow-up"], textarea[placeholder="Ask follow-up"]');
                if (inputField) {
                    const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
                    inputField.dispatchEvent(event);
                }
            }, 5000); // 5 seconds
        };

        recognition.start();

        // Focus on the input field
        const inputField = document.querySelector('input[placeholder="Ask follow-up"], textarea[placeholder="Ask follow-up"]');
        if (inputField) {
            inputField.focus();
        } else {
            alert('Input field or textarea not found');
        }
    } else {
        alert('This script only works on https://www.perplexity.ai/');
    }
})();
