javascript:(function() {
    // Version number
    const version = '0.1.28';
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
        
        let index = 0;
        function typeNextChar() {
            if (index < text.length) {
                const char = text[index];
                targetElement.value += char;
                targetElement.dispatchEvent(new Event('input', { bubbles: true }));
                targetElement.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                targetElement.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                targetElement.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                index++;
                setTimeout(typeNextChar, 50); // Adjust this delay as needed
            } else {
                targetElement.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => {
                    afterVoiceInputSnapshot = takeSnapshot(targetElement);
                    console.log('After voice input snapshot taken:', afterVoiceInputSnapshot);
                    const changes = compareSnapshots(initialSnapshot, afterVoiceInputSnapshot);
                    console.log('Changes after voice input:', changes);
                    triggerSearch();
                }, 500);
            }
        }
        
        typeNextChar();
        console.groupEnd();
    }

    function triggerSearch() {
        console.log('Attempting to trigger search');
        const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            keyCode: 13,
            which: 13
        });
        targetElement.dispatchEvent(enterEvent);
        console.log('Enter key event dispatched');

        // Simulate the exact sequence of events that occur when Enter is pressed
        targetElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        targetElement.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));

        // Also try to click the submit button
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (submitButton) {
            console.log('Submit button found, attempting to click');
            submitButton.click();
            // Simulate mousedown and mouseup events
            submitButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            submitButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
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

})(); // Version 0.1.28