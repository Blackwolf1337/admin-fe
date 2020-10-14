import Vuex from 'vuex'
import { createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/reports')
jest.mock('@/api/settings')

describe('Reports filter', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchReports')
    await flushPromises()
  })

  it('shows open reports when "Open" filter is applied', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(7)

    store.dispatch('SetReportsFilter', 'open')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports', 1)
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(2)

    done()
  })

  it('shows resolved reports when "Resolved" filter is applied', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(7)

    store.dispatch('SetReportsFilter', 'resolved')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(2)

    done()
  })

  it('shows closed reports when "Closed" filter is applied', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(7)

    store.dispatch('SetReportsFilter', 'closed')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(3)

    done()
  })

  it('shows all users after removing filters', async (done) => {
    expect(store.state.reports.fetchedReports.length).toEqual(7)

    store.dispatch('SetReportsFilter', 'open')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(2)

    store.dispatch('SetReportsFilter', '')
    store.dispatch('ClearFetchedReports')
    store.dispatch('FetchReports')
    await flushPromises()
    expect(store.state.reports.fetchedReports.length).toEqual(7)

    done()
  })
})
