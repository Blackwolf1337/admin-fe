import { changeState, fetchReports, fetchSingleReport, createNote, deleteNote } from '@/api/reports'
import {
  activateUsers,
  deactivateUsers,
  deleteUsers,
  tagUser,
  untagUser
} from '@/api/users'

const reports = {
  state: {
    currentPage: 1,
    fetchedReports: [],
    loading: true,
    openReportsCount: 0,
    pageSize: 50,
    singleReport: {},
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
    },
    SET_SINGLE_REPORT: (state, report) => {
      state.singleReport = report
    }
  },
  actions: {
    async ActivateUserFromReports({ commit, dispatch, getters, state }, { user, reportId }) {
      try {
        await activateUsers([user.nickname], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReports = state.fetchedReports.map(report => {
          const updatedAccount = { ...user, deactivated: false }
          return report.id === reportId ? { ...report, account: updatedAccount } : report
        })
        commit('SET_REPORTS', updatedReports)
      }
      dispatch('SuccessMessage')
    },
    async ActivateUserFromReportShow({ commit, dispatch, getters, state }, user) {
      try {
        await activateUsers([user.nickname], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReport = { ...state.singleReport, account: { ...user, deactivated: false }}
        commit('SET_SINGLE_REPORT', updatedReport)
      }
      dispatch('SuccessMessage')
    },
    async AddTagFromReports({ commit, dispatch, getters, state }, { user, tag, reportId }) {
      try {
        await tagUser([user.nickname], [tag], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReports = state.fetchedReports.map(report => {
          const updatedAccount = { ...user, tags: [...user.tags, tag] }
          return report.id === reportId ? { ...report, account: updatedAccount } : report
        })
        commit('SET_REPORTS', updatedReports)
      }
      dispatch('SuccessMessage')
    },
    async AddTagFromReportsFromReportShow({ commit, dispatch, getters, state }, { user, tag }) {
      try {
        await tagUser([user.nickname], [tag], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReport = { ...state.singleReport, account: { ...user, tags: [...user.tags, tag] }}
        commit('SET_SINGLE_REPORT', updatedReport)
      }
      dispatch('SuccessMessage')
    },
    async ChangeReportState({ commit, dispatch, getters, state }, reportsData) {
      try {
        await changeState(reportsData, getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReports = state.fetchedReports.map(report => {
          const updatedReportsIds = reportsData.map(({ id }) => id)
          return updatedReportsIds.includes(report.id) ? { ...report, state: reportsData[0].state } : report
        })

        commit('SET_REPORTS', updatedReports)
        dispatch('FetchOpenReportsCount')
      }
    },
    ClearFetchedReports({ commit }) {
      commit('SET_REPORTS', [])
    },
    async DeactivateUserFromReports({ commit, dispatch, getters, state }, { user, reportId }) {
      try {
        await deactivateUsers([user.nickname], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReports = state.fetchedReports.map(report => {
          const updatedAccount = { ...user, deactivated: true }
          return report.id === reportId ? { ...report, account: updatedAccount } : report
        })
        commit('SET_REPORTS', updatedReports)
      }
      dispatch('SuccessMessage')
    },
    async DeactivateUserFromReportShow({ commit, dispatch, getters, state }, user) {
      try {
        await deactivateUsers([user.nickname], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReport = { ...state.singleReport, account: { ...user, deactivated: true }}
        commit('SET_SINGLE_REPORT', updatedReport)
      }
      dispatch('SuccessMessage')
    },
    async DeleteUserFromReports({ commit, dispatch, getters, state }, { user, reportId }) {
      try {
        await deleteUsers([user.nickname], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReports = state.fetchedReports.map(report => {
          const updatedAccount = { ...user, deactivated: true }
          return report.id === reportId ? { ...report, account: updatedAccount } : report
        })
        commit('SET_REPORTS', updatedReports)
      }
      dispatch('SuccessMessage')
    },
    async FetchReports({ commit, getters, state }, page) {
      commit('SET_LOADING', true)
      const { data } = await fetchReports(state.stateFilter, page, state.pageSize, getters.authHost, getters.token)

      commit('SET_REPORTS', data.reports)
      commit('SET_REPORTS_COUNT', data.total)
      commit('SET_PAGE', page)
      commit('SET_LOADING', false)
    },
    async FetchSingleReport({ commit, getters }, id) {
      commit('SET_LOADING', true)
      const { data } = await fetchSingleReport(id, getters.authHost, getters.token)

      commit('SET_SINGLE_REPORT', data)
      commit('SET_LOADING', false)
    },
    async FetchOpenReportsCount({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const { data } = await fetchReports('open', state.currentPage, state.pageSize, getters.authHost, getters.token)

      commit('SET_OPEN_REPORTS_COUNT', data.total)
      commit('SET_LOADING', false)
    },
    async RemoveTagFromReports({ commit, dispatch, getters, state }, { user, tag, reportId }) {
      try {
        await untagUser([user.nickname], [tag], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReports = state.fetchedReports.map(report => {
          const updatedAccount = { ...user, tags: user.tags.filter(userTag => userTag !== tag) }
          return report.id === reportId ? { ...report, account: updatedAccount } : report
        })
        commit('SET_REPORTS', updatedReports)
      }
      dispatch('SuccessMessage')
    },
    async RemoveTagFromReportsFromReportShow({ commit, dispatch, getters, state }, { user, tag }) {
      try {
        await untagUser([user.nickname], [tag], getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        const updatedReport = { ...state.singleReport, account: { ...user, tags: user.tags.filter(userTag => userTag !== tag) }}
        commit('SET_SINGLE_REPORT', updatedReport)
      }
      dispatch('SuccessMessage')
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
