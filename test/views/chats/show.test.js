import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Element from 'element-ui'
import ChatShow from '@/views/chats/show'
import { storeConfig } from './store.conf'
import { cloneDeep } from 'lodash'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

const $route = {
  params: {
    id: '9y8e7ESoVUiKVMAoCW'
  }
}

jest.mock('@/api/nodeInfo')
jest.mock('@/api/chat')

describe('Chat view', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('fetches chat messages', async (done) => {
    const wrapper = mount(ChatShow, {
      store,
      localVue,
      sync: false,
      stubs: ['router-link'],
      mocks: {
        $route
      }
    })

    await flushPromises()
    expect(wrapper.find('.message-card').isVisible()).toBe(true)
    expect(wrapper.find('.chat-particiants-sender').isVisible()).toBe(true)
    expect(wrapper.find('.chat-particiants-receiver').isVisible()).toBe(true)
    expect(store.state.chat.fetchedChat.receiver.acct).toBe('test10')
    expect(store.state.chat.fetchedChatMessages[0].chat_id).toBe('9y8e7ESoVUiKVMAoCW')
    expect(store.state.chat.max_id).toBe(null)
    done()
  })
})
