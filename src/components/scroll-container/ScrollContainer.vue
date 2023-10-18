<template>
  <div ref="container" class="scroll-container" tabindex="0"
       v-on:keydown.left="eventScroll({'+x': 300}, $event)"
       v-on:keydown.right="eventScroll({'-x': 300}, $event)"
       v-on:keydown.up="eventScroll({'+y': 300}, $event)"
       v-on:keydown.down="eventScroll({'-y': 300}, $event)"
       @keydown.-="zoomOut"
       @keyup.187="zoomIn"
       @keyup.61="zoomIn"
       @keyup.107="zoomIn"
       @keydown.91="handleCmd($event)"
       @keydown.93="handleCmd($event)"
       @keydown.224="handleCmd($event)"
  >
    <div class="touch-layer" :class="isScrolling? 'scrolling':''" ref="touchLayer">
      <div class="scroll-item" ref="content">
        <slot/>
      </div>
    </div>

    <scroll-bar v-if="enableScrollBars" :class="{ show: showScrollBar, active: !!Math.round(maxScrollX) }" mode="horizontal" :max="maxScrollX"
                :value="scrollX" @change="onScrollChange" @scrollState="handleScrollState" :thumb-size="xViewPerc">
      <template #thumb-content>
        <slot name="scroll-thumb-x"/>
      </template>
    </scroll-bar>
    <scroll-bar v-if="enableScrollBars" :class="{ show: showScrollBar, active: !!Math.round(maxScrollY) }" mode="vertical" :max="maxScrollY" :value="scrollY"
                @change="onScrollChange" @scrollState="handleScrollState" :thumb-size="yViewPErc">
      <template #thumb-content>
        <slot name="scroll-thumb-y"/>
      </template>
    </scroll-bar>


    <span :class="{'arrow horizontal left': true, 'is-visible': leftArrowVisible && enableScrollButtons }" @click="scrollLeft"></span>
    <span :class="{'arrow horizontal right': true, 'is-visible': rightArrowVisible && enableScrollButtons }" @click="scrollRight"></span>

    <span :class="{'arrow vertical up': true, 'is-visible': upArrowVisible && enableScrollButtons }" @click="scrollUp"></span>
    <span :class="{'arrow vertical down': true, 'is-visible': downArrowVisible && enableScrollButtons }" @click="scrollDown"></span>


    <!-- <div v-if="scrollToTopVisible && enableScrollToTopButton" class="toTheTop" @click="scrollToTop"/> -->
    <span v-if="this.language === 'en'">
    <div v-if="scrollToTopVisible && enableScrollToTopButton" class="toTheTop" @click="scrollToTop"/>
    </span>
    <span v-else>
    <div v-if="scrollToTopVisible && enableScrollToTopButton" class="toTheTopFr" @click="scrollToTop"/>
    </span>
  </div>
</template>

<script>

const mounted = [];

import ScrollZoom from "@/classes/ScrollZoom";
import ScrollBar from "@/components/scroll-container/ScrollBar";
import {mapActions, mapGetters, mapState} from "vuex";

