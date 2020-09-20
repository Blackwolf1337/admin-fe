import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Statuses from '@/views/statuses/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/status')
jest.mock('@/api/peers')
jest.mock('@/api/nodeInfo')

describe('Statuses', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches peers and statuses count', async (done) => {
    mount(Statuses, {
      store,
      localVue
    })

    await flushPromises()
    const statusVisibilityCount = store.state.status.statusVisibility
    expect(statusVisibilityCount.direct).toEqual(4)
    expect(statusVisibilityCount.private).toEqual(10)
    expect(statusVisibilityCount.public).toEqual(4)
    expect(statusVisibilityCount.unlisted).toEqual(10)
    done()
  })

  it('fetches statuses from selected instance and updates the count', async (done) => {
    const wrapper = mount(Statuses, {
      store,
      localVue
    })
    await flushPromises()

    store.dispatch('HandleFilterChange', 'heaven.com')
    wrapper.vm.handleFilterChange()
    await flushPromises()
    const statusVisibilityCount = store.state.status.statusVisibility

    expect(statusVisibilityCount.direct).toEqual(1)
    expect(statusVisibilityCount.private).toEqual(2)
    expect(statusVisibilityCount.public).toEqual(3)
    expect(statusVisibilityCount.unlisted).toEqual(0)
    expect(store.state.status.fetchedStatuses.length).toEqual(2)
    done()
  })

  it('handles status select', async (done) => {
    const wrapper = mount(Statuses, {
      store: store,
      localVue
    })
    await flushPromises()

    store.dispatch('HandleFilterChange', 'heaven.com')
    wrapper.vm.handleFilterChange()
    await flushPromises()
    wrapper.find('.status-checkbox input').setChecked()
    await flushPromises()

    expect(wrapper.vm.selectedUsers.length).toEqual(1)
    expect(wrapper.vm.selectedUsers[0].nickname).toBe('sky')
    done()
  })

  it('clear state after component was destroyed', async (done) => {
    const wrapper = mount(Statuses, {
      store: store,
      localVue
    })
    await flushPromises()

    store.dispatch('HandleFilterChange', 'heaven.com')
    wrapper.vm.handleFilterChange()
    await flushPromises()
    wrapper.find('.status-checkbox input').setChecked()
    await flushPromises()

    expect(wrapper.vm.selectedUsers.length).toEqual(1)
    expect(store.state.status.statusesByInstance.selectedInstance).toBe('heaven.com')
    expect(store.state.status.fetchedStatuses.length).toEqual(2)
    wrapper.destroy()

    expect(wrapper.vm.selectedUsers.length).toEqual(0)
    expect(store.state.status.statusesByInstance.selectedInstance).toBe('')
    expect(store.state.status.fetchedStatuses.length).toEqual(0)
    done()
  })
})
