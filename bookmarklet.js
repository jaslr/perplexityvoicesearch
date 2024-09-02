javascript:(function() {
    // Version number
    const version = '0.1.22';
    console.log(`Voice Input Bookmarklet v${version} loaded`);

    let targetElement;
    let initialSnapshot;
    let afterTypingSnapshot;
    let afterVoiceInputSnapshot;

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
        const textarea = document.querySelector('textarea[placeholder="Ask anything..."]');
        return textarea || textarea.closest('div');
    }

    function initializeMonitoring() {
        targetElement = findTargetElement();
        if (targetElement) {
            initialSnapshot = takeSnapshot(targetElement);
            console.log('Initial snapshot taken:', initialSnapshot);
            
            alert('Please type "rabbits" in the input field. The script will take another snapshot when "rabbits" is entered.');
            
            targetElement.addEventListener('input', function() {
                if (targetElement.value.toLowerCase().includes('rabbits')) {
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

    // Initialize speech recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let isListening = false;
    let lastInputText = '';

    function simulateTyping(text) {
        console.group('Voice Input Processing');
        if (!targetElement) {
            console.error('Target element not found');
            console.groupEnd();
            return;
        }

        console.log('Input text:', text);
        lastInputText = text;
        targetElement.value = text;

        ['input', 'keydown', 'keyup', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            targetElement.dispatchEvent(event);
            console.log(`Dispatched ${eventType} event`);
        });

        afterVoiceInputSnapshot = takeSnapshot(targetElement);
        console.log('After voice input snapshot taken:', afterVoiceInputSnapshot);
        const changes = compareSnapshots(initialSnapshot, afterVoiceInputSnapshot);
        console.log('Changes after voice input:', changes);

        console.groupEnd();
    }

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Voice input received:', transcript);
        simulateTyping(transcript);
    };

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

    initializeMonitoring();

})(); // Version 0.1.22