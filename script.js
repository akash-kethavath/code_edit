const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const runButton = document.getElementById('run-button');
const output = document.getElementById('output');
const themeToggle = document.getElementById('theme-toggle');
const downloadButton = document.getElementById('download-button');

let currentTheme = 'dark';

const defaultEditorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  tabSize: 2,
  indentUnit: 2,
  theme: 'dark',
  lineWrapping: true,
};

const editor = CodeMirror.fromTextArea(codeEditor, {
  ...defaultEditorSettings,
  mode: 'html',
});

const codeSnippets = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Example</title>
</head>
<body>
  <h1>Hello, HTML!</h1>
</body>
</html>`,
  css: `body {
  background-color: lightblue;
  font-family: Arial, sans-serif;
}

h1 {
  color: navy;
  margin-left: 20px;
}`,
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('JavaScript'));

// Example of an array method
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);`
};

languageSelect.addEventListener('change', (e) => {
  const language = e.target.value;
  editor.setOption('mode', language);
  editor.setValue(codeSnippets[language]);
});

runButton.addEventListener('click', updateOutput);

themeToggle.addEventListener('click', toggleTheme);

downloadButton.addEventListener('click', downloadCode);

function updateOutput() {
  const code = editor.getValue();
  const language = languageSelect.value;

  let content = '';
  switch (language) {
    case 'html':
      content = code;
      break;
    case 'css':
      content = `<style>${code}</style>`;
      break;
    case 'javascript':
      content = `<script>${code}<\/script>`;
      break;
  }

  output.srcdoc = `
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif;
            ${currentTheme === 'dark' ? 'background-color: #2d2d2d; color: #f0f0f0;' : ''}
          }
        </style>
        ${language === 'css' ? content : ''}
      </head>
      <body>
        ${language === 'html' ? content : ''}
        ${language === 'javascript' ? content : ''}
        ${language === 'javascript' ? '<script>console.log = function(message) { const output = document.createElement("div"); output.textContent = JSON.stringify(message); document.body.appendChild(output); }</script>' : ''}
      </body>
    </html>
  `;
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  editor.setOption('theme', currentTheme);
  updateOutput();
  
  const themeIcon = document.querySelector('#theme-toggle i');
  if (currentTheme === 'dark') {
    
    themeIcon.classList.remove('ri-moon-line');
    themeIcon.classList.add('ri-sun-line');
  } else {
    themeIcon.classList.remove('ri-sun-line');
    themeIcon.classList.add('ri-moon-line');
  }
}

function downloadCode() {
  const code = editor.getValue();
  const language = languageSelect.value;
  const filename = `code-${language}.txt`;
  
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Set initial theme icon
const themeIcon = document.querySelector('#theme-toggle i');
themeIcon.classList.add('ri-sun-line');

// Initialize with HTML code and dark theme
editor.setValue(codeSnippets.html);
document.body.classList.add('dark-mode');
updateOutput();
