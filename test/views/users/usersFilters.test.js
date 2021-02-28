import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Filters from '@/views/users/components/UsersFilter'
import flushPromises from 'flush-promises'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import userProfile from '@/store/modules/userProfile'
import users from '@/store/modules/users'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/settings')
jest.mock('@/api/users')

describe('Filters users', () => {
  let store
  let actions

  beforeEach(async() => {
    actions = { ...users.actions, ToggleUsersFilter: jest.fn(), ToggleActorTypeFilter: jest.fn() }
    store = new Vuex.Store(({ 
      modules: {
        app,
        settings,
        user,
        userProfile,
        users: { ...users, actions }
      },
      getters: {}
    }))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
  })

  it('enables local and active filters when component is mounted, toggles local filter on button click', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(1, expect.anything(), ['local', 'active'], undefined)

    const filter = wrapper.find(`li.el-select-dropdown__item:nth-child(${1})`)
    filter.trigger('click')

    expect(actions.ToggleUsersFilter).toHaveBeenCalled()
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalled()
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(2, expect.anything(), ['active'], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), [], undefined)
    await flushPromises()
    done()
  })

  it('applies three filters', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(1, expect.anything(), ['local', 'active'], undefined)
    
    const filter1 = wrapper.find(`.el-select-group__wrap:nth-child(${1}) li.el-select-dropdown__item:nth-child(${2})`)
    filter1.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(2, expect.anything(), ['external', 'active'], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), [], undefined)
    await flushPromises()

    const filter2 = wrapper.find(`.el-select-group__wrap:nth-child(${2}) li.el-select-dropdown__item:nth-child(${3})`)
    filter2.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(3, expect.anything(), ['external', 'need_approval'], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), [], undefined)
    await flushPromises()

    const filter3 = wrapper.find(`.el-select-group__wrap:nth-child(${3}) li.el-select-dropdown__item:nth-child(${1})`)
    filter3.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(4, expect.anything(), ['external', 'need_approval'], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), ['Person'], undefined)
    await flushPromises()
    done()
  })

  it('removes all filters', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(1, expect.anything(), ['local', 'active'], undefined)
    
    const filter1 = wrapper.find(`.el-select-group__wrap:nth-child(${1}) li.el-select-dropdown__item:nth-child(${1})`)
    filter1.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(2, expect.anything(), ['active'], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), [], undefined)
    await flushPromises()

    const filter2 = wrapper.find(`.el-select-group__wrap:nth-child(${2}) li.el-select-dropdown__item:nth-child(${1})`)
    filter2.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(3, expect.anything(), [], undefined)
    expect(actions.ToggleActorTypeFilter).toHaveBeenCalledWith(expect.anything(), [], undefined)
    await flushPromises()

    done()
  })

  it('applies actor type filters', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })
    
    const filter1 = wrapper.find(`.el-select-group__wrap:nth-child(${3}) li.el-select-dropdown__item:nth-child(${1})`)
    filter1.trigger('click')
    expect(actions.ToggleActorTypeFilter).toHaveBeenNthCalledWith(1, expect.anything(), ['Person'], undefined)
    await flushPromises()

    const filter2 = wrapper.find(`.el-select-group__wrap:nth-child(${3}) li.el-select-dropdown__item:nth-child(${2})`)
    filter2.trigger('click')
    expect(actions.ToggleActorTypeFilter).toHaveBeenNthCalledWith(2, expect.anything(), ['Person', 'Service'], undefined)
    await flushPromises()

    const filter3 = wrapper.find(`.el-select-group__wrap:nth-child(${3}) li.el-select-dropdown__item:nth-child(${3})`)
    filter3.trigger('click')
    expect(actions.ToggleActorTypeFilter).toHaveBeenNthCalledWith(3, expect.anything(), ['Person', 'Service', 'Application'], undefined)
    await flushPromises()

    done()
  })

  it('applies opposite filters', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })

    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(1, expect.anything(), ['local', 'active'], undefined)
    
    const filter1 = wrapper.find(`.el-select-group__wrap:nth-child(${2}) li.el-select-dropdown__item:nth-child(${2})`)
    filter1.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(2, expect.anything(), ['local', 'deactivated'], undefined)
    await flushPromises()

    const filter2 = wrapper.find(`.el-select-group__wrap:nth-child(${2}) li.el-select-dropdown__item:nth-child(${3})`)
    filter2.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(3, expect.anything(), ['local', 'need_approval'], undefined)
    await flushPromises()

    const filter3 = wrapper.find(`.el-select-group__wrap:nth-child(${2}) li.el-select-dropdown__item:nth-child(${4})`)
    filter3.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(4, expect.anything(), ['local', 'unconfirmed'], undefined)
    await flushPromises()

    const filter4 = wrapper.find(`.el-select-group__wrap:nth-child(${1}) li.el-select-dropdown__item:nth-child(${2})`)
    filter4.trigger('click')
    expect(actions.ToggleUsersFilter).toHaveBeenNthCalledWith(5, expect.anything(), ['external', 'unconfirmed'], undefined)
    await flushPromises()


    done()
  })
})
