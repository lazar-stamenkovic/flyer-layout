<template>
  <div class="wrapper-hamburger" @click="closeHamburger">
    <div class="popup" @click.stop="">

      <!-- DYNAMIC APPROACH.. ONLY PROBLEM IS USING ROUTER-LINK DYNAMICALLY INSTEAD OF ANCHOR TAG. CAN BE IMPROVED IN FUTURE -->
      <!--                <li v-for="item in items" :key="item.nameEn" class="hamburger-item">-->
      <!--                  <div class="btn" @click="item.link">-->
      <!--                      <img :src="item.icon" :alt="item.name">-->
      <!--                      <span v-if="language=='en'" class="item_name">    {{ item.nameEn}} </span>-->
      <!--                      <span v-else class="item_name"> {{item.nameFr}}</span>-->
      <!--                  </div>-->
      <!--                </li>-->

      <!-- HARD CODED APPROACH -->
      <ul class="hamburger-list">

        <!-- OTHER FLYERS -->
<!--        <div class="list-container">-->
<!--          <li class="hamburger-item btn">-->
<!--            <div class="item_icon">-->
<!--              <router-link :to="{ name: 'LandingPage' }" style="text-decoration: none;" >-->
<!--                <svg width="28" height="17" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <g fill-rule="nonzero" fill="none">-->
<!--                    <path d="M23.53 1.38h-1.58V.86c.01-.2-.13-.39-.33-.45C20.52.14 19.4 0 18.26 0 16.4 0 13.86.4 12 2.25 10.13.39 7.58 0 5.72 0 4.6 0 3.46.14 2.37.41a.45.45 0 00-.34.45v.52H.47c-.26 0-.47.2-.47.45v14.35c0 .25.2.45.47.45.08 0 .15-.02.22-.06.05-.02 4.7-2.48 11.2-.9H12.1c6.52-1.6 11.17.86 11.2.9.15.08.32.08.47 0a.45.45 0 00.23-.39V1.83c0-.24-.2-.45-.47-.45z" fill="#545454"/>-->
<!--                    <g fill="#FFF">-->
<!--                      <path d="M5.36 12.6a19 19 0 00-2.36.16V1.3C3.84 1.09 4.7 1 5.57 1 7.2 1 9.43 1.38 11 3.14L11 14c-.9-.6-2.66-1.4-5.64-1.4zM13 3.14C14.56 1.39 16.8 1 18.42 1a12 12 0 012.58.29v11.48c-.78-.1-1.56-.16-2.35-.16-2.96 0-4.73.8-5.65 1.39V3.14z"/>-->
<!--                    </g>-->
<!--                  </g>-->
<!--                </svg>-->
<!--              </router-link>-->
<!--            </div>-->
<!--            <div class="item_title">-->
<!--              <router-link :to="{ name: 'LandingPage' }" style="text-decoration: none; color:var(&#45;&#45;primary-color)" >-->
<!--                <span class="item_name">{{ content.hamburger.otherPubs }}</span>-->
<!--              </router-link>-->
<!--            </div>-->
<!--          </li>-->
<!--        </div>-->

 <!-- HELP COMPONENT -->
        <div class="list-container">
          <li class="hamburger-item btn" @click.stop.prevent="toggleHelpComponent">
            <div class="item_icon">
              <svg width="18px" height="28px" viewBox="8 8 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="M17,9 C12.584,9 9,12.584 9,17 C9,21.416 12.584,25 17,25 C21.416,25 25,21.416 25,17 C25,12.584 21.416,9 17,9 Z M17.8,22.6 L16.2,22.6 L16.2,21 L17.8,21 L17.8,22.6 Z M19.456,16.4 L18.736,17.136 C18.16,17.72 17.8,18.2 17.8,19.4 L16.2,19.4 L16.2,19 C16.2,18.12 16.56,17.32 17.136,16.736 L18.128,15.728 C18.424,15.44 18.6,15.04 18.6,14.6 C18.6,13.72 17.88,13 17,13 C16.12,13 15.4,13.72 15.4,14.6 L13.8,14.6 C13.8,12.832 15.232,11.4 17,11.4 C18.768,11.4 20.2,12.832 20.2,14.6 C20.2,15.304 19.912,15.944 19.456,16.4 Z" id="icon-help" fill="#545454" fill-rule="nonzero"></path>
              </svg>
            </div>
            <div class="item_title">
              <span class="item_name">{{ content.hamburger.help }}</span>
            </div>

          </li>
        </div>

