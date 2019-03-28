import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Filters from '@/views/users/components/UsersFilter'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

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

    expect(store.state.users.totalUsersCount).toEqual(3)

    const filter = wrapper.find(`li.el-select-dropdown__item:nth-child(${1})`)
    filter.trigger('click')
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(2)

    done()
  })

  it('shows users with applied filter and search query', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(3)

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
    expect(store.state.users.totalUsersCount).toEqual(2)

    done()
  })

  it('applies two filters', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(3)

    store.dispatch('ToggleUsersFilter', { active: true, local: true })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)
    expect(store.state.users.fetchedUsers[0].nickname).toEqual('allis')

    store.dispatch('ToggleUsersFilter', { deactivated: true, external: true })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(0)

    done()
  })

  it('shows all users after removing filters', async (done) => {
    expect(store.state.users.totalUsersCount).toEqual(3)

    store.dispatch('ToggleUsersFilter', { deactivated: true })
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(1)

    store.dispatch('ToggleUsersFilter', {})
    await flushPromises()
    expect(store.state.users.totalUsersCount).toEqual(3)

    done()
  })
})
