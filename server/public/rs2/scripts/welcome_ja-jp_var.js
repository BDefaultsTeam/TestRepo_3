//if (window.location.href.toLowerCase().indexOf("http://") >= 0) {
//    window.location.href = window.location.href.replace('http://', 'https://');
//}


$('head').append("<script type='text/javascript' src='../../scripts/cookiesBanner_ja-jp_var.js'></script>");

(function () {
    window.EdgeDiscoveryCenter = window.EdgeDiscoveryCenter || {};

    var app = {
        controls: {},
        utils: {},
        views: {},
        data: {},
        models: {},
        templates: {},
        events: new Backbone.Model(),
        exports: window.EdgeDiscoveryCenter
    };

    var videoFlag = false;
    //document.getElementById("posterImage").play();
    var pausePlay = false;

    function linksBounce() {
        videoFlag = true;
        var ls = new TimelineMax;
        ls.to("#links", 1.5, {
            y: -100,
            ease: CustomEase.create("custom", "M0,0 C0,0 0.035,0.003 0.094,-0.052 0.115,-0.071 0.138,-0.126 0.16,-0.142 0.229,-0.235 0.196,0.099 0.258,0.212 0.326,0.336 0.509,0.293 0.542,0.238 0.584,0.166 0.582,-0.252 0.656,-0.252 0.694,-0.252 0.722,0.005 0.768,0.038 0.793,0.056 0.806,-0.068 0.836,-0.074 0.847,-0.075 0.869,0.034 0.908,0.01 0.949,-0.016 1,0 1,0"),
            delay: 0
        }, "+=0.1"),

        setTimeout(function () {
            videoFlag = false;
        }, 1500)
    };

    $("#bPausePlay").click(function () {
        if (pausePlay) {
            document.getElementById("video").play();
            $("#bPausePlay").removeClass("glyph-play");
            $("#bPausePlay").addClass("glyph-pause");
            pausePlay = false;
        }
        else {            
            document.getElementById("video").pause();
            $("#bPausePlay").removeClass("glyph-pause");
            $("#bPausePlay").addClass("glyph-play");
            pausePlay = true;
        }
        if (!videoFlag) {
            linksBounce();
        }
     
    });

    (function () {


        // utility method to schedule a future event to track user engagement
        var engagementTimeoutIds = [];
        var delayedEvent = function (eventName, delaySeconds) {
            var timeoutId = setTimeout(function () {
                /* jshint newcap: false */
                if (typeof MscomCustomEvent !== 'undefined') {
                    /* global MscomCustomEvent: true */
                    MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', eventName);
                    //console.log('custom event: ' + eventName);
                }
                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.OTHER, "O", eventName);
            }, delaySeconds * 1000);

            engagementTimeoutIds.push(timeoutId);
        };

        var startEngagementEvents = function () {

            // start a sequence of events to track user engagement
            delayedEvent('engagement-1', 1);
            delayedEvent('engagement-2', 2);
            delayedEvent('engagement-3', 3);
            delayedEvent('engagement-4', 4);
            delayedEvent('engagement-5', 5);
            delayedEvent('engagement-6', 6);
            delayedEvent('engagement-7', 7);
            delayedEvent('engagement-8', 8);
            delayedEvent('engagement-9', 9);
            delayedEvent('engagement-10', 10);
            delayedEvent('engagement-15', 15);
            delayedEvent('engagement-20', 20);
            delayedEvent('engagement-25', 25);
            delayedEvent('engagement-30', 30);
            delayedEvent('engagement-40', 40);
            delayedEvent('engagement-50', 50);
            delayedEvent('engagement-60', 60);
            delayedEvent('engagement-90', 90);
            delayedEvent('engagement-120', 120);
            delayedEvent('engagement-180', 180);
            delayedEvent('engagement-240', 240);
            delayedEvent('engagement-300', 300);

            // cancel enagement events if the user navigates or switches away from the current tab
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    _.each(engagementTimeoutIds, function (timeoutId) {
                        clearTimeout(timeoutId);
                    });
                    engagementTimeoutIds = [];
                    //console.log('cancelled engagement events');
                }
            });
        };

        app.exports.speedPage = function (data) {
            startEngagementEvents();

            var min = 25000,
                max = 31000;

            var ffVal = 28286,
                chromeVal = 29399,
                edgeVal = 30818;

            var scaleBy = function (val, s) {
                return min + (s * (val - min));
            };

            var contain = function (destRect, srcRect) {

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

                // add min/max labels
                if ($('div.dial-min').length == 0) {
                    $('.dial-column').append($('<div class="dial-min">' + (min).toLocaleString() + '</div><div class="dial-max">' + (max).toLocaleString() + '</div>'));
                }

                return containerRect;

            };

            var scale = 16;

            var resize = function () {

                // scale the content div to fit within the available space

                var $w = $('.contentContainer'),
                    $c = $('.content'),
                    containRect = contain(
                        { x: 0, y: 0, width: Math.min(1500, $w.width() * 0.8), height: ($w.height() * 0.75) },
                        { x: 0, y: 0, width: $c.width(), height: $c.height() }),
                    contentScale = containRect.width / $c.width();

                scale *= contentScale;
                $('html, body').css('font-size', scale);

                var posterImgWidth = scale * 23;
                var posterImgHeight = scale * 13;
                var posterImg1Width = scale * 32;
                var posterImg1Height = scale * 18;

                $("#posterImage").css('width', posterImgWidth +'px');
                $("#posterImage").css('height', posterImgHeight + 'px');
                $("#posterImage1").css('width', posterImg1Width + 'px');
                $("#posterImage1").css('height', posterImg1Height + 'px');


                var posterImgMarLeft = ((posterImg1Width - posterImgWidth) / 2 ) + 3;
                $("#posterImage").css('margin-left', posterImgMarLeft + 'px');

                // Button font resize 
                if ($(window).width() < 1020 && $(window).width() > 800) {

                    var browserWidth = $(window).width();
                    var btnFontScale = 85;
                    var btnFontSize = (browserWidth / btnFontScale).toFixed(2);
                    $('#links .links-button').css('font-size', btnFontSize + 'px');
                    $('#links span').css('font-size', (Number(btnFontSize) + 5) + 'px');
                    $("#posterImage").css('margin-top', '3px');

                }
                else if ($(window).width() <= 800) {

                    var browserWidth = $(window).width();
                    var btnFontScale = 80;
                    var btnFontSize = (browserWidth / btnFontScale).toFixed(2);
                    $('#links .links-button').css('font-size', btnFontSize + 'px');
                    $('#links span').css('font-size', (Number(btnFontSize) + 1) + 'px');
                    $("#posterImage").css('margin-top', '2px');
                    $("#posterImage").css('margin-left', posterImgMarLeft + 'px');
                }

                else if ($(window).width() <= 600) {
                    $("#posterImage").css('margin-left', posterImgMarLeft + 'px');
                    var posterImgMarLeft = ((posterImg1Width - posterImgWidth) / 2) + 3;
                }
                else {
                    $('#links .links-button').css('font-size', '13px');
                    $('#links span').css('font-size', '19px');
                    $("#posterImage").css('margin-top', '7px');
                }

                // Reduce the gap between buttons.
                if ($(window).width() < 801) {
                    $('#links span').css('margin-right', '0px');
                    $('#links .links-button').css('margin', '12px 2px 8px');

                }
                else {
                    $('#links span').css('margin-right', '16px');
                    $('#links .links-button').css('margin', '12px 8px 8px');
                }

                
                // Reduce the source link font size
                if ($(window).width() < 451) {
                    var browserWidth = $(window).width();
                    var btnFontScale = 35;
                    var btnFontSize = (browserWidth / btnFontScale).toFixed(2);
                }

            };

            $(window).resize(_.debounce(resize, 10));

            resize();
            
            CustomEase.create("softBounce", "M0,0 C0,0 0.169,0.024 0.244,0 0.285,-0.013 0.289,-0.084 0.32,-0.084 0.396,-0.084 0.455,0.385 0.502,0.74 0.562,1.2 0.672,1 0.916,1 0.951,1 1,1 1,1");
            var intro = new TimelineMax();
            var outro = new TimelineMax();
           
            // intro animation
            m = (new TimelineMax, document.getElementById("posterImage"));


            //setTimeout(function () { m.play(); }, 6200);

            intro.addCallback(function () {
                $('.content').addClass('intro');
            });


            intro.addCallback(function () {
                $('.content').addClass('intro');
            });

            intro.add([
                //TweenMax.fromTo('#welcome-heading', 0.8, {opacity: 0, y: 100}, {opacity: 1, y: 40, ease: Power4.easeInOut}),
                TweenMax.fromTo('#welcome-heading', 0.8, { opacity: 0, y: 100 }, { opacity: 1, y: 0, ease: Power4.easeInOut }),
            ], '+=0.5');

            intro.add([
                TweenMax.to('#welcome-heading', 0.8, { y: 0, ease: Power4.easeInOut }),
                TweenMax.fromTo('#links', 0.8, { opacity: 0, y: 100 }, { opacity: 1, y: 0, ease: Power4.easeInOut }),
                //TweenMax.fromTo('#welcome-windows', 0.8, { opacity: 0, y: 100 }, { opacity: 1, y: 0, ease: Power4.easeInOut }),
                //TweenMax.staggerFromTo('#welcome-windows .g1', 0.75, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: Power4.easeInOut }, 0.25),
                //TweenMax.fromTo('#welcome-windows .g2', 0.75, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: Power4.easeInOut, delay: 0.75 }),

                 TweenMax.fromTo('#welcome-faster', 0.8, { opacity: 0, y: 100 }, { opacity: 1, y: 0, ease: Power4.easeInOut }),
                TweenMax.staggerFromTo('#welcome-faster .g1', 0.75, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: Power4.easeInOut }, 0.25)
            ], '+=0.5');

            intro.add([
                //TweenMax.to('#welcome-windows', 0.8, { opacity: 0, y: -60, ease: CustomEase.get("softBounce") }),
                //TweenMax.fromTo('#welcome-faster', 0.8, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: CustomEase.get("softBounce") }),
                //TweenMax.fromTo('#welcome-faster .g2', 0.75, {opacity: 0, y:30}, {opacity: 1, y: 0, ease: Power4.easeInOut, delay: 1}),
            ], '+=1.5');

            intro.addCallback(function () {
                //startDials();
            }, '+=1.5');

            intro.add([
                TweenMax.to('.welcome', 1, { top: 0, ease: CustomEase.get("softBounce") }),
                TweenMax.fromTo('.dials', 1, { opacity: 0, y: 80 }, { opacity: 1, y: 0, ease: CustomEase.get("softBounce") })
            ], '-=1.5');


            // outro animation
            outro.to('#links', 1.5, { y: -100, ease: CustomEase.create("custom", "M0,0 C0,0 0.035,0.003 0.094,-0.052 0.115,-0.071 0.138,-0.126 0.16,-0.152 0.229,-0.235 0.196,0.099 0.258,0.212 0.326,0.336 0.509,0.293 0.542,0.238 0.584,0.166 0.582,-0.252 0.656,-0.252 0.694,-0.252 0.722,0.005 0.768,0.038 0.793,0.056 0.806,-0.068 0.836,-0.074 0.847,-0.075 0.869,0.034 0.908,0.01 0.949,-0.016 1,0 1,0"), delay: 1 });
            outro.pause();

        };


    })();


    (function () {

        var toRad = function (deg) {
            return deg * (Math.PI / 180);
        };

        var createArcPath = function (ctx, cx, cy, r, fromDeg, toDeg, w) {
            var from = toRad(fromDeg),
                to = toRad(toDeg);
            ctx.moveTo(cx, cy);
            ctx.beginPath();
            ctx.arc(cx, cy, r, from, to, false);
            ctx.arc(cx, cy, r - w, to, from, true);
            ctx.closePath();
        };

        var defaults = {
            valueImageUrl: "../images/edge-dial-value.png",
            marksImageUrl: "../images/edge-dial-marks.png",
            pointerImageUrl: "../images/edge-dial-pointer.png",
            startAngle: 144.5,
            endAngle: 395.5,
            minValue: 0,
            maxValue: 100,
            maxFrames: 10000
        };

        function SpeedDial(canvas, options) {

            options = options || {};
            var op = _.defaults(options, defaults);
            this.op = op;

            // render at a high resolution and then shrink in the dom to
            // make sure we get good anti-aliasing and high dpi resolution
            this.w = 1000;
            this.h = 1000;
            canvas.width = this.w;
            canvas.height = this.h;
            this.ctx = canvas.getContext("2d");

            this.startAngle = op.startAngle;
            this.endAngle = op.endAngle;
            this.angle = this.startAngle;
            this.frame = 0;

            this.driftEnabled = false;
            this.driftOffset = 0;

            this.minValue = op.minValue;
            this.maxValue = op.maxValue;
            this.value = this.minValue;

            this.valueImage = new Image();
            this.valueImage.src = op.valueImageUrl;

            this.marksImage = new Image();
            this.marksImage.src = op.marksImageUrl;

            this.pointerImage = new Image();
            this.pointerImage.src = op.pointerImageUrl;

            this.bindRefresh = _.bind(this.refresh, this);
            requestAnimationFrame(this.bindRefresh);
        }

        SpeedDial.prototype.scaledValue = function (v, s) {
            // scale a value accounting for min/max 
            return this.minValue + (s * (v - this.minValue));
        };

        SpeedDial.prototype.clamp = function (min, max) {
            this.clampMin = min;
            this.clampMax = max;
        };

        // args: easeType ('strong', 'normal'), value, duration, onComplete callback
        SpeedDial.prototype.animateToValueT = function (easeType, v, d, onComplete) {

            var t = new TimelineMax({
                onComplete: onComplete
            });
            var sc = _.bind(this.scaledValue, this);

            switch (easeType) {

                case 'strong':

                    t.to(this, 1.8, { ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.10) });
                    t.to(this, 1.0, { ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.20) });
                    t.to(this, 1.0, { ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.40) });
                    t.to(this, 1.0, { ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.70) });
                    t.to(this, 3.0, { ease: Elastic.easeOut.config(1.1, 0.2), value: sc(v, 1) });
                    break;

                case 'normal':

                    t.to(this, 1.8, { ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.15) });
                    t.to(this, 2.0, { ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.80) });
                    t.to(this, 2.0, { ease: Elastic.easeOut.config(1.1, 0.2), value: sc(v, 1) });
                    break;
            }

            t.duration(d);
            return t;
        };

        SpeedDial.prototype.toggleDrift = function (enable, maxVariance, maxDelay, maxDuration) {

            enable = typeof (enable) === 'undefined' ? !this.driftEnabled : enable;
            this.driftEnabled = enable;

            if (enable) {

                var tweenDrift = _.bind(function () {
                    if (this.driftEnabled) {

                        var dur = Math.random() * maxDuration,
                            delay = Math.random * maxDelay,
                            nextDrift = Math.round(maxVariance - (2 * (Math.random() * maxVariance)));

                        TweenLite.to(this, dur, {
                            driftOffset: nextDrift, delay: delay, ease: Back.easeInOut.config(2), onComplete: _.bind(function () {
                                tweenDrift();
                            }, this)
                        });
                    }
                }, this);

                tweenDrift();
            }

        };

        SpeedDial.prototype.refresh = function () {

            var ctx = this.ctx;

            var val = this.value;

            if (this.driftEnabled) {
                val = this.value + this.driftOffset;
            }
            else {
                val = this.value;
            }

            if (this.clampMin && this.clampMax) {
                val = Math.min(this.clampMax, Math.max(this.clampMin, val));
            }

            var rel = (val - this.minValue) / (this.maxValue - this.minValue),
                angle = this.startAngle + (rel * (this.endAngle - this.startAngle));

            var clampAngle = Math.min(angle, this.endAngle);
            var clampValue = Math.min(this.value, this.maxValue);

            // clear the canvas
            ctx.clearRect(0, 0, this.w, this.h);

            // masked value indicator
            if (val > this.minValue) {
                ctx.save();
                createArcPath(ctx, this.w / 2, this.h / 2, this.w / 2, this.startAngle, angle, this.w / 3);
                ctx.clip();
                ctx.drawImage(this.valueImage, 0, 0, this.w, this.h);
                ctx.restore();
            }

            // indicator marks
            ctx.drawImage(this.marksImage, 0, 0, this.w, this.h);

            // pointer
            ctx.save();
            ctx.translate(this.w / 2, this.h / 2);
            ctx.rotate(toRad(180 + angle));
            ctx.translate(this.w / -2, this.h / -2);
            ctx.drawImage(this.pointerImage, 0, 0, this.w, this.h);
            ctx.restore();

            this.frame++;
            if (this.frame < this.op.maxFrames) {
                requestAnimationFrame(this.bindRefresh);
            }
            else {
                //console.log('Max frames reached.');
            }
        };

        app.exports.speedPage.SpeedDial = SpeedDial;

    })();

    //Sends JSLL Pings
    function sendJSLLPing(behaviorName, actionTypeValue, contentNameValue) {

        if ("undefined" != typeof awa) {
            awa.init(jsllConfig);
            var overrideValues = {
                behavior: behaviorName,
                actionType: actionTypeValue,
                content: { contentName: contentNameValue },
            };
            awa.ct.captureContentPageAction(overrideValues);
        }
    }   

    var keyCode = 0;
    $(document).keydown(function (event) {
        keyCode = event.keyCode;
    });
    var targetId = "";
    function findTargetId(target) {
        return target == targetId;
    }
    var filteredLinksIdArray = ["links-button", "pLink"];
    $(document).click(function (event) {
       
        targetId = event.target.className;
       
        if (filteredLinksIdArray.find(findTargetId)) {
            if (keyCode == 13) {
                setTimeout(function () {
                    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.CLICK, "KE", event.target.id + "-LinkClick")
                }, 500);
                keyCode = 0;
            }
            else {
                setTimeout(function () {
                    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.CLICK, "CL", event.target.id + "-LinkClick")
                }, 500);
            }
        }
    });


})();