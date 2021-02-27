import { fetchUser, fetchUserStatuses, fetchUserChats, fetchUserCredentials, updateUserCredentials } from '@/api/users'

const userProfile = {
  state: {
    chats: [],
    chatsLoading: true,
    currentPage: 1,
    pageSize: 10,
    showPrivate: false,
    statuses: [],
    statusesLoading: true,
    totalStatusesCount: 0,
    user: {},
    userCredentials: {},
    userProfileLoading: true,
    withReblogs: false
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
    SET_GODMODE_CHECKBOX_VALUE: (state, value) => {
      state.showPrivate = value
    },
    SET_REBLOGS_CHECKBOX_VALUE: (state, value) => {
      state.withReblogs = value
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
    async FetchUserProfile({ commit, dispatch, getters }, userId) {
      commit('SET_USER_PROFILE_LOADING', true)

      const userResponse = await fetchUser(userId, getters.authHost, getters.token)
      commit('SET_USER', userResponse.data)
      commit('SET_USER_PROFILE_LOADING', false)

      dispatch('FetchUserStatuses', { _page: 1, userId })
      dispatch('FetchUserChats', { userId })
    },
    UpdateStatusInFetchedStatuses({ commit, state }, status) {
      const updatedStatuses = state.statuses.map(fetchedStatus =>
        fetchedStatus.id === status.id ? status : fetchedStatus)
      commit('SET_STATUSES', { activities: updatedStatuses, total: state.totalStatusesCount })
    },
    async FetchUserStatuses({ commit, dispatch, getters, state }, { _page, userId }) {
      commit('SET_STATUSES_LOADING', true)
      if (_page) commit('SET_CURRENT_PAGE', _page)

      const { data } = await fetchUserStatuses({
        id: userId,
        page: state.currentPage,
        pageSize: state.pageSize,
        godmode: state.showPrivate,
        withReblogs: state.withReblogs,
        authHost: getters.authHost,
        token: getters.token
      })
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
    HandleGodmodeChangeFromUserProfile({ commit, dispatch }, { checkbox, userId }) {
      commit('SET_CURRENT_PAGE', 1)
      commit('SET_GODMODE_CHECKBOX_VALUE', checkbox)
      dispatch('FetchUserStatuses', { userId })
    },
    HandleReblogsChangeFromUserProfile({ commit, dispatch }, { checkbox, userId }) {
      commit('SET_CURRENT_PAGE', 1)
      commit('SET_REBLOGS_CHECKBOX_VALUE', checkbox)
      dispatch('FetchUserStatuses', { userId })
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
