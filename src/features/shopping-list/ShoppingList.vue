<template>
  <div v-if="enabled" class="modal-wpr" :class="{'showFilters':showFilters }" v-show="showShoppingList" tabindex="0" ref="shoppingListPopUp" @click="closeShoppingList">
		<config-style-injector :root-selector="`${$options._scopeId}.modal-wpr`" :config="config" />
    <div :class="`modal ${flyerOrientation}`" @click.stop="" v-click-outside="onClickOutside" >
      <div class="header" >
        <span class="shoppingListTitle">{{ content.shoppingList.shoppingListTitle }}</span>
        <button class="close-btn" :aria-label="content.shoppingList.closeShoppingList" @click="closeShoppingList">
            <img src="/images/icon-close-white.svg" alt="Close">
        </button>
      </div>

      <div class="content">
        <div :class="`content-container ${flyerOrientation}`">
          <!-- <div :class="`${flyerOrientation}`"> -->
          <!-- ITEMS IN SHOPPING LIST CODE STARTS-->

          <div class="itemsContainer" v-if="shoppingList.length>0">
            <div class="itemElement" v-for="product in shoppingList" :key="product.sku">
              <div class="left_section">
                <img :src="product.productImage" class="productImage" alt="">
              </div>
              <div class="productDetailsContainer">
                <div class="row1">
                  <div class="productTitle">{{product.productFr}} <span v-show="product.productFr && product.productEn">|</span> {{ product.productEn }} </div>

                  <div class="qtyGroup">
                    <button class="qty-out" :disabled="product.quantity == 1" @click="handleQtyChange(product.sku,'minus')">
                      <!-- <img :alt="content.qtyOut" src="/images/icon-decrease.svg" /> -->
                      <svg width="12px" height="2px" viewBox="0 0 12 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <title>icon - decrease-size copy 2</title>
                        <g id="TransCon-Direction" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="SuperC---ShoppingList---EN" transform="translate(-1808.000000, -173.000000)" fill="#545454" fill-rule="nonzero">
                            <polygon id="icon---decrease-size-copy-2" points="1820 175 1808 175 1808 173 1820 173"></polygon>
                          </g>
                        </g>
                      </svg>
                    </button>
                    <div class="qty-percent">{{ product.quantity }}</div>
                    <button class="qty-in"
                            @click="handleQtyChange(product.sku,'plus')">
                      <!-- <img :alt="content.qtyIn" src="/images/icon-increase.svg" /> -->
                      <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="TransCon-Direction" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="SuperC---ShoppingList---EN" transform="translate(-1872.000000, -168.000000)" fill="#545454" fill-rule="nonzero">
                            <polygon id="icon---increase-size-copy-2" points="1884 174.857143 1878.85714 174.857143 1878.85714 180 1877.14286 180 1877.14286 174.857143 1872 174.857143 1872 173.142857 1877.14286 173.142857 1877.14286 168 1878.85714 168 1878.85714 173.142857 1884 173.142857"></polygon>
                          </g>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="row2">
                  <div class="validity" v-if="!product.productImage.includes('generic')">
                    <span><strong>{{  content.shoppingListValidFrom }} </strong></span>
                    <span class="date" v-html="flyerDate(product.validFrom,product.validTo)"></span>
                  </div>
                </div>

                <div class="row3">
                  <!-- <div class="salePrice">{{ product.salePrice }}</div> -->

                  <div class="salePrice" v-if="product.salePrice==='$NaN' || product.salePrice==='NaN$' || product.salePrice==='' || product.salePrice==null "></div>
                  <span class="salePrice" v-else-if="product.salePrice==='3.99 à 7.99' && language=='fr'">
                  3,99$ à 7,99$</span>
                   <span class="salePrice" v-else-if="product.salePrice==='3.99 à 7.99' && language=='en'">
                  $3.99 à $7.99</span>
                  <div v-else class="salePrice">
                    <span> {{ product.salePricePrefix }} </span>
                    <span v-if="product.priceQuantity">{{ product.priceQuantity }}/ </span>
                {{ product.salePrice }}</div>

                  <span v-if="product.promoUnitFr"> {{ product.promoUnitFr }}  </span>
                  <button class="delIcon" @click.stop.prevent="handleDeleteItem(product)">
                    <!-- <img src="images/icon-trash.svg" class="delIcon" @click="handleDeleteItem(product)"> -->
                    <svg width="33px" height="33px" viewBox="0 0 33 33" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>{{ content.shoppingList.deleteItem }}</title>
                      <g id="TransCon-Direction" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="SuperC---ShoppingList---FR" transform="translate(-1863.000000, -213.000000)">
                          <g id="Trash" transform="translate(1863.954673, 213.500445)">
                            <rect id="Rectangle" x="0" y="0" width="32" height="32"></rect>
                            <path d="M26.9995112,6 L22,6 L22,5 C21.9981277,3.34392191 20.6560781,2.00187233 19,2 L13,2 C11.3439219,2.00187233 10.0018723,3.34392191 10,5 L10,6 L4.99951125,6 C4.4472265,6 3.99951125,6.44771525 3.99951125,7 C3.99951125,7.55228475 4.4472265,8 4.99951125,8 L5.99951125,8 L5.99951125,26 C6.0007739,27.1040461 6.89546518,27.9987373 7.99951125,28 L23.9995112,28 C25.1035573,27.9987373 25.9982486,27.1040461 25.9995112,26 L25.9995112,8 L26.9995112,8 C27.551796,8 27.9995112,7.55228475 27.9995112,7 C27.9995112,6.44771525 27.551796,6 26.9995112,6 L26.9995112,6 Z M14,21 C14,21.5522847 13.5522847,22 13,22 C12.4477153,22 12,21.5522847 12,21 L12,13 C12,12.4477153 12.4477153,12 13,12 C13.5522847,12 14,12.4477153 14,13 L14,21 Z M20,21 C20,21.5522847 19.5522847,22 19,22 C18.4477153,22 18,21.5522847 18,21 L18,13 C18,12.4477153 18.4477153,12 19,12 C19.5522847,12 20,12.4477153 20,13 L20,21 Z M20,6 L12,6 L12,5 C12.0006317,4.44797711 12.4479771,4.00063167 13,4 L19,4 C19.5520229,4.00063167 19.9993683,4.44797711 20,5 L20,6 Z" id="Shape" fill="#ADADAD" fill-rule="nonzero"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </button>

                </div>
              </div>

            </div>
          </div>
          <div v-else class="itemsContainer" style="display:flex; justify-content: center;  flex-direction: column; padding:20px;text-align: center" >

            <h3 class="h3-fontsize"><strong>{{ content.shoppingList.noItemsInSLTitle }}</strong></h3><br/>
            <p class="p-fontsize" >{{ content.shoppingList.noItemsInSLMsg }} </p>
          </div>

          <!-- ITEMS IN SHOPPING LIST ENDS -->
          <div class="addItemContainer">
            <div class="addItemContainer_content">
              <input type="text"  :placeholder="content.shoppingList.addItemPlaceholder"
                     :aria-label="content.shoppingList.addItemPlaceholder"
                     class="txtAddItem"
                     v-model="additionalItem"
                     tabindex="0"
                     ref="additional-item"
                     @keyup.enter="handleAdditionalItem"
                     @focus="setAdditionalItemInputFocus(true)"
                     @blur="setAdditionalItemInputFocus(false)"
              >
              <button class="addItem" @click="handleAdditionalItem" aria-label="addItem" :disabled="additionalItem.length<2">{{ content.shoppingList.addItem }}</button>
            </div>
          </div>

          <div class="optionsContainer" v-if="shoppingList.length>0">
              <button class="btnOptions"  @click="toggleEmail(!email.value)"><img :src="getImage('email')" alt="Email"></button>
              <button class="btnOptions"  @click="handlePrint"> <img :src="getImage('print')" alt="Print"> </button>
              <button class="btnOptions"  @click="toggleClear(!clear.value)"><img :src="getImage('clear')" alt="Clear"></button>

            <div class="emailBody" v-if="email.emailReady && !email.emailSent && !emailError">
              <span class="emailTitle">
                <span>{{ content.shoppingList.emailTitle }}</span>
                <button class="emailClose" @click.stop.prevent="closeEmail">
                   <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path id="a" d="M15.83 5.34l-1.17-1.17L10 8.82 5.34 4.17 4.17 5.34 8.82 10l-4.65 4.66 1.17 1.17L10 11.18l4.66 4.65 1.17-1.17L11.18 10z"/>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <mask id="b" fill="#fff">
                            <use xlink:href="#a"/>
                            </mask>
                            <g mask="url(#b)" fill="#80868B">
                            <path d="M0 0h20v20H0z"/>
                            </g>
                        </g>
                    </svg>
                   </button>
              </span>
              <div class="emailMessage"> {{ content.shoppingList.emailWarning }} </div>

              <div class="emailTxtBoxContainer">
                <input type="text"  :placeholder="content.shoppingList.emailPlaceholder"
                       aria-label="Entrez votre adresse courriel"
                       class="txtAddItem"
                       ref="search-input"
                       v-model="emailAddress"
                       tabindex="0"
                       @keyup.enter="handleEmail()"
                       @focus="setEmailInputFocus(true)"
                       @blur="setEmailInputFocus(false)"

                >
                <button class="addItem" @click.stop.prevent="handleEmail()" aria-label="addItem" :disabled="isValidEmail">{{ content.shoppingList.send }}</button>
              </div>
            </div>

            <div class="emailBody" v-if="clear.clearReady && !clear.clearDone">
              <span class="emailClose" @click.stop.prevent="closeClear">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <defs>
                          <path id="a" d="M15.83 5.34l-1.17-1.17L10 8.82 5.34 4.17 4.17 5.34 8.82 10l-4.65 4.66 1.17 1.17L10 11.18l4.66 4.65 1.17-1.17L11.18 10z"/>
                      </defs>
                      <g fill="none" fill-rule="evenodd">
                          <mask id="b" fill="#fff">
                          <use xlink:href="#a"/>
                          </mask>
                          <g mask="url(#b)" fill="#80868B">
                          <path d="M0 0h20v20H0z"/>
                          </g>
                      </g>
                  </svg>
                </span>
              <div class="clearTitle">
                <span style="text-align: center">{{ content.shoppingList.clearTitle }}</span>
              </div>
              <div class="clearBtnContainer">
                <button class="clearItemYes" @click.stop.prevent="handleClear"  aria-label="yes">{{ content.shoppingList.yes }}</button>
                <button class="clearItemNo"  @click.stop.prevent="closeClear" aria-label="no">{{ content.shoppingList.no }}</button>
              </div>
            </div>

            <div class="emailSent" v-if="!email.emailReady && email.emailSent && !emailError">
            <span class="emailClose" @click.stop.prevent="closeEmail">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path id="a" d="M15.83 5.34l-1.17-1.17L10 8.82 5.34 4.17 4.17 5.34 8.82 10l-4.65 4.66 1.17 1.17L10 11.18l4.66 4.65 1.17-1.17L11.18 10z"/>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <mask id="b" fill="#fff">
                            <use xlink:href="#a"/>
                            </mask>
                            <g mask="url(#b)" fill="#80868B">
                            <path d="M0 0h20v20H0z"/>
                            </g>
                        </g>
                    </svg>
               </span>
              <div class="emailSentTitle">
                <span>{{content.shoppingList.emailSentTitle}}</span>
              </div>
              <div class="emailSentMessage">
              <span  class="emailSentCheck">
                <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <title>icon - checkmark</title>
                    <g id="TransCon-Direction" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="SuperC---ShoppingList---FR---Email-Confirmation" transform="translate(-1517.000000, -764.000000)" fill="#333333" fill-rule="nonzero">
                            <path d="M1533,764 C1524.16429,764 1517,771.164286 1517,780 C1517,788.835714 1524.16429,796 1533,796 C1541.83571,796 1549,788.835714 1549,780 C1549,771.164286 1541.83571,764 1533,764 Z M1541.20714,774.65 L1531.27143,787.4 C1531.19286,787.478571 1531.06429,787.65 1530.90714,787.65 C1530.74286,787.65 1530.63571,787.535714 1530.54286,787.442857 C1530.45,787.35 1524.90714,782.021429 1524.90714,782.021429 L1524.8,781.914286 C1524.75714,781.85 1524.72143,781.771429 1524.72143,781.685714 C1524.72143,781.6 1524.75714,781.521429 1524.8,781.457143 C1524.82857,781.428571 1524.85,781.407143 1524.87857,781.371429 C1525.42857,780.792857 1526.54286,779.621429 1526.61429,779.55 C1526.70714,779.457143 1526.78571,779.335714 1526.95714,779.335714 C1527.13571,779.335714 1527.25,779.485714 1527.33571,779.571429 C1527.42143,779.657143 1530.55,782.664286 1530.55,782.664286 L1538.5,772.45 C1538.57143,772.392857 1538.65714,772.35 1538.75,772.35 C1538.84286,772.35 1538.92857,772.385714 1539,772.442857 L1541.18571,774.164286 C1541.24286,774.235714 1541.27857,774.321429 1541.27857,774.414286 C1541.28571,774.507143 1541.25,774.585714 1541.20714,774.65 L1541.20714,774.65 Z" id="icon---checkmark"></path>
                        </g>
                    </g>
                </svg>
              </span>
                <span><b>{{ content.shoppingList.emailSentMessage }}</b> <br/> {{ content.shoppingList.emailSentMessage2 }}</span>
              </div>

              <p class="emailSentMessage"><a href="#" @click.stop.prevent="handleResend">{{ content.shoppingList.emailSentResent }}</a></p>
            </div>

            <div class="emailSent" v-if="!email.emailReady && !email.emailSent && emailError">
            <span class="emailClose" @click.stop.prevent="closeEmail">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path id="a" d="M15.83 5.34l-1.17-1.17L10 8.82 5.34 4.17 4.17 5.34 8.82 10l-4.65 4.66 1.17 1.17L10 11.18l4.66 4.65 1.17-1.17L11.18 10z"/>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <mask id="b" fill="#fff">
                            <use xlink:href="#a"/>
                            </mask>
                            <g mask="url(#b)" fill="#80868B">
                            <path d="M0 0h20v20H0z"/>
                            </g>
                        </g>
                    </svg>
               </span>
              <div class="emailSentTitle">
                <span>{{content.shoppingList.emailErrorTitle}}</span>
              </div>
              <div class="emailSentMessage">
                <span>{{ content.shoppingList.emailErrorMsg1 }}<br/> {{ content.shoppingList.emailErrorMsg2 }}</span>
              </div>

              <p class="emailSentMessage"><b> {{ content.shoppingList.emailErrorMsg3 }} </b> </p>
            </div>

          </div>
          <div class="emailBody1" v-if="!clear.clearReady && clear.clearDone && shoppingList.length==0">
            <div class="clearDone">
              <span>{{ content.shoppingList.clearDoneMessage }}</span>
            </div>

            <p style="text-align: center;margin-bottom: 8px"><button class="clearItemYes" @click.stop.prevent="closeClear" aria-label="yes">{{ content.shoppingList.clearClose }}</button></p>
          </div>


        </div>


      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import moment from "moment";
