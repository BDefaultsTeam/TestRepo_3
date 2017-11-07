/*global SlowMo: true, Elastic: true */
(function() {

    var toRad = function(deg) {
        return deg * (Math.PI / 180);
    };
    
    var createArcPath = function(ctx, cx, cy, r, fromDeg, toDeg, w) {
        var from = toRad(fromDeg),
            to = toRad(toDeg);
        ctx.moveTo(cx, cy);
        ctx.beginPath();
        ctx.arc(cx, cy, r, from, to, false);
        ctx.arc(cx, cy, r-w, to, from, true);
        ctx.closePath();
    };

    var defaults = { 
        valueImageUrl: '/images/speed/edge-dial-value.png',
        marksImageUrl: '/images/speed/edge-dial-marks.png',
        pointerImageUrl: '/images/speed/edge-dial-pointer.png',
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
        this.ctx = canvas.getContext('2d');

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

    SpeedDial.prototype.scaledValue = function(v, s) {
        // scale a value accounting for min/max 
        return this.minValue + (s * (v - this.minValue));
    };

    SpeedDial.prototype.clamp = function(min, max) {
        this.clampMin = min;
        this.clampMax = max;
    };

    // args: easeType ('strong', 'normal'), value, duration, onComplete callback
    SpeedDial.prototype.animateToValueT = function(easeType, v, d, onComplete) {

        var t = new TimelineMax({
            onComplete: onComplete
        });
        var sc = _.bind(this.scaledValue, this);

        switch (easeType) {

            case 'strong':

                t.to( this, 1.8, {ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.10)});
                t.to( this, 1.0, {ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.20)});
                t.to( this, 1.0, {ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.40)});
                t.to( this, 1.0, {ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.70)});
                t.to( this, 3.0, {ease: Elastic.easeOut.config(1.1, 0.2), value: sc(v, 1)});
                break;

            case 'normal':

                t.to( this, 1.8, {ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.15)});
                t.to( this, 2.0, {ease: SlowMo.ease.config(0.1, 1.5, false), value: sc(v, 0.80)});
                t.to( this, 2.0, {ease: Elastic.easeOut.config(1.1, 0.2), value: sc(v, 1)});
                break;
        }

        t.duration(d);
        return t;
    };

    SpeedDial.prototype.toggleDrift = function(enable, maxVariance, maxDelay, maxDuration) {
        
        enable = typeof(enable) === 'undefined' ? !this.driftEnabled : enable;
        this.driftEnabled = enable;

        if (enable) {

            var tweenDrift = _.bind(function() {
                if (this.driftEnabled) {
                    
                    var dur = Math.random() * maxDuration,
                        delay = Math.random * maxDelay, 
                        nextDrift = Math.round(maxVariance - (2 * (Math.random() * maxVariance)));
                        
                    TweenLite.to(this, dur, {driftOffset: nextDrift, delay: delay, ease:Back.easeInOut.config(2), onComplete: _.bind(function() {
                        tweenDrift();
                    }, this)});
                }             
            }, this);

            tweenDrift();
        }

    };
    
    SpeedDial.prototype.refresh = function() {

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

        /*
        var clampAngle = Math.min(angle, this.endAngle);
        var clampValue = Math.min(this.value, this.maxValue);
        */
        
        // clear the canvas
        ctx.clearRect(0, 0, this.w, this.h);

        // masked value indicator
        if (val > this.minValue) {
            ctx.save();
            createArcPath(ctx, this.w/2, this.h/2, this.w/2, this.startAngle, angle, this.w/3);
            ctx.clip();
            ctx.drawImage(this.valueImage, 0, 0, this.w, this.h);
            ctx.restore();
        }

        // indicator marks
        ctx.drawImage(this.marksImage, 0, 0, this.w, this.h);

        // pointer
        ctx.save();
        ctx.translate(this.w/2, this.h/2);
        ctx.rotate(toRad(180 + angle));
        ctx.translate(this.w/-2, this.h/-2);
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

    app.controls.SpeedDial = SpeedDial;

})();