<!-- FULL SCREEN TOGGLE -->
        <div class="list-container">
          <li class="hamburger-item btn" :class="{ selected: fullScreenToggle }" @click="toggleFullScreenComponent">
            <div class="item_icon">
              <img v-if="!fullScreenToggle" src="/images/icon-full-screen.svg" alt="View Full Screen"/>
              <svg v-else width="18" height="18"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                <path d="M3 14h2V9H0v2h3v3zM5 0H3v3H0v2h5V0zm6 11h3V9H9v5h2v-3zm3-6V3h-3V0H9v5h5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="item_title">
              <span v-if="!fullScreenToggle" class="item_name">{{ content.hamburger.viewFullScreen }}</span>
              <span v-else class="item_name">{{ content.hamburger.exitFullScreen }}</span>
            </div>

          </li>
        </div>
      </ul>

    </div>
  </div>

  <!-- </div> -->
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import ClickOutside from 'vue-click-outside'


export default {
  directives: {
    ClickOutside
  },

  data() {
    return {
      ready: false,
      items: [
        {
          nameEn: 'Home',
          nameFr: "Page d'accueil",
          icon: '/images/icon-home.svg',
          link: 'https://www.metro.ca'
        },
        {
          nameEn: 'Help',
          nameFr: 'Aide et conseils',
          icon: '/images/icon-help-grey1-withoutborder.svg',
          link: 'toggleHelp(!showHelp)'
        },
        {
          nameEn: 'Other Flyers',
          nameFr: 'Autres dèpliants',
          icon: '/images/icon-landing.svg',
          link: '/'
        },
        {
          nameEn: 'View Full Screen',
          nameFr: 'Afflicher en plein ècran',
          icon: '/images/icon-full-screen.svg',
          link: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['content', "language"]),
    ...mapState(['showHamburgerMenu']),
    ...mapGetters('config', ['branding', 'features']),
    ...mapState('toast', ['showHelp']),
    ...mapState('screen', ['fullScreenToggle']),
  },
  methods: {
    ...mapActions(['toggleHamburgerMenu']),
    ...mapActions('toast', ['toggleHelp']),
    ...mapActions('screen', ['toggleFullScreen']),

    closeHamburger(){
      this.toggleHamburgerMenu(false)
    },

    toggleHelpComponent(){
      this.toggleHelp(!this.showHelp)
      this.toggleHamburgerMenu(false)
    },
    toggleFullScreenComponent(){
      this.toggleFullScreen(!this.fullScreenToggle)
      this.toggleHamburgerMenu(false)

    },
  }


}
</script>

<style  lang="scss" scoped>
.wrapper-hamburger {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  left: 0;
  // background-color: rgba(0, 0, 0, 0.75);
  z-index: 120;
  height:1200px;
}


.popup {
  //position: absolute;
  background-color: #FFF;
  padding: 3px 0;
  border-radius: 4px;
  width:100%;
  max-height:93px;
  margin-left:17px;
  margin-right:17px;
  margin-top: -8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  z-index: 121;
}

.hamburger.disabled{
  pointer-events: none;
}

.hamburger-list{
  display: flex;
  flex-direction: column;
  padding:0.2em;
  list-style: none;
  width: 100%;
}
.list-container {
  display: flex;
  padding:3px 3px;
}

.list-container:not(:last-child){
  border-bottom:1px solid lightgrey;
}

.hamburger-item {
  align-items: center;
  border-bottom: none;
  display: flex;
  justify-content: left;
}

.hamburger-item>a{
  text-decoration: none;
}


.btn {
  background: none;
  padding: 5px;
  border: none;
  /*margin: 0 4px;*/
  display: flex;
  align-items: center;
  justify-content: left;
  height: 34px;
  min-width: 34px;
  color: #333;
  transition: none;
  text-decoration: none;
}

.item_title{
  white-space: pre;
}

.item_icon{
  /* width:10%; */
  /* width: 100%; */
  text-align: center;
  width: 68px;
}


</style>
