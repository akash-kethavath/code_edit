function run() {
    let htmlCode = document.getElementById("index.html").value;
    let cssCode = document.getElementById("style.css").value;
    let jsCode = document.getElementById("script.js").value;
    let output = document.getElementById("output");

    output.contentDocument.body.innerHTML = htmlCode + "<style>" + cssCode + "</style>";
    output.contentWindow.eval(jsCode);
}

function downloadCode(target) {
    const codeElement = document.getElementById(target);
    const code = codeElement.value;
    
    if (!code.trim()) {
        alert("The code snippet is empty. Please add some code before downloading.");
        return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = generateFileName(target);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateFileName(target) {
    const prefix = target.split('.')[0];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-code-${timestamp}.txt`;
}

function toggleTheme() {
    const body = document.body;
    const themes = ['theme-standard', 'theme-light', 'theme-dark'];
    let currentThemeIndex = themes.indexOf(body.className) || 0;
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    
    body.className = themes[currentThemeIndex];
    updateThemeIcon(themes[currentThemeIndex]);
    localStorage.setItem('editorTheme', themes[currentThemeIndex]);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    switch (theme) {
        case 'theme-light':
            icon.innerHTML = '<path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M18.4 18.4l.7.7M18.4 5.6l-.7.7M5.6 18.4l-.7.7"></path>';
            break;
        case 'theme-dark':
            icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 A7
