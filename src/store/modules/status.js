import { changeStatusScope, deleteStatus, fetchStatus, fetchStatusesCount, fetchStatusesByInstance } from '@/api/status'

const status = {
  state: {
    fetchedStatus: {},
    fetchedStatuses: [],
    loading: false,
    statusAuthor: {},
    statusesByInstance: {
      selectedInstance: '',
      showLocal: false,
      showPrivate: false,
      currentPage: 1,
      pageSize: 5,
      totalInstanceStatusesCount: 0
    },
    statusVisibility: {}
  },
  mutations: {
    CHANGE_GODMODE_CHECKBOX_VALUE: (state, value) => {
      state.statusesByInstance.showPrivate = value
    },
    CHANGE_LOCAL_CHECKBOX_VALUE: (state, value) => {
      state.statusesByInstance.showLocal = value
    },
    CHANGE_SELECTED_INSTANCE: (state, instance) => {
      state.statusesByInstance.selectedInstance = instance
    },
    SET_STATUS: (state, status) => {
      state.fetchedStatus = status
    },
    SET_STATUSES_BY_INSTANCE: (state, { activities, total }) => {
      state.fetchedStatuses = activities
      state.statusesByInstance.totalInstanceStatusesCount = total
    },
    PUSH_STATUSES: (state, statuses) => {
      state.fetchedStatuses = [...state.fetchedStatuses, ...statuses]
    },
    SET_CURRENT_PAGE_FOR_STATUSES: (state, page) => {
      state.statusesByInstance.currentPage = page
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_STATUS_VISIBILITY: (state, visibility) => {
      state.statusVisibility = visibility
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
        dispatch('FetchStatusesByInstance')
      } else { // called from Status show page
        dispatch('FetchStatusAfterUserModeration', statusId)
      }
    },
    ClearState({ commit }) {
      commit('CHANGE_SELECTED_INSTANCE', '')
      commit('SET_STATUSES_BY_INSTANCE', { activities: [], total: 0 })
      commit('CHANGE_LOCAL_CHECKBOX_VALUE', false)
      commit('CHANGE_GODMODE_CHECKBOX_VALUE', false)
      commit('SET_CURRENT_PAGE_FOR_STATUSES', 1)
    },
    async DeleteStatus({ dispatch, getters }, { statusId, reportCurrentPage, userId, godmode, fetchStatusesByInstance }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) { // called from Reports
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) { // called from User profile
        dispatch('FetchUserStatuses', { userId, godmode })
      } else if (fetchStatusesByInstance) { // called from Statuses by Instance
        dispatch('FetchStatusesByInstance')
      }
    },
    async FetchStatus({ commit, dispatch, getters, state }, id) {
      commit('SET_LOADING', true)
      const status = await fetchStatus(id, getters.authHost, getters.token)

      commit('SET_STATUS', status.data)
      commit('SET_STATUS_AUTHOR', status.data.account)
      commit('SET_LOADING', false)
      dispatch('FetchUserStatuses', { _page: 1, userId: state.fetchedStatus.account.id, godmode: false })
    },
    FetchStatusAfterUserModeration({ commit, dispatch, getters, state }, id) {
      commit('SET_LOADING', true)
      fetchStatus(id, getters.authHost, getters.token)
        .then(status => dispatch('SetStatus', status.data))
      commit('SET_LOADING', false)
    },
    async FetchStatusesCount({ commit, getters }, instance) {
      commit('SET_LOADING', true)
      const { data } = await fetchStatusesCount(instance, getters.authHost, getters.token)
      commit('SET_STATUS_VISIBILITY', data.status_visibility)
      commit('SET_LOADING', false)
    },
    async FetchStatusesByInstance({ commit, dispatch, getters, state }, page) {
      commit('SET_LOADING', true)
      if (page) {
        commit('SET_CURRENT_PAGE_FOR_STATUSES', page)
      }
      dispatch('FetchStatusesCount', state.statusesByInstance.selectedInstance)

      if (state.statusesByInstance.selectedInstance === '') {
        commit('SET_STATUSES_BY_INSTANCE', { activities: [], total: 0 })
      } else {
        const { data } = await fetchStatusesByInstance(
          {
            instance: state.statusesByInstance.selectedInstance,
            authHost: getters.authHost,
            token: getters.token,
            pageSize: state.statusesByInstance.pageSize,
            page: state.statusesByInstance.page
          })
        commit('SET_STATUSES_BY_INSTANCE', data)
      }
      commit('SET_LOADING', false)
    },
    HandleGodmodeCheckboxChange({ commit, dispatch }, value) {
      commit('SET_CURRENT_PAGE_FOR_STATUSES', 1)
      commit('CHANGE_GODMODE_CHECKBOX_VALUE', value)
      dispatch('FetchStatusesByInstance')
    },
    HandleLocalCheckboxChange({ commit, dispatch }, value) {
      commit('SET_CURRENT_PAGE_FOR_STATUSES', 1)
      commit('CHANGE_LOCAL_CHECKBOX_VALUE', value)
      dispatch('FetchStatusesByInstance')
    },
    HandleFilterChange({ commit }, instance) {
      commit('CHANGE_SELECTED_INSTANCE', instance)
    },
    SetStatus({ commit }, status) {
      commit('SET_STATUS', status)
      commit('SET_STATUS_AUTHOR', status.account)
    }
  }
}

export default status
