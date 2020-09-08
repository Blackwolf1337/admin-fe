import app from '@/store/modules/app'
import mediaProxyCache from '@/store/modules/mediaProxyCache'
import user from '@/store/modules/user'
import users from '@/store/modules/users'
import reports from '@/store/modules/reports'
import settings from '@/store/modules/settings'
import status from '@/store/modules/status'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    mediaProxyCache,
    user,
    users,
    reports,
    settings,
    status
  },
  getters
}
