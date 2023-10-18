<template>
  <div class="error-page">
    <div v-if="errorType === 'lang'">
      <div class="lang-error">
        <h1>Cette circulaire n'est pas disponible en français pour la région sélectionnée</h1>
        <a :href="langRedirectURL">Cliquez ici pour voir les Circulaire en anglais ou sélectionnez un autre code postal</a>
      </div>
    </div>
    <div v-else-if="errorType === 'date'">
      <div class="lang-error">
        <h1>{{  content.errors.noFlyersMsg }}</h1>
        <a :href="langRedirectURL" class="red" v-on:click="langRedirectURL">{{  content.errors.noFlyerSubText }}</a>
      </div>
    </div>
    <div v-else-if="errorType === 'nodeal'">
      <div class="lang-error">
        <h1>{{  content.errors.dealNotFound }}</h1>
        <a :href="langRedirectURL" class="red" v-on:click="langRedirectURL">{{  content.errors.noFlyerSubText }}</a>
      </div>
    </div>
	  <div v-else-if="errorType === 'config'">
		  <div class="lang-error">
			  <h1>Configuration file not found!</h1>
			  <a :href="langRedirectURL" class="red" v-on:click="langRedirectURL">{{  content.errors.noFlyerSubText }}</a>
		  </div>
	  </div>
    <div v-else>
      <div class="lang-error">
        <h1>{{  content.errors.somethingWrong }}</h1>
        <a :href="langRedirectURL" class="red" v-on:click="langRedirectURL">{{  content.errors.noFlyerSubText }}</a>
      </div>
    </div>
    <div class="try-again" :class="{'no-show': isCTC}">
      <a :href="langRedirectURL"><button>Click here to try again</button></a>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import AppConfig from "@/classes/AppConfig";

export default {
  name: "ErrorPage",
  props: {
    type: {
      type: String,
      required: true
    },
  },
  mounted(){
    /*if(process.env.VUE_APP_API_URL.includes('metrodigital'))
      document.getElementById('icon').href='../metro_favicon.png'
    document.title = 'Metro - Error';*/
  },

  computed:{
    ...mapGetters(['content']),
    errorType() {
      return this.type;
    },
    isCTC(){
            if(AppConfig.AppConf?.title.toLowerCase().includes("ct".toLowerCase())){
                return true
            }
            else return false
        },
    langRedirectURL(){
      const query = this.$route.query;
      query.language = 'en';
      //return window.location.href.replace('language=fr', 'language=en');
      //hardcoded storeId, language and timeTravelDate since SuperC doesn't have a live flyer currently..
      // query.storeId='425';
      return this.$router.resolve({name:'Flyer', query}).resolved.fullPath;
    }
  },



}
</script>

<style scoped>
a {
  text-decoration: none;
}
button {
  background-color: #729ed1;
  border: 1px solid #AFAFAF;
  border-radius: 4px;
  font-size: 14px;
  padding: 5px 10px;
  color: #fff;
  text-decoration: none;
}

button:hover {
  background-color: #7ea3cd;
  text-decoration: underline;
}

.try-again {
  text-align: center;
}

.lang-error {
  margin: 30px auto;
  padding: 0 20px;
  max-width: 545px;
  text-align: center;
}

.lang-error h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.lang-error a {
  font-size: 18px;
  color: #ED1C24;

}

a.red {
  text-decoration: underline;
}
.try-again.no-show {
  display: none;
}

</style>
