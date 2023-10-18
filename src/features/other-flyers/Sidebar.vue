<template>
  <div v-if="enabled" v-click-outside="onClickOutside">
    <span class="pull-button"
          v-tooltip="{ content: getTooltip}"
          data-tour-item="sidebar"
          :class="{expanded:showSideBar, 'showFilters':showFilters, fr:this.language=='fr' }"
          @click="toggleSidebar"
          v-on:keydown.enter="toggleSidebar"
          v-on:keydown.space="toggleSidebar"
          tabindex="0"
          aria-label="Sidebar Pull Button"
    >

       <span class="flyericon-text" :class="{fr:language=='fr'}">
          <img src="/images/icon-flyer.svg" class="flyer-book" width="22px" height="22px" :alt="showSideBar ? content.closeSideBar : content.openSideBar" />
         <span class="seeOtherFlyers">{{content.seeOtherFlyers}}</span>
       </span>
        <img src="/images/right-arrow-only.svg" class="arrow" :class="{expanded:showSideBar, fr:this.language=='fr'}" width="12px" height="12px" :alt="showSideBar ? content.closeSideBar : content.openSideBar" />
    </span>

    <div class="sidebar" :class="{expanded:showSideBar}" ref="sidebar" >
      <div class="sidebar-content">
        <h4 class="more-publications">{{  content.flyerList }}</h4>

        <PublicationPreview
            v-for="pub in flyers"
            :key="pub.id"
            :preview="pub.flyerType === 'preview'"
            :src="pub.thumbnail"
            :flyerId="pub.title"
            :isActiveFlyer="pub.title === currentFlyer.title"
            :ref="pub.title === currentFlyer.title? 'activeFlyer':null"
        >
          <template slot="title">
              <span>
                {{ pub.flyerTitle }}
              </span>
          </template>
          <template slot="content">
            {{ content.landing.valid }} {{ formatDate(pub.startDate) }} – {{ formatDate(pub.endDate) }}
          </template>
          <template v-if="pub.flyerType === 'preview'" slot="preview-text">
            <pre class="preview-text" v-html="content.landing.preview"></pre>
          </template>
        </PublicationPreview>

      </div>



    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import moment from "moment";
import PublicationPreview from '@/components/PublicationPreview.vue'
import featureMixin from "@/mixins/featureMixin";


export default {
	name: 'Sidebar',
  components:{
    PublicationPreview
  },
	mixins:[featureMixin],
  // created() {
  //   setTimeout(() => this.toggleSideBarState(false), 10000)
  // },
  mounted() {
		if(this.enabled){
			this.$refs.sidebar.focus()
			console.log('sidebar focussed')
		}
  },
  methods:{
    ...mapActions(['toggleHamburgerMenu','toggleSideBarState','setPdpDisplay']),
    ...mapActions('shoppingList',['toggleShoppingList']),
    toggleSidebar(){
      this.$refs.sidebar.focus();
      this.toggleSideBarState(!this.showSideBar);
      //this.toggleShoppingList(false);
      //this.toggleHamburgerMenu(false);
      //this.setPdpDisplay(false);
      console.log('** Active Flyer Preview: ', this.$refs.activeFlyer)
      if(this.showSideBar)setTimeout(() => this.$refs.activeFlyer[0]?.focus(this.$refs.sidebar), 500);
    },
    formatDate(date) {
      return moment.utc(date).format('MMM D');
    },
    getTooltip(){
      return this.showSideBar ? this.content.closeSideBar : this.content.openSideBar;
    },
	  onClickOutside() {
		  if(this.showSideBar) {
				//console.log('Side Bar Clicked Outside');
				this.toggleSideBarState(false);
			}
	  }
  },
  computed:{
    ...mapState('search', ['showSubHeader']),
    ...mapState('landingPage', ['flyers']),
    ...mapGetters('landingPage', ['currentFlyer']),
    ...mapState(['showFilters','showSideBar']),
    ...mapGetters(['content', 'language']),
	  ...mapGetters('config', ['features']),

	  enabled() {
			return this?.features?.otherPublications?.mode === 'drawer'
	  },

    getArrow(){
      return this.showSideBar ? '/images/left-arrow-only.svg' : '/images/right-arrow-only.svg'
    },

  },
  // watch:{
  //   //whenever showSideBar state changes, this triggers..
  //     showSideBar(){
  //        this.showSideBar ? setTimeout(() => this.toggleSideBarState(false), 10000) : ''
  //     }
  // }
}
</script>

