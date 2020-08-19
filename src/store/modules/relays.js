import { fetchRelays, addRelay, deleteRelay } from '@/api/relays'

const relays = {
  state: {
    fetchedRelays: [],
    loading: true
  },
  mutations: {
    SET_LOADING: (state, loading) => {
      state.loading = loading
    },
    SET_RELAYS: (state, relays) => {
      state.fetchedRelays = relays
    },
    ADD_RELAY: (state, relay) => {
      state.fetchedRelays = [...state.fetchedRelays, { actor: relay }]
    },
    DELETE_RELAY: (state, relay) => {
      state.fetchedRelays = state.fetchedRelays.filter(fetchedRelay => fetchedRelay.actor !== relay)
    }
  },
  actions: {
    async FetchRelays({ commit, getters }) {
      commit('SET_LOADING', true)

      const { data } = await fetchRelays(getters.authHost, getters.token)
      commit('SET_RELAYS', data.relays)
      commit('SET_LOADING', false)
    },
    async AddRelay({ commit, dispatch, getters }, relay) {
      commit('ADD_RELAY', relay)

      try {
        await addRelay(relay, getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        dispatch('FetchRelays')
      }
    },
    async DeleteRelay({ commit, dispatch, getters }, relay) {
      commit('DELETE_RELAY', relay)

      try {
        await deleteRelay(relay, getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        dispatch('FetchRelays')
      }
    }
  }
}

export default relays
