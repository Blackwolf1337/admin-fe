import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import chat from '@/store/modules/chat'
import getters from '@/store/getters'

export const storeConfig = {
  modules: {
    app,
    settings,
    user,
    chat
  },
  getters
}

export const storeWithTagPolicy = {
  modules: {
    app,
    settings,
    user,
    chat
  },
  getters
}