export default {
  name: "ScrollContainer",
  components: {ScrollBar},
  props: {
    orientation: {
      type: String,
      default: () => {
        return 'horizontal'
      }
    },
    maxWidth:{
      type: Number,
      default: () => {
        return 900
      }
    },
    align:{
      type: String,
      default: () => {
        return 'center'
      }
    },
    zoomLevel: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    syncGlobalZoom: {
      type: Boolean,
      default: true
    },
    scale: {
      type: [Number, String],
      default: null
    },
    fitAxis: {
      type: String,
      default: () => {
        return null;
      }
    },
    enableScrollBars:{
      type: Boolean,
      default: true
    },
    enableScrollButtons:{
      type: Boolean,
      default: true
    },
    enableScrollToTopButton:{
      type: Boolean,
      default: true
    },
    scrollBarAutoSize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      maxScrollX: 0,
      maxScrollY: 0,
      scrollX: 0,
      scrollY: 0,
      isScrolling: false,
      showScrollBar: false,
      contentHeight: 0,
      contentWidth: 0,
      viewHeight: 0,
      viewWidth: 0,
      tid: null,
      timeout: null
    }
  },
  mounted() {
    mounted.push(this);

    this._sz = new ScrollZoom(this);
    this._sz.fitAxis = this.fitAxis;
    this._sz.zoom = this.zoomLevel;
    this._sz.maxWidth = this.maxWidth;
    this._sz.align = this.align;

    this.contentHeight = this._sz.content.offsetHeight;
    this.contentWidth = this._sz.content.offsetWidth;

    this.viewHeight = this._sz.getViewHeight();
    this.viewWidth = this._sz.getViewWidth();

    this.$refs.content.addEventListener('transitionend', (e)=> {

      if(e.target == this.$refs.content){
        this.$emit('change', this);
      }

    })

    this._sz.update();
    //this.updateScale(this._sz.getScale());


    setTimeout(() => {
      this.scroll({y:0, x: 0});
      this.$emit('ready', this);
    }, 10)



    //console.log('Mounted ScrollContainers:', mounted);
  },

  beforeDestroy() {
    const index = mounted.findIndex((item) => {
      return item._uid == this._uid
    })
    if(index >= 0){
      mounted.splice(index, 1)
    }

    this._sz.destroy();
    //console.log('UnMounted ScrollContainers:', mounted);
  },

  methods: {
    ...mapActions('scale', ['zoomIn', 'zoomOut', 'updateScale', 'setZoomLevel']),
    ...mapActions('screen', ['handleWindowResize']),

    handleCmd(e) {
      console.log("called handleCmd, you presed", e.keyCode);
      if (e.keyCode == 187 && e.metaKey) {
        console.log("pressed command + key on mac", e.keyCode);
        this.zoomIn();
      } else if ((e.keyCode == 189 && e.metaKey)) {
        console.log("pressed command - key on mac", e.keyCode);
        this.zoomOut();
      }
    },

    onChange(scroller, events) {
      //console.log('ScrollContainer Event:', scroller)
      this.maxScrollX = scroller.getScrollMaxX();
      this.maxScrollY = scroller.getScrollMaxY();
      this.scrollX = scroller.getScrollX();
      this.scrollY = scroller.getScrollY();

      this.contentHeight = this._sz.content.offsetHeight;
      this.contentWidth = this._sz.content.offsetWidth;

      this.viewHeight = this._sz.getViewHeight();
      this.viewWidth = this._sz.getViewWidth();

      if (events.touchstart) {
        this.isScrolling = true;
      }

      if (this.isScrolling) {
        delete events.resize;
      }

      if (events.touchend) {
        this.isScrolling = false;
      }

      if(events.wheelScroll){
       // const e = events.wheelScroll;
       // const pr = window.devicePixelRatio;
        // console.log((Math.abs(e.deltaX) > pr) || (Math.abs(e.deltaY) > pr))
        // console.log('Wheel Scroll:', events.wheelScroll);
       // this.isScrolling = (Math.abs(e.deltaX) > pr) || (Math.abs(e.deltaY) > pr);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isScrolling = false;
        }, 250);
        this.isScrolling = true;
      }

      if(events.momentum){
        this.isScrolling = true;
      }




      this.$emit('change', this);

      for (let p in events) {
        this.$emit(p, this);
        switch(p){
	        case 'resize':
						//TODO - Investigate why this was needed, (removed to see what breaks)
            //this.handleWindowResize();
          break;
          case 'zoom':
            //this.setZoomLevel(this._sz.zoom);
          break;
          case 'pinchend':
           // console.log('Pinch End Updating Scale')
            if(this.syncGlobalZoom)this.setZoomLevel(this._sz.zoom);
            this._sz.zoom = this.zoomLevel;
            this._sz.update();
            this.updateScale(this._sz.getScale());
          break;
        }
      }
      this.showScrollBar = true;
      clearTimeout(this.scrollBarTimeoutID);
      this.scrollBarTimeoutID = setTimeout(() => {
        this.showScrollBar = false;
      }, 500);

      if(!this.additionalItemInputFocus && !this.emailInputFocus && !this.showSideBar){
        this.focus();
      }

      //console.log('maxScrollY:', this.maxScrollY, '   scrollY:', this.scrollY)

    },

    onScrollContainerZoom(scroller){
      if(this.syncGlobalZoom)this.setZoomLevel(scroller.zoom);
    },

    onScrollChange(delta) {
      //console.log('onScrollChange Delta:', delta);
      this._sz.applyTransform(delta);
    },

    eventScroll(scroll, e){

      const prevent = () => {
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        return false;
      }
      this.scroll(scroll);
      if(this.scrollY != 0 && this.scrollY != this.maxScrollY){
        return prevent();
      }
    },

    scroll(scroll) {
      this._sz.velocity = null;
      this.isScrolling = false;
      this._sz.applyTransform(scroll);
    },
    getScroll() {
      return {x: this._sz.getScrollX(), y: this._sz.getScrollY()};
    },
    getController() {
      return this._sz;
    },
    getMaxScroll() {
      return {x: this._sz.getScrollMaxX(), y: this._sz.getScrollMaxY()};
    },

    handleScrollState(state) {
      //console.log('handleScrollState:', state)
      this._sz.enabled = !state;
      this.isScrolling = state;

      //this.$refs.container.focus();

    },

    scrollLeft () {
      this.scroll({'+x': 300});
    },
    scrollRight () {
      this.scroll({'+x': -300});
    },

    scrollUp () {
      this.scroll({'+y': 300});
    },

    scrollDown () {
      this.scroll({'+y': -300});
    },


    scrollToTop(){
      this.scroll({y:0});
    },

    focus(){
      this.$refs.container.focus();
      // console.log('flyer focussed')
    },

    getContainerDom(){
      return this.$refs.container;
    }


  },
  computed: {
    //...mapState('scale', ['zoomLevel']),
    ...mapState(['searchInputFocused','showSideBar']),
    ...mapState('shoppingList',['additionalItemInputFocus','emailInputFocus']),
     ...mapState(['columnView', 'currentStore', 'pdf']),
	  ...mapGetters(['language']),
    /*fitAxis() {
      return this.orientation == 'horizontal' ? 'y' : 'x';
    },*/


    leftArrowVisible() {
      return this.scrollX > 0 && this.maxScrollX;
    },

    rightArrowVisible() {
      return this.scrollX < this.maxScrollX;
    },

    upArrowVisible(){
      return this.scrollY > (1 / devicePixelRatio);
    },

    downArrowVisible(){
      return (this.scrollY < this.maxScrollY);
    },

    scrollToTopVisible(){
      return this.scrollY > 0 && this.orientation == 'vertical';
    },
    xViewPerc() {
      return (this.viewWidth / this.contentWidth) * 100;
    },
    yViewPErc() {
      return (this.viewHeight / this.contentHeight) * 100;
    }

  },

  watch: {
    orientation() {
      this._sz.fitAxis = this.fitAxis;
      /*if(val == 'horizontal'){
        this._sz.setScrollX( -this.scrollY )
      } else {
        this._sz.setScrollY( -this.scrollX )
      }*/
      this._sz.update();
    },
    zoomLevel(val) {
      //console.log('Watch Zoom Level', val)
      this._sz.zoom = val;
      this._sz.update();
      //this.updateScale(this._sz.getScale());
    },
    maxWidth(val){
      this._sz.maxWidth = val;
      this._sz.update();
    },
    // searchInputFocused(val){
    //   if(!val){
    //     this.focus();
    //   }
    // },
    align(val){
      this._sz.align = val;
      this._sz.update();
    }
  }

}
</script>


