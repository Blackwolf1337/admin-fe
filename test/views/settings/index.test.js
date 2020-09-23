import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Settings from '@/views/settings/index'
import flushPromises from 'flush-promises'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import getters from '@/store/getters'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

describe('Settings search', () => {
  let store
  let actions
  let appActions

  beforeEach(() => {
    appActions = { ...app.actions, NeedReboot: jest.fn() }
    actions = { ...settings.actions, FetchSettings: jest.fn(), GetNodeInfo: jest.fn() }
    store = new Vuex.Store({
      modules: {
        app: { ...app, actions: appActions },
        settings: { ...settings, actions },
        user: { ...user, state: { ...user.state, authHost: 'localhost:4000' }}
      },
      getters
    })
  })

  it('shows search input', async (done) => {
    const wrapper = mount(Settings, {
      store,
      localVue
    })

    await flushPromises()
    const searchInput = wrapper.find('.settings-search-input')
    expect(searchInput.exists()).toBe(true)
    done()
  })
  it('changes tab when search value was selected', async (done) => {
    const wrapper = mount(Settings, {
      store,
      localVue
    })
    wrapper.vm.handleSearchSelect({ group: 'Pleroma.Upload', key: 'Pleroma.Upload' })
    expect(store.state.settings.activeTab).toBe('upload')

    wrapper.vm.handleSearchSelect({ group: ':swoosh', key: ':serve_mailbox' })
    expect(store.state.settings.activeTab).toBe('mailer')

    wrapper.vm.handleSearchSelect({ group: ':pleroma', key: ':admin_token' })
    expect(store.state.settings.activeTab).toBe('instance')

    wrapper.vm.handleSearchSelect({ group: ':media_proxy', key: ':ssl_options' })
    expect(store.state.settings.activeTab).toBe('media-proxy')

    done()
  })
})