import featureMixin from "@/mixins/featureMixin";
import ConfigStyleInjector from "@/components/style-injector/ConfigStyleInjector.vue";
import AppConfig from "@/classes/AppConfig";

export default {
	components: {ConfigStyleInjector},
	mixins:[featureMixin],
  props:{
    deal: String,
  },

	data() {
    return {
			featurePath: 'shoppingList',
      ready: false,
      additionalItem:'',
      email:{
        value:false,
        emailReady:false,
        emailSent:false,
      },
      emailAddress:'',
      clear:{
        value:false,
        clearReady:false,
        clearDone:false
      },

    }
  },

  computed: {
    ...mapGetters(['content', 'language']),
    ...mapGetters('screen', ['flyerOrientation']),
    ...mapState('shoppingList',['showShoppingList','shoppingList','emailError']),
    ...mapGetters('landingPage', ['currentFlyer']),
    ...mapState(['showFilters']),


    isValidEmail(){
      return !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.emailAddress)
    },

  },


  methods: {
    ...mapActions('shoppingList',['setAdditionalItemInputFocus','toggleShoppingList','setAddToList','skuAddToList','setRemoveFromList','quantityChange','clearAll','sendEmail','setEmailError','setEmailInputFocus']),

    getImage(val){
      if(val==="email"){
        if(this.email.value)
          return `/images/Email-${this.language}-GRN.svg`

        else
          return `/images/Email-${this.language}-Grey.svg`
      }
      if(val=="clear"){

        if(this.clear.value)
          return `/images/Clear-${this.language}-GRN.svg`

        else
          return `/images/Clear-${this.language}-Grey.svg`
      }
      if(val=="print")
        return `/images/Print-${this.language}-Grey.svg`
    },

    closeHelp(){
      if(this.ready){
        this.toggleShoppingList(false);
        // console.log('close shoppinglist');
      }
    },

    handleQtyChange(sku,operation){
      this.quantityChange({sku,operation});
    },

    closeEmail(){
      this.email.value=false;
      this.email.emailReady=false;
      this.email.emailSent=false;
      this.setEmailError(false);
      this.emailAddress=''
    },
    closeClear(){
      this.clear.value=false;
      this.clear.clearReady=false;
      this.clear.clearDone=false;
    },

    flyerDate(validFrom,validTo){
      const start = validFrom ? moment.utc(validFrom) : '';
      const endDate = validTo ? moment.utc(validTo) : '';
      if (this.language === 'en') {
          return `${start.locale('en').format('MMMM D, YYYY')} to ${endDate.locale('en').format('MMMM D, YYYY')}`;
      } else {
        return `${start.format('D MMMM, YYYY').replace('1er', '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')} jusqu'au ${endDate.format('D MMMM, YYYY').replace('1er', '1<sup style="vertical-align: top; font-size: 8px;">er</sup>')}`;
      }
    },

    handleDeleteItem(element){
      this.setRemoveFromList(element);
    },

    handleAdditionalItem() {
      if(this.additionalItem == '')  return

      const additionalItemFlag = true;
      const additionalItem = this.additionalItem
      this.additionalItem='';
      this.clear.value=false;
      this.email.value=false;
      this.setAddToList({ additionalItem, additionalItemFlag});

    },

    handlePrint(){

      var i=0;
      var printWindow = window.open("");
        printWindow.document.write(`<html><head><link rel="icon" href="./images/metro_favicon.png"><title>${AppConfig?.AppConf?.title}-Print ShoppingList</title></head><style>
.print_container_background{
  /*overflow-y:visible;*/
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: opacity .3s ease;
}

.print_container{
  width: 700px;
  /* display: flex;
  justify-content: space-between; */
  font-weight: bold;
  margin-top: 15px;
}
.print_header {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-right: 10px;
  align-items: center;
  border-top: 1px solid lightgrey;
  border-right: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
}

.logo{
  width:220px;
}

.title{
  font-size:20px;
  font-weight: bold;
}

.print_quantity {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  align-items: center;
  padding: 20px 10px 10px 10px;
  border-bottom: 3px solid lightgrey;
  font-size: 14px;
}

a{
  cursor: pointer;
  color:#0000EE;
  text-display: block;
  text-decoration: underline;
  font-size: 12px;;
}

.productImage{
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: 37px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.itemElement{
  display:flex;
  justify-content: space-between;
  padding:15px;
  border-bottom: 1px solid lightgrey;
  align-items: center;
}

.checklist {
  width: 35px;
  height: 35px;
  border: 1px solid gray;
  left: 5px;
  top: 0;
  bottom: 0;
  /* margin: auto; */
  cursor: pointer;
}

.productDetails {
  display: flex;
  flex-direction: column;
  width:75%;
}

.productTitle, .productPrice{
  font-weight: bold;
  font-size: 13px;
}

.productPrice {
  font-size: 14px;
}

.validityTitle {
  font-size: 12px;
}

.validityDate {
  font-size: 12px;
  /* color: var(--primary-color); */
  color: #EE3124;
  margin-left: 2px;
  font-weight: 500;
}

.disclaimer {
  font-size: 10px;
  font-weight: 400;
  margin-top: 15px;
}

@media print{
* {
    display:inline;
    overflow: auto !important;
}
script, style {
    display:none;
}
.itemElement{
page-break-inside: avoid;
}
}

</style>` +
          `<body style="font-family: Lato, sans-serif;">`);
      printWindow.document.write(`<body>`+
          `<div class="print_container_background">
            <div class="print_container">
              <div class="row">
                <a onclick="window.print();">`+ this.content.shoppingList.shoppingListPrint+ `</a>
            </div>`+

          `<div class="print_header">
                <img src='/images/${AppConfig?.AppConf?.title}_logo.jpg' class="logo">
                <div class="title">`+ this.content.shoppingList.shoppingListTitle +`</div>
            </div>

            <div class="print_quantity">
              <div>`+ this.shoppingList.length +` `+ this.content.shoppingList.items +`</div>
              <div>`+ this.content.shoppingList.productQuantityTitle +`</div>
            </div>
            <div class="itemsContainer">`)

      while (i < this.shoppingList.length) {
        printWindow.document.write(`<div class="itemElement">
                    <span class="checklist"> </span>
                    <span style="width:10%">
                        <img src="`+this.shoppingList[i].productImage+`" class="productImage" alt=`+this.shoppingList[i].productEn+`>
                    </span>
              <div class="productDetails">
                <span class="productTitle">`)
        if(this.shoppingList[i].productFr !==null)
          printWindow.document.write(`<span>`+this.shoppingList[i].productFr + `</span>`)

        if(this.shoppingList[i].productEn && this.shoppingList[i].productFr)
          printWindow.document.write(`<span> | </span>`)

          if(this.shoppingList[i].productEn !==null)
              printWindow.document.write(this.shoppingList[i].productEn)

          printWindow.document.write(`<br/>`)

        if (this.shoppingList[i].priceQuantity){
            printWindow.document.write(
          `<span  class="productPrice">` +
          this.shoppingList[i].priceQuantity + `<span>/ </span>` +
            this.shoppingList[i].salePrice +
            `</span>` );
        }

        else {
          printWindow.document.write(`<span class="productPrice">`);
          if(this.shoppingList[i].salePricePrefix)
            printWindow.document.write(`<span>`+this.shoppingList[i].salePricePrefix+ ' '+this.shoppingList[i].salePrice+`</span>`)
          else
            printWindow.document.write(this.shoppingList[i].salePrice +
                `</span>`);
        }
        if(!this.shoppingList[i].productImage.includes('generic')) {
          printWindow.document.write(`<div>
                <span class="validityTitle">` +
              this.content.shoppingList.shoppingListValidFrom +
              `:</span> <span class="validityDate">` + this.flyerDate(this.shoppingList[i].validFrom, this.shoppingList[i].validTo) + `</span></div>`)
        }
            printWindow.document.write(`
         </div>
      <div>`+this.shoppingList[i].quantity +`</div>
    </div>`)
        i++;
      }
      printWindow.document.write(`<div class="disclaimer">`+ this.content.shoppingList.printDisclaimer +`</div>`
          +`</body></html>`)
    },

    closeShoppingList() {
      if (this.showShoppingList) {
        this.additionalItem=''
        this.emailAddress=''
        this.email.value=false;
        this.email.emailReady=false;
        this.email.emailSent=false;
        this.setEmailError(false);
        this.clear.value=false;
        this.clear.clearReady=false;
        this.clear.clearDone=false;
        this.toggleShoppingList(false);
      }
    },

	  onClickOutside() {
			if(this.ready) {
				this.closeShoppingList();
			}
	  },

	  // closeShoppingList1() {
    //   //console.log( this.ready);
    //   if (this.ready) {
    //     this.toggleShoppingList(false);
    //     //console.log("click outside sl", this.ready);
    //   }
    // },

    toggleEmail(val){
      this.email.value = val
      if(this.email.value){
        this.email.emailReady=true;
        this.email.emailSent=false;
        this.setEmailError(false);
        this.clear.value=false;
        this.clear.clearReady=false;
        this.clear.clearDone=false;

      }
      else{
        this.email.emailReady=false;
        this.email.emailSent =false;
        this.setEmailError(false);
      }

    },

    toggleClear(val){
      this.clear.value = val
      if(this.clear.value){
        this.clear.clearReady=true;
        this.clear.clearDone=false;
        this.email.value=false;
        this.email.emailReady=false;
        this.email.emailSent=false;
        this.setEmailError(false);
      }
      else{
        this.clear.clearReady=false;
        this.clear.clearDone =false;
      }

    },
    getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(window.location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    async handleEmail(){
      if(this.emailAddress=='')
        return

      if(!this.isValidEmail){
        this.email.emailReady=false;
        let emailBody = {
          deal:this.deal,
          storeId : this.getUrlParameter("storeId"),
          lang: this.getUrlParameter("language") === "fr" ? "bil" : "en",
          shoppingList: this.shoppingList,
          to:this.emailAddress
        }

        // console.log(emailBody);
        await this.sendEmail(emailBody);

        // this.emailAddress=''
        if(this.emailError==false)
          this.email.emailSent=true;
      }
    },

    handleResend(){
      this.email.emailSent=false;
      this.email.emailReady=true;
    },

    handleClear(){
      this.clear.clearReady = false;
      this.clear.clearDone=true;
      this.clearAll()
      setTimeout(()=> this.clear.clearDone=false,9000)
    },

  },

  watch:{
    showShoppingList(v){
      if(v){
        setTimeout(() => {
          this.ready = true;
        }, 1000)
      }
      this.ready = false;
    }
  },

  mounted() {
    // console.log(this.$refs.shoppingListPopUp);
    const shoppingListPopUpFocus = this.$refs.shoppingListPopUp;
    shoppingListPopUpFocus.focus();

    const skuAddToList = this.skuAddToList;
    const setRemoveFromList = this.setRemoveFromList;
    window.addEventListener('message', async event => {
      if (event.data.action === 'addToShoppingList') {
        // add to shopping list
        const skuAdded = await skuAddToList(event.data.sku)

        // confirm added to shopping list
        if (skuAdded) {
          window.parent.postMessage({action: 'confirmation', message: `${event.data.sku} added to shopping list.`}, '*')
        } else {
          window.parent.postMessage({action: 'error', message: `${event.data.sku} wasn't found.`}, '*')
        }
      }
      if (event.data.action === 'removeFromShoppingList') {
        // delete from shopping list
        const skuAdded = await setRemoveFromList({sku: event.data.sku})

        // confirm deleted from shopping list
        if (skuAdded) {
          window.parent.postMessage({action: 'confirmation', message: `${event.data.sku} removed from shopping list.`}, '*')
        } else {
          window.parent.postMessage({action: 'error', message: `${event.data.sku} wasn't found.`}, '*')
        }
      }
    }, false);

  }
}
</script>

