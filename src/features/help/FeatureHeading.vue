<template>
  <div class="heading">
    <div class="heading-line"></div>
    <h3>
      <slot />
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.heading {
  display: flex;
  justify-content: center;
  position: relative;

  .heading-line {
    border-top: 1px solid #545454;
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
  }

  h3 {
    font-size: 16px;
    text-transform: uppercase;
    background-color: #FFF;
    z-index: 1;
    padding: 0 30px;
  }
}
</style>