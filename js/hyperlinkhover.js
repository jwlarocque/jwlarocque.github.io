$(function() {
    $('a, iframe').hover(function() {
        var href = $(this).attr('href');
        $('a[href="' + href + '"][class!="img"]').css({'border-bottom': '1px solid'});
    }, function() {
        // on mouseout, reset the background colour
        $('a[class!="img"]').css('border-bottom', '1px solid transparent');
    });
});
