$(document).ready(function () {

    // Load shared components
    $('#navbar-placeholder').load('assets/includes/navbar.html', function () {
        // Highlight active nav link based on current filename
        const page = window.location.pathname.split('/').pop() || 'index.html';
        $('.sf-navbar .nav-link[href="' + page + '"]').addClass('active');
    });
    $('#header-placeholder').load('assets/includes/header.html');
    $('#footer-placeholder').load('assets/includes/footer.html');

});

// BibTeX toggle (inline, works without jQuery ready)
function toggleBibtex(btn) {
    const card = btn.closest('.pub-card');
    const box  = card.querySelector('.pub-bibtex');
    const open = box.classList.toggle('open');
    btn.innerHTML = open
        ? '<i class="fa fa-code fa-xs"></i> Hide BibTeX'
        : '<i class="fa fa-code fa-xs"></i> BibTeX';
}
