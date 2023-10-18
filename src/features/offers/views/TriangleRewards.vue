<template>
  <div class="triangle-rewards-offers">
    <offer-list :class="{ disabled: !canViewTriangleRewards || isFakeOffers }" :items="triangleOffers">
      <triangle-rewards-card />
    </offer-list>
    <!-- img class="base-bar" :src="baseBarFilePath" alt="" / -->
  </div>
</template>

<script>

import {mapActions, mapGetters, mapState} from "vuex";
import TriangleRewardsCard from "@/features/offers/TriangleRewardsCard.vue";
import OfferList from "@/features/offers/OfferList.vue";

export default {
  name: "TriangleRewards",
  components: {TriangleRewardsCard, OfferList},
  async mounted() {
    await this.loadOffers();
  },
  computed: {
    ...mapGetters('ctUser', ['canViewTriangleRewards', 'triangleOffers', 'isFakeOffers']),
    ...mapGetters('screen', ['displayMode', 'flyerOrientation']),
    ...mapGetters('scale', ['imageDPI']),
    ...mapState(['language']),
    dpiSnap() {
      //const snapVals = [150, 300];
      return Math.round(this.imageDPI / 150) * 150;
    },

    baseBarFilePath(){
      return `/images/triangle/basebars/${this.dpiSnap}dpi/_${this.displayMode}_${this.flyerOrientation}_${this.language}.jpg`;
    }

  },
  methods: {
    ...mapActions('ctUser', ['triggerUserDialog', 'loadOffers'])
  }

}
</script>

<style lang="scss">

  [mode='mobile'] .responsive-grid{
    &[flyer-orientation='vertical']{
      .triangle-rewards-offers{
        width: 32.1em;
        font-size: 13px;
      }
      .offer-list-item{
        width: 15.8em;
      }
    }
  }

  .responsive-grid{
    [page-id='triangleRewards'] {
      .basebar img{
        width: 491px;
      }
    }
    .triangle-rewards-offers{
      width: 49.1em;
      font-size: 9.99px;
      .base-bar{
        width: 100%;
      }
    }
    &[flyer-orientation='vertical']{
      .triangle-rewards-offers{
        width: auto;
        font-size: 10.595px;
        flex: 1 0 calc(50% - 0.6em);
      }
    }
  }
</style>
