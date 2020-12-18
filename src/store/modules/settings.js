import {
  deleteInstanceDocument,
  fetchDescription,
  fetchRollbackVersionById,
  fetchSettings,
  getInstanceDocument,
  listRollbackVersions,
  removeSettings,
  updateInstanceDocument,
  updateSettings } from '@/api/settings'
import { formSearchObject, parseTuples, wrapUpdatedSettings } from './normalizers'
import _ from 'lodash'

const settings = {
  state: {
    activeTab: 'instance',
    backupVersions: [],
    configDisabled: true,
    db: {},
    description: [],
    instancePanel: '',
    loading: true,
    searchData: {},
    settings: {},
    termsOfServices: '',
    updatedSettings: {},
    versionsLoading: true
  },
  mutations: {
    CLEAR_UPDATED_SETTINGS: (state) => {
      state.updatedSettings = {}
    },
    SET_INSTANCE_PANEL: (state, data) => {
      state.instancePanel = data
    },
    REMOVE_SETTING_FROM_UPDATED: (state, { group, key, subkeys }) => {
      if (_.get(state.updatedSettings, [group, key, subkeys[0]])) {
        const { [subkeys[0]]: value, ...updatedSettings } = state.updatedSettings[group][key]
        state.updatedSettings = updatedSettings
      }
    },
    SET_ACTIVE_TAB: (state, tab) => {
      state.activeTab = tab
    },
    SET_DESCRIPTION: (state, data) => {
      state.description = data
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_SEARCH: (state, searchObject) => {
      state.searchData = searchObject
    },
    SET_SETTINGS: (state, data) => {
      const newSettings = data.reduce((acc, { group, key, value }) => {
        const parsedValue = parseTuples(value, key)
        if (acc[group]) {
          acc[group] = key ? { ...acc[group], [key]: parsedValue } : { ...acc[group], ...parsedValue }
        } else {
          acc[group] = key ? { [key]: parsedValue } : parsedValue
        }
        return acc
      }, {})

      const newDbSettings = data.reduce((acc, { group, key, db }) => {
        if (db) {
          acc[group] = acc[group] ? { ...acc[group], [key]: db } : { [key]: db }
        }
        return acc
      }, {})

      state.settings = newSettings
      state.db = newDbSettings
    },
    SET_TERMS_OF_SERVICES: (state, data) => {
      state.termsOfServices = data
    },
    SET_VERSIONS: (state, versions) => {
      state.backupVersions = versions
    },
    SET_VERSIONS_LOADING: (state, status) => {
      state.versionsLoading = status
    },
    TOGGLE_TABS: (state, status) => {
      state.configDisabled = status
    },
    UPDATE_SETTINGS: (state, { group, key, input, value, type }) => {
      const updatedSetting = !state.updatedSettings[group] || (key === 'Pleroma.Emails.Mailer' && input === ':adapter')
        ? { [key]: { [input]: [type, value] }}
        : { [key]: { ...state.updatedSettings[group][key], ...{ [input]: [type, value] }}}
      state.updatedSettings[group] = { ...state.updatedSettings[group], ...updatedSetting }
    },
    UPDATE_STATE: (state, { group, key, input, value }) => {
      let updatedState
      if (key === 'Pleroma.Emails.Mailer' && input === ':adapter') {
        updatedState = { [key]: { [input]: value }}
      } else if (key === null) {
        updatedState = { [input]: value }
      } else {
        updatedState = { [key]: { ...state.settings[group][key], ...{ [input]: value }}}
      }
      state.settings[group] = { ...state.settings[group], ...updatedState }
    }
  },
  actions: {
    async FetchInstanceDocument({ commit, getters }, name) {
      const { data } = await getInstanceDocument(name, getters.authHost, getters.token)
      if (name === 'instance-panel') {
        commit('SET_INSTANCE_PANEL', data)
      } else {
        commit('SET_TERMS_OF_SERVICES', data)
      }
    },
    async FetchSettings({ commit, getters }) {
      commit('SET_LOADING', true)
      try {
        const response = await fetchSettings(getters.authHost, getters.token)
        const description = await fetchDescription(getters.authHost, getters.token)
        commit('SET_DESCRIPTION', description.data)
        const searchObject = formSearchObject(description.data)
        commit('SET_SEARCH', searchObject)
        commit('SET_SETTINGS', response.data.configs)
      } catch (_e) {
        commit('TOGGLE_TABS', true)
        commit('SET_ACTIVE_TAB', 'relays')
        commit('SET_LOADING', false)
        return
      }
      commit('TOGGLE_TABS', false)
      commit('SET_LOADING', false)
    },
    async ListRollbackVersions({ commit, getters }) {
      commit('SET_VERSIONS_LOADING', true)
      try {
        const { data } = await listRollbackVersions(getters.authHost, getters.token)
        commit('SET_VERSIONS', data.versions)
      } catch (_e) {
        return
      }
      commit('SET_VERSIONS_LOADING', false)
    },
    async RemoveInstanceDocument({ dispatch, getters }, name) {
      await deleteInstanceDocument(name, getters.authHost, getters.token)
      await dispatch('FetchInstanceDocument', name)
    },
    async RemoveSetting({ commit, getters }, configs) {
      await removeSettings(configs, getters.authHost, getters.token)
      const response = await fetchSettings(getters.authHost, getters.token)
      const { group, key, subkeys } = configs[0]
      commit('SET_SETTINGS', response.data.configs)
      commit('TOGGLE_REBOOT', response.data.need_reboot)
      commit('REMOVE_SETTING_FROM_UPDATED', { group, key, subkeys: subkeys || [] })
    },
    async RestoreSettings({ dispatch, getters }, id) {
      await fetchRollbackVersionById(id, getters.authHost, getters.token)
      dispatch('FetchSettings')
    },
    SetActiveTab({ commit }, tab) {
      commit('SET_ACTIVE_TAB', tab)
    },
    async SubmitChanges({ getters, commit, state }) {
      const configs = Object.keys(state.updatedSettings).reduce((acc, group) => {
        return [...acc, ...wrapUpdatedSettings(group, state.updatedSettings[group], state.settings)]
      }, [])

      await updateSettings(configs, getters.authHost, getters.token)
      const response = await fetchSettings(getters.authHost, getters.token)
      commit('SET_SETTINGS', response.data.configs)
      commit('TOGGLE_REBOOT', response.data.need_reboot)
      commit('CLEAR_UPDATED_SETTINGS')
    },
    async UpdateInstanceDocs({ commit, getters }, { name, content }) {
      commit('SET_INSTANCE_PANEL', content)
      const formData = new FormData()
      const blob = new Blob([content], { type: 'text/html' })
      formData.append('file', blob)
      await updateInstanceDocument(name, formData, getters.authHost, getters.token)
    },
    UpdateSettings({ commit }, { group, key, input, value, type }) {
      key
        ? commit('UPDATE_SETTINGS', { group, key, input, value, type })
        : commit('UPDATE_SETTINGS', { group, key: null, input, value, type })
    },
    async UpdateState({ commit, getters, state }, { group, key, input, value }) {
      if (key === 'Pleroma.Emails.Mailer' && input === ':adapter') {
        const subkeys = Object.keys(state.settings[group][key]).filter(el => el !== ':adapter')
        await removeSettings([{ group, key, delete: true, subkeys }], getters.authHost, getters.token)
      } else if (key === 'Pleroma.Upload' && input === ':uploader') {
        const deletedKey = value === 'Pleroma.Uploaders.Local' ? 'Pleroma.Uploaders.S3' : 'Pleroma.Uploaders.Local'
        await removeSettings([{ group, key: deletedKey, delete: true }], getters.authHost, getters.token)
      }
      key
        ? commit('UPDATE_STATE', { group, key, input, value })
        : commit('UPDATE_STATE', { group, key: null, input, value })
    }
  }
}

export default settings
