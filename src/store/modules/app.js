import Cookies from 'js-cookie'
import { needReboot, restartApp } from '@/api/app'

const app = {
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    language: Cookies.get('language') || 'en',
    needReboot: false,
    size: Cookies.get('size') || 'medium',
    invitesEnabled: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_INVITES_ENABLED: (state, invitesEnabled) => {
      state.invitesEnabled = invitesEnabled
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    TOGGLE_REBOOT: (state, needReboot) => {
      state.needReboot = needReboot
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    }
  },
  actions: {
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    async NeedReboot({ commit, getters }) {
      const response = await needReboot(getters.authHost, getters.token)
      commit('TOGGLE_REBOOT', response.data['need_reboot'])
    },
    async RestartApplication({ commit, getters }) {
      await restartApp(getters.authHost, getters.token)
      commit('TOGGLE_REBOOT', false)
    },
    SetInvitesEnabled({ commit }, invitesEnabled) {
      commit('SET_INVITES_ENABLED', invitesEnabled)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
