<template>
  <div :class="{ hidden: highlightResults || hidden }">
    <button class="product-quebec"
            :class="{active: quebecProduct}"
            @click="handleSubmit()"
            aria-label="Air Miles"
            tabindex="0"
    > {{ content.airMiles }}
      <!-- <img  src="/images/productofQuebec.svg" alt=""> -->
      <!-- <img/> -->
      <span class="image"></span>
    </button>

  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import Lytics from "@/classes/Lytics";

export default {
  name: "Airmiles",

  data() {
    return {
      value: '',
      showCategories: false,
      showFilters: false,
    }
  },


  computed: {
    ...mapGetters(['content']),
    ...mapState(['highlightResults']),
    ...mapState('search', ['airMilesThunderBucks'])
  },

  methods: {
    ...mapActions('search', ['setProductOfQuebecFilter']),
    ...mapActions(['setSearchInputFocusState']),

    handleSubmit() {
      this.toggleSideBarState(false)
      this.setAirmilesFilter(!this.airMilesThunderBucks);
      // console.log('quebecProduct '  + this.quebecProduct );
      Lytics.TriggerFilter('Air Miles', this.quebecProduct? 'enable': 'disable');
    }
  },

  watch: {
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');

div {
  height:100%;
}

button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1B68A6;
  border: 1px solid #AFAFAF;
  border-radius: 4px;
  font-size: inherit;
  color: #FFFFFF;
  padding: 5px 10px;
  margin: 0 4px;
  height: 100%;
  white-space: nowrap;
}

.product-quebec .image{
  margin-left:10px;
  /* filter: invert(100%) sepia(0%) saturate(5899%) hue-rotate(257deg) brightness(113%) contrast(90%); */
  background-image: url("/images/AirMiles_logo.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width:19px;
  height:16px;
}

.active {
  background-color:#93D5E8;
  color: #FFF;
}

.active .image{
  background-image: url("/images/AirMiles_logo_active.svg");
  width:19px;
  height:16px;
}

.clear {
  position: absolute;
  right: 40px;
  top: 51%;
  transform: translateY(-50%);
  line-height: 1em;
  font-family: monospace;
  cursor: pointer;
}

/*Mobile */
@media (min-width: 280px ) and (max-width: 1022px) {
  button {
    margin: 0px;
    font-weight: bold;
    font-size: 14px;
    min-height: 34px;
    padding: 0px 8px;
    width: 92%;
  }
  /* .product-quebec {
     width: 100%;
  } */
}

/*Tablet */
@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px){
  button {
    width:96%;
  }
}


</style>
