<template>
  <div class="modal-wpr" v-show="showTour">
    <div :class="`modal step-${index + 1}`">
      <div class="arrow" />
      <div class="content">
        <h4>
          {{ step.title }}
          <span>{{ content.tip }} - {{ index + 1 }} {{ content.of }} {{ steps.length }}</span>
        </h4>
        <p>{{ step.text }}</p>
        <div class="cta-btns">
          <button v-if="lastStep" class="close-btn" :aria-label="content.restart" @click="restart">{{ content.restart }}</button>
          <button v-if="lastStep" class="next-btn" :aria-label="content.finish" @click="dismissTour(payload)">{{ content.finish }}</button>
          <button v-else class="close-btn" :aria-label="content.skipTour"  @click="dismissTour(payload)">{{ content.skipTour }}</button>

          <button v-if="!lastStep" class="next-btn" :aria-label="content.next" @click="nextStep()">{{ content.next }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

  export default {
    mounted() {
      this.step = this.steps[0]
      this.checkDisplayToast(this.payload.id);
    },

    data() {
      return {
        payload: {
          permanent: true
        },
        step: {},
        index: 0
      }
    },

    watch: {
      showTour(val) {
        if (!val) {
          this.step = this.steps[0]
          this.index = 0
        }
      }
    },

    computed: {
      ...mapState(['columnView']),
      ...mapGetters(['content']),
      ...mapGetters('toast', ['showTour']),

      steps() {
        return Object.values(this.content.walkthrough);
      },

      lastStep(){
        return this.index == this.steps.length - 1;
      }
    },

    methods: {
      ...mapActions('toast', ['dismissTour', 'checkDisplayToast']),

      restart(){
        this.index = 0;
        this.step = this.steps[this.index];
      },
      nextStep() {
        this.index++
        this.step = this.steps[this.index]
        // if (this.index === this.steps.length) {
        //   this.dismissToast(this.payload)
        // } else {
        //   this.step = this.steps[this.index]
        // }
      }
    }
  }
</script>

<style lang="scss" scoped>
.modal-wpr {
  position: fixed;
  top: 65px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(216, 216, 216, 0.74);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;


  .modal {
    position: relative;
    top: -13px;
    right: 320px;
    transition: all 300ms;
    &.step-2 {
      right: 267px;
    }
    &.step-3 {
      right: 197px;
    }
    &.step-4 {
      right: 125px;
    }
    &.step-5 {
      right: 83px;
    }
    &.step-6 {
      right: 17px;
      .arrow {
        margin-right: 117px;
      }
    }
    &.step-7{
      right: 10px;
      .arrow {
        margin-right: 20px;
      }
    }
  }

  .arrow {
    width: 0;
    height: 0;
    border-bottom: 10px solid var(--primary-color);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    margin: 0 auto;
    transition: all 300ms;
  }

  .content {
    background: #fff;
    border-radius: 4px;
    width: 300px;
    font-size: 12px;
    overflow: auto;
  }

  h4 {
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    border-bottom: 1px solid #eee;
    margin: 0px;
    padding: 5px 10px;

    span {
      float: right;
      font-weight: 200;
    }
  }

  p {
    color: #555;
    padding: 1em;
  }

  .cta-btns{
    padding: 0em 1em 1em;
    text-align: right;
  }

  button {
    background: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 1em;
    padding: 5px;
    /*float: right;*/

    &.next-btn {
      margin-left: 8px;
      background: var(--secondary-color);
      color: var(--primary-text-color);
    }

    .search-toggle {
      padding: 5px 8px;
    }

    .subtitle.mobile {
      text-align: center;
      margin-bottom: 20px;
    }
  }
}

// @media (max-width: 1200px) {
//   .modal-wpr {
//     display: none;
//   }
// }
@media (max-width: 1023px) {
  .modal-wpr {
    display: none;
  }
}
</style>
