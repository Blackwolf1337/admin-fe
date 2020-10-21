import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Report from '@/views/reports/components/Report'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/reports')
jest.mock('@/api/settings')

describe('Report in a timeline', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchReports')
    await flushPromises()
  })

  it('changes report state from open to resolved', async (done) => {
    const reports = store.state.reports.fetchedReports
    const wrapper = mount(Report, {
      store,
      localVue,
      propsData: {
        reports
      }
    })
    expect(reports[0].state).toBe('open')

    const button = wrapper.find(`li.el-timeline-item:nth-child(1) li.el-dropdown-menu__item:nth-child(1)`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[0].state).toBe('resolved')
    done()
  })

  it('changes report state from open to closed', async (done) => {
    const reports = store.state.reports.fetchedReports
    const wrapper = mount(Report, {
      store,
      localVue,
      propsData: {
        reports
      }
    })
    expect(reports[3].state).toBe('open')

    const button = wrapper.find(`li.el-timeline-item:nth-child(4) li.el-dropdown-menu__item:nth-child(2)`)
    button.trigger('click')
    await flushPromises()
    expect(store.state.reports.fetchedReports[3].state).toBe('closed')
    done()
  })

  it('shows statuses', () => {
    const reports = store.state.reports.fetchedReports
    const wrapper = mount(Report, {
      store,
      localVue,
      propsData: {
        reports
      }
    })

    const statuses = wrapper.findAll(`.status-card`)
    expect(statuses.length).toEqual(2)
  })
})
