import { Message } from 'element-ui'
import i18n from '@/lang'
import {
  activateUsers,
  addRight,
  createNewAccount,
  deactivateUsers,
  deleteRight,
  deleteUsers,
  disableMfa,
  fetchUsers,
  getPasswordResetToken,
  searchUsers,
  tagUser,
  untagUser,
  forcePasswordReset,
  approveUserAccount,
  confirmUserEmail,
  resendConfirmationEmail,
  updateUserCredentials
} from '@/api/users'
import { fetchSettings } from '@/api/settings'

const users = {
  state: {
    fetchedUsers: [],
    loading: true,
    searchQuery: '',
    tagPolicyEnabled: true,
    totalUsersCount: 0,
    currentPage: 1,
    pageSize: 50,
    filters: {
      local: false,
      external: false,
      active: false,
      need_approval: false,
      deactivated: false
    },
    passwordResetToken: {
      token: '',
      link: ''
    }
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SWAP_USERS: (state, users) => {
      const usersWithoutSwapped = users.reduce((acc, user) => {
        return acc.filter(u => u.id !== user.id)
      }, state.fetchedUsers)

      if (state.fetchedUsers.length === 0) {
        return
      }

      const updatedUsers = [...usersWithoutSwapped, ...users]
      state.fetchedUsers = updatedUsers
        .filter(user => user.nickname && user.id)
        .sort((a, b) => a.nickname.localeCompare(b.nickname))
        .concat(updatedUsers.filter(user => !user.nickname || !user.id))
    },
    SET_COUNT: (state, count) => {
      state.totalUsersCount = count
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_PAGE_SIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    SET_PASSWORD_RESET_TOKEN: (state, { token, link }) => {
      state.passwordResetToken.token = token
      state.passwordResetToken.link = link
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    },
    SET_TAG_POLICY: (state, policyEnabled) => {
      state.tagPolicyEnabled = policyEnabled
    },
    SET_USERS_FILTERS: (state, filters) => {
      state.filters = filters
    }
  },
  actions: {
    async ActivateUsers({ dispatch, getters }, { users, _userId }) {
      const updatedUsers = users.map(user => {
        return { ...user, deactivated: false }
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await activateUsers(nicknames, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId })
    },
    async ApplyChanges({ commit, dispatch, state }, { updatedUsers, callApiFn, userId, statusId }) {
      commit('SWAP_USERS', updatedUsers)

      try {
        await callApiFn()
      } catch (_e) {
        return
      } finally {
        dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
      }
      if (statusId) {
        dispatch('FetchStatusAfterUserModeration', statusId)
      } else if (userId) {
        dispatch('FetchUserProfile', { userId, godmode: false })
      }
      dispatch('SuccessMessage')
    },
    async AddRight({ dispatch, getters }, { users, right, _userId, _statusId }) {
      const updatedUsers = users.map(user => {
        return user.local ? { ...user, roles: { ...user.roles, [right]: true }} : user
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await addRight(nicknames, right, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    },
    async AddTag({ dispatch, getters }, { users, tag, _userId, _statusId }) {
      const updatedUsers = users.map(user => {
        return { ...user, tags: [...user.tags, tag] }
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await tagUser(nicknames, [tag], getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    },
    async ApproveUsersAccount({ dispatch, getters }, { users, _userId, _statusId }) {
      const updatedUsers = users.map(user => {
        return { ...user, approval_pending: false }
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await approveUserAccount(nicknames, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    },
    ClearUsersState({ commit }) {
      commit('SET_SEARCH_QUERY', '')
      commit('SET_USERS_FILTERS', { local: false, external: false, active: false, need_approval: false, deactivated: false })
    },
    async ClearFilters({ commit, dispatch, state }) {
      commit('CLEAR_USERS_FILTERS')
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async ConfirmUsersEmail({ dispatch, getters }, { users, _userId, _statusId }) {
      const updatedUsers = users.map(user => {
        return { ...user, confirmation_pending: false }
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await confirmUserEmail(nicknames, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    },
    async CreateNewAccount({ dispatch, getters, state }, { nickname, email, password }) {
      try {
        await createNewAccount(nickname, email, password, getters.authHost, getters.token)
      } catch (_e) {
        return
      } finally {
        dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
      }
      dispatch('SuccessMessage')
    },
    async DeactivateUsers({ dispatch, getters }, { users, _userId }) {
      const updatedUsers = users.map(user => {
        return { ...user, deactivated: true }
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await deactivateUsers(nicknames, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId })
    },
    async DisableMfa({ dispatch, getters }, nickname) {
      try {
        await disableMfa(nickname, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      dispatch('SuccessMessage')
    },
    async DeleteRight({ dispatch, getters }, { users, right, _userId, _statusId }) {
      const updatedUsers = users.map(user => {
        return user.local ? { ...user, roles: { ...user.roles, [right]: false }} : user
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await deleteRight(nicknames, right, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    },
    async DeleteUsers({ commit, dispatch, getters, state }, { users, _userId }) {
      const usersNicknames = users.map(user => user.nickname)
      try {
        await deleteUsers(usersNicknames, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      const updatedUsers = users.map(user => {
        return { ...user, deactivated: true }
      })
      commit('SWAP_USERS', updatedUsers)

      if (_userId) {
        dispatch('FetchUserProfile', { userId: _userId, godmode: false })
      }
      dispatch('SuccessMessage')
    },
    async FetchTagPolicySetting({ commit, getters }) {
      const { data } = await fetchSettings(getters.authHost, getters.token)
      const tagPolicyEnabled = data.configs
        .find(el => el.key === ':mrf').value
        .find(el => el.tuple[0] === ':policies').tuple[1]
        .includes('Pleroma.Web.ActivityPub.MRF.TagPolicy')

      commit('SET_TAG_POLICY', tagPolicyEnabled)
    },
    async FetchUsers({ commit, dispatch, getters, state }, { page }) {
      commit('SET_LOADING', true)
      const filters = Object.keys(state.filters).filter(filter => state.filters[filter]).join()
      const response = await fetchUsers(filters, getters.authHost, getters.token, page)
      await dispatch('GetNodeInfo')
      loadUsers(commit, page, response.data)
    },
    async GetPasswordResetToken({ commit, getters }, nickname) {
      const { data } = await getPasswordResetToken(nickname, getters.authHost, getters.token)
      commit('SET_PASSWORD_RESET_TOKEN', data)
    },
    RemovePasswordToken({ commit }) {
      commit('SET_PASSWORD_RESET_TOKEN', { link: '', token: '' })
    },
    async RemoveTag({ dispatch, getters }, { users, tag, _userId, _statusId }) {
      const updatedUsers = users.map(user => {
        return { ...user, tags: user.tags.filter(userTag => userTag !== tag) }
      })
      const nicknames = users.map(user => user.nickname)
      const callApiFn = async() => await untagUser(nicknames, [tag], getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    },
    async RequirePasswordReset({ dispatch, getters }, users) {
      const nicknames = users.map(user => user.nickname)
      try {
        await forcePasswordReset(nicknames, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      dispatch('SuccessMessage')
    },
    async ResendConfirmationEmail({ dispatch, getters }, users) {
      const usersNicknames = users.map(user => user.nickname)
      try {
        await resendConfirmationEmail(usersNicknames, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      dispatch('SuccessMessage')
    },
    async SearchUsers({ commit, dispatch, state, getters }, { query, page }) {
      if (query.length === 0) {
        commit('SET_SEARCH_QUERY', query)
        dispatch('FetchUsers', { page })
      } else {
        commit('SET_LOADING', true)
        commit('SET_SEARCH_QUERY', query)

        const filters = Object.keys(state.filters).filter(filter => state.filters[filter]).join()
        const response = await searchUsers(query, filters, getters.authHost, getters.token, page)

        loadUsers(commit, page, response.data)
      }
    },
    SuccessMessage() {
      Message.success({
        message: i18n.t('users.completed'),
        duration: 5 * 1000
      })
    },
    async ToggleUsersFilter({ commit, dispatch, state }, filters) {
      const defaultFilters = {
        local: false,
        external: false,
        active: false,
        need_approval: false,
        deactivated: false
      }
      const currentFilters = { ...defaultFilters, ...filters }
      commit('SET_USERS_FILTERS', currentFilters)
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async UpdateActorType({ dispatch, getters }, { user, type, _userId, _statusId }) {
      const updatedUsers = [{ ...user, actor_type: type }]
      const credentials = { actor_type: type }

      const callApiFn = async() => await updateUserCredentials(user.nickname, credentials, getters.authHost, getters.token)

      dispatch('ApplyChanges', { updatedUsers, callApiFn, userId: _userId, statusId: _statusId })
    }
  }
}

const loadUsers = (commit, page, { users, count, page_size }) => {
  commit('SET_USERS', users)
  commit('SET_COUNT', count)
  commit('SET_PAGE', page)
  commit('SET_PAGE_SIZE', page_size)
  commit('SET_LOADING', false)
}

export default users
