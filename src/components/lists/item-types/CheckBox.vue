<template>
  <div :class="`check-box ${selected? 'selected':null}`">
    <svg v-if="selected" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 76.083 85.083"
         fill="#fff" fill-rule="evenodd" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
      <use xlink:href="#A" x="1.042" y="1.042"/>
      <symbol id="A" overflow="visible">
        <path class="check-mark" d="M.96 48.33c6.652 9.388 12.223 19.271 16.483 29.969 1.729 4.348 8.804 5.513 10.042 0C33.397 52.028 44.593 21.684 70.58 9.536c6.069-2.833.785-11.819-5.258-8.994-28.371 13.26-41.417 46.25-47.883 74.988H27.48C22.876 63.964 17.151 53.239 9.945 43.072 6.099 37.647-2.936 42.843.951 48.33z"
              stroke="none" fill-rule="nonzero"/>
      </symbol>
    </svg>
  </div>
</template>

<script>
export default {
  name: "CheckBox",
  props: {
    selected: {
      type:Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .check-box {
    position: relative;
    border: solid 1px;
    border-radius: 0.2em;
    color: inherit;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    flex-grow: 0;
    &.selected {
      background-color: rgba(164, 143, 143, 0.2);
    }
    svg {
      position:absolute;
      width: 1em;
      bottom: 0.001em;
      left: 0.1em;
    }
    .check-mark {
      fill: var(--list-item-select-color);
    }
  }
</style>
