import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import userProfile from '@/store/modules/userProfile'
import users from '@/store/modules/users'
import getters from '@/store/getters'

export const storeConfig = {
  modules: {
    app,
    settings,
    user,
    userProfile,
    users
  },
  getters
}

export const storeWithTagPolicy = {
  modules: {
    app,
    settings,
    user,
    userProfile,
    users: { ...users, state: { ...users.state, mrfPolicies: ['Pleroma.Web.ActivityPub.MRF.TagPolicy'] }}
  },
  getters
}
