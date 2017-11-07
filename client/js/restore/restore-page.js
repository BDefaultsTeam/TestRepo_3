$(document).ready(function () {
    $('body').addClass('show');
    resize();
});

$(window).resize(function () {
    resize();
});

function resize() {

    if (window.innerWidth > 1200) {
        var height;
        if (window.outerHeight > 800) {
            height = window.innerHeight - 550;
        }
        else {
            height = window.innerHeight - 450;
        }
        height = (height < 80) ? 80 : height;
        $('#pageContent').css({ 'margin-top': height / 2 });
    }
    else {
        $('#pageContent').css({ 
            'margin-top': '80px', 
            'margin-bottom': '200px' 
        });
    }
    //setTimeout(function () {
    //    $('body').css({ "opacity": "1" });
    //},1000);
}