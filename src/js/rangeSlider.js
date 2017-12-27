let that;

class CustomRangeSlider {
    constructor(id, valueList = [], callback, min = 0, max = 100) {
        this.id = id;
        this.valueList = valueList;
        this.min = min;
        this.max = max;
        this.callBack = callback;
        that = this;
        this.setup();
    }

    setup() {
        that.slider = document.getElementById(this.id);
        const sliderTemplate = "<div id='" + this.id + "thumb' class='slider-thumb'></div><div id='" + this.id + "track' class='slider-runnable-track'></div><div id='" + this.id + "fill' class='slider-fill'></div>"
        that.slider.innerHTML = sliderTemplate;
        that.thumb = document.getElementById(this.id + 'thumb');
        that.sliderFill = document.getElementById(this.id + 'fill');
        this.addEvents();
        that.mouseDown = false;
    }

    addEvents() {

        if('ontouchstart' in window){
            that.slider.addEventListener('touchstart', this.onMouseDown, false);
            that.slider.addEventListener('touchmove', this.onMouseMove, false);
            that.slider.addEventListener('touchend', this.onMouseUp, false);
        }else if(window.navigator.msPointerEnabled){
            that.slider.addEventListener('MSPointerDown', this.onMouseDown, false);
            that.slider.addEventListener('MSPointerMove', this.onMouseMove, false);
            that.slider.addEventListener('MSPointerUp', this.onMouseUp, false);
        }else if(window.PointerEvent){
            that.slider.addEventListener('pointerdown', this.onMouseDown, false);
            that.slider.addEventListener('pointermove', this.onMouseMove, false);
            that.slider.addEventListener('pointerup', this.onMouseUp, false);
        }else {
            that.slider.addEventListener('mousedown', this.onMouseDown, false);
            that.slider.addEventListener('mousemove', this.onMouseMove, false);
            that.slider.addEventListener('mouseup', this.onMouseUp, false);
        }
    }

    onMouseDown(e) {
        e.stopImmediatePropagation();
        that.sliderOffsetLeft = that.getOffsetLeft(that.slider).left;
        that.sliderOffsetWidth = that.slider.offsetWidth;
        that.thumbWidth = that.thumb.offsetWidth / that.slider.offsetWidth * 100 / 2;
        that.mouseDown = true;
    }

    onMouseMove(e) {
        //e.stopImmediatePropagation();
        if (!that.mouseDown) return;
        let X = e.clientX || e.targetTouches[0].pageX;
        let pecentLeft = that.calculateLeftValueInPercentage(X);
        if (pecentLeft >= 0 && pecentLeft <= 100) {
            that.thumb.style.left = that.calculateLeftValueInPercentage(X) + '%';
        }
    }

    calculateLeftValueInPercentage(clientX) {
        return Math.abs([(clientX - that.sliderOffsetLeft) / that.sliderOffsetWidth] * 100) - that.thumbWidth;
    }

    onMouseUp(e) {
        e.stopImmediatePropagation();
        that.mouseDown = false;
        if(that.callBack)that.callBack(that.valueList.toString());
    }

    getOffsetLeft(element) {
        let x = 0;
        while (element && !isNaN(element.offsetLeft) && element.offsetLeft > 0) {
            x = element.offsetLeft - element.scrollLeft;
            element = element.offsetParent;
        }
        return { left: x };
    }

    findClosestValueFromArray(val,array){
        let minDiff = val - array[0];
        let closest = 0;
        for (let i = 1; i < array.length; i++) {
            let diff = Math.abs(val - array[i]);
            if (diff < minDiff) {
                minDiff = diff;
                closest = i;
            }
        }
        return closest;
    }
}