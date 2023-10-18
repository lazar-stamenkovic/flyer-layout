<template>
    <div class="expanding-disclaimer" :style="{ width: containerWidth}" :class="{ border: (useExpansion || addCollapsible) && disclaimer, 'negative-margins': addCollapsible}" ref="expanding-container" @click.stop="toggleExpand">
      <button v-if="useExpansion || addCollapsible">
        <svg :class="{ flip: expanded }" width="16" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M16 .848c0-.343-.18-.652-.458-.783a.677.677 0 00-.81.184l-6.75 7.704L1.23.249a.677.677 0 00-1.015.04.936.936 0 00-.03 1.159L7.462 9.75a.7.7 0 00.525.249.7.7 0 00.525-.249l7.265-8.303a.91.91 0 00.223-.6z" fill="#333" fill-rule="nonzero"/></svg>
      </button>
       <p
        v-if="disclaimer"
        :class="{ collapsed: useExpansion && !expanded }"
        class="content"
        ref="disclaimer"
      >
        <span class="legal-start" v-if="useExpansion"> {{ content.legalDisclaimer }}</span>
        {{ disclaimer }}
      </p>
      <div v-else class="content image ad" :class="{ collapsed: !expanded }">
         <p>{{ content.legalDisclaimer }}</p>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  export default {
    props: {
      disclaimer: {
        type: String
      },
      alt: {
        type: String
      },
      containerWidth: {
      type: String
      },
      addCollapsible:{
        type: Boolean,
        default: false
      }
    },
  
    data() {
      return {
        useExpansion: false,
        expanded: false,
      }
    },
  
    computed: {
      ...mapGetters(['content']),
    
     
    },
   
    methods: {
      toggleExpand() {
        this.expanded = !this.expanded;
      },
    },
  
    mounted() {
      if (this.disclaimer) {
        const numLines = (this.$refs.disclaimer.offsetHeight - 10) / 14;
        if (numLines > 2) this.useExpansion = true;
      }
    }
  }
  </script>
  
  <style lang="scss">
  .expanding-disclaimer {
    display: flex;
    text-align: center;
    width: 100%;
  
    &.negative-margins {
      margin-bottom: -21px;
    }
    
    &.border {
      margin-top: -3px;
      border: 1px solid #D6D6D6;
    }
  
    button {
      border: none;
      border-radius: 0;
      background-color: #D6D6D6;
      z-index: 999;
    }
  
    svg {
      transition: transform 300ms ease-in-out;
  
      &.flip {
        transform: scaleY(-1);
      }
    }
  }
  
  .content {
    font-size: 11px;
    padding: 5px;
    line-height: 14px;
  
    &.image {
      padding: 0;
  
      p {
        text-align: left;
        color: #ED1C24;
        padding: 2px 5px;
      }
  
      img {
        width: 100%;
      }
    }
  
    &.collapsed {
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      display: -webkit-box;
      max-height: 40px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
  
      &:before {
        content:'';
        width:100%;
        height:100%;    
        position:absolute;
        left:0;
        top:0;
        background:linear-gradient(transparent, white);
        z-index: 1;
      }
    }
  
    .legal-start {
      color: #ED1C24;
  
    }
  }
  </style>