<template>
  <div :class="`scroll-bar ${mode}`">
    <div class="scroll-track" ref="track" :style="trackStyle">
      <div class="scroll-thumb" :style="style" ref="scrollThumb" @mousedown="$emit('scrollState', true)"><slot name="thumb-content" /></div>
    </div>
  </div>
</template>

<script>
import ScrollZoom from "@/classes/ScrollZoom";
import Hammer from 'hammerjs';

export default {
  name: "ScrollBar",
  props: {
    mode:{
      type: String,
      default: 'horizontal'
    },
    scroller: {
      type: ScrollZoom
    },
    max:{
      type: Number,
      default: 100
    },
    min:{
      type: Number,
      default: 0
    },
    thumbSize:{
      type: Number,
      default: null
    },
    value:{
      type: Number,
      default: 0
    }
  },
  mounted() {
    const mc = new Hammer(this.$refs.scrollThumb);
    let tempDelta = {x:0, y:0}

    mc.get('pan').set({direction: Hammer[this.axis == 'x'? 'DIRECTION_HORIZONTAL': 'DIRECTION_VERTICAL'], threshold: 0 });

    mc.on('panstart', () => {
      tempDelta.x = 0;
      tempDelta.y = 0;
      this.$emit('scrollState', true);
    })

    mc.on('panend pancancel', () => {
      this.$emit('scrollState', false);
    })

    mc.on('pan', (e) => {
      if(!this.$refs.track)return;
      const dist = this.max - this.min;
      const track = this.$refs.track.getBoundingClientRect();
      const movement = e['delta' + this.axis.toUpperCase()] - tempDelta[this.axis];

      tempDelta.x = e.deltaX;
      tempDelta.y = e.deltaY;

      const pDist = movement/track[this.axis === 'x'? 'width': 'height']

      //console.log('pDist:', pDist, '   dist:', dist);

      const scroll = {};
      scroll[`+${this.axis}`] = -dist * pDist;
      this.$emit('change', scroll);

    })
  },

  computed:{
    axis() {
      return this.mode == 'horizontal'? 'x':'y';
    },
    style(){
      const val = ((this.value - this.min) / (this.max - this.min)) * 100;
      const axis = this.mode == 'horizontal'? 'left':'top';
      const style = {};

      style[axis] = `${val}%`;

     /*if(this.thumbSize) {
        const wh = {'horizontal': 'width', 'vertical': 'height'};
        const trackPerc = this.thumbSize;
        const percDiff = 100 - trackPerc;
        const thumbPerc = 100 * percDiff;
        style[wh[this.mode]] = `${ thumbPerc }%`;
      }*/


      return style;
    },

    trackMargin () {
        if(this.thumbSize) {
          return this.thumbSize / 2;
        }
        return 135
    },

    trackStyle() {
      const style = {};
      /*if(this.mode === 'vertical') {
        style['top'] = `${this.trackMargin}%`;
        style['bottom'] = `${this.trackMargin}%`;
      } else {
        style['left'] = `${this.trackMargin}%`;
        style['right'] = `${this.trackMargin}%`;
      }*/

      return style;
    }
  }
}
</script>


<style>
  :root {
    --scroll-bar-width: 28px;
    --scroll-bar-thumb-size: 135px;
    --scroll-bar-track-margin: 67.5px;
  }
</style>

<style scoped lang="scss">
  .scroll-bar{
    position:absolute;
    /*border: solid 1px #545454;*/
    background-color: rgba(255,255,255, 0.2);
    display: none;
    pointer-events: none;
    &.active{
      display: block;
      transition: all 0.3s;
      transition-delay: 2s;
    }

    /*z-index:99999;*/
    transform: translateZ(0px);
    opacity: 0;
    &:hover, &.show{
      transition-delay: unset;
      opacity: 1;
    }

    .scroll-track{
      position: absolute;

    }
    &.horizontal {
      left: 0px;
      right: 0px;
      bottom: 0px;
      width: 100%;
      height: var(--scroll-bar-width);


      .scroll-track {
        height: inherit;
        top:0px;
        left: var(--scroll-bar-track-margin);
        right: var(--scroll-bar-track-margin);
        pointer-events: none;
      }
      .scroll-thumb{
        height: inherit;
        width: var(--scroll-bar-thumb-size);
        transform: translateX(-50%);
        pointer-events: all;
      }
    }
    &.vertical {
      right: 0px;
      top:0px;
      bottom: 0px;
      width: var(--scroll-bar-width);
      height: 100%;
      pointer-events: all;
      pointer-events: all;

      .scroll-track {
        width: inherit;
        left:0px;
        top: var(--scroll-bar-track-margin);
        bottom: var(--scroll-bar-track-margin);
      }

      .scroll-thumb{
        height: var(--scroll-bar-thumb-size);
        width: inherit;
        transform: translateY(-50%);
      }
    }

    .scroll-thumb{
      position:absolute;
      background-color: var(--primary-color);
      color: var(--primary-text-color);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
      border-radius: 4px;
      /*transition: all 0.2s;*/
    }


  }



</style>
