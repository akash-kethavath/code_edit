let htmlEditor, cssEditor, jsEditor;
let currentTab = 'html';
let isLivePreview = true;

const htmlDefault = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Welcome to My Web Page</h1>
    <p>This is a paragraph.</p>
</body>
</html>`;

const cssDefault = `body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

h1 {
    color: #333;
}

p {
    color: #666;
}`;

const jsDefault = `// Your JavaScript code here
console.log("Hello, World!");

// Example: Change text color when clicking on the heading
document.querySelector('h1').addEventListener('click', function() {
    this.style.color = 'blue';
});`;

document.addEventListener('DOMContentLoaded', () => {
    initializeEditors();
    setupEventListeners();
    loadFromLocalStorage();
    updateOutput();
});

function initializeEditors() {
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true
    });

    cssEditor = CodeMirror.fromTextArea(document.getElementById('css-editor'), {
        mode: 'css',
        theme: 'monokai',
        lineNumbers: true
    });

    jsEditor = CodeMirror.fromTextArea(document.getElementById('js-editor'), {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true
    });

    htmlEditor.setValue(htmlDefault);
    cssEditor.setValue(cssDefault);
    jsEditor.setValue(jsDefault);
}

function setupEventListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    document.getElementById('live-preview').addEventListener('change', (e) => {
        isLivePreview = e.target.checked;
        if (isLivePreview) updateOutput();
    });

    document.getElementById('run-button').addEventListener('click', updateOutput);

    htmlEditor.on('change', () => {
        if (isLivePreview) updateOutput();
        saveToLocalStorage();
    });

    cssEditor.on('change', () => {
        if (isLivePreview) updateOutput();
        saveToLocalStorage();
    });

    jsEditor.on('change', () => {
        if (isLivePreview) updateOutput();
        saveToLocalStorage();
    });

    setupResizer();
}

function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    htmlEditor.getWrapperElement().style.display = 'none';
    cssEditor.getWrapperElement().style.display = 'none';
    jsEditor.getWrapperElement().style.display = 'none';

    switch (tab) {
        case 'html':
            htmlEditor.getWrapperElement().style.display = 'block';
            break;
        case 'css':
            cssEditor.getWrapperElement().style.display = 'block';
            break;
        case 'js':
            jsEditor.getWrapperElement().style.display = 'block';
            break;
    }

    currentTab = tab;
    if (isLivePreview) updateOutput();
}

function updateOutput() {
    const htmlContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();
    const jsContent = jsContent = jsEditor.getValue();

    const outputFrame = document.getElementById('output-frame');
    const errorDisplay = document.getElementById('error-display');

    try {
        const combinedContent = `
            <html>
                <head>
                    <style>${cssContent}</style>
                </head>
                <body>
                    ${htmlContent}
                    <script>
                        try {
                            ${jsContent}
                        } catch (error) {
                            console.error('JavaScript Error:', error);
                            window.parent.postMessage({ type: 'error', message: error.message }, '*');
                        }
                    </script>
                </body>
            </html>
        `;

        outputFrame.srcdoc = combinedContent;
        errorDisplay.style.display = 'none';
    } catch (error) {
        errorDisplay.textContent = `Error: ${error.message}`;
        errorDisplay.style.display = 'block';
    }
}

function setupResizer() {
    const resizer = document.getElementById('resizer');
    const leftSide = document.getElementById('code-editor');
    const rightSide = document.getElementById('output-container');

    let x = 0;
    let leftWidth = 0;

    const mouseDownHandler = (e) => {
        x = e.clientX;
        leftWidth = leftSide.getBoundingClientRect().width;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
        const dx = e.clientX - x;
        const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;
        rightSide.style.width = `${100 - newLeftWidth}%`;
    };

    const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

function saveToLocalStorage() {
    localStorage.setItem('htmlContent', htmlEditor.getValue());
    localStorage.setItem('cssContent', cssEditor.getValue());
    localStorage.setItem('jsContent', jsEditor.getValue());
}

function loadFromLocalStorage() {
    const savedHtml = localStorage.getItem('htmlContent');
    const savedCss = localStorage.getItem('cssContent');
    const savedJs = localStorage.getItem('jsContent');

    if (savedHtml) htmlEditor.setValue(savedHtml);
    if (savedCss) cssEditor.setValue(savedCss);
    if (savedJs) jsEditor.setValue(savedJs);
}

window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'error') {
        const errorDisplay = document.getElementById('error-display');
        errorDisplay.textContent = `JavaScript Error: ${event.data.message}`;
        errorDisplay.style.display = 'block';
    }
});
