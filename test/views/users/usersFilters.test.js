import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Filters from '@/views/users/components/UsersFilter'
import { storeConfig } from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

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

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
  })

  it('shows local users when "Local" filter is applied', async (done) => {
    const wrapper = mount(Filters, {
      store,
      localVue
    })

    expect(store.state.users.totalUsersCount).toEqual(6)

    const filter = wrapper.find(`li.el-select-dropdown__item:nth-child(${1})`)
    filter.trigger('click')
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(5)

    done()
  })

  it('shows users with applied filter and search query', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleUsersFilter', { active: true })
    await flushPromises()
    store.dispatch('SearchUsers', { query: 'john', page: 1 })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(0)

    store.dispatch('SearchUsers', { query: 'allis', page: 1 })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)

    store.dispatch('SearchUsers', { query: '', page: 1 })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(5)

    done()
  })

  it('applies two filters', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleUsersFilter', { active: true, local: true })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(4)
    expect(store.state.users.fetchedUsers[0].nickname).toEqual('allis')

    store.dispatch('ToggleUsersFilter', { deactivated: true, external: true })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(0)

    done()
  })

  it('shows all users after removing filters', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleUsersFilter', { deactivated: true })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)

    store.dispatch('ToggleUsersFilter', {})
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(6)

    done()
  })

  it('applies actor type filter', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleActorTypeFilter', ["Person"])
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(4)
    expect(store.state.users.fetchedUsers[0].nickname).toEqual('allis')

    store.dispatch('ToggleActorTypeFilter', ["Service"])
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)
    expect(store.state.users.fetchedUsers[0].nickname).toEqual('sally')

    done()
  })

  it('shows users with applied actor type filter and search query', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleActorTypeFilter', ["Person"])
    await flushPromises()
    store.dispatch('SearchUsers', { query: 'john', page: 1 })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)

    store.dispatch('SearchUsers', { query: 'bot', page: 1 })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(0)

    store.dispatch('SearchUsers', { query: '', page: 1 })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(4)

    done()
  })

  it('applies two actor type filters', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleActorTypeFilter', ["Person", "Service"])
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(5)

    store.dispatch('ToggleActorTypeFilter', ["Service", "Application"])
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(2)

    done()
  })

  it('shows all users after removing actor type filters', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(6)

    store.dispatch('ToggleActorTypeFilter', ["Application"])
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)

    store.dispatch('ToggleActorTypeFilter', [])
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(6)

    done()
  })
})
