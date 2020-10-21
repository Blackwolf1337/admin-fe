import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Login from '@/views/login/index'
import storeConfig from './store.conf'
import routerConfig from './router.conf'
import { cloneDeep } from 'lodash'
import { beforeEachRoute } from '@/permission'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/login')
jest.mock('@/api/settings')

describe('Login', () => {
  let store
  let router

  const usernameInput = 'input[name="username"]'
  const passwordInput = 'input[name="password"]'

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    router = new VueRouter(cloneDeep(routerConfig))
    router.beforeEach(beforeEachRoute)
  })

  it('takes authHost from window.location if it is not provided in username', () => {
    const wrapper = mount(Login, {
      store,
      router,
      localVue
    })

    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        host: 'pleroma'
      }
    });
    const errorLog = store.state.errorLog.logs
    expect(errorLog.length).toBe(0)
    const submitButton = wrapper.find('button')

    wrapper.find(usernameInput).element.value = 'bob'
    wrapper.find(usernameInput).trigger('input')
    wrapper.find(passwordInput).element.value = '1234'
    wrapper.find(passwordInput).trigger('input')
    submitButton.trigger('click')

    const updatedErrorLog = store.state.errorLog.logs
    expect(updatedErrorLog.length).toBe(0)
  })

  it('throws error if password is incorrect', async (done) => {
    const wrapper = mount(Login, {
      store,
      router,
      localVue
    })

    const errorLog = store.state.errorLog.logs
    expect(errorLog.length).toBe(0)
    const submitButton = wrapper.find('button')

    wrapper.find(usernameInput).element.value = 'bob@apple'
    wrapper.find(usernameInput).trigger('input')
    wrapper.find(passwordInput).element.value = '1234'
    wrapper.find(passwordInput).trigger('input')
    submitButton.trigger('click')
    await flushPromises()

    const updatedErrorLog = store.state.errorLog.logs
    expect(updatedErrorLog.length).toBe(1)
    expect(updatedErrorLog[0].message).toEqual(
      'Invalid credentials'
    )
    done()
  })

  it('logs user in', async (done) => {
    const wrapper = mount(Login, {
      store,
      router,
      localVue
    })

    const errorLog = store.state.errorLog.logs
    const submitButton = wrapper.find('button')
    expect(wrapper.vm.$route.path).toBe('/login')

    wrapper.find(usernameInput).element.value = 'bob@pleroma'
    wrapper.find(usernameInput).trigger('input')
    wrapper.find(passwordInput).element.value = '123456'
    wrapper.find(passwordInput).trigger('input')
    submitButton.trigger('click')
    await flushPromises()

    expect(errorLog.length).toBe(0)
    expect(wrapper.vm.$route.path).toBe('/')
    done()
  })
})
