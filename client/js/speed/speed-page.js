/*global CustomEase: true, Power4: true */
(function() {

    app.startEngagementEvents();

    var min = 24000,
        max = 32000;
    
    var ffVal = 28286,
        chromeVal = 29399,
        edgeVal = 30818;
    
    /*
    var scaleBy = function(val, s) {
        return min + (s * (val - min));
    };
    */

    var contain = function(destRect, srcRect) {

        var destAspect = destRect.width / destRect.height,
            srcAspect = srcRect.width / srcRect.height,
            width, height, x, y, scale;

        if (srcAspect > destAspect) {
            width = destRect.width;
            height = destRect.width / srcAspect;
            x = destRect.x + 0;
            y = destRect.y + ((destRect.height - height) / 2);
            scale = height / srcRect.height;
        }
        else {
            width = destRect.height * srcAspect;
            height = destRect.height;
            y = destRect.y + 0;
            x = destRect.x + ((destRect.width - width) / 2);
            scale = width / srcRect.width;
        }

        var containerRect = {
            width: width,
            height: height,
            x: x,
            y: y,
            scale: scale
        };

        return containerRect;

    };        

    var scale = 16;

    var resize = function() {
        
        // scale the content div to fit within the available space

        var $w = $('.contentContainer'),
            $c = $('.content'),
            containRect = contain(
                {x:0, y:0, width: Math.min(1500, $w.width() * 0.8), height: ($w.height() * 0.75) }, 
                {x:0, y:0, width: $c.width(), height: $c.height() }),
            contentScale = containRect.width / $c.width();

        scale *= contentScale;
        $('html, body').css('font-size', scale);
    };

    $(window).resize(_.debounce(resize, 100));
    
    resize();

    var edgeDial = new app.controls.SpeedDial(
        document.getElementById('edge-dial-canvas'), {
            minValue: min,
            maxValue: max,
            valueImageUrl: '/images/speed/edge-dial-value.png',
            marksImageUrl: '/images/speed/edge-dial-marks.png',
            pointerImageUrl: '/images/speed/edge-dial-pointer.png',
            labelUpdateFrameFreq: 2
        });

    var chromeDial = new app.controls.SpeedDial(
        document.getElementById('chrome-dial-canvas'), {
            minValue: min,
            maxValue: max,
            valueImageUrl: '/images/speed/chrome-dial-value.png',
            marksImageUrl: '/images/speed/chrome-dial-marks.png',
            pointerImageUrl: '/images/speed/chrome-dial-pointer.png',
            labelUpdateFrameFreq: 4
        });

    var ffDial = new app.controls.SpeedDial(
        document.getElementById('ff-dial-canvas'), {
            minValue: min,
            maxValue: max,
            valueImageUrl: '/images/speed/ff-dial-value.png',
            marksImageUrl: '/images/speed/ff-dial-marks.png',
            pointerImageUrl: '/images/speed/ff-dial-pointer.png',
            labelUpdateFrameFreq: 4
        });

    var animateDialLabel = function(label, from, value, dur) {
        var lbl = { v: from };
        TweenLite.to(lbl, dur, {v: value, ease: Expo.easeInOutm, onUpdate: function() {
            label.textContent = Math.round(lbl.v).toLocaleString();
        }});
    };

    CustomEase.create('softBounce', 'M0,0 C0,0 0.169,0.024 0.244,0 0.285,-0.013 0.289,-0.084 0.32,-0.084 0.396,-0.084 0.455,0.385 0.502,0.74 0.562,1.2 0.672,1 0.916,1 0.951,1 1,1 1,1');
    var intro = new TimelineMax();
    var outro = new TimelineMax();

    var startDials = function() { 

        var edgeDur = 3,
            chromeDur = 5,
            ffDur = 6.5;
        
        animateDialLabel(document.getElementById('edge-dial-label'), 0, edgeVal, edgeDur - 0.5);
        var et = edgeDial.animateToValueT('strong', edgeVal, edgeDur);
        et.addCallback(function() {
            $('.edge-dial-column').addClass('show-final');
        }, '-=2.5');

        animateDialLabel(document.getElementById('chrome-dial-label'), 0, chromeVal, chromeDur - 0.5);
        var ct = chromeDial.animateToValueT('normal', chromeVal, chromeDur);
        ct.addCallback(function() {
            $('.chrome-dial-column').addClass('show-final');
        }, '-=1');

        animateDialLabel(document.getElementById('ff-dial-label'), 0, ffVal, ffDur - 0.5);
        var ft = ffDial.animateToValueT('normal', ffVal, ffDur);
        ft.addCallback(function() {
            $('.ff-dial-column').addClass('show-final');
            outro.play();
        }, '-=1');

    };

    // intro animation

    intro.addCallback(function() {
        $('.content').addClass('intro');
    });

    intro.add([
        //TweenMax.fromTo('#welcome-heading', 0.8, {opacity: 0, y: 100}, {opacity: 1, y: 40, ease: Power4.easeInOut}),
        TweenMax.fromTo('#welcome-heading', 0.8, {opacity: 0, y: 100}, {opacity: 1, y: 0, ease: Power4.easeInOut}),
    ], '+=0.5');

    intro.add([
        TweenMax.to('#welcome-heading', 0.8, {y: 0, ease: Power4.easeInOut}),
        TweenMax.fromTo('#links', 0.8, {opacity: 0, y: 100}, {opacity: 1, y: 0, ease: Power4.easeInOut}),
        TweenMax.fromTo('#welcome-windows', 0.8, {opacity: 0, y: 100}, {opacity: 1, y: 0, ease: Power4.easeInOut}),
        TweenMax.staggerFromTo('#welcome-windows .g1', 0.75, {opacity: 0, y:30}, {opacity: 1, y: 0, ease: Power4.easeInOut}, 0.25),
        TweenMax.fromTo('#welcome-windows .g2', 0.75, {opacity: 0, y:30}, {opacity: 1, y: 0, ease: Power4.easeInOut, delay: 0.75}),
    ], '+=0.5');

    intro.add([
        TweenMax.to('#welcome-windows', 0.8, {opacity: 0, y: -60, ease: CustomEase.get('softBounce')}),
        TweenMax.fromTo('#welcome-faster', 0.8, {opacity: 0, y: 60}, {opacity: 1, y: 0, ease: CustomEase.get('softBounce')}),
        //TweenMax.fromTo('#welcome-faster .g2', 0.75, {opacity: 0, y:30}, {opacity: 1, y: 0, ease: Power4.easeInOut, delay: 1}),
    ], '+=1.5');

    intro.addCallback(function() {
        startDials();
    }, '+=1.5');

    intro.add([
        TweenMax.to('.welcome', 1, {top: 0, ease: CustomEase.get('softBounce')}),
        TweenMax.fromTo('.dial-column', 1, {opacity: 0, y: 80}, {opacity: 1, y: 0, ease: CustomEase.get('softBounce')})
    ], '-=1.5');

    // outro animation
    outro.to('#links', 1.5, {y: -100, ease:CustomEase.create('custom', 'M0,0 C0,0 0.035,0.003 0.094,-0.052 0.115,-0.071 0.138,-0.126 0.16,-0.152 0.229,-0.235 0.196,0.099 0.258,0.212 0.326,0.336 0.509,0.293 0.542,0.238 0.584,0.166 0.582,-0.252 0.656,-0.252 0.694,-0.252 0.722,0.005 0.768,0.038 0.793,0.056 0.806,-0.068 0.836,-0.074 0.847,-0.075 0.869,0.034 0.908,0.01 0.949,-0.016 1,0 1,0'), delay: 1});
    outro.pause();

    // add min/max labels
    $('.dial-column').append($('<div class="dial-min">' + (min).toLocaleString() + '</div><div class="dial-max">' + (max).toLocaleString() + '</div>'));

})();


