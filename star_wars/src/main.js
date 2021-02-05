import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) },
  created () {
    this.$store.dispatch('fetchPeopleList', 1);

    const firebaseConfig = {
      apiKey: "AIzaSyCe6ugKzCWei92vVA8iEJxluTkTm2Uf7wk",
      authDomain: "ed-ads-2101.firebaseapp.com",
      databaseURL: "https://ed-ads-2101-default-rtdb.firebaseio.com",
      projectId: "ed-ads-2101",
      storageBucket: "ed-ads-2101.appspot.com",
      messagingSenderId: "426491610589",
      appId: "1:426491610589:web:7ebc11957ee415fbaba234"
    };
    firebase.initializeApp(firebaseConfig);
  },
}).$mount('#app')

