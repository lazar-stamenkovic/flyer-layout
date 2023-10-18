<template>
  <div class="wpr" data-tour-item="discountFilter">
    <span class="label"><slot /></span>
    <div class="savings-buttons" >
      <!-- <button :class="{ selected: savingsFilter === 0 }" @click="setSavingsFilter(0)">None</button> -->
      <button
        v-for="val in features.filters.discount.values"
        :key="val"
        :class="{
          selected: savingsFilter === val,
          belowSelected: savingsFilter > (val)
        }"
        @click="handleClick(val)"
        :aria-label="`Savings ${n * 10}%`"
      >
        >{{ val }}%
      </button>
    </div>

    <div class="dropdown" v-click-outside="closeDropDown">
      <button :aria-label="savingsFilter" @click="toggleSavings" :class="{ highlight: this.showSavings }">
        <span>{{ savingsFilter ? `>${savingsFilter}%` : content.byDiscount }}</span>
        <img :class="{ expand: showSavings }" src="/images/icon-dropdown-arrow.svg" alt="">
      </button>
      <div v-if="showSavings" class="savings-popup popup">
        <button :aria-label="`Savings Filter ${n * 10}%`" class="savings-item" v-for="n in 6" :key="n" :class="{ selected: savingsFilter === n * 10 }" @click="handleClick(n * 10)">>{{ n * 10 }}%</button>
      </div>
    </div>

    <button aria-label="Clear All" class="reset btn" data-tour-item="clearDiscount" @click="clearAll()">
      {{ content.clear }}
    </button>
  </div>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import ClickOutside from 'vue-click-outside'
  import Lytics from "@/classes/Lytics";

  export default {
    directives: {
      ClickOutside
    },
    data() {
      return {
        showSavings: false
      }
    },

    computed: {
      ...mapGetters(['content']),
      ...mapState('search', ['savingsFilter']),
      ...mapState('config', ['features']),
    },

    methods: {
      ...mapActions('search', ['resetFilters', 'setSavingsFilter']),

      clearAll() {
        this.resetFilters()
      },

      handleClick(val) {
        if (val === this.savingsFilter) {
          this.setSavingsFilter(0);
        } else {
          this.setSavingsFilter(val);
        }

        Lytics.TriggerFilter('discount', val);

        this.closeDropDown();
      },
      toggleSavings() {
        this.showSavings = !this.showSavings;
      },
      closeDropDown() {
        this.showSavings = false;
      }

    },
  }
</script>

<style lang="scss" scoped>
  .wpr {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }

  button {
    font-size: inherit;
  }

  .savings-buttons {
    height: 32px;
    /* display: flex;
    align-items: center; */
    border: 1px solid #AEAEAE;
    border-radius: 4px;
    overflow: hidden;
    background-color: #FFF;
    font-size: inherit;
    margin-right: 16px;

    button {
      height: 100%;
      border: none;
      padding: 4px 8px;
      background-color: #FFF;
      border-left: 1px solid #AEAEAE;

      &:first-child {
        border-left: none;
      }

      &.selected {
        background-color: var(--primary-color);
        color: var(--primary-text-color);
      }

      &.belowSelected {
        background-color: #d5d5d5;
        color: #111;
      }
    }
  }

  .btn {
    background-color: #FFF;
    border: 1px solid #BBB;
    border-radius: 4px;
    padding: 5px;
    margin: 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    min-width: 32px;
    color: #333;
    transition: none;

    &.reset {
      margin: 0;
    }
  }

  .label {
    padding: 0 10px;
  }
  .dropdown {
    margin-right: 20px;
    flex-grow: 1;
    max-width: 50%;
  }

  .dropdown button {
    border: 1px solid #AFAFAF;
    border-radius: 4px;
    display: flex;
    width: 100%;
    min-height: 34px;
    padding: 0 8px;
    align-items: center;
    justify-content: space-between;
    background: none;
    font-size: 14px;
    font-weight: bold;
    width: 130px;
  }

  .dropdown button.highlight {
    background-color: rgba(237, 28, 36, 0.2);
  }

  .dropdown button span {
    overflow: hidden;
    white-space: nowrap;
  }

  .dropdown .popup {
    position: absolute;
    background-color: #FFF;
    padding: 15px 0;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    z-index: 103;
    width: 130px;
  }

  .savings-popup .savings-item {
    border: none;
    border-radius: 0;
    padding: 0 15px;
  }

  .savings-popup .savings-item.selected {
    background-color: #ED1C24;
    color: #FFF;
  }
  @media (max-width: 1364px) {
    .savings-buttons {
      display: none;
    }
  }
  @media (min-width: 1365px) {
    .dropdown {
      display: none;
    }
  }
</style>
