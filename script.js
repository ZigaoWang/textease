document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('toolbar');
    const markdownInput = document.getElementById('markdown-input');
    const downloadBtn = document.getElementById('download-btn');
    const fontToggleBtn = document.getElementById('font-toggle-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const zenModeBtn = document.getElementById('zen-mode-btn');

    document.body.addEventListener('mousemove', (e) => {
        if (e.clientX < 50) {
            toolbar.classList.remove('hidden');
        } else {
            toolbar.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    });

    fontToggleBtn.addEventListener('click', () => {
        markdownInput.classList.toggle('serif');
        markdownInput.classList.toggle('sans-serif');
    });

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        markdownInput.classList.toggle('dark-mode');
    });

    zenModeBtn.addEventListener('click', () => {
        markdownInput.classList.toggle('zen-mode');
    });

    markdownInput.addEventListener('input', () => {
        const lines = markdownInput.value.split('\n');
        const cursorPosition = markdownInput.selectionStart;
        let currentLine = 0;

        for (let i = 0; i < lines.length; i++) {
            currentLine += lines[i].length + 1;
            if (cursorPosition <= currentLine) {
                highlightCurrentLine(i);
                break;
            }
        }
    });

    function highlightCurrentLine(lineNumber) {
        const lines = markdownInput.value.split('\n');
        markdownInput.value = lines.map((line, index) => {
            if (index === lineNumber) {
                return line;
            } else {
                return line; // No special formatting for non-focused lines
            }
        }).join('\n');
    }
});