import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Statuses from '@/views/statuses/index'
import storeConfig from './storeForPagination.conf'
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

  it('pagination', async (done) => {
    const wrapper = mount(Statuses, {
      store,
      localVue
    })
    await flushPromises()

    store.dispatch('HandleFilterChange', 'heaven.com')
    wrapper.vm.handleFilterChange()
    await flushPromises()

    expect(store.state.status.statusesByInstance.allLoaded).toBe(false)
    expect(store.state.status.statusesByInstance.page).toBe(1)
    wrapper.find('.statuses-pagination button').trigger('click')
    await flushPromises()

    expect(store.state.status.statusesByInstance.allLoaded).toBe(false)
    expect(store.state.status.statusesByInstance.page).toBe(2)

    wrapper.find('.statuses-pagination button').trigger('click')
    await flushPromises()

    expect(store.state.status.statusesByInstance.allLoaded).toBe(true)

    done()
  })
})
