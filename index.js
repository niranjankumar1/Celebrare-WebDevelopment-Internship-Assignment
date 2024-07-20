document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const addTextButton = document.getElementById('addText');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const fontColor = document.getElementById('fontColor');
    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');

    let selectedText = null;
    let undoStack = [];
    let redoStack = [];

    function saveState() {
        const state = canvas.innerHTML;
        undoStack.push(state);
        redoStack = [];
    }

    function applyState(state) {
        canvas.innerHTML = state;
        document.querySelectorAll('.text').forEach(addDragAndDrop);
    }

    addTextButton.addEventListener('click', () => {
        saveState();
        const newText = document.createElement('div');
        newText.className = 'text';
        newText.contentEditable = true;
        newText.style.fontFamily = fontSelect.value;
        newText.style.fontSize = `${fontSize.value}px`;
        newText.style.color = fontColor.value;
        newText.textContent = 'New Text';
        newText.style.left = '50%';
        newText.style.top = '50%';
        newText.style.transform = 'translate(-50%, -50%)';
        canvas.appendChild(newText);

        addDragAndDrop(newText);
    });

    function addDragAndDrop(element) {
        let offsetX, offsetY;

        element.addEventListener('mousedown', (event) => {
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                let newLeft = pageX - offsetX - canvas.getBoundingClientRect().left;
                let newTop = pageY - offsetY - canvas.getBoundingClientRect().top;

                // Ensure the text stays within the canvas
                newLeft = Math.max(0, Math.min(newLeft, canvas.offsetWidth - element.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, canvas.offsetHeight - element.offsetHeight));

                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';
                element.style.transform = '';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
                saveState();
            }, { once: true });
        });

        element.addEventListener('dragstart', () => false);
    }

    canvas.addEventListener('click', (event) => {
        if (event.target.classList.contains('text')) {
            selectedText = event.target;
        }
    });

    fontSelect.addEventListener('change', () => {
        if (selectedText) {
            selectedText.style.fontFamily = fontSelect.value;
        }
    });

    fontSize.addEventListener('change', () => {
        if (selectedText) {
            selectedText.style.fontSize = `${fontSize.value}px`;
        }
    });

    fontColor.addEventListener('change', () => {
        if (selectedText) {
            selectedText.style.color = fontColor.value;
        }
    });

    undoButton.addEventListener('click', () => {
        if (undoStack.length > 0) {
            const state = undoStack.pop();
            redoStack.push(canvas.innerHTML);
            applyState(state);
        }
    });

    redoButton.addEventListener('click', () => {
        if (redoStack.length > 0) {
            const state = redoStack.pop();
            undoStack.push(canvas.innerHTML);
            applyState(state);
        }
    });
    document.querySelectorAll('.text').forEach(addDragAndDrop);
});
