document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('toolbar');
    const markdownInput = document.getElementById('markdown-input');
    const downloadBtn = document.getElementById('download-btn');
    const fontToggleBtn = document.getElementById('font-toggle-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const zenModeBtn = document.getElementById('zen-mode-btn');
    const zenTimer = document.getElementById('zen-timer');
    const themes = ['theme-blue', 'theme-green', 'theme-yellow'];
    let currentThemeIndex = 0;
    let timerInterval;
    let zenModeActive = false;

    // Load cached settings
    const cachedText = localStorage.getItem('markdownText') || '';
    const cachedTheme = localStorage.getItem('theme') || '';
    const cachedFont = localStorage.getItem('font') || 'sans-serif';

    markdownInput.value = cachedText;
    if (cachedTheme) {
        document.body.classList.add(cachedTheme);
        currentThemeIndex = themes.indexOf(cachedTheme);
    }
    if (cachedFont === 'serif') {
        markdownInput.classList.add('serif');
    } else {
        markdownInput.classList.add('sans-serif');
    }

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
        const font = markdownInput.classList.contains('serif') ? 'serif' : 'sans-serif';
        localStorage.setItem('font', font);
    });

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.remove(themes[currentThemeIndex]);
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.body.classList.add(themes[currentThemeIndex]);
        localStorage.setItem('theme', themes[currentThemeIndex]);
    });

    zenModeBtn.addEventListener('click', () => {
        markdownInput.classList.toggle('zen-mode');
        zenTimer.classList.toggle('hidden');
        zenModeActive = !zenModeActive;
        if (zenModeActive) {
            startZenTimer();
        } else {
            clearInterval(timerInterval);
            zenTimer.textContent = '00:00';
        }
    });

    markdownInput.addEventListener('input', () => {
        localStorage.setItem('markdownText', markdownInput.value);
    });

    markdownInput.addEventListener('keyup', () => {
        ensureCurrentLineInView();
    });

    function ensureCurrentLineInView() {
        const textarea = markdownInput;
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
        const selectionStart = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substr(0, selectionStart);
        const linesBeforeCursor = textBeforeCursor.split('\n').length;

        const scrollPosition = (linesBeforeCursor - 1) * lineHeight;
        const middlePosition = textarea.clientHeight / 2;

        textarea.scrollTop = scrollPosition - middlePosition + lineHeight / 2;
    }

    function startZenTimer() {
        let seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const displaySeconds = seconds % 60;
            zenTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
        }, 1000);
    }
});