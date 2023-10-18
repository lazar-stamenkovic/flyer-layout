<template>
  <div class="label-list-item" v-html="label"></div>
</template>

<script>
function applyHighlights(text, highlights) {
  let ns = '';
  let sliceStart = 0;
  const hl = highlights.sort((a, b) => {
    return a[0] - b[0];
  })
  hl.forEach((h, i, all) => {
    const s = h[0];
    const e = h[1];
    if(s !== sliceStart) {
      ns += text.slice(sliceStart, s);
    }
    ns += "<span class='highlight'>" + text.slice(s,e) + "</span>";
    sliceStart = e;
    if(i === all.length - 1 && e < text.length) {
      ns += text.slice(sliceStart);
    }
  })
  return ns;
}
export default {
  name: "LabelListItem",
  props:{
    /**
     * {
     *   label,
     *   highlights: [
     *     [0, 20]
     *   ]
     * }
     */
    itemData: {
      type: Object
    }
  },
  computed: {
    highlights() {
      return this.itemData?.highlights;
    },
    label(){
      let label = this.itemData?.label;

      if(this.highlights) {
        label = applyHighlights(label, this.highlights)
      }
      return label;
    }
  }
}
</script>

<style scoped>

</style>