const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const output = document.getElementById('output');

const defaultEditorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  tabSize: 2,
  indentUnit: 2,
  theme: 'dracula', // Set theme to Dracula
  lineWrapping: true,
};

const editor = CodeMirror.fromTextArea(codeEditor, {
  ...defaultEditorSettings,
  mode: 'html',
});

languageSelect.addEventListener('change', (e) => {
  const language = e.target.value;
  editor.setOption('mode', language);
  updateOutput(); // Run code immediately when changing language
});

editor.on('change', () => {
  updateOutput(); // Update output in real-time
});

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
      content = `<script>${code}</script>`;
      break;
  }

  output.srcdoc = content;
}

// Initialize with some example HTML code
editor.setValue('<h1>Hello, World!</h1>');
updateOutput(); // Display the default code immediately