<style scoped>

.pull-button{
  padding:5px;
  margin-top:10px;
  width:50px;
  height:75px;
  background-color: rgba(0,0,0,0.75);
  opacity: 1;
  cursor: pointer;
  display: flex;
  position: absolute;
  z-index:1;
  transition: 0.5s;
  /*align-items: center;*/
  justify-content: center;
  vertical-align: center;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.7);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 1px solid #FFFFFF;
  border-right: 1px solid #FFFFFF;
  border-bottom: 1px solid #FFFFFF;
  color:#FFFFFF;
  font-size: 11px;
}

.pull-button.fr{
  width:65px;
}

.pull-button.subHeaderOpen{
  top:120px;
}

.pull-button.showFilters{
  top:-1px;
}

.arrow{
  top:50%;
  transition: transform 0.2s;

}

.arrow.expanded{
  transform: rotate(180deg);
}


.pull-button.expanded{
  margin-left:250px;
}

.sidebar{
  background-color: rgba(0,0,0,0.75);
  width: 0px;
  height: 100%;
  color:white;
  position:absolute;
  z-index:1;
  align-items: center;
  justify-content: center;
  font-size:20px;
  overflow-x: hidden;
  overflow-y:auto;
  transition: width 0.5s;
}

.sidebar.expanded{
  width:250px;
}

.sidebar-content{
  padding:15px;
  display: flex;
  flex-direction: column !important;
  align-items: center;
  text-align: center;
}

.more-publications {
  position: sticky;
}

.flyericon-text{
  display: flex;
  flex-direction: column;
}

/* width */
::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
//background: #f1f1f1;
  display:none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}



/*Mobile*/
@media (min-width: 280px ) and (max-width: 1023px) {

  .more-publications{
    position: sticky;
    font-size:15px;
    display:none;
  }
  .pull-button{
    width:35px;
    height:175px;
    padding:5px;
    transform: rotate(90deg);
    margin-top:-69px;
    left:50%;
    display:flex;
    justify-content: space-evenly;
    flex-direction: column-reverse;
    align-items: center;
  }
  .pull-button.fr{
    height:195px;
    margin-top: -76px;
    width:40px;
  }
  .pull-button.expanded{
    margin-top:140px;
    margin-left:0px;
  }
  .pull-button.expanded.fr{
    margin-top: 133px !important;
  }

  .flyericon-text{
    transform: rotate(270deg);
    width:105px;
    align-items: center;
    display:flex;
    justify-content: space-between;
    margin-bottom:35px;
    margin-top:5px;
    display:flex;
    flex-direction: row;
  }

  .flyericon-text.fr{
    width:130px;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 43px;
  }

  .sidebar{
    width:100%;
    height:0px;
    transition: height 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
    overflow-y: hidden;
    overflow-x: auto;
  }


  .sidebar.expanded{
    width:100%;
    height:210px;
    transition: height 0.5s ease-out;
    transform: translateY(1px);
  }

  .sidebar-content{
    display:flex;
    flex-direction: row !important;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
		width: fit-content;
  }

  .arrow{
    width:15px;
    height:15px;
    margin-bottom:25px;
  }
  .arrow.fr{
    margin-bottom:28px;
  }


}

