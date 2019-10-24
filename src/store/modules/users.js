import {
  activateUsers,
  addRight,
  createNewAccount,
  deactivateUsers,
  deleteRight,
  deleteUsers,
  fetchUsers,
  getPasswordResetToken,
  searchUsers,
  tagUser,
  untagUser,
  requirePasswordReset
} from '@/api/users'

const users = {
  state: {
    fetchedUsers: [],
    loading: true,
    searchQuery: '',
    totalUsersCount: 0,
    currentPage: 1,
    filters: {
      local: false,
      external: false,
      active: false,
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

      state.fetchedUsers = [...usersWithoutSwapped, ...users].sort((a, b) =>
        a.nickname.localeCompare(b.nickname)
      )
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
    SET_USERS_FILTERS: (state, filters) => {
      state.filters = filters
    },
    SET_USER_PROFILE: (state, user) => {
      state.userProfile = user
    }
  },
  actions: {
    async ActivateUsers({ commit, dispatch, getters, state }, users) {
      const updatedUsers = users.map(user => {
        return { ...user, deactivated: false }
      })
      commit('SWAP_USERS', updatedUsers)

      const usersNicknames = users.map(user => user.nickname)
      await activateUsers(usersNicknames, getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
    },
    async AddRight({ commit, dispatch, getters, state }, { users, right }) {
      const updatedUsers = users.map(user => {
        return user.local ? { ...user, roles: { ...user.roles, [right]: true }} : user
      })
      commit('SWAP_USERS', updatedUsers)

      const usersNicknames = users.map(user => user.nickname)
      await addRight(usersNicknames, right, getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
    },
    async AddTag({ commit, dispatch, getters, state }, { users, tag }) {
      const updatedUsers = users.map(user => {
        return { ...user, tags: [...user.tags, tag] }
      })
      commit('SWAP_USERS', updatedUsers)

      const nicknames = users.map(user => user.nickname)
      await tagUser(nicknames, [tag], getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
    },
    async ClearFilters({ commit, dispatch, state }) {
      commit('CLEAR_USERS_FILTERS')
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async CreateNewAccount({ dispatch, getters, state }, { nickname, email, password }) {
      await createNewAccount(nickname, email, password, getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
    },
    async DeactivateUsers({ commit, dispatch, getters, state }, users) {
      const updatedUsers = users.map(user => {
        return { ...user, deactivated: true }
      })
      commit('SWAP_USERS', updatedUsers)

      const usersNicknames = users.map(user => user.nickname)
      await deactivateUsers(usersNicknames, getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
    },
    async DeleteRight({ commit, dispatch, getters, state }, { users, right }) {
      const updatedUsers = users.map(user => {
        return user.local ? { ...user, roles: { ...user.roles, [right]: false }} : user
      })
      commit('SWAP_USERS', updatedUsers)

      const usersNicknames = users.map(user => user.nickname)
      await deleteRight(usersNicknames, right, getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
    },
    async DeleteUsers({ commit, getters, state }, users) {
      const deletedUsersIds = users.map(deletedUser => deletedUser.id)
      const updatedUsers = state.fetchedUsers.filter(user => !deletedUsersIds.includes(user.id))
      commit('SET_USERS', updatedUsers)

      const usersNicknames = users.map(user => user.nickname)
      await deleteUsers(usersNicknames, getters.authHost, getters.token)
    },
    async RequirePasswordReset({ getters }, user) {
      await requirePasswordReset(user.nickname, getters.authHost, getters.token)
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
    async RemoveTag({ commit, dispatch, getters, state }, { users, tag }) {
      const updatedUsers = users.map(user => {
        return { ...user, tags: user.tags.filter(userTag => userTag !== tag) }
      })
      commit('SWAP_USERS', updatedUsers)

      const nicknames = users.map(user => user.nickname)
      await untagUser(nicknames, [tag], getters.authHost, getters.token)
      dispatch('SearchUsers', { query: state.searchQuery, page: state.currentPage })
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
    async ToggleUsersFilter({ commit, dispatch, state }, filters) {
      const defaultFilters = {
        local: false,
        external: false,
        active: false,
        deactivated: false
      }
      const currentFilters = { ...defaultFilters, ...filters }
      commit('SET_USERS_FILTERS', currentFilters)
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
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
