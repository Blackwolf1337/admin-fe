import { fetchUser, fetchUserStatuses, fetchUserChats, fetchUserCredentials, updateUserCredentials } from '@/api/users'

const userProfile = {
  state: {
    chats: [],
    chatsLoading: true,
    currentPage: 1,
    pageSize: 10,
    statuses: [],
    statusesLoading: true,
    totalStatusesCount: 0,
    user: {},
    userCredentials: {},
    userProfileLoading: true
  },
  mutations: {
    SET_STATUSES: (state, { activities, total }) => {
      state.statuses = activities
      state.totalStatusesCount = total
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
    SET_CURRENT_PAGE: (state, page) => {
      state.currentPage = page
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

      dispatch('FetchUserStatuses', { _page: 1, userId, godmode })
      dispatch('FetchUserChats', { userId })
    },
    UpdateStatusInFetchedStatuses({ commit, state }, status) {
      const updatedStatuses = state.statuses.map(fetchedStatus =>
        fetchedStatus.id === status.id ? status : fetchedStatus)
      commit('SET_STATUSES', { activities: updatedStatuses, total: state.totalStatusesCount })
    },
    async FetchUserStatuses({ commit, dispatch, getters, state }, { _page, userId, godmode }) {
      commit('SET_STATUSES_LOADING', true)
      if (_page) {
        commit('SET_CURRENT_PAGE', _page)
      }

      const { data } = await fetchUserStatuses(userId, state.currentPage, state.pageSize, godmode, getters.authHost, getters.token)
      dispatch('SetStatuses', data)
      commit('SET_STATUSES_LOADING', false)
    },
    async FetchUserChats({ commit, dispatch, getters }, { userId }) {
      commit('SET_CHATS_LOADING', true)

      const { data } = await fetchUserChats(userId, getters.authHost, getters.token)
      dispatch('SetChats', data)
      commit('SET_CHATS_LOADING', false)
    },
    async FetchUserCredentials({ commit, getters }, { nickname }) {
      const userResponse = await fetchUserCredentials(nickname, getters.authHost, getters.token)
      commit('SET_USER_CREDENTIALS', userResponse.data)
    },
    SetStatuses({ commit }, data) {
      commit('SET_STATUSES', data)
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
