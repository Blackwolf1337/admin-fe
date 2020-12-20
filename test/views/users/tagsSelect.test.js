import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import TagsSelect from '@/views/users/components/TagsSelect'
import { storeConfig } from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'

config.mocks["$t"] = () => {}
config.stubs.transition = false

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/app')
jest.mock('@/api/nodeInfo')
jest.mock('@/api/settings')
jest.mock('@/api/users')

describe('Toggle users tags', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
  })

  it('adds tags', async (done) => {
    const wrapper = mount(TagsSelect, {
      store,
      propsData: {
        page: 'index',
        tags: ['test-tag'],
        user: { active: true, 
          approval_pending: false, 
          deactivated: false, id: '2', 
          nickname: 'allis', 
          local: true, 
          external: false, 
          roles: { admin: true, moderator: false }, 
          tags: [], 
          actor_type: 'Person' }
      },
      localVue
    })
    await flushPromises()

    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[1]
    expect(user1.tags.length).toBe(0)
    expect(user2.tags.length).toBe(1)

    await wrapper.vm.toggleTag(['test-tag'],
      { active: true, 
        approval_pending: false, 
        deactivated: false, id: '2', 
        nickname: 'allis', 
        local: true, 
        external: false, 
        roles: { admin: true, moderator: false }, 
        tags: [], 
        actor_type: 'Person' })

    await wrapper.vm.toggleTag(['test-tag', 'mrf_tag:sandbox'],
      { active: true, 
        approval_pending: false, 
        deactivated: false, 
        id: '10', 
        nickname: 'bob', 
        local: true, 
        external: false, 
        roles: { admin: false, moderator: false }, 
        tags: ['mrf_tag:sandbox'], 
        actor_type: 'Person' })

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[1]
    expect(updatedUser1.tags.length).toBe(1)
    expect(updatedUser2.tags.length).toBe(2)
    done()
  })

  it('deletes tags', async (done) => {
    const wrapper = mount(TagsSelect, {
      store,
      propsData: {
        page: 'index',
        tags: ['test-tag'],
        user: { active: true, 
          approval_pending: false, 
          deactivated: false, id: '2', 
          nickname: 'allis', 
          local: true, 
          external: false, 
          roles: { admin: true, moderator: false }, 
          tags: [], 
          actor_type: 'Person' }
      },
      localVue
    })
    await flushPromises()

    const user = store.state.users.fetchedUsers[1]
    expect(user.tags.length).toBe(1)
    
    await wrapper.vm.toggleTag([],
      { active: true, 
        approval_pending: false, 
        deactivated: false, 
        id: '10', 
        nickname: 'bob', 
        local: true, 
        external: false, 
        roles: { admin: false, moderator: false }, 
        tags: ['mrf_tag:sandbox'], 
        actor_type: 'Person' })

    const updatedUser = store.state.users.fetchedUsers[1]
    expect(updatedUser.tags.length).toBe(0)
    done()
  })
})