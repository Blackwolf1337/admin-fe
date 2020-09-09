import { fetchChat, fetchChatMessages } from '@/api/chat'

const chat = {
  state: {
    fetchedChat: {},
    fetchedChatMessages: {},
    loading: false,
    chatAuthor: {}
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
    }
  }
}

export default chat
