
app.isMouseActive = false;

var focusElements = 'button, input, select, a, video';

$('body').on('mousedown touchdown pointerdown', focusElements, function() {
    app.isMouseActive = true;
    setTimeout(function() {
        app.isMouseActive = false;
    }, 100);
});

$('body').on('focus', focusElements, function() {
    if(!app.isMouseActive) { 
        $(this).addClass('keyboard-focused'); 
    }
});

$('body').on('blur', focusElements, function() {
    $(this).removeClass('keyboard-focused'); 
});