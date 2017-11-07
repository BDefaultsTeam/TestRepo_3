if (window.location.href.toLowerCase().indexOf("http://") >= 0) {
    window.location.href = window.location.href.replace('http://', 'https://');
}

$('head').append("<script type='text/javascript' src='scripts/cookiesBanner.js'></script>");

/*! Edge Discovery Center | http://microsoft.com/ %> */

!function () {

    $("#video-main").hover(function () {
        $("#videoControlSection").show();
     document.getElementById("videoControlSection").style.opacity = "1";
    });
    $(window).keydown(function () {
        if(keyCode==9)
            $("#videoControlSection").hide();
    });
    
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
            c("engagement-360", 360),
			c("engagement-420", 420),
			c("engagement-480", 480),
			c("engagement-540", 540),
			c("engagement-600", 600),
			document.addEventListener("visibilitychange", function () {
			    document.hidden && (_.each(b, function (a) {
			        clearTimeout(a)
			    }), b = [])
			})
        }
    }
	(),
	function () {
	    var isDragged = true;
	    var isVideoTracked = true;
	    var videoStopped = false;
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
			    welcomeHeight = .5 * j / 2;
			    b.css({
			        height: welcomeHeight
			    }),
				g.css({
				    top: welcomeHeight,
				    width: "100%"
				    //height: n
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
			    //videoHeight = 1.3 * j / 2,
                videoHeight = ($(window).width() < 725) ? 1 * j / 2 : 1.3 * j / 2,
                videoWidth = videoHeight * l,
                lapLidWidth = videoWidth + 2 * y,
				lapLidHeight = videoHeight + 2 * y,
                lapLidLeft = (k - lapLidWidth) / 2,
                videoLeft = lapLidLeft + y,
               
				p.css({
				    width: lapLidWidth,
				    height: lapLidHeight,
				    left: lapLidLeft
				}),
				s.css({
				    width: videoWidth,
				    height: videoHeight,
				    left: videoLeft,
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

                
			    $(".f-video-player").css({
			        "min-width": videoWidth,
			        "width": videoWidth
			    });

			    $(".f-video-controls").css({
			        "width": videoWidth
			    });
			   
			    
                // Full screen mode
			    if (document.webkitIsFullScreen) {

			        $(".f-video-player").css({
			            "min-width": "100%",
			            "width": "100%"
			        });

			        $(".f-video-controls").css({
			            "width": "100%"
			        });
			    }


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
			    $.each(f, function (a, b) {
			        $("#" + b.elementId).css({
			            top: J.top + J.height * b.videoPosition.y,
			            left: J.left + J.width * b.videoPosition.x
			        })
			    }),
				d = x * c,
				$("html, body").css("font-size", d)
                
			    // Button font resize 
			    if ($(window).width() < 926) {
			        var browserWidth = $(window).width();
			        var btnFontScale = 75;
			        var btnFontSize = (browserWidth / btnFontScale).toFixed(2);
			        $('#links .links-button').css('font-size', btnFontSize + 'px');

			        $('#links span').css('font-size', (Number(btnFontSize) + 5) + 'px');
			    }
			    else {
			        $('#links .links-button').css('font-size', '13px');
			        $('#links span').css('font-size', '19px');
			    }

			    // Reduce the gap between buttons.
			    if ($(window).width() < 726) {
			        $('#links span').css('margin-right', '0px');
			        $('#links .links-button').css('margin', '12px 2px 8px');
			    }
			    else {
			        $('#links span').css('margin-right', '16px');
			        $('#links .links-button').css('margin', '12px 8px 8px');
			    }

			    // Replay button position
			    var videoTop = $("#video-main").css("top");
			    var videoHeight = $("#video-main").css("height");
			    var replayHeight = ((videoHeight.substring(0, videoHeight.length - 2)) + (videoTop.substring(0, videoTop - 2))) / 2;
			    replayHeight += 16;
			    replayHeight += "px";
			    $('.tabBody #video-controls .play-button').css({ top: replayHeight });
			};

	        $(window).resize(_.debounce(g, 10)),
			g();           

	        var h = f.slice(),
			i = h[0].startTime,
			j = 0,
			k = null;
	        CustomEase.create("softBounce", "M0,0 C0,0 0.169,0.024 0.244,0 0.285,-0.013 0.289,-0.084 0.32,-0.084 0.396,-0.084 0.455,0.385 0.502,0.74 0.562,1.2 0.672,1 0.916,1 0.951,1 1,1 1,1");

	        var videoMain = document.getElementById("video-main")
	        videoMain.addEventListener("playing", function () {
	            ControlsOn();
	        });
	        videoMain.addEventListener("webkitfullscreenchange", function () {
	            if (!document.webkitIsFullScreen) {
	                var VideoCurrentTime = document.getElementsByClassName("f-current-time")[0].textContent;
	                if (VideoCurrentTime.localeCompare("00:00") == 0) {
	                    ControlsOff();
	                    $("#videoControlSection").css({ 'display': 'none' });
	                }
	            }
	        });
	       
	        var l = new TimelineMax,
			m = (new TimelineMax, document.getElementById("video-main"));
	        m.addEventListener("ended", function () {
	            "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "103", "cn", "video-main-stop");

	            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOCOMPLETE, "A", "video-main-stop");

                linksBounce();
	            isDragged = true;
	            isVideoTracked = true;
	            videoStopped = true;
	            if (!document.webkitIsFullScreen) {
	                $("#videoControlSection").css({ 'display': 'none' });
	            }
	            setTimeout(function () {
	                m.currentTime = 0,
	                //m.play(),
					h = f.slice(),
					i = h[0].startTime,
					k = null;
	                if (document.webkitIsFullScreen) {
	                    ControlsOn();
	                }
	                else {	                    	                    
	                    ControlsOff();
	                    m.tabIndex = -1;
	                }
	            })
	        });
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
	        /*
			l.add([TweenMax.fromTo("#welcome-claim", .8, {
			    opacity: 0,
			    y: 60
			}, {
			    opacity: 1,
			    y: 0,
			    ease: CustomEase.get("softBounce")
			})], "+=.5"),
            */
			l.add([TweenMax.fromTo(".desk-container", .8, {
			    opacity: 0,
			    y: 10
			}, {
			    opacity: 1,
			    y: 0,
			    ease: CustomEase.get("softBounce")
			}), TweenMax.fromTo("#video-container", 1, {
			    opacity: 0,
			    y: 0
			}, {
			    opacity: 1,
			    y: 0,
			    ease: Power4.easeInOut
			})], "+=0.5"),

			l.addCallback(function () {
			    var a = document.getElementById("laptop-lid"),
				b = document.getElementById("video-main"),
				c = document.getElementById("laptop-keyboard");
			    setTimeout(function () {
			        m.style.opacity = 1
			    }, 100),
				setTimeout(function () {
				    //m.play(),
				    $("#playbutton").trigger("click"),
				    "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "100", "cn", "video-main-start");

				    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOSTART, "A", "video-main-start");

				}, 1e3)
			})

	    }

	    var videoMain = document.getElementById("video-main");
	    var videoFlag = false;
	    var videoSeekFlag = false;
	    var videoReplay = false;
	    var video = document.getElementById('video-main');                
	    
	    function ControlsOn() {

	        $(".fade-out-for-controls").animate({
	            opacity: 1
	        }, 0),
                $("#video-controls").addClass("video-ended").css({
                    opacity: 0
                }).animate({
                    opacity: 0
                }, 0)
            
	        $('.tabBody #video-controls .play-button').css({ pointerEvents: "none" });
	        document.getElementById('video-main').style.cursor = "auto";
	        document.getElementById("video-main").controls = true;
	    };
	    function ControlsOff() {
                        
	        $(".fade-out-for-controls").animate({
	            opacity: .25
	        }, 0),
                $("#video-controls").addClass("video-ended").css({
                    opacity: 1
                }).animate({
                    opacity: 1
                }, 0)
            
	        $('.tabBody #video-controls .play-button').css({ pointerEvents: "visible" });
	        document.getElementById('video-main').style.cursor = "pointer";
	        document.getElementById("video-main").controls = false;
	    };

	    video.addEventListener('pause', function () {
            
	        var VideoCurrentTime = document.getElementsByClassName("f-current-time")[0].textContent;
	        var VideoDuration = document.getElementsByClassName("f-duration")[0].textContent;

	        if (VideoCurrentTime != VideoDuration) {
	            "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "101", "cn", "video-main-pause");
	            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOPAUSE, "CL", "video-main-pause");
	        }
	        if (!videoFlag) {
	            if (!videoSeekFlag) {
	                linksBounce();
	                videoSeekFlag = false;
	            }
	        }
	    }, false);

	    video.addEventListener('play', function () {	        
	        if (videoReplay) {
	            videoReplay = false;
	        }
	        else {
	            if (videoStopped) {
	                videoStopped = false;	                
	                vidPerTracked = [true, true, true, true, true];
	                isVideoTracked = true;
	                "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.interactionType", "101", "cn", "video-main-replay");

	                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOREPLAY, "CL", "video-main-replay");
	            }
	            else {
	                var VideoCurrentTime = document.getElementsByClassName("f-current-time")[0].textContent;	                
	                if (VideoCurrentTime.localeCompare("00:00") != 0) {	                
	                    "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "101", "cn", "video-main-play_after_pause");
	                    sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOCONTINUE, "CL", "video-main-play_after_pause");
	                }
	            }
	        }
	    }, false);

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
	        }, 1550)
	    };

	    video.addEventListener("volumechange", function () {
	        // Written the functionlity in another JS file

	    }, false);

	    video.addEventListener("webkitfullscreenchange", function () {	        
	        if (document.webkitIsFullScreen) {	            
	            "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "16", "cn", "video-main-Full_Screen_Enabled");
	            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOFULLSCREEN, "CL", "video-main-Full_Screen_Enabled");
	            $("#fullScreenButton").removeClass("glyph-full-screen");
	            $("#fullScreenButton").addClass("glyph-back-to-window");
	            $("#fullScreenButton").attr("aria-label", "Exit Full Screen");
	            $("#fullScreenButton span").html("Exit Full Screen");
	        } else {	            
	            "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "17", "cn", "video-main-Full_Screen_Disabled");
	            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOUNFULLSCREEN, "CL", "video-main-Full_Screen_Disabled");
	            $("#fullScreenButton").removeClass("glyph-back-to-window");
	            $("#fullScreenButton").addClass("glyph-full-screen");
	            $("#fullScreenButton").attr("aria-label", "Full Screen");
	            $("#fullScreenButton span").html("Full Screen");
	        }
	    }, false);
        	    
	    var vidPerTracked = [true, true, true, true, true];
	    var i = 0;
	    var sTime = 0;	    

	    video.addEventListener("timeupdate", function () {
            
	        var videoCurrentTime = document.getElementsByClassName("f-current-time")[0].textContent;
	        var videoDuration = document.getElementsByClassName("f-duration")[0].textContent;

	        //Play Duration
	        var playSeconds = videoCurrentTime.substring(videoCurrentTime.length - 2, videoCurrentTime.length);
	        var playMinute = videoCurrentTime.substring(0, videoCurrentTime.length - 3);
	        var playDurationInSecs = playMinute * 60;
	        playDurationInSecs = parseInt(playDurationInSecs) + parseInt(playSeconds);	        

	        //Video Duration (Total Time)
	        var durationSeconds = videoDuration.substring(videoDuration.length - 2, videoDuration.length);
	        var durationMinute = videoDuration.substring(0, videoDuration.length - 3);
	        var videoDurationInSecs = durationMinute * 60;
	        videoDurationInSecs = parseInt(videoDurationInSecs) + parseInt(durationSeconds);
                        
	        if (playDurationInSecs != 0) {
	            if ((playDurationInSecs == Math.round(videoDurationInSecs * 1 / 4)) && vidPerTracked[0]) {
	                vidPerTracked[0] = false;
	                "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "102", "ms.video.completionrate", "25", "cn", "video-main-25_Completed");
	                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOCHECKPOINT, "A", "video-main-25_Completed");
	            }
	            else if ((playDurationInSecs == Math.round(videoDurationInSecs * 1 / 2)) && vidPerTracked[1]) {
	                vidPerTracked[1] = false;
	                // WEDCS code here for video 50% checkpoint
	                "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "102", "ms.video.completionrate", "50", "cn", "video-main-50_Completed");
	                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOCHECKPOINT, "A", "video-main-50_Completed");
	            }
	            else if ((playDurationInSecs == Math.round(videoDurationInSecs * 3 / 4)) && vidPerTracked[2]) {
	                vidPerTracked[2] = false;
	                // WEDCS code here for video 75% checkpoint
	                "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "102", "ms.video.completionrate", "75", "cn", "video-main-75_Completed");
	                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOCHECKPOINT, "A", "video-main-75_Completed");
	            }
	            else if ((playDurationInSecs == Math.round(videoDurationInSecs)) && vidPerTracked[3]) {
	                vidPerTracked[3] = false;
	                vidPerTracked[4] = false;
	                // WEDCS code here for video 100% checkpoint
	                "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "102", "ms.video.completionrate", "100", "cn", "video-main-100_Completed");
	                sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOCHECKPOINT, "A", "video-main-100_Completed");
	            }
	        }            


	    }, false);

	    video.addEventListener("seeked", function () {	        

	        if (isDragged && !videoStopped) {
	            "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.InteractionType", "102", "cn", "video-main-seeked");
	            sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOJUMP, "CL", "video-main-seeked");
	            isVideoTracked = true;
	            isDragged = true;
	        }

	    }, false);

	    var replayBtn = document.getElementById('replay');
	    replayBtn.addEventListener('click', function () {
	        $("#playbutton").trigger("click"),
            videoStopped = false;
	        vidPerTracked = [true, true, true, true, true];
	        isVideoTracked = true;
	        "undefined" != typeof MscomCustomEvent && MscomCustomEvent("ms.interactionType", "101", "cn", "video-main-replay");
			
	        sendJSLLPing(typeof (awa) == "undefined" ? null : awa.behavior.VIDEOREPLAY, "CL", "video-main-replay");
	    }, false);

	}
	()


    var targetId = "";
    function findTargetId(target) {
        return target == targetId;
    }
    var keyCode = 0;
    $(document).keydown(function (event) {
        keyCode = event.keyCode;
    });
    //To check whether user has clicked any predefined links 
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

    //Sends JSLL Pings
    function sendJSLLPing(behaviorName, actionTypeValue, contentNameValue) {

        var overrideValues = {
            behavior: behaviorName,
            actionType: actionTypeValue,
            contentTags: {
                contentName: contentNameValue,
                vidnm: "Windows 10 Creators Update Video",
                vidid: "video-main"
            }
        };
        awa.ct.captureContentPageAction(overrideValues);
    }
}
();
