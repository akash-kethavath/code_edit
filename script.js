require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' } });

let htmlEditor, cssEditor, jsEditor;

require(['vs/editor/editor.main'], function() {
    htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
        value: '<h1>Hello, World!</h1>',
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true
    });

    cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
        value: 'body {\n    color: blue;\n}',
        language: 'css',
        theme: 'vs-dark',
        automaticLayout: true
    });

    jsEditor = monaco.editor.create(document.getElementById('js-editor'), {
        value: 'console.log("Hello, World!");',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true
    });

    // Set up event listeners for real-time preview updates
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.onDidChangeModelContent(() => {
            updatePreview();
        });
    });

    // Initial preview update
    updatePreview();
});

function updatePreview() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    const output = document.getElementById('output');
    const previewContent = `
        <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}<\/script>
            </body>
        </html>
    `;

    output.srcdoc = previewContent;
}
