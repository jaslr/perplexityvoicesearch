javascript:(function() {
    // Version number
    const version = '0.1.24';
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
        return document.querySelector('textarea[placeholder="Ask anything..."]');
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

    function simulateTyping(text) {
        console.group('Voice Input Processing');
        if (!targetElement) {
            console.error('Target element not found');
            console.groupEnd();
            return;
        }

        console.log('Input text:', text);
        targetElement.value = text;
        targetElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        targetElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        // Simulate more detailed typing events
        text.split('').forEach((char, index) => {
            targetElement.value = text.slice(0, index + 1);
            targetElement.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
            targetElement.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
            targetElement.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Dispatch a final set of events
        targetElement.dispatchEvent(new Event('change', { bubbles: true }));
        targetElement.dispatchEvent(new Event('blur', { bubbles: true }));
        targetElement.dispatchEvent(new Event('focus', { bubbles: true }));

        setTimeout(() => {
            afterVoiceInputSnapshot = takeSnapshot(targetElement);
            console.log('After voice input snapshot taken:', afterVoiceInputSnapshot);
            const changes = compareSnapshots(initialSnapshot, afterVoiceInputSnapshot);
            console.log('Changes after voice input:', changes);
            monitorSubmitButton();
        }, 1000);

        console.groupEnd();
    }

    function monitorSubmitButton() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (submitButton) {
            console.log('Submit button found. Attributes:', submitButton.attributes);
            console.log('Submit button disabled:', submitButton.disabled);
            console.log('Submit button classes:', submitButton.className);
            
            // Try to enable the button by modifying its classes
            submitButton.classList.remove('opacity-50', 'cursor-default');
            submitButton.classList.add('cursor-pointer');
            submitButton.disabled = false;
            
            console.log('Attempted to enable submit button');
            console.log('Submit button classes after attempt:', submitButton.className);
            console.log('Submit button disabled after attempt:', submitButton.disabled);
            
            // Simulate a click on the submit button
            submitButton.click();
            console.log('Simulated click on submit button');
        } else {
            console.log('Submit button not found');
        }
    }

    // ... (rest of the code remains the same)

    initializeMonitoring();

})(); // Version 0.1.24