<style lang="scss" scoped>

.left_section{
  margin-right:15px;
  height: 55px;
  width: 20%;
  float: left;
}
.productDetailsContainer {
  display: flex;
  flex-direction: column;
}

.row1{
  display:flex;
  justify-content: space-between;
}

.row3{
  display:flex;
  justify-content: space-between;
  padding-top: 12px;
}

.itemsContainer{
  min-height:150px;
  max-height:275px;
  //max-width: calc(100vw - 6em);
  overflow-y:auto;
  padding:0 10px 0 10px;
}
.h3-fontsize {
  font-size: 17px;
  padding:0 15px 0 15px;
  line-height: 1.4em;
}
.p-fontsize {
  font-size: 15px;
  padding:0 15px 0 15px;
}

/* width */
::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
  //background: #f1f1f1;
  display:none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.itemElement{
  // display:flex;
  // justify-content: space-between;
  //justify-content: center;
  border-bottom: 1px solid lightgrey;
  //margin-bottom: 15px;
  padding: 10px 5px;
}

.productTitle{
  font-size:15px;
  font-weight: bold;
  line-height:1.1em;
  padding-right: 10px;
  word-break: break-word;
}

.productImage{
  //height:50px;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.validity{
  font-size:13px;
}

.delIcon{
  cursor:pointer;
  // height:28px;
}

