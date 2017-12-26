let that;

class CustomRangeSlider {
    constructor(id, valueList = [], min = 0, max = 100) {
        this.id = id;
        this.valueList = valueList;
        this.min = min;
        this.max = max;
        that = this;
        this.setup();
    }

    setup() {
        that.slider = document.getElementById(this.id);
        const sliderTemplate = "<div id='" + this.id + "thumb' class='slider-thumb'></div><div id='" + this.id + "track' class='slider-runnable-track'></div><div id='" + this.id + "fill' class='slider-fill'></div>"
        that.slider.innerHTML = sliderTemplate;
        that.thumb = document.getElementById(this.id + 'thumb');
        this.addEvents();
        that.mouseDown = false;
    }

    addEvents() {
        that.slider.addEventListener('mousedown', this.onMouseDown, false);
        that.slider.addEventListener('mousemove', this.onMouseMove, false);
        that.slider.addEventListener('mouseup', this.onMouseUp, false);
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
        let pecentLeft = that.calculateLeftValueInPercentage(e.clientX);
        if (pecentLeft >= 0 && pecentLeft <= 100) {
            that.thumb.style.left = that.calculateLeftValueInPercentage(e.clientX) + '%';
        }
    }

    calculateLeftValueInPercentage(clientX) {
        return Math.round([(clientX - that.sliderOffsetLeft) / that.sliderOffsetWidth] * 100) - that.thumbWidth;
    }

    onMouseUp(e) {
        e.stopImmediatePropagation();
        that.mouseDown = false;
    }

    getOffsetLeft(element) {
        let x = 0;
        while (element && !isNaN(element.offsetLeft) && element.offsetLeft > 0) {
            x = element.offsetLeft - element.scrollLeft;
            element = element.offsetParent;
        }
        return { left: x };
    }
}