<style scoped>

.scroll-container:focus{
  outline: none;
}

.scroll-container{
  min-height: 10px;
}

.toTheTop {
  display: block;
  width: 90px;
  height: 90px;
  background: url('/images/back-tothe-top-mobile.png') no-repeat center 45%;
  background-size: 77% auto;
  position: absolute;
  /* right: 45px; */
  bottom: 20px;
  cursor: pointer;
  filter: drop-shadow(2px 4px 6px black);
  opacity: 0.9;
  cursor: pointer;
  z-index: 5;
}

.toTheTopFr {
  display: block;
  width: 90px;
  height: 90px;
  background: url('/images/back-tothe-top-mobile-fr-png.png') no-repeat center 45%;
  background-size: 68% auto;
  position: absolute;
  /* right: 45px; */
  bottom: 20px;
  cursor: pointer;
  filter: drop-shadow(2px 4px 6px black);
  opacity: 0.9;
  cursor: pointer;
  z-index: 5;
}

@media screen and (max-width: 628px) {
  .arrow {
    display: none;
  }

  .scroll-bar.horizontal {
    display: none;
  }
}

@media screen and (min-width: 628px) {
  .toTheTop {
    display: none;
  }
  .toTheTopFr {
    display: none;
  }
}

@media screen and (min-width: 1256px) {
  .toTheTop {
    display: none;
  }
  .toTheTopFr {
    display: none;
  }
}

.arrow {
  position: absolute;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  opacity: .4;
  transition: opacity 200ms, filter 100ms;
  /*box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.5);*/
  filter: drop-shadow(0px 0px 0px #222);
  cursor: pointer;
  display: none;
}

.arrow.is-visible{
  display: block;
}

.arrow:hover{
  opacity: 0.9;
  filter: drop-shadow(3px 2px 3px #222);
}

.arrow:active{
  filter: drop-shadow(0px 0px 0px #222);
}

.arrow.horizontal{
  top: 50%;
  transform: translateY(-50%);
}

.arrow.vertical{
  left: 50%;
  transform: translateX(-50%);
}

.arrow.left {
  background-image: url("/images/moveleft-arrow-desktop.png");
  left: 35px;
}

.arrow.right {
  background-image: url("/images/moveright-arrow-desktop.png");
  right: 35px;
}

.arrow.up {
  background-image: url("/images/moveleft-arrow-desktop.png");
  transform: rotate(90deg) translateY(-50%);
  transform-origin: top left;
  top: 35px;
}

.arrow.down {
  background-image: url("/images/moveleft-arrow-desktop.png");
  transform: rotate(-90deg) translateY(50%);
  transform-origin: bottom left;
  bottom: 35px;
}

.scroll-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.scroll-item {
  width: max-content;
  height: max-content;
  transform: translateZ(0px);
  transition: transform 0.3s;
  transform-origin: top left;
}

.scrolling .scroll-item {
  transition: none;
  pointer-events: none;
  touch-action: none;
}

.scroll-container * {
  -webkit-backface-visibility: hidden;
}

.touch-layer {
  position: relative;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  height: 100%;
}


</style>
