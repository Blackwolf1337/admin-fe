import Vuex from 'vuex'
import { mount, createLocalVue, config } from '@vue/test-utils'
import Element from 'element-ui'
import MultipleUsersMenu from '@/views/users/components/MultipleUsersMenu'
import storeConfig from './store.conf'
import { cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'
import { users } from '@/api/__mocks__/users.js'

config.mocks["$t"] = () => {}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Element)

jest.mock('@/api/nodeInfo')
jest.mock('@/api/users')

describe('Apply users actions to multiple users', () => {
  let store

  beforeEach(async() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
    store.dispatch('FetchUsers', { page: 1 })
    await flushPromises()
  })

  it('grants admin rights to multiple users', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const grantRightToMultipleUsersStub = jest.fn()
    wrapper.setMethods({ grantRightToMultipleUsers: grantRightToMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(1)`).trigger('click')
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalledWith('admin')

    const grantRight = wrapper.vm.mappers().grantRight
    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[1]
    const user3 = store.state.users.fetchedUsers[2]
    expect(user1.roles.admin).toBe(true)
    expect(user2.roles.admin).toBe(false)
    expect(user3.roles.admin).toBe(false)
    grantRight('admin')()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[1]
    const updatedUser3 = store.state.users.fetchedUsers[2]
    expect(updatedUser1.roles.admin).toBe(true)
    expect(updatedUser2.roles.admin).toBe(false)
    expect(updatedUser3.roles.admin).toBe(true)
    done()
  })

  it('grants moderator rights to multiple users', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const grantRightToMultipleUsersStub = jest.fn()
    wrapper.setMethods({ grantRightToMultipleUsers: grantRightToMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(3)`).trigger('click')
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.grantRightToMultipleUsers).toHaveBeenCalledWith('moderator')

    const grantRight = wrapper.vm.mappers().grantRight
    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[1]
    const user3 = store.state.users.fetchedUsers[2]
    expect(user1.roles.moderator).toBe(false)
    expect(user2.roles.moderator).toBe(false)
    expect(user3.roles.moderator).toBe(false)
    grantRight('moderator')()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[1]
    const updatedUser3 = store.state.users.fetchedUsers[2]
    expect(updatedUser1.roles.moderator).toBe(true)
    expect(updatedUser2.roles.moderator).toBe(false)
    expect(updatedUser3.roles.moderator).toBe(true)
    done()
  })

  it('revokes admin rights from multiple users', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const revokeRightFromMultipleUsersStub = jest.fn()
    wrapper.setMethods({ revokeRightFromMultipleUsers: revokeRightFromMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(2)`).trigger('click')
    expect(wrapper.vm.revokeRightFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.revokeRightFromMultipleUsers).toHaveBeenCalledWith('admin')

    const revokeRight = wrapper.vm.mappers().revokeRight
    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[2]
    expect(user1.roles.admin).toBe(true)
    expect(user2.roles.admin).toBe(false)
    revokeRight('admin')()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[2]
    expect(updatedUser1.roles.admin).toBe(false)
    expect(updatedUser2.roles.admin).toBe(false)
    done()
  })

  it('calls a function that revokes moderator rights from multiple users', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const revokeRightFromMultipleUsersStub = jest.fn()
    wrapper.setMethods({ revokeRightFromMultipleUsers: revokeRightFromMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(4)`).trigger('click')
    expect(wrapper.vm.revokeRightFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.revokeRightFromMultipleUsers).toHaveBeenCalledWith('moderator')
    done()
  })

  it('activates multiple accounts', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const activateMultipleUsersStub = jest.fn()
    wrapper.setMethods({ activateMultipleUsers: activateMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(9)`).trigger('click')
    expect(wrapper.vm.activateMultipleUsers).toHaveBeenCalled()

    const activate = wrapper.vm.mappers().activate
    const user = store.state.users.fetchedUsers[2]
    expect(user.deactivated).toBe(true)
    activate()

    const updatedUser = store.state.users.fetchedUsers[2]
    expect(updatedUser.deactivated).toBe(false)
    done()
  })

  it('deactivates multiple accounts', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const deactivateMultipleUsersStub = jest.fn()
    wrapper.setMethods({ deactivateMultipleUsers: deactivateMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(10)`).trigger('click')
    expect(wrapper.vm.deactivateMultipleUsers).toHaveBeenCalled()

    const deactivate = wrapper.vm.mappers().deactivate
    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[1]
    expect(user1.deactivated).toBe(false)
    expect(user2.deactivated).toBe(false)
    deactivate()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[1]
    expect(updatedUser1.deactivated).toBe(true)
    expect(updatedUser2.deactivated).toBe(true)
    done()
  })

  it('deletes multiple accounts', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const deleteMultipleUsersStub = jest.fn()
    wrapper.setMethods({ deleteMultipleUsers: deleteMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(11)`).trigger('click')
    expect(wrapper.vm.deleteMultipleUsers).toHaveBeenCalled()

    const remove = wrapper.vm.mappers().remove
    expect(store.state.users.fetchedUsers.filter(user => user.deactivated).length).toEqual(1)
    remove()
    await flushPromises()

    expect(store.state.users.fetchedUsers.length).toEqual(4)
    done()
  })

  it('applies tags for multiple accounts', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const addTagForMultipleUsersStub = jest.fn()
    wrapper.setMethods({ addTagForMultipleUsers: addTagForMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(13) button:nth-child(1)`).trigger('click')
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalledWith('mrf_tag:media-force-nsfw')

    wrapper.find(`.el-dropdown-menu__item:nth-child(15) button:nth-child(1)`).trigger('click')
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalledWith('mrf_tag:force-unlisted')

    wrapper.find(`.el-dropdown-menu__item:nth-child(17) button:nth-child(1)`).trigger('click')
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.addTagForMultipleUsers).toHaveBeenCalledWith('mrf_tag:disable-remote-subscription')

    const addTag = wrapper.vm.mappers().addTag
    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[1]
    expect(user1.tags.length).toBe(0)
    expect(user2.tags.length).toBe(1)
    addTag('mrf_tag:media-strip')()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[1]
    expect(updatedUser1.tags.length).toBe(1)
    expect(updatedUser2.tags.length).toBe(2)
    done()
  })

  it('removes tags from multiple accounts', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const removeTagFromMultipleUsersStub = jest.fn()
    wrapper.setMethods({ removeTagFromMultipleUsers: removeTagFromMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(14) button:nth-child(2)`).trigger('click')
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalledWith('mrf_tag:media-strip')

    wrapper.find(`.el-dropdown-menu__item:nth-child(16) button:nth-child(2)`).trigger('click')
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalledWith('mrf_tag:sandbox')

    wrapper.find(`.el-dropdown-menu__item:nth-child(18) button:nth-child(2)`).trigger('click')
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalled()
    expect(wrapper.vm.removeTagFromMultipleUsers).toHaveBeenCalledWith('mrf_tag:disable-any-subscription')

    const removeTag = wrapper.vm.mappers().removeTag
    const user1 = store.state.users.fetchedUsers[1]
    const user2 = store.state.users.fetchedUsers[2]
    expect(user1.tags.length).toBe(1)
    expect(user2.tags.length).toBe(1)
    removeTag('mrf_tag:media-strip')()

    const updatedUser1 = store.state.users.fetchedUsers[1]
    const updatedUser2 = store.state.users.fetchedUsers[2]
    expect(updatedUser1.tags.length).toBe(1)
    expect(updatedUser2.tags.length).toBe(0)
    done()
  })

  it('approves multiple accounts', async (done) => {
    const wrapper = mount(MultipleUsersMenu, {
      store,
      localVue,
      sync: false,
      propsData: {
        selectedUsers: users
      }
    })
    await flushPromises()

    const approveAccountsForMultipleUsersStub = jest.fn()
    wrapper.setMethods({ approveAccountsForMultipleUsers: approveAccountsForMultipleUsersStub })

    wrapper.find(`.el-dropdown-menu__item:nth-child(5)`).trigger('click')
    expect(wrapper.vm.approveAccountsForMultipleUsers).toHaveBeenCalled()

    const approveAccounts = wrapper.vm.mappers().approveAccounts
    const user1 = store.state.users.fetchedUsers[0]
    const user2 = store.state.users.fetchedUsers[3]
    expect(user1.approval_pending).toBe(false)
    expect(user2.approval_pending).toBe(true)
    approveAccounts()

    const updatedUser1 = store.state.users.fetchedUsers[0]
    const updatedUser2 = store.state.users.fetchedUsers[3]
    expect(updatedUser1.approval_pending).toBe(false)
    expect(updatedUser2.approval_pending).toBe(false)
    done()
  })
})
