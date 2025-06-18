$(document).ready(function() { 
    $('.meanu-link').on('click', function(e) {
         e.preventDefault();
         const url =$(this).attr('href');
         $('#content-area').load(url);
    });
});
       