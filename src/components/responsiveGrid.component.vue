<template>
  <div
    class="responsive-grid"
    :class="{'update':zIndex, 'update2':!zIndex, 'column-view': columnView}"
    :flyer-orientation="flyerOrientation"
    :style="currentGridStyle"
  >
    <flyer-section v-for="(p,i) in flyerPages"
                   :key="p.id + '_' + i"
                   :page="p"
                   :prevDocumentName="i > 0 ? flyerPages[i - 1].documentName : null"
                   :device="displayMode"
                   :index="i"
                   :root-scroll-container="rootScrollContainer"
    ></flyer-section>
    <!-- div class="trans-dot" :style="dotStyle"></div -->
  </div>
</template>

<script>

// import $ from "jquery";
//import { debounce } from "lodash";
import FlyerSection from "./flyerSection.component.vue";
//import Page from "@/classes/Page";
import {mapState, mapGetters} from 'vuex';
export default {
  components: {
    FlyerSection,
  },
  props: [
    "flyerPages",
    "rootScrollContainer"
  ],

  computed: {
    ...mapState(['columnView']),
    ...mapGetters('screen', ['displayMode', 'flyerOrientation']),

    pageCount(){
      return this.flyerPages.length;
    },

    currentGrid() {
      switch (this.displayMode){
        case 'mobile':
          return this.gridPhone;
        break;

        case 'tablet':
          return this.gridTablet;
        break;
      }
      return this.gridDesktop;
    },

    currentLayoutDirection(){
      return this.flyerOrientation == 'vertical'? this.LayoutDirections.VERTICAL : this.LayoutDirections.HORIZONTAL;
    },

    dotStyle(){
      return {
        top: '20px',
        left: `${this.dotLeft}px`
      }
    },

    currentGridStyle: function () {
      const styles = {
        0: {
          gridTemplateColumns: `repeat(${this.flyerPages.length},max-content)`
        },
        1: {
          gridTemplateRows: `repeat(${this.flyerPages.length},max-content)`
        }
      };
      return styles[this.currentLayoutDirection];
    },

    narrowBroadOffset() {
      // TODO: if this is a narrow broad ratio flyer
      return this.size.outerWidth < 930 ? 0 : -0.5;
    }
    /*gridStyles:function(){
      return {
        0: {
          gridTemplateColumns: `repeat(${this.flyerPages.length},max-content)`,
          transform:`scale(${this.currentScale})`
        },
        1: {
          gridTemplateRows: `repeat(${this.flyerPages.length},max-content)`,
          transform:`scale(${this.zoomLevel + this.mobileGridDefaultScale})`
        }
      };
    },
    currentDevice: function () {
      //Page.SetMode(this.currentGrid.name);
      //Page.UpdatePageBounds();
      return this.currentGrid.name;
    },*/
  },

  data: function () {
    return {
      LayoutDirections: {
        HORIZONTAL: 0,
        VERTICAL: 1,
      },
      //currentLayoutDirection: 0,
      // gridStyles: {
      //   0: {
      //     gridTemplateColumns: `repeat(${this.flyerPages.length},max-content)`,
      //     transform:`scale(${this.gridScale})`
      //   },
      //   1: {
      //     gridTemplateRows: `repeat(${this.flyerPages.length},max-content)`,
      //     transform:`scale(${this.gridScale})`
      //   },
      // },
      allBlocks: [],
      activeSearch: false,
      blocksWithoutBasebars: [],
      blocks: [],
      winWidth: undefined,
      winHeight: undefined,
      pxRatio: 1,
      gridDesktop: undefined,
      gridPhone: undefined,
      gridTablet: undefined,
      gridWidth: undefined,
      zIndex: false,
      visibleBlocks: [],
      /*currentGrid: {
        name: "desktop",
      },*/
      desktopGridDefaultScale: 1,
      mobileGridDefaultScale: 1,
      gridScale: 0,
      gridStyle2: {
        transform: "",
        width: "",
      },
      fixedBasebars: [],
      gridPadding: {
        top: 25,
        left: 0,
      },
      blockSize: {
        width: 281,
        height: 267,
      },
      dotLeft: 0
    };
  },
  mounted() {
    this.createDesktopGrid();
    // console.log("gridDesktop", this.gridDesktop);
    this.createPhoneGrid();
    // console.log("gridPhone", this.gridPhone);
    this.createTabletGrid();
    // console.log("gridTablet", this.gridTablet);

    /*const container = document.querySelector('.grid-container');
    const clipper = document.querySelector('.grid-scale-clipper');
    const grid = document.querySelector('#resp-grid');

    container.addEventListener('scroll', () => {
      const clipperLeft = clipper.getBoundingClientRect().left;
      const gridLeft = grid.getBoundingClientRect().left;
      const origin = (Math.abs( clipperLeft ) + (clipperLeft - gridLeft) +  window.innerWidth/2) * (1 / this.currentScale);
      this.dotLeft = origin;
      //this.$store.commit('scale/SET_TRANSFORM_ORIGIN', origin);
      //console.log('GridLeft Diff:', clipperLeft - gridLeft);
      //grid.style.left = (clipperLeft - gridLeft) + 'px';
    })*/


    //  this.windowResized();
    //let targetGrid = this.selectGrid();
    //this.currentGrid = targetGrid;

    /*setTimeout(() => {
      this.desktopGridDefaultScale = Page.GetBaseScale();
    }, 100)*/

    // this.switchGrid(targetGrid, false);

    // window.addEventListener("resize", debounce(this.windowResized,200));
  },
  methods: {

    createDesktopGrid: function () {
      this.gridDesktop = this.createGrid("desktop", 5, 5, 0, 0);
    },
    createPhoneGrid: function () {
      this.gridPhone = this.createGrid("mobile", 0, 3, 600, 1);
    },
    createTabletGrid: function () {
      this.gridTablet = this.createGrid("tablet", 0, 5, 800, 1);
      // this.gridTablet = this.createGrid("tablet", 0, 5, 1600, 1);
    },
    createGrid: function (
      name,
      rowsPerGroup,
      countPerRow,
      breakpoint,
      direction
    ) {
      let g = [];
      let columnCount =
        direction == 0 ? countPerRow * this.pageCount : countPerRow;
      if (rowsPerGroup == 0) rowsPerGroup = this.blocks.length;
      // console.log("rows per group", rowsPerGroup);
      for (let i = 0; i < rowsPerGroup; i++) {
        g[i] = [];
        for (let j = 0; j < columnCount; j++) g[i][j] = -1;
      }
      return {
        name: name,
        breakpoint: breakpoint,
        layout: g,
        rowsPerGroup: rowsPerGroup,
        countPerRow: countPerRow,
        direction: direction,
      };
    },

    isMobile: function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
  },
};
</script>

<style>
.responsive-grid {
  width: fit-content;
  transform-origin: top left;
  background-color: #fff;
  /* transition: transform 0.2s; */
  /* overflow: auto; */
  position: relative;
  /* height: 100%; */
  /*top: -13px;*/
  /* top: 0; */
  display: grid;
  column-gap: 20px;
  /* row-gap: 20px; */
  transition: 0.2s transform;
}
.section-container {
  /* box-shadow:0 0 10px rgba(0,0,0,0.5); */
}
.padding-filler {
  position: relative;
}

.column-view {
  /* max-width: 1200px; */
  margin: 0 auto;
  width: 100%;
}

.trans-dot{
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: red;
  border: solid 2px #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

@media screen and (min-width: 628px) {
  .responsive-grid {
    /*top: -13px;*/
    /* top: -12px; */
  }
}
@media screen and (min-width: 1256px) {
  .responsive-grid {
    /*top: -15px;*/
  }
}
</style>
