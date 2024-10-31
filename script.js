const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const runButton = document.getElementById('run');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

const defaultEditorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  tabSize: 2,
  indentUnit: 2,
  theme: 'monokai',
  lineWrapping: true,
};

const editor = CodeMirror.fromTextArea(codeEditor, {
  ...defaultEditorSettings,
  mode: 'html',
});

languageSelect.addEventListener('change', (e) => {
  const language = e.target.value;
  editor.setOption('mode', language);
});

runButton.addEventListener('click', () => {
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
});

clearButton.addEventListener('click', () => {
  editor.setValue('');
  output.srcdoc = '';
});

// Initialize with some example HTML code
editor.setValue('<h1>Hello, World!</h1>');
