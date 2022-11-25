import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

// axios.defaults.baseURL = 'http://10.10.0.35:8080/apiPedidos'

axios.defaults.baseURL = 'http://localhost:9000/apiPedidos'
axios.defaults.headers.common.Authorization = sessionStorage.getItem('tknHonduras')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
