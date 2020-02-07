// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VeeValidate, { Validator } from 'vee-validate'
import store from './store/store'
import Cleave from 'vue-cleave-component'
require('./assets/css/styling.css')

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VeeValidate)
Vue.use(Cleave)

// Vee-Validate Validator config
const dict = {
  en: {
    attributes: {
      // Exhibitor
      saleNumber: 'Sale Number',
      fullName: 'Name',
      tag: 'Tag',
      species: 'Species',
      animalDescription: 'Animal Description',
      checkInWeight: 'Check-in Weight',
      clubName: 'Club Name',
      showClassName: 'Show Class Name',
      placing: 'Placing',
      buyback: 'Buyback',
      // Buyer
      bidderNumber: 'Bidder Number',
      name: 'Name',
      contactName: 'Contact Name',
      phone: 'Phone Number',
      email: 'Email Address',
      logoFileName: 'Logo Filename',
      // Transaction
      purchaseAmount: 'Purchase Amount',
      purchaseType: 'Purchase Type'
    },
    messages: {
      regex: () => 'Invalid Phone Number. Required format: 555-555-5555'
    }
  }
}
Validator.localize(dict)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
