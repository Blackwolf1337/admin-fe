import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import Status from '@/components/Status'
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
jest.mock('@/api/status')

describe('Status in reports', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchReports', 1)
    await flushPromises()
  })

  it('adds sensitive flag to a status', async (done) => {
    const status = store.state.reports.fetchedReports[4].statuses[0]
    const wrapper = mount(Status, {
      store,
      localVue,
      propsData: {
        status,
        page: 1,
        userId: '7',
        godmode: false,
        showCheckbox: false
      }
    })
    await flushPromises()

    const changeStatusStub = jest.fn()
    wrapper.setMethods({ changeStatus: changeStatusStub })

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(1)`)
    button.trigger('click')

    expect(wrapper.vm.changeStatus).toHaveBeenCalled()
    expect(wrapper.vm.changeStatus).toHaveBeenCalledWith('11', true, 'public')
    done()
  })

  it('removes sensitive flag to a status', async (done) => {
    const status = store.state.reports.fetchedReports[4].statuses[1]
    const wrapper = mount(Status, {
      store,
      localVue,
      propsData: {
        status,
        page: 1,
        userId: '7',
        godmode: false,
        showCheckbox: false
      }
    })
    await flushPromises()

    const changeStatusStub = jest.fn()
    wrapper.setMethods({ changeStatus: changeStatusStub })

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(1)`)
    button.trigger('click')

    expect(wrapper.vm.changeStatus).toHaveBeenCalled()
    expect(wrapper.vm.changeStatus).toHaveBeenCalledWith('10', false, 'unlisted')
    done()
  })

  it('changes status visibility from public to unlisted', async (done) => {
    const status = store.state.reports.fetchedReports[4].statuses[0]
    const wrapper = mount(Status, {
      store,
      localVue,
      propsData: {
        status,
        page: 1,
        userId: '7',
        godmode: false,
        showCheckbox: false
      }
    })
    await flushPromises()

    const changeStatusStub = jest.fn()
    wrapper.setMethods({ changeStatus: changeStatusStub })

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(3)`)
    button.trigger('click')

    expect(wrapper.vm.changeStatus).toHaveBeenCalled()
    expect(wrapper.vm.changeStatus).toHaveBeenCalledWith('11', false, 'unlisted')
    done()
  })

  it('changes status visibility from unlisted to private', async (done) => {
    const status = store.state.reports.fetchedReports[4].statuses[1]
    const wrapper = mount(Status, {
      store,
      localVue,
      propsData: {
        status,
        page: 1,
        userId: '7',
        godmode: false,
        showCheckbox: false
      }
    })
    await flushPromises()

    const changeStatusStub = jest.fn()
    wrapper.setMethods({ changeStatus: changeStatusStub })

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(3)`)
    button.trigger('click')

    expect(wrapper.vm.changeStatus).toHaveBeenCalled()
    expect(wrapper.vm.changeStatus).toHaveBeenCalledWith('10', true, 'private')
    done()
  })

  it('deletes a status', async (done) => {
    const status = store.state.reports.fetchedReports[4].statuses[1]
    const wrapper = mount(Status, {
      store,
      localVue,
      propsData: {
        status,
        page: 1,
        userId: '7',
        godmode: false,
        showCheckbox: false
      }
    })
    await flushPromises()

    const deleteStatusStub = jest.fn()
    wrapper.setMethods({ deleteStatus: deleteStatusStub })

    const button = wrapper.find(`li.el-dropdown-menu__item:nth-child(4)`)
    button.trigger('click')

    expect(wrapper.vm.deleteStatus).toHaveBeenCalled()
    expect(wrapper.vm.deleteStatus).toHaveBeenCalledWith('10')
    done()
  })
})
