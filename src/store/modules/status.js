import { changeStatusScope, deleteStatus, fetchStatus, fetchStatuses, fetchStatusesCount, fetchStatusesByInstance } from '@/api/status'

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
      page: 1,
      pageSize: 20,
      buttonLoading: false,
      allLoaded: false
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
    CHANGE_PAGE: (state, page) => {
      state.statusesByInstance.page = page
    },
    CHANGE_SELECTED_INSTANCE: (state, instance) => {
      state.statusesByInstance.selectedInstance = instance
    },
    SET_STATUS: (state, status) => {
      state.fetchedStatus = status
    },
    SET_STATUSES_BY_INSTANCE: (state, statuses) => {
      state.fetchedStatuses = statuses
    },
    PUSH_STATUSES: (state, statuses) => {
      state.fetchedStatuses = [...state.fetchedStatuses, ...statuses]
    },
    SET_ALL_LOADED: (state, status) => {
      state.statusesByInstance.allLoaded = status
    },
    SET_BUTTON_LOADING: (state, status) => {
      state.statusesByInstance.buttonLoading = status
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
      commit('SET_STATUSES_BY_INSTANCE', [])
      commit('CHANGE_LOCAL_CHECKBOX_VALUE', false)
      commit('CHANGE_GODMODE_CHECKBOX_VALUE', false)
      commit('SET_ALL_LOADED', false)
      commit('CHANGE_PAGE', 1)
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
    async FetchStatusesByInstance({ commit, dispatch, getters, state, rootState }) {
      commit('SET_LOADING', true)
      dispatch('FetchStatusesCount', state.statusesByInstance.selectedInstance)
      if (state.statusesByInstance.selectedInstance === '') {
        commit('SET_STATUSES_BY_INSTANCE', [])
      } else {
        const statuses = state.statusesByInstance.selectedInstance === rootState.user.authHost
          ? await fetchStatuses(
            {
              godmode: state.statusesByInstance.showPrivate,
              localOnly: state.statusesByInstance.showLocal,
              authHost: getters.authHost,
              token: getters.token,
              pageSize: state.statusesByInstance.pageSize,
              page: state.statusesByInstance.page
            })
          : await fetchStatusesByInstance(
            {
              instance: state.statusesByInstance.selectedInstance,
              authHost: getters.authHost,
              token: getters.token,
              pageSize: state.statusesByInstance.pageSize,
              page: state.statusesByInstance.page
            })
        commit('SET_STATUSES_BY_INSTANCE', statuses.data)
        if (statuses.data.length < state.statusesByInstance.pageSize) {
          commit('SET_ALL_LOADED', true)
        }
      }
      commit('SET_LOADING', false)
    },
    async FetchStatusesPageByInstance({ commit, getters, rootState, state }) {
      commit('SET_BUTTON_LOADING', true)
      const statuses = state.statusesByInstance.selectedInstance === rootState.user.authHost
        ? await fetchStatuses(
          {
            godmode: state.statusesByInstance.showPrivate,
            localOnly: state.statusesByInstance.showLocal,
            authHost: getters.authHost,
            token: getters.token,
            pageSize: state.statusesByInstance.pageSize,
            page: state.statusesByInstance.page
          })
        : await fetchStatusesByInstance(
          {
            instance: state.statusesByInstance.selectedInstance,
            authHost: getters.authHost,
            token: getters.token,
            pageSize: state.statusesByInstance.pageSize,
            page: state.statusesByInstance.page
          })
      commit('PUSH_STATUSES', statuses.data)
      commit('SET_BUTTON_LOADING', false)
      if (statuses.data.length < state.statusesByInstance.pageSize) {
        commit('SET_ALL_LOADED', true)
      }
    },
    HandleGodmodeCheckboxChange({ commit, dispatch }, value) {
      dispatch('HandlePageChange', 1)
      commit('SET_ALL_LOADED', false)

      commit('CHANGE_GODMODE_CHECKBOX_VALUE', value)
      dispatch('FetchStatusesByInstance')
    },
    HandleLocalCheckboxChange({ commit, dispatch }, value) {
      dispatch('HandlePageChange', 1)
      commit('SET_ALL_LOADED', false)

      commit('CHANGE_LOCAL_CHECKBOX_VALUE', value)
      dispatch('FetchStatusesByInstance')
    },
    HandleFilterChange({ commit }, instance) {
      commit('CHANGE_SELECTED_INSTANCE', instance)
      commit('SET_ALL_LOADED', false)
    },
    HandlePageChange({ commit }, page) {
      commit('CHANGE_PAGE', page)
    },
    SetStatus({ commit }, status) {
      commit('SET_STATUS', status)
      commit('SET_STATUS_AUTHOR', status.account)
    }
  }
}

export default status
