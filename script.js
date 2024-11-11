let currentLanguage = 'html';
let htmlCode = '';
let cssCode = '';
let jsCode = '';

const editor = document.getElementById('editor');
const languageBtn = document.getElementById('language-btn');
const languageDropdown = document.getElementById('language-dropdown');
const outputFrame = document.getElementById('output');
const themeToggle = document.getElementById('theme-toggle');

function updateLanguageButton() {
    languageBtn.textContent = currentLanguage.toUpperCase();
    const dropdownIcon = document.createElement('img');
    dropdownIcon.src = 'https://img.icons8.com/material-outlined/24/000000/expand-arrow--v1.png';
    dropdownIcon.alt = 'Dropdown arrow';
    dropdownIcon.className = 'dropdown-icon';
    languageBtn.appendChild(dropdownIcon);
}

function setActiveCode() {
    switch (currentLanguage) {
        case 'html':
            editor.textContent = htmlCode;
            break;
        case 'css':
            editor.textContent = cssCode;
            break;
        case 'js':
            editor.textContent = jsCode;
            break;
    }
    Prism.highlightElement(editor);
}

function saveActiveCode() {
    switch (currentLanguage) {
        case 'html':
            htmlCode = editor.textContent;
            break;
        case 'css':
            cssCode = editor.textContent;
            break;
        case 'js':
            jsCode = editor.textContent;
            break;
    }
}

function run() {
    outputFrame.srcdoc = `
        <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>${htmlCode}</body>
            <script>${jsCode}<\/script>
        </html>
    `;
}

languageBtn.addEventListener('click', () => {
    languageDropdown.classList.toggle('show');
});

languageDropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown-item')) {
        saveActiveCode();
        currentLanguage = e.target.getAttribute('data-language');
        updateLanguageButton();
        setActiveCode();
        languageDropdown.classList.remove('show');
    }
});

editor.addEventListener('input', () => {
    saveActiveCode();
    run();
});

document.addEventListener('click', (e) => {
    if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});

document.getElementById('file-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.textContent = e.target.result;
            saveActiveCode();
            Prism.highlightElement(editor);
            run();
        };
        reader.readAsText(file);
    }
});

document.querySelector('.copy-btn').addEventListener('click', async () => {
    const code = editor.textContent;
    if (!code.trim()) {
        alert("The code snippet is empty.");
        return;
    }
    try {
        await navigator.clipboard.writeText(code);
        const button = document.querySelector('.copy-btn');
        button.classList.add('copy-success');
        setTimeout(() => {
            button.classList.remove('copy-success');
        }, 1000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy code to clipboard');
    }
});

document.querySelector('.download-btn').addEventListener('click', () => {
    const code = editor.textContent;
    if (!code.trim()) {
        alert("The code snippet is empty. Please add some code before downloading.");
        return;
    }
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = currentLanguage === 'js' ? 'js' : (currentLanguage === 'css' ? 'css' : 'html');
    const filename = `${currentLanguage}-code-${timestamp}.${fileExtension}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Theme switcher
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

// Line numbers
function addLineNumbers() {
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    const lines = editor.textContent.split('\n');
    lines.forEach(() => {
        const span = document.createElement('span');
        lineNumbers.appendChild(span);
    });
    editor.parentNode.insertBefore(lineNumbers, editor);
}

// Auto-indent
editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.textContent = editor.textContent.substring(0, start) + '    ' + editor.textContent.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        Prism.highlightElement(editor);
    }
});

// Initialize
updateLanguageButton();
setActiveCode();
addLineNumbers();
run();
