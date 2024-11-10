function run() {
    let htmlCode = document.getElementById("html-code").value;
    let cssCode = document.getElementById("css-code").value;
    let jsCode = document.getElementById("js-code").value;
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
    const prefix = target.split('-')[0];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-code-${timestamp}.txt`;
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    const target = event.target.getAttribute('data-target');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(target).value = e.target.result;
            run(); // Re-run the output to reflect the new code
        };
        reader.readAsText(file);
    }
}

// Handle the "+" button clicks
document.querySelectorAll('.upload-btn').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        const fileInput = document.getElementById('file-input');
        fileInput.setAttribute('data-target', target
