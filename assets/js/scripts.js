// Apply stored theme immediately to prevent flash
(function () {
    const mode  = localStorage.getItem('sf-mode')  || 'light';
    const theme = localStorage.getItem('sf-theme') || 'red';
    const html  = document.documentElement;
    if (mode  === 'dark')  html.setAttribute('data-mode',  'dark');
    if (theme === 'red')   html.setAttribute('data-theme', 'red');
})();

$(document).ready(function () {

    // Load shared components
    $('#navbar-placeholder').load('assets/includes/navbar.html', function () {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        $('.sf-navbar .nav-link[href="' + page + '"]').addClass('active');
    });
    $('#header-placeholder').load('assets/includes/header.html');
    $('#footer-placeholder').load('assets/includes/footer.html');

    // Inject and initialise theme switcher
    injectThemeSwitcher();

});

// ── Theme switcher ────────────────────────────────────────────

function injectThemeSwitcher() {
    const html = `
<div class="sf-theme-switcher" id="sfThemeSwitcher">
    <button class="sf-theme-btn" id="sfThemeToggle" aria-label="Theme options" title="Theme options">
        <i class="fa fa-palette"></i>
    </button>
    <div class="sf-theme-panel" id="sfThemePanel">
        <div class="sf-theme-panel-inner">
            <div class="sf-theme-section-label">Mode</div>
            <div class="d-flex gap-2 mb-3">
                <button class="sf-mode-btn" data-mode="light" onclick="setMode('light')">
                    <i class="fa fa-sun fa-xs me-1"></i>Light
                </button>
                <button class="sf-mode-btn" data-mode="dark" onclick="setMode('dark')">
                    <i class="fa fa-moon fa-xs me-1"></i>Dark
                </button>
            </div>
            <div class="sf-theme-section-label">Color</div>
            <div class="d-flex gap-2">
                <button class="sf-swatch sf-swatch-violet" data-theme="violet" onclick="setTheme('violet')" aria-label="Violet theme" title="Violet"></button>
                <button class="sf-swatch sf-swatch-red"    data-theme="red"    onclick="setTheme('red')"    aria-label="Red theme"    title="Red"></button>
            </div>
        </div>
    </div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    syncSwitcherState();

    document.getElementById('sfThemeToggle').addEventListener('click', function (e) {
        e.stopPropagation();
        document.getElementById('sfThemePanel').classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
        const switcher = document.getElementById('sfThemeSwitcher');
        if (switcher && !switcher.contains(e.target)) {
            document.getElementById('sfThemePanel').classList.remove('open');
        }
    });
}

function setMode(mode) {
    const html = document.documentElement;
    if (mode === 'dark') {
        html.setAttribute('data-mode', 'dark');
    } else {
        html.removeAttribute('data-mode');
    }
    localStorage.setItem('sf-mode', mode);
    syncSwitcherState();
}

function setTheme(theme) {
    const html = document.documentElement;
    if (theme === 'red') {
        html.setAttribute('data-theme', 'red');
    } else {
        html.removeAttribute('data-theme');
    }
    localStorage.setItem('sf-theme', theme);
    syncSwitcherState();
}

function syncSwitcherState() {
    const currentMode  = document.documentElement.getAttribute('data-mode')  || 'light';
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'violet';

    document.querySelectorAll('.sf-mode-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.mode === currentMode);
    });
    document.querySelectorAll('.sf-swatch').forEach(function (sw) {
        sw.classList.toggle('active', sw.dataset.theme === currentTheme);
    });
}

// ── BibTeX toggle ────────────────────────────────────────────

function toggleBibtex(btn) {
    const card = btn.closest('.pub-card');
    const box  = card.querySelector('.pub-bibtex');
    const open = box.classList.toggle('open');
    btn.innerHTML = open
        ? '<i class="fa fa-code fa-xs"></i> Hide BibTeX'
        : '<i class="fa fa-code fa-xs"></i> BibTeX';
}
