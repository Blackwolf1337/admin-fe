import Vuex from 'vuex'
import { mount, createLocalVue, config, RouterLinkStub } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import StatusShow from '@/views/statuses/show'
import storeConfig from './statusShowStore.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

const $route = {
  params: {
    id: '9vJOO3iFPyjNaEhJ5s'
  }
}

jest.mock('@/api/app')
jest.mock('@/api/status')
jest.mock('@/api/peers')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/users')

describe('Status show page', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it(`fetches single status and user's statuses`, async (done) => {
    const wrapper = mount(StatusShow, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      },
      mocks: {
        $route
      }
    })
    await flushPromises()

    expect(wrapper.find('.status-container').isVisible()).toBe(true)
    expect(store.state.status.fetchedStatus.id).toBe('9vJOO3iFPyjNaEhJ5s')
    expect(store.state.status.fetchedStatus.account.nickname).toBe('dolin')
    expect(store.state.userProfile.statuses.length).toEqual(3)
    done()
  })

  it(`renders links and user's moderation menu`, async (done) => {
    const wrapper = mount(StatusShow, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      },
      mocks: {
        $route
      }
    })
    await flushPromises()

    expect(wrapper.findComponent(RouterLinkStub).find('h1').text()).toBe('dolin')
    expect(wrapper.find('button.moderate-user-button').exists()).toBe(true)
    expect(wrapper.find('.el-dropdown-menu').exists()).toBe(true)
    done()
  })

  it(`renders status card`, async (done) => {
    const wrapper = mount(StatusShow, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      },
      mocks: {
        $route
      }
    })
    await flushPromises()

    expect(wrapper.find('.status-card').exists()).toBe(true)
    expect(wrapper.findAllComponents(RouterLinkStub).at(1).find('span.status-account-name').text()).toBe('dolin')
    expect(wrapper.find('span.el-tag').text()).not.toBe('Sensitive')
    expect(wrapper.find('span.el-tag').text()).toBe('Public')
    expect(wrapper.find('button.status-actions-button').exists()).toBe(true)
    expect(wrapper.find('.status-body .status-content').text()).toBe('pizza makes everything better')
    done()
  })
})
