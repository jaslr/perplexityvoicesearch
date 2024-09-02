javascript:(function() {
    // Version number
    const version = '0.1.20';
    console.log(`Voice Input Bookmarklet v${version} loaded`);

    let targetDiv;
    let initialSnapshot;
    let afterTypingSnapshot;
    let afterVoiceInputSnapshot;

    function takeSnapshot(element) {
        return {
            classes: element.className,
            textContent: element.textContent,
            childrenCount: element.children.length,
            hasTextMainClass: element.classList.contains('text-textMain')
        };
    }

    function compareSnapshots(snapshot1, snapshot2) {
        return {
            classesChanged: snapshot1.classes !== snapshot2.classes,
            textContentChanged: snapshot1.textContent !== snapshot2.textContent,
            childrenCountChanged: snapshot1.childrenCount !== snapshot2.childrenCount,
            textMainClassChanged: snapshot1.hasTextMainClass !== snapshot2.hasTextMainClass
        };
    }

    function findTargetDiv() {
        const divs = document.querySelectorAll('div');
        for (const div of divs) {
            if (div.className.includes('text-textMain') && div.className.includes('items-center')) {
                return div;
            }
        }
        return null;
    }

    function initializeMonitoring() {
        targetDiv = findTargetDiv();
        if (targetDiv) {
            initialSnapshot = takeSnapshot(targetDiv);
            console.log('Initial snapshot taken:', initialSnapshot);
            
            alert('Please type something in the input field. The script will take another snapshot after 5 seconds of inactivity.');
            
            let typingTimer;
            const doneTypingInterval = 5000;
            
            targetDiv.addEventListener('input', function() {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function() {
                    afterTypingSnapshot = takeSnapshot(targetDiv);
                    console.log('After typing snapshot taken:', afterTypingSnapshot);
                    const changes = compareSnapshots(initialSnapshot, afterTypingSnapshot);
                    console.log('Changes after typing:', changes);
                    
                    alert('Now please initiate voice input. The script will take another snapshot after voice input and 5 seconds of inactivity.');
                }, doneTypingInterval);
            });
        } else {
            console.error('Target div not found');
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
        const inputField = document.querySelector('textarea[placeholder="Ask anything..."]');
        if (!inputField) {
            console.error('Input field not found');
            console.groupEnd();
            return;
        }

        console.log('Input text:', text);
        lastInputText = text;
        inputField.value = text;

        ['input', 'keydown', 'keyup', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            inputField.dispatchEvent(event);
            console.log(`Dispatched ${eventType} event`);
        });

        setTimeout(function() {
            afterVoiceInputSnapshot = takeSnapshot(targetDiv);
            console.log('After voice input snapshot taken:', afterVoiceInputSnapshot);
            const changes = compareSnapshots(initialSnapshot, afterVoiceInputSnapshot);
            console.log('Changes after voice input:', changes);
        }, 5000);

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

})(); // Version 0.1.20