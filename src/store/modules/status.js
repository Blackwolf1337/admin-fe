import { changeStatusScope, deleteStatus, fetchStatus } from '@/api/status'

const status = {
  state: {
    fetchedStatus: {},
    fetchedStatuses: [],
    loading: false,
    statusAuthor: {}
  },
  mutations: {
    SET_STATUS: (state, status) => {
      state.fetchedStatus = status
    },
    PUSH_STATUSES: (state, statuses) => {
      state.fetchedStatuses = [...state.fetchedStatuses, ...statuses]
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_STATUS_AUTHOR: (state, user) => {
      state.statusAuthor = user
    }
  },
  actions: {
    async ChangeStatusScope({ dispatch, getters }, { statusId, isSensitive, visibility, reportCurrentPage, userId, godmode, fetchStatusesByInstance }) {
      const { data } = await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) { // called from Reports
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) { // called from User profile
        dispatch('UpdateStatusInFetchedStatuses', data)
      } else if (fetchStatusesByInstance) { // called from Statuses by Instance
        dispatch('UpdateStatusInStatusesByInstance', data)
      } else { // called from Status show page
        dispatch('FetchStatusAfterUserModeration', statusId)
      }
    },
    async DeleteStatus({ dispatch, getters }, { statusId, reportCurrentPage, userId, fetchStatusesByInstance }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) { // called from Reports
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) { // called from User profile
        dispatch('FetchUserStatuses', { userId })
      } else if (fetchStatusesByInstance) { // called from Statuses by Instance
        dispatch('RemoveStatusFromStatusesByInstance', statusId)
      }
    },
    async FetchStatus({ commit, dispatch, getters, state }, id) {
      commit('SET_LOADING', true)
      const status = await fetchStatus(id, getters.authHost, getters.token)

      commit('SET_STATUS', status.data)
      commit('SET_STATUS_AUTHOR', status.data.account)
      commit('SET_LOADING', false)
      dispatch('FetchUserStatuses', { _page: 1, userId: state.fetchedStatus.account.id })
    },
    FetchStatusAfterUserModeration({ commit, dispatch, getters }, id) {
      commit('SET_LOADING', true)
      fetchStatus(id, getters.authHost, getters.token)
        .then(status => dispatch('SetStatus', status.data))
      commit('SET_LOADING', false)
    },
    SetStatus({ commit }, status) {
      commit('SET_STATUS', status)
      commit('SET_STATUS_AUTHOR', status.account)
    }
  }
}

export default status
