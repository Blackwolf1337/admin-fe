import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Settings from '@/views/settings/index'
import flushPromises from 'flush-promises'
import app from '@/store/modules/app'
import getters from '@/store/getters'
import relays from '@/store/modules/relays'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import users from '@/store/modules/users'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

describe('Settings search', () => {
  let store
  let actions

  beforeEach(() => {
    actions = { SetActiveTab: jest.fn() }

    store = new Vuex.Store({
      modules: {
        app,
        relays,
        settings: { ...settings, actions },
        user,
        users
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
    await flushPromises()
    wrapper.vm.handleSearchSelect({ group: 'Pleroma.Upload', key: 'Pleroma.Upload' })
    expect(actions.SetActiveTab).toHaveBeenCalled()
    done()
  })
})
