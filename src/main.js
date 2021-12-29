import Vue from 'vue'
import App from './App.vue'
import VueTailwind from 'vue-tailwind'
import settings from "@/vue-tailwind-settings"
import Unicon from 'vue-unicons/dist/vue-unicons-vue2.umd'
import store from "@/store"

import { uniArrowRight, uniTachometerFast, uniSearchAlt, uniMusicNote, uniMultiply, uniTrash, uniTimes, uniDiary, uniGripHorizontalLine, uniArrowsV, uniSignOutAlt } from 'vue-unicons/dist/icons'
Unicon.add([uniArrowRight, uniTachometerFast, uniSearchAlt, uniArrowsV, uniMusicNote, uniDiary, uniMultiply, uniTrash, uniTimes, uniGripHorizontalLine, uniSignOutAlt])
// https://antonreshetov.github.io/vue-unicons/

Vue.use(VueTailwind, settings)
Vue.use(Unicon)


console.log(store);

import '@/assets/tailwind.css'

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
