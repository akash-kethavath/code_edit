let currentLanguage = 'html';
let htmlCode = '';
let cssCode = '';
let jsCode = '';

const codeInput = document.getElementById('code-input');
const languageBtn = document.getElementById('language-btn');
const languageDropdown = document.getElementById('language-dropdown');
const outputFrame = document.getElementById('output');

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
            codeInput.value = htmlCode;
            break;
        case 'css':
            codeInput.value = cssCode;
            break;
        case 'js':
            codeInput.value = jsCode;
            break;
    }
}

function saveActiveCode() {
    switch (currentLanguage) {
        case 'html':
            htmlCode = codeInput.value;
            break;
        case 'css':
            cssCode = codeInput.value;
            break;
        case 'js':
            jsCode = codeInput.value;
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

codeInput.addEventListener('input', () => {
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
            codeInput.value = e.target.result;
            saveActiveCode();
            run();
        };
        reader.readAsText(file);
    }
});

document.querySelector('.copy-btn').addEventListener('click', async () => {
    const code = codeInput.value;
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
    const code = codeInput.value;
    if (!code.trim()) {
        alert("The code snippet is empty. Please add some code before downloading.");
        return;
    }
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${currentLanguage}-code-${timestamp}.txt`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Initialize
updateLanguageButton();
setActiveCode();
run();
