const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const runButton = document.getElementById('run-button');
const output = document.getElementById('output');
const themeToggle = document.getElementById('theme-toggle');
const downloadButton = document.getElementById('download-button');

let currentTheme = 'dark';
let currentLanguage = 'html';

let htmlContent = '';
let cssContent = '';
let jsContent = '';

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
  const newLanguage = e.target.value;
  
  // Save current content
  saveCurrentContent();
  
  // Update editor mode and content
  editor.setOption('mode', newLanguage);
  editor.setValue(getContent(newLanguage));
  
  currentLanguage = newLanguage;
});

runButton.addEventListener('click', updateOutput);

themeToggle.addEventListener('click', toggleTheme);

downloadButton.addEventListener('click', downloadCode);

function saveCurrentContent() {
  switch (currentLanguage) {
    case 'html':
      htmlContent = editor.getValue();
      break;
    case 'css':
      cssContent = editor.getValue();
      break;
    case 'javascript':
      jsContent = editor.getValue();
      break;
  }
}

function getContent(language) {
  switch (language) {
    case 'html':
      return htmlContent || codeSnippets.html;
    case 'css':
      return cssContent || codeSnippets.css;
    case 'javascript':
      return jsContent || codeSnippets.javascript;
  }
}

function updateOutput() {
  saveCurrentContent();

  output.srcdoc = `
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif;
            ${currentTheme === 'dark' ? 'background-color: #2d2d2d; color: #f0f0f0;' : ''}
          }
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          ${jsContent}
          // Capture console.log output
          (function() {
            var old = console.log;
            var logger = document.createElement('div');
            logger.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(0,0,0,0.8);color:#fff;padding:10px;font-family:monospace;font-size:14px;white-space:pre-wrap;';
            document.body.appendChild(logger);
            console.log = function () {
              for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'object') {
                    logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
                } else {
                    logger.innerHTML += arguments[i] + '<br />';
                }
              }
              old.apply(undefined, arguments);
            }
          })();
        </script>
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
  saveCurrentContent();
  const fullCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Combined Code</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${htmlContent}
<script>
${jsContent}
</script>
</body>
</html>`;
  
  const blob = new Blob([fullCode], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'combined-code.html';
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
htmlContent = codeSnippets.html;
cssContent = codeSnippets.css;
jsContent = codeSnippets.javascript;
document.body.classList.add('dark-mode');
updateOutput();
