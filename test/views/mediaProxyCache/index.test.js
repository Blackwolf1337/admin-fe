import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import MediaProxyCache from '@/views/mediaProxyCache/index'
import app from '@/store/modules/app'
import mediaProxyCache from '@/store/modules/mediaProxyCache'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import getters from '@/store/getters'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/mediaProxyCache')
jest.mock('@/api/settings')

describe('MediaProxy Cache Invalidation', () => {
  let store
  let actions

  beforeEach(() => {
    actions = { ...mediaProxyCache.actions, PurgeUrls: jest.fn() }
    store = new Vuex.Store({ 
      modules: {
        app,
        mediaProxyCache: { ...mediaProxyCache, actions },
        user,
        settings,
      },
      getters
    })
  })

  it('fetches initial list of urls', async (done) => {
    const wrapper = mount(MediaProxyCache, {
      store,
      localVue,
      sync: false
    })

    await flushPromises()
    expect(wrapper.vm.urlsCount).toEqual(2)
    expect(wrapper.vm.mediaProxyEnabled).toBeTruthy()
    done()
  })

  it('evicts single url', async (done) => {
    const wrapper = mount(MediaProxyCache, {
      store,
      localVue,
      sync: false
    })

    await flushPromises()
    const textarea = wrapper.find('.url-input textarea')
    const button = wrapper.find('.url-input-container button')
    const value = 'http://example.com/media/asdf89.jpg'
    const expectedUrls = ['http://example.com/media/asdf89.jpg']

    textarea.element.value = value
    textarea.trigger('input')
    button.trigger('click')
    await flushPromises()

    expect(actions.PurgeUrls).toHaveBeenCalled()
    expect(wrapper.vm.urls.length).toEqual(0)
    expect(wrapper.vm.splitUrls(value)).toEqual(expectedUrls)
    done()
  })

  it('evicts multiple urls', async (done) => {
    const wrapper = mount(MediaProxyCache, {
      store,
      localVue,
      sync: false
    })

    await flushPromises()
    const textarea = wrapper.find('.url-input textarea')
    const button = wrapper.find('.url-input-container button')
    const value = ' http://example.com/media/asdf89.jpg,http://example.com/media/oi678lk.jpg, http://example.com/media/kdjhf87.jpg  ,  http://example.com/media/98234sd.jpg'
    const expectedUrls = ['http://example.com/media/asdf89.jpg', 'http://example.com/media/oi678lk.jpg', 'http://example.com/media/kdjhf87.jpg', 'http://example.com/media/98234sd.jpg']

    textarea.element.value = value
    textarea.trigger('input')
    button.trigger('click')
    await flushPromises()

    expect(actions.PurgeUrls).toHaveBeenCalled()
    expect(wrapper.vm.urls.length).toEqual(0)
    expect(wrapper.vm.splitUrls(value)).toEqual(expectedUrls)
    done()
  })
})