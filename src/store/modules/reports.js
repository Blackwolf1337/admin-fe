import { changeState, fetchReports, createNote, deleteNote } from '@/api/reports'

const reports = {
  state: {
    currentPage: 1,
    fetchedReports: [],
    loading: true,
    openReportsCount: 0,
    pageSize: 50,
    stateFilter: '',
    totalReportsCount: 0
  },
  mutations: {
    SET_LAST_REPORT_ID: (state, id) => {
      state.idOfLastReport = id
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_OPEN_REPORTS_COUNT: (state, total) => {
      state.openReportsCount = total
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_REPORTS: (state, reports) => {
      state.fetchedReports = reports
    },
    SET_REPORTS_COUNT: (state, total) => {
      state.totalReportsCount = total
    },
    SET_REPORTS_FILTER: (state, filter) => {
      state.stateFilter = filter
    }
  },
  actions: {
    async ChangeReportState({ commit, dispatch, getters, state }, reportsData) {
      changeState(reportsData, getters.authHost, getters.token)

      const updatedReports = state.fetchedReports.map(report => {
        const updatedReportsIds = reportsData.map(({ id }) => id)
        return updatedReportsIds.includes(report.id) ? { ...report, state: reportsData[0].state } : report
      })

      commit('SET_REPORTS', updatedReports)
      dispatch('FetchOpenReportsCount')
    },
    ClearFetchedReports({ commit }) {
      commit('SET_REPORTS', [])
    },
    async FetchReports({ commit, getters, state }, page) {
      commit('SET_LOADING', true)
      const { data } = await fetchReports(state.stateFilter, page, state.pageSize, getters.authHost, getters.token)

      commit('SET_REPORTS', data.reports)
      commit('SET_REPORTS_COUNT', data.total)
      commit('SET_PAGE', page)
      commit('SET_LOADING', false)
    },
    async FetchOpenReportsCount({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const { data } = await fetchReports('open', state.currentPage, state.pageSize, getters.authHost, getters.token)

      commit('SET_OPEN_REPORTS_COUNT', data.total)
      commit('SET_LOADING', false)
    },
    SetReportsFilter({ commit }, filter) {
      commit('SET_REPORTS_FILTER', filter)
    },
    CreateReportNote({ commit, getters, state, rootState }, { content, reportID }) {
      createNote(content, reportID, getters.authHost, getters.token)

      const optimisticNote = {
        user: {
          avatar: rootState.user.avatar,
          nickname: rootState.user.name,
          id: rootState.user.id
        },
        content: content,
        created_at: new Date().getTime()
      }

      const updatedReports = state.fetchedReports.map(report => {
        if (report.id === reportID) {
          report.notes = [...report.notes, optimisticNote]
        }

        return report
      })

      commit('SET_REPORTS', updatedReports)
    },
    DeleteReportNote({ commit, getters, state }, { noteID, reportID }) {
      deleteNote(noteID, reportID, getters.authHost, getters.token)

      const updatedReports = state.fetchedReports.map(report => {
        if (report.id === reportID) {
          report.notes = report.notes.filter(note => note.id !== noteID)
        }

        return report
      })

      commit('SET_REPORTS', updatedReports)
    }
  }
}

export default reports
