<template>
  <div class="adv-search-suggest-view">
    <div>
      <adv-titled-list
        title="Did you mean?"
        :items="suggest"
        @select="(item) => handleEvent('suggest', item)"
      />
      <adv-titled-list
          title="Popular Searches"
          :items="popSearch"
          @select="(item) => handleEvent('popular', item)"
      />
      <adv-titled-list
          title="Categories"
          :items="categories"
      />

    </div>
    <div>
      <adv-titled-list
        title="Popular Products"
        :items="products"
        @select="(item) => handleEvent('popularProducts', item)"
      >
        <button class="btn red">Show Flyer Results</button>
      </adv-titled-list>

      <adv-titled-list
          title="Filter Examples"
          :items="filters"
          @select="(item) => handleEvent('filter', item)"
          :collapsable="true"
      />
    </div>
  </div>
</template>

<script>
import AdvTitledList from "@/components/lists/AdvTitledList";
import {mapGetters, mapState} from "vuex";
export default {
  name: "AdvSearchSuggestView",
  components: { AdvTitledList },
  computed:{
    ...mapState('advSearchStore', ['suggest','popSearch','products','filters']),
    ...mapGetters('advSearchStore', ['categories']),
  },
  methods: {
    handleEvent(e, d) {
      console.log('Event Triggered: ', e,  '  Data:', d)
    }
  }
}
</script>

<style lang="scss" scoped>
  .adv-search-suggest-view {
    display: flex;
    padding: 10px;
    box-shadow: 4px 4px 8px 0px #0000003b;
    background-color: #fff;
    > * {
      padding-right: 1.5em;
      border-right: solid 1px #AEAEAE;
      overflow: auto;
    }
    > *:nth-child(n+2) {
      padding-left: 1.5em;
    }

    > *:last-child {
      border-right: none;
      padding-right: 10px;
    }

    > * > *{
      border-bottom: solid 1px #AEAEAE;
      &:last-child {
        border-bottom: none;
      }
    }

    .btn {
      background: none;
      border: 1px solid #BBB;
      border-radius: 4px;
      padding: 5px;
      /*margin: 0 4px;*/
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      min-width: 34px;
      color: #333;
      transition: none;
      width: 100%;
    }

    .btn * {
      transition: none;
    }

    .btn:hover {
      background-color: #EEE;
    }

    .btn.selected {
      background-color: var(--primary-color);
      color: var(--primary-text-color);
    }

    .btn.selected:hover {
      background-color: var(--primary-color);
    }

    .btn.red {
      background-color:  #E12526;
      color: #fff;
      &:hover {
        background-color: #9d4d3b;
      }
    }

    .highlight {
      color: #E54142;
      font-weight: 700;
    }

  }
</style>
<style lang="scss">
  .adv-search-suggest-view {
    .highlight {
      color: #E54142;
      font-weight: 700;
    }
  }
</style>