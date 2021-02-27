import { fetchStatuses, fetchStatusesByInstance, fetchStatusesCount } from '@/api/status'

const statusesByInstance = {
  state: {
    fetchedStatuses: [],
    loading: false,
    selectedInstance: '',
    showLocal: false,
    showPrivate: false,
    withReblogs: false,
    currentPage: 1,
    pageSize: 20,
    total: 0,
    visibility: {}
  },
  mutations: {
    CHANGE_GODMODE_CHECKBOX_VALUE: (state, value) => {
      state.showPrivate = value
    },
    CHANGE_LOCAL_CHECKBOX_VALUE: (state, value) => {
      state.showLocal = value
    },
    CHANGE_REBLOGS_CHECKBOX_VALUE: (state, value) => {
      state.withReblogs = value
    },
    CHANGE_SELECTED_INSTANCE: (state, instance) => {
      state.selectedInstance = instance
    },
    SET_CURRENT_PAGE_FOR_STATUSES: (state, page) => {
      state.currentPage = page
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_STATUS_VISIBILITY: (state, visibility) => {
      state.visibility = visibility
    },
    SET_STATUSES_BY_INSTANCE: (state, { activities, total }) => {
      state.fetchedStatuses = activities
      state.total = total
    }
  },
  actions: {
    ClearState({ commit }) {
      commit('CHANGE_SELECTED_INSTANCE', '')
      commit('SET_STATUSES_BY_INSTANCE', { activities: [], total: 0 })
      commit('CHANGE_LOCAL_CHECKBOX_VALUE', false)
      commit('CHANGE_GODMODE_CHECKBOX_VALUE', false)
      commit('SET_CURRENT_PAGE_FOR_STATUSES', 1)
    },
    async FetchStatusesByInstance({ commit, dispatch, getters, state, rootState }, page) {
      commit('SET_LOADING', true)
      if (state.selectedInstance.length === 0) dispatch('ClearState')

      if (page) commit('SET_CURRENT_PAGE_FOR_STATUSES', page)
      dispatch('FetchStatusesCount', state.selectedInstance)

      const params = {
        instance: state.selectedInstance,
        godmode: state.showPrivate,
        localOnly: state.showLocal,
        withReblogs: state.withReblogs,
        authHost: getters.authHost,
        token: getters.token,
        pageSize: state.pageSize,
        page: state.currentPage
      }
      const { data } = state.selectedInstance === rootState.user.authHost
        ? await fetchStatuses(params)
        : await fetchStatusesByInstance(params)

      commit('SET_STATUSES_BY_INSTANCE', data)
      commit('SET_LOADING', false)
    },
    async FetchStatusesCount({ commit, getters }, instance) {
      commit('SET_LOADING', true)
      const { data } = await fetchStatusesCount(instance, getters.authHost, getters.token)
      commit('SET_STATUS_VISIBILITY', data.status_visibility)
      commit('SET_LOADING', false)
    },
    HandleFilterChange({ commit }, instance) {
      commit('CHANGE_SELECTED_INSTANCE', instance)
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
    HandleReblogsCheckboxChange({ commit, dispatch }, value) {
      commit('SET_CURRENT_PAGE_FOR_STATUSES', 1)
      commit('CHANGE_REBLOGS_CHECKBOX_VALUE', value)
      dispatch('FetchStatusesByInstance')
    },
    RemoveStatusFromStatusesByInstance({ commit, state }, id) {
      const updatedStatuses = state.fetchedStatuses.filter(status => status.id !== id)
      commit('SET_STATUSES_BY_INSTANCE', { activities: updatedStatuses, total: state.total })
    },
    UpdateStatusInStatusesByInstance({ commit, state }, status) {
      const updatedStatuses = state.fetchedStatuses.map(fetchedStatus =>
        fetchedStatus.id === status.id ? status : fetchedStatus)
      commit('SET_STATUSES_BY_INSTANCE', { activities: updatedStatuses, total: state.total })
    }
  }
}

export default statusesByInstance
