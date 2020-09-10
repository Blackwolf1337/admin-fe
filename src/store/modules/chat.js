import { fetchChat, fetchChatMessages, deleteChatMessage } from '@/api/chat'

const chat = {
  state: {
    fetchedChat: {},
    fetchedChatMessages: {},
    loading: false
  },
  mutations: {
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_CHAT: (state, chat) => {
      state.fetchedChat = chat
    },
    SET_CHAT_MESSAGES: (state, chatMessages) => {
      state.fetchedChatMessages = chatMessages
    }
  },
  actions: {
    async FetchChat({ commit, dispatch, getters, state }, id) {
      commit('SET_LOADING', true)
      const chat = await fetchChat(id, getters.authHost, getters.token)

      commit('SET_CHAT', chat.data)
      commit('SET_LOADING', false)
    },
    async FetchChatMessages({ commit, dispatch, getters, state }, id) {
      commit('SET_LOADING', true)
      const chat = await fetchChatMessages(id, getters.authHost, getters.token)
      commit('SET_CHAT_MESSAGES', chat.data)
      commit('SET_LOADING', false)
    },
    async DeleteMessage({ commit, dispatch, getters, state }, params) {
      await deleteChatMessage(params.chat_id, params.message_id, getters.authHost, getters.token)
      dispatch('FetchChatMessages', params.chat_id)
    }
  }
}

export default chat
