import {
  addNewEmojiFile,
  createPack,
  deleteEmojiFile,
  deletePack,
  downloadFrom,
  fetchPack,
  importFromFS,
  listPacks,
  listRemotePacks,
  reloadEmoji,
  savePackMetadata,
  updateEmojiFile
} from '@/api/emojiPacks'
import i18n from '@/lang'
import { Message } from 'element-ui'

import Vue from 'vue'

const emojiPacks = {
  state: {
    activeTab: '',
    currentLocalFilesPage: 1,
    currentLocalPacksPage: 1,
    currentRemoteFilesPage: 1,
    currentRemotePacksPage: 1,
    filesPageSize: 30,
    localPackFilesCount: 0,
    localPacks: {},
    localPacksCount: 0,
    pageSize: 50,
    remoteInstance: '',
    remotePackFilesCount: 0,
    remotePacks: {},
    remotePacksCount: 0
  },
  mutations: {
    SET_ACTIVE_TAB: (state, tab) => {
      state.activeTab = tab
    },
    SET_LOCAL_FILES_COUNT: (state, count) => {
      state.localPackFilesCount = count
    },
    SET_LOCAL_FILES_PAGE: (state, page) => {
      state.currentLocalFilesPage = page
    },
    SET_LOCAL_PACKS: (state, packs) => {
      state.localPacks = packs
    },
    SET_LOCAL_PACKS_COUNT: (state, count) => {
      state.localPacksCount = count
    },
    SET_LOCAL_PACK_FILES: (state, { name, files }) => {
      state.localPacks = { ...state.localPacks, [name]: { ...state.localPacks[name], files }}
    },
    SET_LOCAL_PAGE: (state, page) => {
      state.currentLocalPacksPage = page
    },
    SET_REMOTE_FILES_COUNT: (state, count) => {
      state.remotePackFilesCount = count
    },
    SET_REMOTE_FILES_PAGE: (state, page) => {
      state.currentRemoteFilesPage = page
    },
    SET_REMOTE_INSTANCE: (state, name) => {
      state.remoteInstance = name
    },
    SET_REMOTE_PACKS_COUNT: (state, count) => {
      state.remotePacksCount = count
    },
    SET_REMOTE_PACK_FILES: (state, { name, files }) => {
      state.remotePacks = { ...state.remotePacks, [name]: { ...state.remotePacks[name], files }}
    },
    SET_REMOTE_PACKS: (state, packs) => {
      state.remotePacks = packs
    },
    UPDATE_LOCAL_PACK_VAL: (state, { name, key, value }) => {
      Vue.set(state.localPacks[name]['pack'], key, value)
    },
    UPDATE_LOCAL_PACK_PACK: (state, { name, pack }) => {
      state.localPacks[name]['pack'] = pack
    },
    UPDATE_LOCAL_PACK_FILES: (state, { name, files }) => {
      // Use vue.set in case "files" was null
      Vue.set(
        state.localPacks[name],
        'files',
        files
      )
    }
  },
  actions: {
    async AddNewEmojiFile({ commit, getters }, { packName, file, shortcode, filename }) {
      let result
      try {
        result = await addNewEmojiFile(packName, file, shortcode, filename, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
        type: 'success',
        duration: 5 * 1000
      })

      commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: result.data })
    },
    async DeleteEmojiFile({ commit, dispatch, getters, state }, { packName, shortcode }) {
      const { [shortcode]: value, ...updatedPackFiles } = state.localPacks[packName].files
      commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: updatedPackFiles })

      try {
        await deleteEmojiFile(packName, shortcode, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
        type: 'success',
        duration: 5 * 1000
      })
      if (Object.keys(updatedPackFiles).length === 0 && state.currentLocalFilesPage > 1) {
        dispatch('FetchLocalSinglePack', { name: packName, page: state.currentLocalFilesPage - 1 })
      } else {
        dispatch('FetchLocalSinglePack', { name: packName, page: state.currentLocalFilesPage })
      }
    },
    async CreatePack({ getters }, { name }) {
      await createPack(getters.authHost, getters.token, name)
    },
    async DeletePack({ getters }, { name }) {
      await deletePack(getters.authHost, getters.token, name)
    },
    async DownloadFrom({ getters }, { instanceAddress, packName, as }) {
      const result = await downloadFrom(instanceAddress, packName, as, getters.authHost, getters.token)

      if (result.data === 'ok') {
        Message({
          message: `${i18n.t('settings.successfullyDownloaded')} ${packName}`,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async FetchLocalEmojiPacks({ commit, getters, state }, page) {
      const { data } = await listPacks(page, state.pageSize, getters.authHost, getters.token)
      const { packs, count } = data
      const updatedPacks = Object.keys(packs).reduce((acc, packName) => {
        const { files, ...pack } = packs[packName]
        acc[packName] = pack
        return acc
      }, {})
      commit('SET_LOCAL_PACKS', updatedPacks)
      commit('SET_LOCAL_PACKS_COUNT', count)
      commit('SET_LOCAL_PAGE', page)
    },
    async FetchLocalSinglePack({ getters, commit, state }, { name, page }) {
      const { data } = await fetchPack(name, page, state.filesPageSize, getters.authHost, getters.token)
      const { files, files_count } = data
      commit('SET_LOCAL_PACK_FILES', { name, files })
      commit('SET_LOCAL_FILES_COUNT', files_count)
      commit('SET_LOCAL_FILES_PAGE', page)
    },
    async FetchRemoteSinglePack({ getters, commit, state }, { name, page }) {
      const { data } = await fetchPack(name, page, state.filesPageSize, getters.authHost, getters.token)
      const { files, files_count } = data
      commit('SET_REMOTE_PACK_FILES', { name, files })
      commit('SET_REMOTE_FILES_COUNT', files_count)
      commit('SET_REMOTE_FILES_PAGE', page)
    },
    async ImportFromFS({ getters }) {
      const result = await importFromFS(getters.authHost, getters.token)

      if (result.status === 200) {
        const message = result.data.length > 0
          ? `${i18n.t('settings.successfullyImported')} ${result.data}`
          : i18n.t('settings.nowNewPacksToImport')

        Message({
          message,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async ReloadEmoji({ getters }) {
      await reloadEmoji(getters.authHost, getters.token)
    },
    async SavePackMetadata({ commit, getters, state }, { packName }) {
      const result =
        await savePackMetadata(
          getters.authHost,
          getters.token,
          packName,
          state.localPacks[packName]['pack']
        )

      if (result.status === 200) {
        Message({
          message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
          type: 'success',
          duration: 5 * 1000
        })

        commit('UPDATE_LOCAL_PACK_PACK', { name: packName, pack: result.data })
      }
    },
    SetActiveTab({ commit }, activeTab) {
      commit('SET_ACTIVE_TAB', activeTab)
    },
    async SetRemoteEmojiPacks({ commit, getters, state }, { page, remoteInstance }) {
      const { data } = await listRemotePacks(remoteInstance, page, state.pageSize, getters.authHost, getters.token)
      const { packs, count } = data
      const updatedPacks = Object.keys(packs).reduce((acc, packName) => {
        const { files, ...pack } = packs[packName]
        acc[packName] = pack
        return acc
      }, {})

      commit('SET_REMOTE_INSTANCE', remoteInstance)
      commit('SET_REMOTE_PACKS', updatedPacks)
      commit('SET_REMOTE_PACKS_COUNT', count)
    },
    SetRemoteInstance({ commit }, instance) {
      commit('SET_REMOTE_INSTANCE', instance)
    },
    async UpdateEmojiFile({ commit, dispatch, getters, state }, { packName, shortcode, newShortcode, newFilename, force }) {
      const updatedPackFiles = Object.keys(state.localPacks[packName].files).reduce((acc, el) => {
        if (el === shortcode) {
          acc[newShortcode] = newFilename
        } else {
          acc[el] = state.localPacks[packName].files[el]
        }
        return acc
      }, {})
      commit('UPDATE_LOCAL_PACK_FILES', { name: packName, files: updatedPackFiles })

      try {
        await updateEmojiFile(packName, shortcode, newShortcode, newFilename, force, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: `${i18n.t('settings.successfullyUpdated')} ${packName} ${i18n.t('settings.metadatLowerCase')}`,
        type: 'success',
        duration: 5 * 1000
      })

      dispatch('FetchLocalSinglePack', { name: packName, page: state.currentLocalFilesPage })
    },
    async UpdateLocalPackVal({ commit }, args) {
      commit('UPDATE_LOCAL_PACK_VAL', args)
    }
  }
}

export default emojiPacks
