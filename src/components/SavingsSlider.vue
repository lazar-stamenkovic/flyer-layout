<template>
  <div class="saving-slider" :class="noBorder ? 'no-border' : ''">
    <span class="label"><slot /></span>
    <img alt="Decrease savings" src="/images/icon-decrease-size.svg" @click="incrSlider(-1)"/>
    <vue-slider
        :tooltip="'none'"
        class="p-slider"
        :interval="savingIncr"
        :min="minSavings"
        :max="maxSavings"
        v-model="savings"
        @change="setSavingsFilter($event)"
    >
      <template v-slot:dot="{ value, focus }">
        <div :class="['savings-dot', { focus }]">{{value}}%</div>
      </template>
    </vue-slider>
    <img alt="Increase savings" src="/images/icon-increase-size.svg" @click="incrSlider(1)"/>
  </div>
</template>

<script>
  import VueSlider from "vue-slider-component";
  import 'vue-slider-component/theme/default.css';
  import { debounce } from "lodash";
  import { mapActions, mapState } from 'vuex';

  export default {
    components: {
      VueSlider
    },

    props: {
      noBorder: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        savings: 0,
        minSavings: 0,
        maxSavings: 60,
        savingIncr: 10
      }
    },

    computed: {
      ...mapState('search', ['savingsFilter']),
    },

    methods: {
      ...mapActions('search', ['setSavingsFilter']),

      incrSlider(dir){
        const val = this.savings + (dir * this.savingIncr);
        if(val < this.minSavings) {
          this.savings = this.minSavings;
        }else if(val > this.maxSavings){
          this.savings = this.maxSavings;
        } else {
          this.savings = val;
        }
        this.setSavingsFilter(this.savings);
      },
    },

    watch: {
      savings(val) {
        debounce(() => { this.setSavingsFilter(val) }, 200);
      },

      // savingsFilter(val) {
      //   if (val === 0) this.savings = 0;
      // }
    },

    created() {
      this.savings = this.savingsFilter
    }
  }
</script>

<style scoped>
.saving-slider{
    width: 220px;
    height: 100%;
    padding:0px 10px;
    display: flex;
    align-items: center;
    border: 1px solid #AFAFAF;
    border-radius: 4px;
    background-color: #FFF;
    font-size: 14px;
  }

  .saving-slider.no-border {
    border: none;
  }

  .label {
    margin-right: 10px;
  }

  .saving-slider > img{
    cursor: pointer;
  }

  .p-slider{
    flex-basis: 100%;
    margin: 0px 13px;
  }

  .savings-dot{
    background-color:  #ED1C24;
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
