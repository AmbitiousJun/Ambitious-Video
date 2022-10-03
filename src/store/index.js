import { createStore } from 'vuex'

const state = {
  curFrameUrl: ''
}

const store = createStore({
  state,
  mutations: {
    setFrameUrl(state, url) {
      state.curFrameUrl = url
    }
  }
})

export default store