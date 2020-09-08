import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import MediaProxyCache from '@/views/mediaProxyCache/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/mediaProxyCache')
jest.mock('@/api/settings')

describe('', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches initial list of urls', async (done) => {
    const wrapper = mount(MediaProxyCache, {
      store,
      localVue,
      sync: false
    })

    await flushPromises()
    console.log(store.state)
    console.log(wrapper.html())
    expect(wrapper.vm.urlsCount).toEqual(2)
    done()
  })
})