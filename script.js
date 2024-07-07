document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('toolbar');
    const textInput = document.getElementById('text-input');
    const downloadBtn = document.getElementById('download-btn');
    const fontToggleBtn = document.getElementById('font-toggle-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const zenModeBtn = document.getElementById('zen-mode-btn');
    const zenTimer = document.getElementById('zen-timer');
    const themeOptions = document.getElementById('theme-options');
    const themeOptionButtons = document.querySelectorAll('.theme-option');
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const closeAbout = document.getElementById('close-about');
    const themes = ['default', 'dark-mode', 'theme-blue', 'theme-green', 'theme-yellow', 'theme-dark-blue', 'theme-dark-green', 'theme-dark-red'];
    let currentTheme = 'default';
    let timerInterval;
    let zenModeActive = false;
    let isTextChanged = false;

    // Load cached settings
    const cachedText = localStorage.getItem('text') || '';
    const cachedTheme = localStorage.getItem('theme') || 'default';
    const cachedFont = localStorage.getItem('font') || 'sans-serif';

    textInput.value = cachedText;
    document.body.classList.add(cachedTheme);
    currentTheme = cachedTheme;
    if (cachedFont === 'serif') {
        textInput.classList.add('serif');
    } else {
        textInput.classList.add('sans-serif');
    }

    document.body.addEventListener('mousemove', (e) => {
        if (e.clientX < 50) {
            toolbar.classList.remove('hidden');
        } else {
            toolbar.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([textInput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    fontToggleBtn.addEventListener('click', () => {
        textInput.classList.toggle('serif');
        textInput.classList.toggle('sans-serif');
        const font = textInput.classList.contains('serif') ? 'serif' : 'sans-serif';
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
        textInput.classList.toggle('zen-mode');
        zenTimer.classList.toggle('hidden');
        zenModeActive = !zenModeActive;
        if (zenModeActive) {
            startZenTimer();
        } else {
            clearInterval(timerInterval);
            zenTimer.textContent = '00:00';
        }
    });

    textInput.addEventListener('input', () => {
        localStorage.setItem('text', textInput.value);
        ensureCurrentLineInView();
        isTextChanged = true;
    });

    textInput.addEventListener('keyup', () => {
        ensureCurrentLineInView();
    });

    window.addEventListener('beforeunload', (event) => {
        if (isTextChanged) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    aboutBtn.addEventListener('click', () => {
        aboutModal.classList.remove('hidden');
    });

    closeAbout.addEventListener('click', () => {
        aboutModal.classList.add('hidden');
    });

    function ensureCurrentLineInView() {
        const textarea = textInput;
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
        const selectionStart = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substr(0, selectionStart);
        const linesBeforeCursor = textBeforeCursor.split('\n').length;
        const middlePosition = textarea.clientHeight / 2;

        textarea.scrollTop = (linesBeforeCursor - 1) * lineHeight - middlePosition + lineHeight / 2;
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