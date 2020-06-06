import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import UsersShow from '@/views/users/show'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

const $route = {
  params: {
    id: '2'
  }
}

jest.mock('@/api/nodeInfo')
jest.mock('@/api/users')

describe('User profile', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches user profile', async (done) => {
    const wrapper = mount(UsersShow, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link'],
      mocks: {
        $route
      }
    })

    await flushPromises()
    expect(wrapper.find('.user-profile-card').isVisible()).toBe(true)
    expect(store.state.userProfile.user.nickname).toBe('allis')
    expect(store.state.userProfile.user.roles.admin).toBe(true)
    done()
  })
})