.salePrice{
  font-size:15px;
  font-weight: bold;
}

.right_section{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.optionsContainer{
  position: relative;
  display:flex;
  justify-content: center;
  flex:0.9;
  //max-width: calc(100vw - 6em);
  padding:0 10px 10px 10px;
}

.btnOptions{
  // width:30%;
  padding: 10px 5px 0 5px;
  cursor:pointer;
  border-radius:5px;
  border:none;
}
.btnOptions > img {
  object-fit: contain;
  margin-right:5px;
  max-width:125px;
  //width:120px;
  width:100%;
}

.clear{
  background-color: green;
  color:white;
}

.qtyGroup {
  display: flex;
  justify-self: end;
  /*margin: 0 2px;*/
  border: 1px solid #BBB;
  border-radius: 4px;
  height: 34px;
}

.qtyGroup > * {
  background: none;
  border: 0;
}

.qty-in {
  font-size: 0px;
  line-height: 0;
}

.qty-in:disabled {
  opacity: 0.5;
  cursor: inherit;
}

.qty-percent {
  font-size: 14px;
  color: #545454;
  display: flex;
  align-items: center;
  padding-bottom: 1px;
}

.qty-out {
  font-size: 0px;
  line-height: 0;
}

.addItemContainer{
  //max-width: calc(100vw - 6em);
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 103;
  background-color: #FFF;
  padding-bottom: 10px;
  padding-top: 3px;
  .addItemContainer_content{
    display: flex;
    width: 100%;
    justify-content: center;
    //max-width: calc(100vw - 6em);
  }
}

.emailTxtBoxContainer{
  //margin-top:10px;
  display:flex;
  justify-content: center;
  margin: 10px auto;
}

.txtAddItem{
  flex:0.9;
  outline:none;
  //flex-grow: 1;
  border-style: solid;
  border-radius: 3px;
  border-width: 1px;
  text-indent: 1em;
  font-size: 11px;
  width: 90%;
}
.mobile {
  display: none !important;
  flex-flow: column;
  row-gap: 2em;
  padding: 1.5em;
  .description{
    display: flex;
    flex-flow: row;
    text-align: left;
    align-items: flex-end;
    > :first-child{
      width: calc(55px + 1em);
    }
    .mobile-content{
      flex-basis: 100%;
    }
  }
}

.addItem{
  //width: 25%;
  padding:10px;
  background-color: var(--tertiary-color);
  color:#FFF;
  border: none;
  border-radius: 3px;
  margin-left: -2px;
  font-weight: 200;
}

.addItem:disabled{
  background-color: var(--primary-color);
  opacity:0.6;
}

.modal-wpr {
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 20;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-flow: column;



  .modal {
    background-color: var(--secondary-color);
    /*margin-top: 75px;*/
    border: 1px solid #BBBBBB;
    /* overflow: auto;*/
    max-height: calc(100% - 1em);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
    display:flex;
    flex-flow: column;
    max-width: calc(100% - 4em);

    .header {
      background-color: var(--secondary-color);
      color: var(--primary-text-color);
      display: flex;
      justify-content: space-between;
      padding: 10px;

      h2 {
        font-size: 18px;
        text-transform: uppercase;
        font-weight: 400;
      }

      .close-btn {
        cursor: pointer;
        &:hover{
          background: none;
          filter: unset;
        }
      }
    }

    .subtitle {
      padding-top: 6px;
      font-size: 12px;
    }

    .content {
      //padding: 8px;
      background-color: #FFF;
      color: #545454;
      position: relative;
      flex: 1 0 auto;
      overflow: hidden;
      // margin:0px 10px 10px 10px;
      margin: 10px;
      min-height:200px;
      // overflow-y: scroll;
      max-width:400px;
      max-height: calc(100% - 3.5em);
      /*.scroll-container{
        position: absolute;
        top:0px;
        bottom:0px;
        left:0px;
        right:0px;
      }*/
      .content-container{
        text-align:left;
      }

      .f-half {
        display: flex;
        column-gap: 1em;

        flex-direction: column;

        > div {
          flex-basis: 100%;
          display: flex;
          flex-flow: column;
        }
      }

      .content-container{
        // width: 380px;
      }

      .feature {
        background: #eee;
        margin: 12px 0;
        display: flex;
        justify-content: center;
        flex: 1;
        .description {
          display: flex;
          font-size: 14px;
          padding: 15px 0;

          .button-preview {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 20px;

            h4 {
              text-transform: uppercase;
              padding-top: 16px;
              white-space: nowrap;
            }

            .subtitle {
              text-align: center;
            }
          }
        }
      }
    }
    .emailBody{
      background-color: lightgrey;
      // margin-top:5px;
      max-width: calc(100vw - 6em);
      position: absolute;
      bottom: 86%;
      //background: #EDEDED;
      margin-bottom: 3px;
      padding: 4px;
      z-index: 111;
      width: 100%;
    }
    .emailBody1{
      background-color: lightgrey;
      max-width: calc(100vw - 6em);
      //position: absolute;
      bottom: 0%;
      //margin-bottom: 3px;
      padding: 4px;
      z-index: 111;
      width: 100%;
    }
    .emailTitle{
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      padding:10px;
      font-size:15px;
    }
    .emailMessage{
      margin-left:10px;
      margin-right:10px;
      font-size:14px;
    }

    .emailSent{
      // background-color: lightgrey;
      // padding:5px;
      // margin-top:5px;

      background-color: lightgrey;
      // margin-top:5px;
      max-width: calc(100vw - 6em);
      position: absolute;
      bottom: 86%;
      //background: #EDEDED;
      margin-bottom: 3px;
      padding: 4px;
      z-index: 111;
      width: 100%;
    }

    .emailSentTitle{
      font-weight: bold;
      display: flex;
      justify-content: center;
      font-size: 15px;
      padding:5px;
      margin-bottom:5px;
    }
    .emailSentCheck{
      margin-right:10px;
    }

    .emailSentMessage{
      font-size:14px;
      display:flex;
      justify-content: center;
      margin-bottom: 5px;
    }
    .emailClose{
      cursor:pointer;
      display:flex;
      justify-content: flex-end;
    }
    .clearTitle{
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      margin-top:5px;
      padding:10px;
      font-size:15px;
    }
    .clearItemYes{
      width: 25%;
      padding:10px;
      background-color: var(--tertiary-color);
      color:#FFF;
      border: none;
      border-radius: 3px;
      margin-left: -3px;
      margin-right:5px;
    }
    .clearItemNo{
      width: 25%;
      padding:10px;
      background-color: var(--primary-color);
      opacity: 0.4;
      color:#FFF;
      border: none;
      border-radius: 3px;
      margin-left: -3px;
      margin-right:5px;
    }
    .clearBtnContainer{
      display: flex;
      justify-content: center;
      margin: 10px auto;
    }
    .clearDone{
      display:flex;
      justify-content: center;
      padding:20px;
      font-weight: 600;
      text-align: center;
    }
  }
}

.shoppingListTitle{
  font-size:20px;
  font-weight: bold;
}

button {
  background: transparent;
  // border: 1px solid #ccc;
  text-transform: uppercase;
  font-weight: 600;
  color: #666;
  border-radius: 4px;
  border: none;
}

button.button {
  background: #fff;
  border: 1px solid #ccc;
  text-transform: uppercase;
  font-weight: 600;
  color: #666;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 16px;
}

button.button:hover{
  background: #eee;
  color: #000;
}


.btn {
  background: #fff;
  border: 1px solid #BBB;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  color: #333;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
  cursor: auto;
  pointer-events: none;
}

.qty-group {
  display: flex;
  justify-self: end;
  /*margin: 0 2px;*/
  border: 1px solid #BBB;
  border-radius: 4px;
  height: 34px;
  background-color: #FFF;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
}

.qty-group > * {
  border: 0;
}

.qty-in {
  font-size: 0px;
  line-height: 0;
}

.qty-in:disabled {
  cursor: inherit;
}

.qty-percent {
  font-size: 14px;
  color: #545454;
  display: flex;
  align-items: center;
  padding-bottom: 1px;
}

.qty-100 {
  font-size: 14px;
  padding: 0 8px;
  border-left: 1px solid #BBB;
  cursor: inherit;
}

.qty-out {
  font-size: 0px;
  line-height: 0;
}

.qty-in, .qty-out{
  padding: 0px;
  width: 30px;
}

.qty-out img, .qty-in img{
  vertical-align: middle;
}



.qty-out:disabled {
  cursor: inherit;
  opacity: 0.5;
}

.btn.page {
  width: 100%;
  height: 28px;
  justify-content: flex-start;
  padding-left: 3%;
  margin-bottom: 8px;

  & + .subtitle {
    text-align: left !important;
  }
}
.page-num {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  border-radius: 4px;
  font-size: 12px;
  padding: 7px;
}

/*@media only screen and (max-width: 1024px){
  .modal-wpr .modal{
    .content {
      .f-half {
        flex-direction: column !important;
      }
      .content-container{
        width: 925px;
      }
    }
  }
}*/

.navigation{
  .description{
    flex-basis: 50%;
    justify-content: center;
  }
}



@media only screen and (max-height: 850px ) and (min-width: 1024px){
  .modal-wpr .modal{
    .content {
      .f-half {
        flex-direction: row !important;
      }
      .content-container{
        width: 400px;
      }
      .itemsContainer{
        // min-height: 84px;
        // max-height: 99px;
      }
    }
  }

}
// @media only screen and (max-height: 850px ) and (min-width: 600px){
//   .modal-wpr .modal{
//     .content {
//       .itemsContainer{
//           min-height: 84px;
//           max-height: 99px;
//         }
//     }
//   }
// }
@media only screen and (max-height: 450px ) {
  .modal-wpr .modal{
    .content {
      min-height:167px;
      overflow-y:auto;
      .content-container{

      }
    }
  }
}


@media only screen and (max-width: 700px){
  .modal-wpr .modal{
    .content {
      .content-container{
        // width: 575px;
        //width: 315px;
        .itemsContainer {
          //min-height:160px;
          max-height: 195px;
          .productImage{
            max-height: 80%;
            max-width: 80%;
          }
          .qtyGroup{
            height: 32px;;
          }
          .qty-in, .qty-out {
            width:29px;
          }
          .qty-percent {
            font-size: 14px;
          }
          .delIcon{
            cursor:pointer;
            // height:28px;
            svg{
              //height:30px;
              width:28px
            }
          }
        }
        .addItemContainer_content{
          display: flex;
          width: 100%;
          //justify-content: flex-start;
        }
      }
    }
  }
}

@media only screen and (max-width: 700px) {
  .modal-wpr .modal.vertical{
    max-width: calc(100% - 1em);
    .content {
      .content-container {
      .optionsContainer{
        padding: 6px 5px;
        column-gap: 10px;
          .btnOptions {
            padding: none;
            > img {
              min-width:110%;
              margin-right: unset;
              //transform: scale(1.2);
             }
          }
      }
      }
    }
  }
}


/* Vertical View Specific */
@media (min-width: 1200px) {


  .modal-wpr .modal.vertical .content .feature.navigation {
    /*.description {
      padding-top: 10px;
      padding-left: 100px;
      padding-bottom: 70px;
      position: relative;
    }*/

    /*.btn.page {
      transform: rotate(90deg);
      width: 146px;
      position: absolute;
      left: 0;
      bottom: 38%;
    }*/


    h4, .subtitle {
      text-align: left;
      width: 100%;
    }
    .subtitle + .subtitle {
      margin-top: 1em;
    }
  }
  .content-container{
    width: 400px;
  }
}
/*@media (max-width: 850px) {
  .modal-wpr{
    top:60px;
  }
  .modal-wpr.showFilters{
    top:175px !important;
  }
}

/*Tablet */
/*@media only screen
and (min-device-width: 768px)
and (max-device-width: 1024px)
{
  .modal-wpr{
    top:60px;
  }
  .modal-wpr.showFilters {
    top: 118px;
  }
}*/
/* Mobile */
/*@media (min-width: 1024px) and (max-width: 1200px) {
  .modal-wpr{
    top:65px;
  }
  .walkthrough {
    display: none;
  }
}*/
@media (max-width: 1200px) {
  .mobile {
    display: flex !important;
  }
  .desktop {
    display: none !important;
  }

  .modal {
    // width:338px;
  }

  .modal-wpr .modal {
    /* margin-top: 140px;
     width: 90% !important;*/
    //width: 338px;

    .content {
      .f-half {
        /*flex-direction: row !important;*/
      }
      .content-container{
        //width: 400px;
      }
    }

    .header {
      padding-bottom: 4px;
      h2 {
        font-size: 14px;
      }
    }
  }

  .heading {
    display: none;
  }
  .h3-fontsize {
    padding:0px;
  }
  .p-fontsize {
    padding:0px;
  }

  .modal-wpr .modal .content .feature {
    display: block;
    background: none;
    padding: 0 6%;

    .description {
      padding: 0;
      margin-bottom: 20px;
      height: 50px;
    }

    .button-preview {
      display: block;
      position: relative;
      padding-left: 60px;
      width: 100%;

      h4 {
        padding: 0;
      }

      .subtitle {
        text-align: left;
      }

      .btn {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .subtitle.mobile {
    text-align: center;
    margin-bottom: 20px;
  }
}


</style>
