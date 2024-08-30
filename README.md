# Speech Recognition Script for Perplexity.ai

This script enhances the user experience on the Perplexity.ai website by adding speech recognition capabilities. It allows users to input text via voice commands, which are then transcribed and inserted into a textarea or input field. The script also includes a feature to simulate pressing the "Enter" key after a 5-second pause to submit the input.

## Features

- **Voice Input:** Captures voice input and transcribes it into text.
- **Continuous Recognition:** Allows continuous speech recognition.
- **Automatic Submission:** Simulates pressing the "Enter" key after a 5-second pause to submit the input.
- **Domain Check:** Ensures the script only runs on the Perplexity.ai domain.

## Usage

### Prerequisites

- Ensure your browser supports the Web Speech API.
- This script is designed to work on the Perplexity.ai website.

### Installation

1. **Bookmarklet:**
   - Copy the script below and create a new bookmark in your browser.
   - Paste the script into the URL field of the bookmark.
   - Click the bookmark to run the script on the Perplexity.ai website.

2. **Stream Deck:**
   - You can split the script into multiple steps for a Stream Deck action.

### Script

```javascript
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
