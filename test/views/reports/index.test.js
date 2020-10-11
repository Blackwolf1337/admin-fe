import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Reports from '@/views/reports/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}
config.stubs['reports-filter'] = { template: '<div />'}
config.stubs['timeline-item'] = { template: '<div />'}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/reports')
jest.mock('@/api/settings')

describe('Reports', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('initially fetches reports', async (done) => {
    const wrapper = mount(Reports, {
      store,
      localVue
    })

    await flushPromises()
    const initialReports = store.state.reports.fetchedReports.length
    expect(initialReports).toEqual(7)
    done()
  })
})