/*Tablet */
/*@media only screen
and (min-device-width: 768px)
and (max-device-width: 1179px)
{

  .sidebar.expanded{
    width:100%;
    height:210px;
    transition: height 0.5s ease-out;
    transform: translateY(1px);
  }

  .sidebar-content{
    display:flex;
    flex-direction: row !important;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .arrow{
    width:15px;
    height:15px;
    margin-bottom:25px;
  }
  .arrow.fr{
    margin-bottom:28px;
  }


}

/*Tablet */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1179px)
{

  .more-publications{
    position: sticky;
    font-size:15px;
    display:none;
  }
  .pull-button{
    width:35px;
    height:185px;
    padding:20px;
    transform: rotate(90deg);
    margin-top:-70px;
    left:50%;
    display:flex;
    justify-content: space-evenly;
    flex-direction: column-reverse;
    align-items: center;
  }
  .pull-button.fr{
    width:45px;
  }

  .pull-button.expanded{
    margin-top:174px;
    margin-left:0px;
  }
  .pull-button.expanded.fr{
    margin-top: 176px !important;
  }

  .flyericon-text{
    transform: rotate(270deg);
    width:105px;
    align-items: center;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom:35px;
    margin-top:5px;
  }

  .flyericon-text.fr{
    width:130px;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom:45px;
  }

  .sidebar{
    width:100%;
    height:0px;    transition: height 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
    overflow-y: hidden;
    overflow-x: auto;
  }


  .sidebar.expanded{
    width:100%;
    height:245px;
    transition: height 0.5s ease-out;
    transform: translateY(1px);
  }

  .sidebar-content{
    display:flex;
    flex-direction: row !important;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .arrow{
    width:18px;
    height:18px;
    margin-bottom:25px;
  }

  .arrow.fr{
    margin-bottom:49px;
  }

}

/* iPad Pro 12.9" Portrait and Landscape */
/*@media only screen*/
/*and (min-device-width: 1024px)*/
/*and (max-device-width: 1199px)*/
/*and (-webkit-min-device-pixel-ratio: 2) {*/

/*  .sidebar.expanded{*/
/*    width:100%;*/
/*    height:225px;*/
/*    transition: height 0.5s ease-out;*/
/*    transform: translateY(1px);*/
/*  }*/
/*   .pull-button.expanded.fr{*/
/*     margin-top: 156px !important;*/
/*   }*/
/*   .pull-button.expanded{*/
/*     margin-top:153px;*/
/*   }*/

/*  .pull-button{*/
/*    margin-top:-75px;*/
/*  }*/
/*}*/

/*Samsung Galaxy Tab S8*/
/*@media only screen
and (min-device-width: 732px)
and (max-device-width: 767px)
and (-webkit-min-device-pixel-ratio: 2){
  .more-publications{
    position: sticky;
    font-size:15px;
    display:none;
  }
  .pull-button{
    width:35px;
    height:185px;
    padding:20px;
    transform: rotate(90deg);
    margin-top:-70px;
    left:50%;
    display:flex;
    justify-content: space-evenly;
    flex-direction: column-reverse;
    align-items: center;
  }
  .pull-button.fr{
    width:45px;
  }

  .pull-button.expanded{
    margin-top:174px;
    margin-left:0px;
  }
  .pull-button.expanded.fr{
    margin-top: 176px !important;
  }

  .flyericon-text{
    transform: rotate(270deg);
    width:105px;
    align-items: center;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom:35px;
    margin-top:5px;
  }

  .flyericon-text.fr{
    width:130px;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom:45px;
  }

  .sidebar{
    width:100%;
    height:0px;    transition: height 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
    overflow: auto;
  }


  .sidebar.expanded{
    width:100%;
    height:245px;
    transition: height 0.5s ease-out;
    transform: translateY(1px);
  }

  .sidebar-content{
    display:flex;
    flex-direction: row !important;
    justify-content: center;
  }

  .arrow{
    width:18px;
    height:18px;
    margin-bottom:25px;
  }

  .arrow.fr{
    margin-bottom:49px;
  }

}*/
</style>
