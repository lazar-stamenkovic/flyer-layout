<template>
  <div>
    <div class="landing-page" v-if="flyers.length">
      <div class="grid-wpr">
        <div class="content-wpr">
          <div v-if="getUrlParameter('language')=='en'" class="content">
            <div class="wrapper">
              <!-- <h2 style="color:var(--secondary-color)">{{ content.landing.introduction }}</h2> -->
            <h1 style="color:var(--secondary-color)">{{ content.landing.title }}</h1>
            <h3>{{ content.landing.subtitle }}</h3>
            </div>

            <ul class="checklist">
              <li>{{ content.landing.modes }}</li>
              <li>{{ content.landing.relevantProducts }}</li>
              <li>{{ content.landing.fullScreen }}</li>
               <li>{{ content.landing.shoppingList }}</li>
            </ul>
          </div>
           <div v-else class="content-bil">
            <div class="wrapper">
              <!-- <h2 style="color:var(--secondary-color)">{{ content.landing.introduction }}</h2> -->
            <h1 style="color:var(--secondary-color)">{{ content.landing.title }}</h1>
            <h3>{{ content.landing.subtitle }}</h3>
            </div>

            <ul class="checklist">
              <li>{{ content.landing.modes }}</li>
              <li>{{ content.landing.relevantProducts }}</li>
              <li>{{ content.landing.fullScreen }}</li>
               <li>{{ content.landing.shoppingList }}</li>
            </ul>
          </div>
        </div>
        <Carousel
          v-if="flyers.length > 2"
          class="flyer-carousel"
          navigationEnabled
          :paginationEnabled="false"
          :perPageCustom="[[1550, 3]]"
          navigationNextLabel=""
          navigationPrevLabel=""
        >
          <Slide v-for="pub in flyers" :key="pub.id">
            <PublicationPreview
              :preview="pub.flyerType === 'preview'"
              :src="pub.thumbnail"
              :moreThanTwoFlyers="flyers.length > 2"
              :flyerId="pub.title"
            >
              <template slot="title">
                <span>
                  {{ content.landing.canadaStore }}
                </span>
              </template>
              <template slot="content">
                {{ content.landing.valid }} {{ formatDate(pub.startDate) }} – {{ formatDate(pub.endDate) }}
              </template>
              <template slot="preview-text">
                <pre class="preview-text" v-html="content.landing.preview"></pre>
              </template>
            </PublicationPreview>
          </Slide>
          <div class="flyer"></div>
        </Carousel>
        <div class="flyer-carousel" :class="{ 'desktop-hidden': flyers.length > 2 }">
          <PublicationPreview
            v-for="pub in flyers"
            :key="pub.id"
            :preview="pub.flyerType === 'preview'"
            :src="pub.thumbnail"
            :flyerId="pub.title"
          >
            <template slot="title">
              <span>
                {{ content.landing.canadaStore }}
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
    <!--div v-else-if="languageError">
      <div class="lang-error">
        <h1>Cette circulaire n'est pas disponible en français pour la région sélectionnée</h1>
        <a :href="langRedirect">Cliquez ici pour voir les éléments circulaires en anglais ou sélectionnez un autre code postal</a>
      </div>
    </div>
    <div v-else-if="dateError">
      <div class="lang-error">
        <h1>{{  content.noFlyersMsg }}</h1>
        <p class="red">{{  content.noFlyerSubText }}</p>
      </div>
    </div-->
  </div>
</template>

<script>
import { getUrlParameter } from "../utils";
import { mapGetters, mapState } from 'vuex'
import PublicationPreview from '@/components/PublicationPreview'
import moment from "moment";
import { Carousel, Slide } from 'vue-carousel';

export default {
  components: {
    PublicationPreview,
    Carousel,
    Slide
  },

  computed: {
    ...mapState(['apiUrl']),
    ...mapState('landingPage', ['flyers', 'languageError','dateError']),
    ...mapGetters(['content', 'language']),

    timeTravelDate() {
      return getUrlParameter('timeTravelDate')
    },

    langRedirect() {
      return window.location.href.replace('language=fr', 'language=en');
    },
  },

  methods: {
    formatDate(date) {
      return this.language=='fr' ? moment.utc(date).locale('fr').format('D MMMM') : moment.utc(date).format('MMM D')
    },
     getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(window.location.search);
        return results === null
            ? ""
            : decodeURIComponent(results[1].replace(/\+/g, " "));
      },
  }
}
</script>

