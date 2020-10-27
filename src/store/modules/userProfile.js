import { fetchUser, fetchUserStatuses, fetchUserChats, fetchUserCredentials, updateUserCredentials } from '@/api/users'

const userProfile = {
  state: {
    statuses: [],
    statusesLoading: true,
    chats: [],
    chatsLoading: true,
    user: {},
    userCredentials: {},
    userProfileLoading: true
  },
  mutations: {
    SET_STATUSES: (state, statuses) => {
      state.statuses = statuses
    },
    SET_STATUSES_LOADING: (state, status) => {
      state.statusesLoading = status
    },
    SET_CHATS: (state, chats) => {
      state.chats = chats
    },
    SET_CHATS_LOADING: (state, chat) => {
      state.chatsLoading = chat
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_USER_PROFILE_LOADING: (state, status) => {
      state.userProfileLoading = status
    },
    SET_USER_CREDENTIALS: (state, userCredentials) => {
      state.userCredentials = userCredentials
    }
  },
  actions: {
    async FetchUserProfile({ commit, dispatch, getters }, { userId, godmode }) {
      commit('SET_USER_PROFILE_LOADING', true)

      const userResponse = await fetchUser(userId, getters.authHost, getters.token)
      commit('SET_USER', userResponse.data)
      commit('SET_USER_PROFILE_LOADING', false)

      dispatch('FetchUserStatuses', { userId, godmode })
      dispatch('FetchUserChats', { userId })
    },
    FetchUserStatuses({ commit, dispatch, getters }, { userId, godmode }) {
      commit('SET_STATUSES_LOADING', true)

      fetchUserStatuses(userId, getters.authHost, godmode, getters.token)
        .then(statuses => dispatch('SetStatuses', statuses.data))

      commit('SET_STATUSES_LOADING', false)
    },
    FetchUserChats({ commit, dispatch, getters }, { userId }) {
      commit('SET_CHATS_LOADING', true)

      fetchUserChats(userId, getters.authHost, getters.token)
        .then(chats => dispatch('SetChats', chats.data))

      commit('SET_CHATS_LOADING', false)
    },
    async FetchUserCredentials({ commit, getters }, { nickname }) {
      const userResponse = await fetchUserCredentials(nickname, getters.authHost, getters.token)
      commit('SET_USER_CREDENTIALS', userResponse.data)
    },
    SetStatuses({ commit }, statuses) {
      commit('SET_STATUSES', statuses)
    },
    SetChats({ commit }, chats) {
      commit('SET_CHATS', chats)
    },
    async UpdateUserCredentials({ dispatch, getters }, { nickname, credentials }) {
      await updateUserCredentials(nickname, credentials, getters.authHost, getters.token)
      dispatch('FetchUserCredentials', { nickname })
    }
  }
}

export default userProfile
