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
        that.setupSliderWithValueList();
        that.addEvents();
        that.mouseDown = false;
        that.initSlider();
    }

    getThumbWidth(){
        return that.thumb.offsetWidth / that.slider.offsetWidth * 100 / 2;
    }

    setupSliderWithValueList(){
        that.pointsList = [];
        let diff = Math.floor(100/(that.valueList.length-1));
        that.thumbWidth = that.getThumbWidth();
        for(var i=0;i<that.valueList.length;i++){
            that.pointsList.push((diff)*i-that.thumbWidth);
        }
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

    initSlider(val){
        that.currentIndex = that.valueList.indexOf(val) || 0;
        that.currentIndex = that.currentIndex < 0 ? 0 : that.currentIndex;
        that.position =  that.pointsList[that.currentIndex];
        that.thumb.style.left = that.pointsList[that.currentIndex]+'%';
        that.sliderFill.style.width = that.pointsList[that.currentIndex]+'%';
    }

    onMouseDown(e) {
        e.stopImmediatePropagation();
        let X = e.clientX || e.targetTouches[0].pageX;
        that.sliderOffsetLeft = that.getOffsetLeft(that.slider).left;
        that.sliderOffsetWidth = that.slider.offsetWidth;
        that.thumbWidth = that.getThumbWidth();
        that.mouseDown = true;
    }

    onMouseMove(e) {
        //e.stopImmediatePropagation();
        if (!that.mouseDown) return;
        let X = e.clientX || e.targetTouches[0].pageX;
        that.update(X);
        that.currentIndex = that.findClosestValueFromArray(that.position, that.pointsList);
        that.callBack(that.pointsList[that.currentIndex],that.currentIndex);
        //that.updateThumbPositionAndFillSlider();
        that.sliderMove = true;
    }

    calculateLeftValueInPercentage(clientX) {
        return Math.abs([(clientX - that.sliderOffsetLeft) / that.sliderOffsetWidth] * 100) - that.thumbWidth;
    }

    onMouseUp(e) {
        e.stopImmediatePropagation();
        let X = e.clientX || e.targetTouches[0].pageX;
        that.mouseDown = false;
        that.sliderMove = false;
        that.update(X);
        that.updateThumbPositionAndFillSlider();
    }

    getOffsetLeft(element) {
        let x = 0;
        while (element && !isNaN(element.offsetLeft) && element.offsetLeft > 0) {
            x = element.offsetLeft - element.scrollLeft;
            element = element.offsetParent;
        }
        return { left: x };
    }

    update(x){
        that.position= x - that.sliderOffsetLeft;
        if(that.slider.getBoundingClientRect().x) that.position = Math.round((that.position/ that.slider.getBoundingClientRect().width)*100);
        else that.position = Math.round((that.position/ that.slider.offsetWidth)*100);
        //that.position-= that.thumbWidth;

        if(that.position<0 || that.position>100){
            that.updateThumbPositionAndFillSlider();
            return;
        }
        that.thumb.style.left = that.position+'%';
        that.sliderFill.style.width = that.position+'%'
    }

    updateThumbPositionAndFillSlider(){
        that.currentIndex = that.findClosestValueFromArray(that.position, that.pointsList);
        that.thumb.style.left = that.pointsList[that.currentIndex]+'%';
        that.sliderFill.style.width = that.pointsList[that.currentIndex]<0?0:that.pointsList[that.currentIndex]+'%';
        that.callBack(that.pointsList[that.currentIndex],that.currentIndex);
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