<style scoped lang="scss">
.landing-page {
  height: 100vh;
  width: 100vw;
  overflow: auto;

  .grid-wpr {
    // height: 100%;
    height:70%;
    max-width: 2490px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin: 0 auto;

    .content-wpr {
      width: 33.3%;
      //margin-right: 20px;

      .content {
        max-width: 400px;
        margin: 0 auto;
        // text-align: center;
        padding: 0px 30px 0px 30px;

        .wrapper {
          //padding: 0px 20px 0px 20px;
        }

        h1 {
          color: var(--primary-color);
          // font-size: 32px;
          font-size: 30px;
        }

        h3 {
          margin-top: 5px;;
        }

        .checklist {
         // padding-left: 20px;
          // margin-top: 15px;
          margin-top: 10px;
          font-size: 15px;
          font-weight: bolder;
        }

        ul {
          list-style: none;
          text-align: start;
        }

        ul li::before {
          content: "\2022";
          color: red;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          // margin-left: -1em;
          margin-bottom:5px;
        }
      }

       .content-bil {
        max-width: 400px;
        margin: 0 auto;

        .wrapper {
          //padding: 0px 20px 0px 20px;
        }

        h1 {
          color: var(--primary-color);
          // font-size: 32px;
          font-size: 30px;
        }

        h3 {
          margin-top: 5px;;
        }

        .checklist {
         // padding-left: 20px;
          // margin-top: 15px;
          margin-top: 10px;
          font-size: 15px;
          font-weight: bolder;
        }

        ul {
          list-style: none;
          text-align: start;
        }

        ul li::before {
          content: "\2022";
          color: red;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          // margin-left: -1em;
          margin-bottom:5px;
        }
      }
    }

    .flyer-carousel {
      width: 60%;
      max-width: 1488px;
      display: flex;
      align-items: center;
    }
  }
}

.desktop-hidden {
  display: none !important;
}

@media (max-width: 1023px) {
  .flyer-carousel {
    flex-direction: column;

    &.desktop-hidden {
      display: flex !important;
      padding-bottom: 100px;
    }
  }


  .VueCarousel.flyer-carousel {
    display: none !important;
    width: 100%;
  }

  .landing-page .grid-wpr {
    flex-direction: column;
    max-width: 400px;
    margin: 10px auto;
    padding: 20px 10px;

    .content-wpr {
      width: 100%;

      .content {
        margin: 0 18px;
        padding:0px;

        h1 {
          // font-size: 24px;
           font-size: 19px;
        }
        h2 {
          font-size: 19px;
        }
        h3 {
          font-size: 10px;
        }
        .checklist {
          font-size: 11px;
        }
      }

      .content-bil {
        margin: 0 18px;
        padding:0px;

        h1 {
          // font-size: 24px;
           font-size: 19px;
        }
        h2 {
          font-size: 19px;
        }
        h3 {
          font-size: 10px;
        }
        .checklist {
          font-size: 11px;
        }
      }
    }

    .flyer-carousel {
      width: 100%;

      .flyer {
        width: 100%;
        height: 80vw;
        max-height: 333px;
      }
    }
  }
}

.lang-error {
  margin: 30px auto;
  padding: 0 20px;
  max-width: 545px;
  text-align: center;
}

.lang-error h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.lang-error a {
  font-size: 18px;
  color: var(--primary-color);
}

.preview-text {
  text-align: right;
  font-family: inherit !important;
}
</style>

<style lang="scss">
  .VueCarousel-navigation-button {
    background: none;
    height: 32px;
    width: 32px;
    position: absolute;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
    opacity: .75;
    transition: opacity 200ms, filter 100ms;

    &:hover,&:focus {
      opacity: 1;
    }

    &.VueCarousel-navigation-prev {
      background-image: url("/images/moveleft-arrow-desktop.png");
    }

    &.VueCarousel-navigation-next {
      background-image: url("/images/moveright-arrow-desktop.png");
    }

    &.VueCarousel-navigation--disabled {
      opacity: 0.3 !important;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }
  }

  .VueCarousel-slide {
    display: flex;
    justify-content: center;
  }
</style>
