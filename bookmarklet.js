javascript:(function() {
    // Version number
    const version = '0.1.31';
    console.log(`Voice Input Bookmarklet v${version} loaded`);

    let targetElement;
    let initialSnapshot;
    let afterTypingSnapshot;
    let afterVoiceInputSnapshot;
    let rabbitsTyped = false;

    function takeSnapshot(element) {
        return {
            tagName: element.tagName,
            classes: element.className,
            value: element.value || element.textContent,
            childrenCount: element.children.length,
            attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ')
        };
    }

    function compareSnapshots(snapshot1, snapshot2) {
        return {
            tagNameChanged: snapshot1.tagName !== snapshot2.tagName,
            classesChanged: snapshot1.classes !== snapshot2.classes,
            valueChanged: snapshot1.value !== snapshot2.value,
            childrenCountChanged: snapshot1.childrenCount !== snapshot2.childrenCount,
            attributesChanged: snapshot1.attributes !== snapshot2.attributes
        };
    }

    function findTargetElement() {
        return document.querySelector('textarea[placeholder="Ask anything..."]');
    }

    function initializeMonitoring() {
        targetElement = findTargetElement();
        if (targetElement) {
            initialSnapshot = takeSnapshot(targetElement);
            console.log('Initial snapshot taken:', initialSnapshot);
            
            if (!rabbitsTyped) {
                alert('Please type "rabbits" in the input field. The script will take another snapshot when "rabbits" is entered.');
            }
            
            targetElement.addEventListener('input', function() {
                if (targetElement.value.toLowerCase().includes('rabbits') && !rabbitsTyped) {
                    rabbitsTyped = true;
                    afterTypingSnapshot = takeSnapshot(targetElement);
                    console.log('After typing snapshot taken:', afterTypingSnapshot);
                    const changes = compareSnapshots(initialSnapshot, afterTypingSnapshot);
                    console.log('Changes after typing:', changes);
                    
                    alert('Now please initiate voice input. The script will take another snapshot after voice input is processed.');
                }
            });
        } else {
            console.error('Target element not found');
        }
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
                
                const delay = Math.floor(Math.random() * 100) + 50; // Random delay between 50-150ms
                setTimeout(() => typeCharacter(index + 1), delay);
            } else {
                targetElement.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => {
                    afterVoiceInputSnapshot = takeSnapshot(targetElement);
                    console.log('After voice input snapshot taken:', afterVoiceInputSnapshot);
                    const changes = compareSnapshots(initialSnapshot, afterVoiceInputSnapshot);
                    console.log('Changes after voice input:', changes);
                    monitorSubmitButton();
                }, 500);
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

            // Stop checking after 10 seconds to prevent infinite loop
            setTimeout(() => {
                clearInterval(checkInterval);
                console.log('Stopped monitoring submit button after 10 seconds');
            }, 10000);
        } else {
            console.log('Submit button not found');
        }
    }

    // Initialize speech recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let isListening = false;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
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
            recognition.start();
            isListening = true;
            micUI.style.backgroundColor = '#F44336';
            console.log('Listening started');
        } else {
            stopListening();
            micUI.style.backgroundColor = '#4CAF50';
        }
    });

    initializeMonitoring();

})(); // Version 0.1.31