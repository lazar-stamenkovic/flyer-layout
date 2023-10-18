<template>
  <div class="page-number-container" :class="{ 'visible': scrolling }">
    <div class="text">PAGE</div>
    <div class="text">{{currentPage}} / {{totalPages}}</div>
  </div>
</template>

<script>
//import debounce from 'lodash/debounce';
//import $ from "jquery";
import { mapState, mapGetters } from 'vuex';
export default {
  name: "PageNumber",
  data() {
    return {
      scrolling: false,
      timer: undefined,
      pNumber:1,
      perPageWidth:880,
      currentPage: 1
    };
  },
  computed:{
    ...mapState(['columnView']),
    ...mapGetters('screen', ['totalPages', 'flyerOrientation']),

  },
  created() {

  },
  mounted(){
    document.querySelector('.grid-container').addEventListener('scroll', this.scrolled);
    //$(".grid-container").scroll(this.scrolled);
    /*setTimeout(() => {
      Page.UpdatePageBounds();
      this.totalPages = Page.GetTotalPages();
    }, 500);*/

  },

  beforeDestroy() {
    document.querySelector('.grid-container').removeEventListener('scroll', this.scrolled);
  },

  methods: {
    scrolled: function() {

      const container = document.getElementsByClassName('grid-container')[0];

      if(container){
        this.$emit('scrolled', container);
        const totalPages = this.totalPages;
        const pageMode = this.flyerOrientation;
        const containerBounds = container.getBoundingClientRect();

        const bhw = (pageMode == 'vertical'? 'height':'width');

        const scrollMax = container[bhw == 'height'? 'scrollHeight': 'scrollWidth'];
        const containerMax = containerBounds[bhw];

        const maxLeft = scrollMax  - containerMax;
        this.currentPage = Math.round((container[bhw == 'height'? 'scrollTop': 'scrollLeft'] / maxLeft) * totalPages) || 1;
      }


      //this.currentPage = Page.GetCurrentPage(this.totalPages);
      /*var left = $(".grid-container").scrollLeft();
      var totalWidth=$("#resp-grid")[0].getBoundingClientRect().width;
      var transform=$("#resp-grid").css("transform");
      console.log('transfomr',transform);
      var scale=Number.parseFloat(transform.match(/matrix\(([0-9\.]+)/)[1]);
      console.log('scale',scale);
      var perPageWidth=1408*scale;
      console.log('perPageWidth/TotalWidth',perPageWidth, totalWidth);
      console.log("scrolled", left);
      this.pNumber=Math.floor(left/perPageWidth)+1;*/
      if (this.timer) clearTimeout(this.timer);
      this.scrolling=true;
      this.timer=setTimeout(()=>{
          this.scrolling=false;
      },1500);
    }
  }
};
</script>

<style scoped>
.page-number-container {
  display: inline-block;
  width: 130px;
  height: 100px;
  background-color: rgb(35, 31, 32);
  position: absolute;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%) translateZ(0px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: 0.5s opacity;
  z-index:999;
}
.page-number-container.visible {
  opacity: 0.75;
}
.text {
  color: white;
}

@media screen and (max-width: 628px) {
  .page-number-container {
    bottom: 5%;
  }
}

@media (max-width: 800px) {

  .page-number-container{
   /* display: none;*/
  }
}
</style>
