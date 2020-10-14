import Vuex from 'vuex'
import { mount, createLocalVue, config, RouterLinkStub } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import Invites from '@/views/invites/index'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/invites')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/settings')

describe('Invite tokens', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches initial list of invtie tokens', async (done) => {
    mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      }
    })

    await flushPromises()
    const inviteTokens = store.state.invites.inviteTokens
    expect(inviteTokens.length).toEqual(3)
    done()
  })

  it('opens and closes dialog window', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
    await flushPromises()

    wrapper.setData({ createTokenDialogVisible: false })
    const openDialogButton = wrapper.find('button.create-invite-token')
    const closeDialogButton = wrapper.find('div.el-dialog__footer button.invites-close-dialog')
    expect(wrapper.vm.createTokenDialogVisible).toBe(false)

    openDialogButton.trigger('click')
    await flushPromises()
    expect(wrapper.vm.createTokenDialogVisible).toBe(true)

    closeDialogButton.trigger('click')
    await flushPromises()
    expect(wrapper.vm.createTokenDialogVisible).toBe(false)
    done()
  })

  it('generates new invtie token', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
    await flushPromises()
    expect(store.state.invites.inviteTokens.length).toEqual(3)
    expect(Object.keys(store.state.invites.newToken).length).toEqual(0)

    const openDialogButton = wrapper.find('button.create-invite-token')
    openDialogButton.trigger('click')
    await flushPromises()

    const maxUseInput = wrapper.find('input[name="maxUse"]')
    maxUseInput.element.value = 3
    maxUseInput.trigger('input')

    const expireDate = wrapper.find('input[name="date"]')
    expireDate.element.value = '2019-04-10'
    expireDate.trigger('input')

    const createButton = wrapper.find('.create-new-token-dialog button.el-button--primary')
    createButton.trigger('click')
    await flushPromises()

    expect(store.state.invites.inviteTokens.length).toEqual(4)
    expect(Object.keys(store.state.invites.newToken).length).toEqual(3)
    expect(store.state.invites.newToken.token).toEqual('JYl0SjXW8t-t-pLSZBnZLf6PwjCW-qy6Dq70jfUOuqk=')
    expect(store.state.invites.newToken.expiresAt).toEqual('2019-04-10')
    expect(store.state.invites.newToken.maxUse).toEqual(3)
    done()
  })

  it('revokes invite token', async (done) => {
    const wrapper = mount(Invites, {
      store,
      localVue,
      sync: false,
      stubs: {
        RouterLink: RouterLinkStub
      }
    })

    await flushPromises()
    expect(store.state.invites.inviteTokens[3].used).toBe(false)

    const revokeButton = wrapper.find('table tr button')
    revokeButton.trigger('click')
    await flushPromises()

    expect(store.state.invites.inviteTokens[0].used).toBe(true)
    done()
  })
})
