javascript:(function() {
    // Version number
    const version = '0.1.42';
    console.log(`Voice Input Bookmarklet v${version} loaded`);

    let targetElement;

    function findTargetElement() {
        return document.querySelector('textarea[placeholder="Ask anything..."]');
    }

    function getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactFiber$')) {
                return element[key];
            }
        }
        return null;
    }

    function updateReactTextarea(text) {
        targetElement = findTargetElement();
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }

        const reactInstance = getReactInstance(targetElement);
        if (!reactInstance) {
            console.error('React instance not found');
            return;
        }

        // Find the React component that manages the textarea
        let fiber = reactInstance;
        while (fiber) {
            if (fiber.stateNode && fiber.stateNode.constructor && fiber.stateNode.constructor.name === 'ChatInput') {
                const chatInput = fiber.stateNode;
                
                // Update the component's state
                chatInput.setState({ inputText: text }, () => {
                    console.log('React state updated');
                    simulateEnterKey();
                });
                
                return;
            }
            fiber = fiber.return;
        }

        console.error('ChatInput component not found');
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
        updateReactTextarea(transcript);
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
            recognition.start();
            isListening = true;
            micUI.style.backgroundColor = '#F44336';
            console.log('Listening started');
        } else {
            stopListening();
            micUI.style.backgroundColor = '#4CAF50';
        }
    });

})(); // Version 0.1.42