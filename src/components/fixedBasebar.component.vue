<template>
  <div id="basebar-container" class="container" :style="containerStyle">
    <img alt="" :src="firstBlock" class="placeholder"/>
    <div v-for="(b,i) in blocks" v-bind:key="i" class="bb-container">
      <img alt="" class="animating" :src="getImagePath(b)" :class="{active:currentIndex==i}" />
    </div>
  </div>
</template>

<script>
import basebars from "../basebars.json";
import $ from "jquery";
import {debounce} from "lodash";
export default {
  props: ["grid","smallBasebars"],
  data: function() {
    return {
      basebars:[],
      currentIndex: 0,
      containerStyle:{
        height:0
      },
      ratios:{
        tablet:7.992805755395683,
        mobile:4.616306954436451
      }
    };
  },
  watch: {
    grid: {
      immediate: true,
      handler() {
        //this.updateBlocks();
        this.windowResized();
      }
    }
  },
  created(){
    window.addEventListener("resize", debounce(this.windowResized,200));
  },
  mounted() {
    setInterval(this.cycleBasebar, 4000);
    this.windowResized();
  },
  computed:{
    blocks(){
      return this.grid.name == "mobile" ? basebars.mobile : basebars.tablet;
    },
    firstBlock(){
      return this.blocks[0];
    }
  },
  methods: {
    windowResized:function(){
      var bbContainer=$('#basebar-container');
      var w=bbContainer.width();
      var ratio=this.grid.name=="mobile"?this.ratios.mobile:this.ratios.tablet;
      var h=w/ratio;
      this.containerStyle.height=h+"px";
      console.log('basebar container width',w,h);
    },
    getImagePath:function(b){
      return `pngs/${b}`;
    },
    cycleBasebar: function() {
      this.currentIndex++;
      if (this.currentIndex >= this.blocks.length) this.currentIndex = 0;
    },
    updateBlocks: function() {
      this.blocks = this.grid.name == "mobile" ? basebars.mobile : basebars.tablet;
      this.firstBlock=this.blocks[0];
    }
  }
};
</script>

<style scoped>
.container {
  /* position: fixed; */
  bottom: 0;
  width: 100%;
  z-index: 99999;
}
.placeholder{
  object-fit: contain;
  width: 100%;
  visibility: hidden;
}
.container > div{
  /* position: relative; */
}
.container img.animating {
  object-fit: contain;
  width: 100%;
  transform: scaleY(0);
  transform-origin: bottom;
  bottom: 0;
  transition: transform 0.5s;
  position: absolute;
}
.container img.active {
  transform-origin: top;
  transform: scaleY(1);
}
.bb-container{

}
</style>
