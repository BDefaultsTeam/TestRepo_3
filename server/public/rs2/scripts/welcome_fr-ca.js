if (window.location.href.toLowerCase().indexOf("http://") >= 0) {
    window.location.href = window.location.href.replace('http://', 'https://');
}

$('head').append("<script type='text/javascript' src='../scripts/cookiesBanner.js'></script>");

/*! Edge Discovery Center | http://microsoft.com/ %> */
!function () {
    window.EdgeDiscoveryCenter = window.EdgeDiscoveryCenter || {};
    var a = {
        controls: {},
        utils: {},
        views: {},
        data: {},
        models: {},
        templates: {},
        events: new Backbone.Model,
        exports: window.EdgeDiscoveryCenter
    };
    !function () {
        var b = [],
		c = function (a, c) {
		    var d = setTimeout(function () {
		        "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.interactionType", "4", "ms.cmpnm", a)
		        sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.OTHER, "O", a);
		    }, 1e3 * c);
		    b.push(d)
		};
        a.startEngagementEvents = function () {
            c("engagement-1", 1),
			c("engagement-2", 2),
			c("engagement-3", 3),
			c("engagement-4", 4),
			c("engagement-5", 5),
			c("engagement-6", 6),
			c("engagement-7", 7),
			c("engagement-8", 8),
			c("engagement-9", 9),
			c("engagement-10", 10),
			c("engagement-15", 15),
			c("engagement-20", 20),
			c("engagement-25", 25),
			c("engagement-30", 30),
			c("engagement-40", 40),
			c("engagement-50", 50),
			c("engagement-60", 60),
			c("engagement-90", 90),
			c("engagement-120", 120),
			c("engagement-180", 180),
			c("engagement-240", 240),
			c("engagement-300", 300),
			document.addEventListener("visibilitychange", function () {
			    document.hidden && (_.each(b, function (a) {
			        clearTimeout(a)
			    }), b = [])
			})
        }
    }
	(),
	function () {
	    a.exports.tabPage = function (b) {
	        a.startEngagementEvents();
	        var c = 16,
			d = c,
			e = 2500,
			f = [{
			    elementId: "video-overlay-1",
			    startTime: 1.6,
			    endTime: 4,
			    videoPosition: {
			        x: .315,
			        y: -.15
			    }
			}, {
			    elementId: "video-overlay-2",
			    startTime: 4.5,
			    endTime: 6.5,
			    videoPosition: {
			        x: .315,
			        y: -.15
			    }
			}, {
			    elementId: "video-overlay-3",
			    startTime: 9,
			    endTime: 12,
			    videoPosition: {
			        x: .76,
			        y: -.15
			    }
			}, {
			    elementId: "video-overlay-4",
			    startTime: 16.25,
			    endTime: 19,
			    videoPosition: {
			        x: .045,
			        y: -.15
			    }
			}, {
			    elementId: "video-overlay-5",
			    startTime: 20,
			    endTime: 23.1,
			    videoPosition: {
			        x: .495,
			        y: .167
			    }
			}
			],
			g = function () {
			    var a = $(".contentContainer"),
				b = $(".welcome"),
				g = $("#video-container"),
				h = $("#desk-content-left"),
				i = $("#desk-content-right"),
				j = a.height(),
				k = a.width(),
				l = 1884 / 1066,
				m = .25 * j,
				n = .75 * j / 2,
				o = .75 * j / 2;
			    b.css({
			        height: o
			    }),
				g.css({
				    top: o,
				    width: "100%",
				    height: n
				}),
				$("#desk").css({
				    height: m + .15 * n
				});
			    var p = $("#laptop-lid"),
				q = $("#laptop-keyboard"),
				r = $("#laptop-front"),
				s = $("#video-main"),
				t = $("#welcome-claim"),
				u = b.width(),
				v = 1e3,
				w = 350,
				x = Math.min(o / w, u / v),
				y = 15 * x,
				z = n * l,
				A = z + 2 * y,
				B = n + 2 * y,
				C = (k - A) / 2,
				D = C + y,
				E = A,
				F = C;
			    e = 4 * A,
				$("#video-main, #laptop-lid").css({
				    transform: "perspective(" + e + "px)"
				}),
				$("#laptop-keyboard").css({
				    transform: "perspective(" + e + "px) rotateX(-100deg)"
				}),
				$("#laptop-front").css({
				    transform: "perspective(" + e + "px)"
				}),
				p.css({
				    width: A,
				    height: B,
				    left: C
				}),
				s.css({
				    width: z,
				    height: n,
				    left: D,
				    top: y
				}),
				q.css({
				    width: A,
				    height: B,
				    left: C
				}),
				r.css({
				    width: E,
				    left: F,
				    top: B,
				    transform: "perspective(" + e + "px) translateZ(" + B + "px) translateY(" + B * Math.tan(10 * Math.PI / 180) + "px)"
				}),
				t.css({
				    bottom: .4 * o
				}),
				$("#welcome-heading").css({
				    "margin-top": .2 * o
				});
			    var G = document.getElementById("laptop-front").getBoundingClientRect(),
				H = G.left,
				I = G.width;
			    h.css({
			        right: k - H,
			        bottom: 90 * x,
			        width: 480 * x,
			        height: 653 * x
			    }),
				i.css({
				    left: H + I,
				    bottom: 90 * x,
				    width: 350 * x,
				    height: 653 * x
				}),
				$("#laptop-front").css({
				    height: 15 * x
				});
                
			    var J = document.getElementById("video-main").getBoundingClientRect();
			    var containerPos = $(".contentContainer").position();
			    $.each(f, function (a, b) {
			        $("#" + b.elementId).css({
			            top: (J.top + J.height * b.videoPosition.y) - containerPos.top,
			            left: J.left + J.width * b.videoPosition.x
			        })
			    }),
				d = x * c,
				$("html, body").css("font-size", d)


			    $(document).ready(function () {
			        if (document.getElementsByTagName("html")[0].getAttribute("dir") == "rtl") {
			            document.styleSheets[0].addRule(' .links-button:after', 'display: inline-block;');
			            document.styleSheets[0].addRule(' .links-button:after', 'transform: scale(-1, 1);');
			        }
			    });

			    function btnFontResize(scale) {
			        var browserWidth = $(window).width();
			        var btnFontSize = (browserWidth / scale).toFixed(2);
			        $('#links .links-button').css('font-size', btnFontSize + 'px');

			        var getStartFontSize = Number(btnFontSize) + 5;
			        if (browserWidth < 700)
			            getStartFontSize = Number(btnFontSize) + 2;
			        $('#links span').css('font-size', getStartFontSize + 'px');
			    }
			    // Button font resize 
			    if ($(window).width() < 1200 && $(window).width() > 910) {
			        btnFontResize(90);
			    }
			    else if ($(window).width() <= 910 && $(window).width() > 750) {
			        btnFontResize(90);
			    }
			    else if ($(window).width() <= 750 && $(window).width() > 650) {
			        btnFontResize(90);
			    }
			    else if ($(window).width() <= 650) {
			        btnFontResize(85);
			    }
			    else {
			        $('#links .links-button').css('font-size', '13px');
			        $('#links span').css('font-size', '19px');
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
			        $('#source-links').css('font-size', btnFontSize + 'px');
			    }
			    else {
			        $('#source-links').css('font-size', '13px');
			    }

			    // Reduce padding in buttons
			    if ($(window).width() < 901) {
			        $('#links .links-button').css('padding', '0 1em');
			    }
			    else {
			        $('#links .links-button').css('padding', '0 1.5em');
			    }

			};
	        $(window).resize(_.debounce(g, 10)),
			g(),
			$("#video-main, #laptop-lid, #laptop-keyboard").css({
			    transform: "perspective(" + e + "px) rotateX(-100deg)"
			});
	        var h = f.slice(),
			i = h[0].startTime,
			j = 0,
			k = null;
	        CustomEase.create("softBounce", "M0,0 C0,0 0.169,0.024 0.244,0 0.285,-0.013 0.289,-0.084 0.32,-0.084 0.396,-0.084 0.455,0.385 0.502,0.74 0.562,1.2 0.672,1 0.916,1 0.951,1 1,1 1,1");
	        var l = new TimelineMax,
			m = (new TimelineMax, document.getElementById("video-main"));
	        m.addEventListener("ended", function () {
	            setTimeout(function () {
	                m.currentTime = 0,
					m.play(),
					h = f.slice(),
					i = h[0].startTime,
					k = null
	            }, 2e3)
	        }),
			setInterval(function () {
			    var a = m.currentTime;
			    if (!k && a > i) {
			        k = h[0],
					j = k.endTime;
			        document.getElementById("video-main").getBoundingClientRect();			        
			        $("#" + k.elementId).addClass("video-overlay-show")
			    } else
			        k && a > j && ($("#" + k.elementId).removeClass("video-overlay-show"), h = h.slice(1), h.length && (i = h[0].startTime, k = null))
			}, 50),
			l.addCallback(function () {
			    $(".content").addClass("intro")
			}),
			l.add([TweenMax.fromTo("#welcome-heading", .8, {
			    opacity: 0,
			    y: 100
			}, {
			    opacity: 1,
			    y: 0,
			    ease: Power4.easeInOut
			}), TweenMax.to("#welcome-heading", .8, {
			    y: 0,
			    ease: Power4.easeInOut
			}), TweenMax.fromTo("#links", .8, {
			    opacity: 0,
			    y: 100
			}, {
			    opacity: 1,
			    y: 0,
			    ease: Power4.easeInOut
			}), TweenMax.fromTo("#welcome-tagline", .8, {
			    opacity: 0,
			    y: 100
			}, {
			    opacity: 1,
			    y: 0,
			    ease: Power4.easeInOut
			}), TweenMax.staggerFromTo("#welcome-tagline .g1", .75, {
			    opacity: 0,
			    y: 30
			}, {
			    opacity: 1,
			    y: 0,
			    ease: Power4.easeInOut
			}, .25), TweenMax.fromTo("#welcome-tagline .g2", .75, {
			    opacity: 0,
			    y: 30
			}, {
			    opacity: 1,
			    y: 0,
			    ease: Power4.easeInOut,
			    delay: .75
			})], "+=0.5"),
			l.add([TweenMax.fromTo("#welcome-claim", .8, {
			    opacity: 0,
			    y: 60
			}, {
			    opacity: 1,
			    y: 0,
			    ease: CustomEase.get("softBounce")
			})], "+=.5"),
			l.add([TweenMax.fromTo(".desk-container", .8, {
			    opacity: 0,
			    y: 10
			}, {
			    opacity: 1,
			    y: 0,
			    ease: CustomEase.get("softBounce")
			}), TweenMax.fromTo("#video-container", .8, {
			    opacity: 0,
			    y: 10
			}, {
			    opacity: 1,
			    y: 0,
			    ease: CustomEase.get("softBounce")
			})], "+=1.0"),
			l.addCallback(function () {
			    var a = document.getElementById("laptop-lid"),
				b = document.getElementById("video-main"),
				c = document.getElementById("laptop-keyboard");
			    a.style.transform = "perspective(" + e + "px) rotateX( 0deg )",
				b.style.transform = "perspective(" + e + "px) rotateX( 0deg )",
				c.style.backgroundColor = "#1171bc",
				setTimeout(function () {
				    m.style.opacity = 1
				}, 800),
				setTimeout(function () {
				    m.play()
				}, 1e3)
			}),
			l.to("#links", 1.5, {
			    y: -100,
			    ease: CustomEase.create("custom", "M0,0 C0,0 0.035,0.003 0.094,-0.052 0.115,-0.071 0.138,-0.126 0.16,-0.142 0.229,-0.235 0.196,0.099 0.258,0.212 0.326,0.336 0.509,0.293 0.542,0.238 0.584,0.166 0.582,-0.252 0.656,-0.252 0.694,-0.252 0.722,0.005 0.768,0.038 0.793,0.056 0.806,-0.068 0.836,-0.074 0.847,-0.075 0.869,0.034 0.908,0.01 0.949,-0.016 1,0 1,0"),
			    delay: 2
			}, "+=29")
	    }
	}
	()

    //Sends JSLL Pings
    function sendJSLLPing(behaviorName, actionTypeValue, contentNameValue) {

        if ("undefined" != typeof awa) {
            //awa.init(jsllConfig);
            var overrideValues = {
                behavior: behaviorName,
                actionType: actionTypeValue,
                content: { contentName: contentNameValue },
            };
            awa.ct.captureContentPageAction(overrideValues);
        }
    }
    var targetId = "";
    function findTargetId(target) {
        return target == targetId;
    }
    var keyCode = 0;
    $(document).keydown(function (event) {
        keyCode = event.keyCode;
    });
    var filteredLinksIdArray = ["link-bookmarks", "link-extensions", "link-new"];
    $(document).click(function (event) {
        targetId = event.target.id;
        if (filteredLinksIdArray.find(findTargetId)) {
            if (keyCode == 13) {
                setTimeout(function () {
                    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.CLICK, "KE", targetId + "-LinkClick")
                }, 500);
                keyCode = 0;
            }
            else {
                setTimeout(function () {
                    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.CLICK, "CL", targetId + "-LinkClick")
                }, 500);
            }
        }
    });

}
();
