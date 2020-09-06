import { listBannedUrls, purgeUrls, removeBannedUrls, searchBannedUrls } from '@/api/mediaProxyCache'
import { fetchSettings, updateSettings } from '@/api/settings'
import { Message } from 'element-ui'
import i18n from '@/lang'

const mediaProxyCache = {
  state: {
    bannedUrls: [],
    currentPage: 1,
    loading: false,
    mediaProxyEnabled: false,
    pageSize: 50,
    searchQuery: '',
    totalUrlsCount: 0
  },
  mutations: {
    MEDIA_PROXY_ENABLED: (state, enabled) => {
      state.mediaProxyEnabled = enabled
    },
    SET_BANNED_URLS: (state, urls) => {
      state.bannedUrls = urls.map(el => { return { url: el } })
    },
    SET_TOTAL_URLS_COUNT: (state, count) => {
      state.totalUrlsCount = count
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
    async EnableMediaProxy({ dispatch, getters, state }) {
      const configs = [{
        group: ':pleroma',
        key: ':media_proxy',
        value: [
          { tuple: [':enabled', true] },
          { tuple: [':invalidation', [{ tuple: [':enabled', true] }]] }
        ]
      }]
      await updateSettings(configs, getters.authHost, getters.token)

      dispatch('FetchMediaProxySetting')
    },
    async FetchMediaProxySetting({ commit, getters }) {
      const { data } = await fetchSettings(getters.authHost, getters.token)
      const mediaProxySettings = data.configs.find(el => el.key === ':media_proxy')
        ? data.configs.find(el => el.key === ':media_proxy').value
        : []
      const mediaProxyEnabled = mediaProxySettings.find(el => el.tuple[0] === ':enabled')
        ? mediaProxySettings.find(el => el.tuple[0] === ':enabled').tuple[1]
        : false

      commit('MEDIA_PROXY_ENABLED', mediaProxyEnabled)
    },
    async ListBannedUrls({ commit, getters, state }, { page }) {
      commit('SET_LOADING', true)
      const response = await listBannedUrls(page, state.pageSize, getters.authHost, getters.token)
      commit('SET_BANNED_URLS', response.data.urls)
      commit('SET_TOTAL_URLS_COUNT', response.data.count)
      commit('SET_PAGE', page)
      commit('SET_LOADING', false)
    },
    async PurgeUrls({ dispatch, getters, state }, { urls, ban }) {
      await purgeUrls(urls, ban, getters.authHost, getters.token)
      Message({
        message: i18n.t('mediaProxyCache.evictedMessage'),
        type: 'success',
        duration: 5 * 1000
      })
      if (ban && state.searchQuery.length === 0) {
        dispatch('ListBannedUrls', { page: state.currentPage })
      } else if (ban) {
        dispatch('SearchUrls', { query: state.searchQuery, page: state.currentPage })
      }
    },
    async RemoveBannedUrls({ dispatch, getters, state }, urls) {
      await removeBannedUrls(urls, getters.authHost, getters.token)
      if (state.searchQuery.length === 0) {
        dispatch('ListBannedUrls', { page: state.currentPage })
      } else {
        dispatch('SearchUrls', { query: state.searchQuery, page: state.currentPage })
      }
    },
    async SearchUrls({ commit, dispatch, getters, state }, { query, page }) {
      if (query.length === 0) {
        commit('SET_SEARCH_QUERY', query)
        dispatch('ListBannedUrls', { page })
      } else {
        commit('SET_LOADING', true)
        commit('SET_SEARCH_QUERY', query)

        const response = await searchBannedUrls(query, page, state.pageSize, getters.authHost, getters.token)
        commit('SET_BANNED_URLS', response.data.urls)
        commit('SET_TOTAL_URLS_COUNT', response.data.count)
        commit('SET_PAGE', page)
        commit('SET_LOADING', false)
      }
    }
  }
}

export default mediaProxyCache
