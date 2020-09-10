import { fetchChat, fetchChatMessages, deleteChatMessage } from '@/api/chat'

const chat = {
  state: {
    fetchedChat: {},
    fetchedChatMessages: {},
    loading: false,
    buttonLoading: false,
    allLoaded: false,
    max_id: null
  },
  mutations: {
    SET_LOADING: (state, chat) => {
      state.loading = chat
    },
    SET_ALL_LOADED: (state, chat) => {
      state.allLoaded = chat
    },
    SET_BUTTON_LOADING: (state, chat) => {
      state.buttonLoading = chat
    },
    SET_CHAT: (state, chat) => {
      state.fetchedChat = chat
    },
    SET_CHAT_MESSAGES: (state, chatMessages) => {
      state.fetchedChatMessages = chatMessages
    },
    CHANGE_MAX_ID: (state, max_id) => {
      state.max_id = max_id
    }
  },
  actions: {
    async FetchChat({ commit, dispatch, getters, state }, id) {
      commit('SET_LOADING', true)
      const chat = await fetchChat(id, getters.authHost, getters.token)

      commit('SET_CHAT', chat.data)
      commit('SET_LOADING', false)
    },
    async FetchChatMessages({ commit, dispatch, getters, state }, id, max_id) {
      commit('SET_LOADING', true)
      const chat = await fetchChatMessages(id, state.max_id, getters.authHost, getters.token)
      commit('SET_CHAT_MESSAGES', chat.data)
      commit('SET_LOADING', false)
    },
    async DeleteMessage({ commit, dispatch, getters, state }, params) {
      await deleteChatMessage(params.chat_id, params.message_id, getters.authHost, getters.token)
      dispatch('FetchChatMessages', params.chat_id)
    },
    HandlePageChange({ commit }, max_id) {
      commit('CHANGE_MAX_ID', max_id)
    }
  }
}

export default chat
