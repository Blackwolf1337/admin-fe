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
    currentFilesPage: 1,
    currentPage: 1,
    filesPageSize: 30,
    localPackFilesCount: 0,
    localPacks: {},
    localPacksCount: 0,
    pageSize: 50,
    remoteInstance: '',
    remotePacks: {}
  },
  mutations: {
    SET_ACTIVE_TAB: (state, tab) => {
      state.activeTab = tab
    },
    SET_FILES_COUNT: (state, count) => {
      state.localPackFilesCount = count
    },
    SET_FILES_PAGE: (state, page) => {
      state.currentFilesPage = page
    },
    SET_LOCAL_PACKS: (state, packs) => {
      state.localPacks = packs
    },
    SET_LOCAL_PACKS_COUNT: (state, count) => {
      state.localPacksCount = count
    },
    SET_PACK_FILES: (state, { name, files }) => {
      state.localPacks = { ...state.localPacks, [name]: { ...state.localPacks[name], files }}
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_REMOTE_INSTANCE: (state, name) => {
      state.remoteInstance = name
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
      if (Object.keys(updatedPackFiles).length === 0 && state.currentFilesPage > 1) {
        dispatch('FetchSinglePack', { name: packName, page: state.currentFilesPage - 1 })
      } else {
        dispatch('FetchSinglePack', { name: packName, page: state.currentFilesPage })
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
      commit('SET_PAGE', page)
    },
    async FetchSinglePack({ getters, commit, state }, { name, page }) {
      const { data } = await fetchPack(name, page, state.filesPageSize, getters.authHost, getters.token)
      const { files, files_count } = data
      commit('SET_PACK_FILES', { name, files })
      commit('SET_FILES_COUNT', files_count)
      commit('SET_FILES_PAGE', page)
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
    async SetRemoteEmojiPacks({ commit, getters }, { remoteInstance }) {
      const { data } = await listRemotePacks(getters.authHost, getters.token, remoteInstance)

      commit('SET_REMOTE_INSTANCE', remoteInstance)
      commit('SET_REMOTE_PACKS', data)
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

      dispatch('FetchSinglePack', { name: packName, page: state.currentFilesPage })
    },
    async UpdateLocalPackVal({ commit }, args) {
      commit('UPDATE_LOCAL_PACK_VAL', args)
    }
  }
}

export default emojiPacks
