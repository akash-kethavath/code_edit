const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const runButton = document.getElementById('run-button');
const output = document.getElementById('output');
const themeToggle = document.getElementById('theme-toggle');

let currentTheme = 'light';

const defaultEditorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  tabSize: 2,
  indentUnit: 2,
  theme: 'light',
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
  <h1>Welcome to HTML</h1>
  <p>This is a sample HTML document.</p>
</body>
</html>`,
  css: `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

p {
  margin-bottom: 20px;
}`,
  javascript: `function greet(name) {
  return \`Hello, \${name}! Welcome to JavaScript.\`;
}

console.log(greet('World'));

// Example of an array method
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);

// Example of a class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(\`Hi, I'm \${this.name} and I'm \${this.age} years old.\`);
  }
}

const john = new Person('John', 30);
john.sayHello();`
};

languageSelect.addEventListener('change', (e) => {
  const language = e.target.value;
  editor.setOption('mode', language);
  editor.setValue(codeSnippets[language]);
});

runButton.addEventListener('click', updateOutput);

themeToggle.addEventListener('click', toggleTheme);

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
        ${language === 'javascript' ? '<script>console.log = function(message) { const output = document.createElement("div"); output.textContent = message; document.body.appendChild(output); }</script>' : ''}
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
}

// Initialize with HTML code and light theme
editor.setValue(codeSnippets.html);
document.body.classList.add('light-mode');
updateOutput();
