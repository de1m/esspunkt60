import Vue from 'vue'
import Vuex from 'vuex'
import Fingerprint from 'fingerprintjs2'

Vue.use(Vuex)

const state = {
  // single source of data
  fingerprint: '',
  userAuth: false
}

const actions = {
  // asynchronous operations
  setFingerPrint () {
    if ((state.fingerprint === null && state.fingerprint === undefined) || state.fingerprint.length <= 0) {
      return new Promise((resolve, reject) => {
        Fingerprint().get(function (fprint) {
          state.fingerprint = fprint
          resolve()
        })
      })
    }
  }
}

const mutations = {
  // isolated data mutations
}

const getters = {
  // reusable data accessors
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store
