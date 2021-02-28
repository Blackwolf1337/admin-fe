import app from '@/store/modules/app'
import peers from '@/store/modules/peers'
import user from '@/store/modules/user'
import users from '@/store/modules/users'
import settings from '@/store/modules/settings'
import status from '@/store/modules/status'
import statusesByInstance from '@/store/modules/statusesByInstance'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    peers,
    settings,
    status,
    statusesByInstance,
    user: { ...user, state: { ...user.state, authHost: 'localhost:4000' }},
    users
  },
  getters
}
