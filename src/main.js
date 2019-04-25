import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VModal from 'vue-js-modal'
import selectInput from './components/Fields/selectInput.vue'

Vue.config.productionTip = false
Vue.use(VModal, {dialog: true})
Vue.component('field-selectInput', selectInput)
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

