<template>

    <div class="deep-link-controller"></div>

</template>




<script>

import featureMixin from "@/mixins/featureMixin";

import {mapGetters, mapActions} from "vuex";

import AppConfig from "@/classes/AppConfig";

export default {

    name: "DeepLinkController",
    mixins: [featureMixin],

    data() {
        return {
            waysToSave: '',
            category: '',
            savings: 0,
            search: ''
        }
    },

    computed: {
        ...mapGetters('filters', ["filtersByName"]),
        openFilterPanel(){
            if(AppConfig.AppConf?.title.toLowerCase().includes("ct".toLowerCase())){
                this.setFilterPanelState(true);
                return true
            }
            else return false
        }

    },

    methods: {
        ...mapActions('filters', ["setFilterPanelState"]),
    },

    mounted() {
        this.search = this.$route.query?.searchTerm;
        const categoryParam = decodeURIComponent(this.$route.fullPath?.match(/category=(.*)/)?.[1]);
        this.category = categoryParam.includes('&') ? categoryParam : this.$route.query?.category;
        this.savings = this.$route.query?.savings;
        this.waysToSave = this.$route.query?.waysToSave;

        if (this.search) {
            this.filtersByName['text'].value = this.search;
            this.openFilterPanel
        }

        if (this.category) {
            const sections = this.filtersByName['category']?.sections;
            sections?.forEach((section) => {
                section?.items?.forEach((item) => {
                
                  if (item?.label.toUpperCase() === this.category.toUpperCase()) {
                    item.checkbox.selected = true;
                    this.openFilterPanel
                  }

                  item?.subItems?.forEach((subItem) => {
                    if (subItem.label === this.category.toUpperCase()) {
                        subItem.checkbox.selected = true
                        this.openFilterPanel
                    }
                })
             })
            })
        }

        if (this.savings) {
            let saving = this.filtersByName['saving']?.items;
            if (this.filtersByName['saving']) {
                saving.forEach((saving) => {
                    if (saving.label.includes(this.savings)) {
                        saving.selected = true;
                        this.openFilterPanel
                    }
                })
            }
        }

        if (this.waysToSave) {
            let waysToSave = this.filtersByName['waysToSave']?.sections[0]
            waysToSave.items.forEach((item) => {
                if (item.label.toUpperCase() === this.waysToSave.toUpperCase()) {
                    item.checkbox.selected = true;
                }
            })
        }
    }
}

</script>




<style scoped>

.deep-link-controller {
    display: none;
}

</style>