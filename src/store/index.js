import Vue from "vue"
import Vuex from "vuex"
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
const store = new Vuex.Store({
  state: {
    user: {
      name: null,
      id: null
    },
    tempo: 'normal',
    selectedTunes: []
  },
  mutations: {
    user(state, payload) {
      // mutate state
      state.user = payload
    },
    tempo(state, payload) {
      // mutate state
      state.tempo = payload
    },
    selectedTunes(state, payload) {
      // mutate state
      state.selectedTunes = payload
    }
  },
  plugins: [vuexLocal.plugin],

})
export default store
