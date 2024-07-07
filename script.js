document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('toolbar');
    const markdownInput = document.getElementById('markdown-input');
    const downloadBtn = document.getElementById('download-btn');
    const fontToggleBtn = document.getElementById('font-toggle-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const zenModeBtn = document.getElementById('zen-mode-btn');
    const zenTimer = document.getElementById('zen-timer');
    const themeOptions = document.getElementById('theme-options');
    const themeOptionButtons = document.querySelectorAll('.theme-option');
    const themes = ['default', 'dark-mode', 'theme-blue', 'theme-green', 'theme-yellow', 'theme-dark-blue', 'theme-dark-green', 'theme-dark-red'];
    let currentTheme = 'default';
    let timerInterval;
    let zenModeActive = false;
    let isTextChanged = false;

    // Load cached settings
    const cachedText = localStorage.getItem('markdownText') || '';
    const cachedTheme = localStorage.getItem('theme') || 'default';
    const cachedFont = localStorage.getItem('font') || 'sans-serif';

    markdownInput.value = cachedText;
    document.body.classList.add(cachedTheme);
    currentTheme = cachedTheme;
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
        themeOptions.classList.toggle('hidden');
    });

    themeOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.classList.remove(currentTheme);
            currentTheme = button.getAttribute('data-theme');
            document.body.classList.add(currentTheme);
            localStorage.setItem('theme', currentTheme);
            themeOptions.classList.add('hidden');
        });
    });

    zenModeBtn.addEventListener('click', () => {
        if (!zenModeActive) {
            openFullscreen();
        } else {
            closeFullscreen();
        }
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
        ensureCurrentLineInView();
        isTextChanged = true;
    });

    markdownInput.addEventListener('keyup', () => {
        ensureCurrentLineInView();
    });

    window.addEventListener('beforeunload', (event) => {
        if (isTextChanged) {
            event.preventDefault();
            event.returnValue = '';
        }
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

    function openFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
});