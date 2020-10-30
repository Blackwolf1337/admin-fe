import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Layout from '@/views/layout/Layout'
import storeConfig from './store.conf'
import routerConfig from './router.conf'
import { cloneDeep } from 'lodash'
import { beforeEachRoute } from '@/permission'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(Element)

jest.mock('@/api/reports')

describe('Log out', () => {
  let store
  let router

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    router = new VueRouter(cloneDeep(routerConfig))
    router.beforeEach(beforeEachRoute)

    delete window.location
    window.location = { href: '' }
  })

  it('logs out user', async (done) => {
    const wrapper = mount(Layout, {
      store,
      router,
      localVue
    })

    const logoutButton = wrapper.find('span')
    expect(store.state.user.roles.length).toBe(1)
    expect(store.state.user.token).toBe('foo123')

    logoutButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(store.state.user.roles.length).toBe(0)
    expect(store.state.user.token).toBe('')
    done()
  })
})
