import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const IS_AUTHENTICATED = 'IS_AUTHENTICATED'

Vue.use(Vuex)

const state = {
	isAuthenticated: null
}

const mutations = {
	[IS_AUTHENTICATED] (state, bool) {
		state.isAuthenticated = bool
	}
}

const actions = {
	setIsAuthenticated ({commit}, bool) {
		commit(IS_AUTHENTICATED, bool)
	}
}

const vuexPersist = new VuexPersist({
	key: 'my-app',
	storage: localStorage
})

export default new Vuex.Store({
	state,
	mutations,
	actions,
	plugins: [vuexPersist.plugin]
})
