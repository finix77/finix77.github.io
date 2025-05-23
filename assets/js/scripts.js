// Basic smooth scrolling
$(document).ready(function(){
    $('#navbar-placeholder').load('assets/includes/navbar.html');
    $('#header-placeholder').load('assets/includes/header.html');
    $('#footer-placeholder').load('assets/includes/footer.html');

    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top
            }, 800);
        }
    });
});
