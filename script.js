function run() {
    let htmlCode = document.getElementById("html-code").value;
    let cssCode = document.getElementById("css-code").value;
    let jsCode = document.getElementById("js-code").value;
    let output = document.getElementById("output");

    output.contentDocument.body.innerHTML = htmlCode + "<style>" + cssCode + "</style>";
    try {
        output.contentWindow.eval(jsCode);
    } catch (error) {
        console.error("Error in JavaScript code:", error);
    }
}

function handleFileUpload(event, targetId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(targetId).value = e.target.result;
            run();
        };
        reader.readAsText(file);
    }
}

async function copyCode(targetId) {
    const codeElement = document.getElementById(targetId);
    const code = codeElement.value;
    
    if (!code.trim()) {
        alert("The code snippet is empty.");
        return;
    }

    try {
        await navigator.clipboard.writeText(code);
        alert("Code copied to clipboard!");
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy code to clipboard');
    }
}

function downloadCode(targetId, prefix) {
    const codeElement = document.getElementById(targetId);
    const code = codeElement.value;
    
    if (!code.trim()) {
        alert("The code snippet is empty. Please add some code before downloading.");
        return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${prefix}-code-${timestamp}.txt`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add event listeners for file uploads
document.getElementById('html-upload').addEventListener('change', (e) => handleFileUpload(e, 'html-code'));
document.getElementById('css-upload').addEventListener('change', (e) => handleFileUpload(e, 'css-code'));
document.getElementById('js-upload').addEventListener('change', (e) => handleFileUpload(e, 'js-code'));

// Initial run
run();
