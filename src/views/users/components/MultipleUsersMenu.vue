<template>
  <el-dropdown size="small" trigger="click" placement="bottom-start">
    <el-button v-if="isDesktop" class="actions-button">
      <span class="actions-button-container">
        <span>
          <i class="el-icon-edit" />
          {{ $t('users.moderateUsers') }}
        </span>
        <i class="el-icon-arrow-down el-icon--right"/>
      </span>
    </el-button>
    <el-dropdown-menu v-if="showDropdownForMultipleUsers" slot="dropdown">
      <el-dropdown-item
        @click.native="grantRightToMultipleUsers('admin')">
        {{ $t('users.grantAdmin') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="revokeRightFromMultipleUsers('admin')">
        {{ $t('users.revokeAdmin') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="grantRightToMultipleUsers('moderator')">
        {{ $t('users.grantModerator') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="revokeRightFromMultipleUsers('moderator')">
        {{ $t('users.revokeModerator') }}
      </el-dropdown-item>
      <el-dropdown-item
        divided
        @click.native="approveAccountsForMultipleUsers">
        {{ $t('users.approveAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="rejectAccountsForMultipleUsers">
        {{ $t('users.rejectAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        divided
        @click.native="confirmAccountsForMultipleUsers">
        {{ $t('users.confirmAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="resendConfirmationForMultipleUsers">
        {{ $t('users.resendConfirmation') }}
      </el-dropdown-item>
      <el-dropdown-item
        divided
        @click.native="activateMultipleUsers">
        {{ $t('users.activateAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="deactivateMultipleUsers">
        {{ $t('users.deactivateAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="deleteMultipleUsers">
        {{ $t('users.deleteAccounts') }}
      </el-dropdown-item>
      <el-dropdown-item
        @click.native="requirePasswordReset">
        {{ $t('users.requirePasswordReset') }}
      </el-dropdown-item>
      <el-dropdown-item v-if="tagPolicyEnabled" divided class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.forceNsfw') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('mrf_tag:media-force-nsfw')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('mrf_tag:media-force-nsfw')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item v-if="tagPolicyEnabled" class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.stripMedia') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('mrf_tag:media-strip')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('mrf_tag:media-strip')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item v-if="tagPolicyEnabled" class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.forceUnlisted') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('mrf_tag:force-unlisted')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('mrf_tag:force-unlisted')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item v-if="tagPolicyEnabled" class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.sandbox') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('mrf_tag:sandbox')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('mrf_tag:sandbox')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item v-if="tagPolicyEnabled" class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.disableRemoteSubscriptionForMultiple') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('mrf_tag:disable-remote-subscription')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('mrf_tag:disable-remote-subscription')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item v-if="tagPolicyEnabled" class="no-hover">
        <div class="tag-container">
          <span class="tag-text">{{ $t('users.disableAnySubscriptionForMultiple') }}</span>
          <el-button-group class="tag-button-group">
            <el-button size="mini" @click.native="addTagForMultipleUsers('mrf_tag:disable-any-subscription')">
              {{ $t('users.apply') }}
            </el-button>
            <el-button size="mini" @click.native="removeTagFromMultipleUsers('mrf_tag:disable-any-subscription')">
              {{ $t('users.remove') }}
            </el-button>
          </el-button-group>
        </div>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="tagPolicyDisabled"
        divided
        @click.native="enableTagPolicy">
        {{ $t('users.enableTagPolicy') }}
      </el-dropdown-item>
    </el-dropdown-menu>
    <el-dropdown-menu v-else slot="dropdown">
      <el-dropdown-item>
        {{ $t('users.selectUsers') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    selectedUsers: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    showDropdownForMultipleUsers() {
      return this.$props.selectedUsers.length > 0
    },
    tagPolicyEnabled() {
      return this.$store.state.users.tagPolicies.includes('Pleroma.Web.ActivityPub.MRF.TagPolicy')
    }
  },
  methods: {
    mappers() {
      const applyAction = async(users, dispatchAction) => {
        await dispatchAction(users)
        this.$emit('apply-action')
      }
      return {
        grantRight: (right) => () => {
          const filterUsersFn = user => this.isLocalUser(user) && !user.roles[right] && this.$store.state.user.id !== user.id
          const addRightFn = async(users) => await this.$store.dispatch('AddRight', { users, right })
          const filtered = this.selectedUsers.filter(filterUsersFn)

          applyAction(filtered, addRightFn)
        },
        revokeRight: (right) => () => {
          const filterUsersFn = user => this.isLocalUser(user) && user.roles[right] && this.$store.state.user.id !== user.id
          const deleteRightFn = async(users) => await this.$store.dispatch('DeleteRight', { users, right })
          const filtered = this.selectedUsers.filter(filterUsersFn)

          applyAction(filtered, deleteRightFn)
        },
        activate: () => {
          const filtered = this.selectedUsers.filter(user => user.nickname && user.deactivated && this.$store.state.user.id !== user.id)
          const activateUsersFn = async(users) => await this.$store.dispatch('ActivateUsers', { users })

          applyAction(filtered, activateUsersFn)
        },
        deactivate: () => {
          const filtered = this.selectedUsers.filter(user => user.nickname && !user.deactivated && this.$store.state.user.id !== user.id)
          const deactivateUsersFn = async(users) => await this.$store.dispatch('DeactivateUsers', { users })

          applyAction(filtered, deactivateUsersFn)
        },
        remove: () => {
          const filtered = this.selectedUsers.filter(user => user.nickname && this.$store.state.user.id !== user.id)
          const deleteAccountFn = async(users) => await this.$store.dispatch('DeleteUsers', { users })

          applyAction(filtered, deleteAccountFn)
        },
        addTag: (tag) => () => {
          const filtered = this.selectedUsers.filter(user =>
            tag === 'mrf_tag:disable-remote-subscription' || tag === 'mrf_tag:disable-any-subscription'
              ? this.isLocalUser(user) && !user.tags.includes(tag)
              : user.nickname && !user.tags.includes(tag))
          const addTagFn = async(users) => await this.$store.dispatch('AddTag', { users, tag })
          applyAction(filtered, addTagFn)
        },
        removeTag: (tag) => async() => {
          const filtered = this.selectedUsers.filter(user =>
            tag === 'mrf_tag:disable-remote-subscription' || tag === 'mrf_tag:disable-any-subscription'
              ? this.isLocalUser(user) && user.tags.includes(tag)
              : user.nickname && user.tags.includes(tag))
          const removeTagFn = async(users) => await this.$store.dispatch('RemoveTag', { users, tag })

          applyAction(filtered, removeTagFn)
        },
        requirePasswordReset: () => {
          const filtered = this.selectedUsers.filter(user => this.isLocalUser(user))
          const requirePasswordResetFn = async(users) => await this.$store.dispatch('RequirePasswordReset', users)

          applyAction(filtered, requirePasswordResetFn)
        },
        approveAccounts: () => {
          const filtered = this.selectedUsers.filter(user => this.isLocalUser(user) && user.approval_pending)
          const approveAccountFn = async(users) => await this.$store.dispatch('ApproveUsersAccount', { users })

          applyAction(filtered, approveAccountFn)
        },
        confirmAccounts: () => {
          const filtered = this.selectedUsers.filter(user => this.isLocalUser(user) && user.confirmation_pending)
          const confirmAccountFn = async(users) => await this.$store.dispatch('ConfirmUsersEmail', { users })

          applyAction(filtered, confirmAccountFn)
        },
        resendConfirmation: () => {
          const filtered = this.selectedUsers.filter(user => this.isLocalUser(user) && user.confirmation_pending)
          const resendConfirmationFn = async(users) => await this.$store.dispatch('ResendConfirmationEmail', users)

          applyAction(filtered, resendConfirmationFn)
        }
      }
    },
    enableTagPolicy() {
      this.$store.dispatch('EnableTagPolicy')
    },
    isLocalUser(user) {
      return user.nickname && user.local
    },
    grantRightToMultipleUsers(right) {
      const { grantRight } = this.mappers()
      this.confirmMessage(
        this.$t('users.grantRightConfirmation', { right }),
        grantRight(right)
      )
    },
    revokeRightFromMultipleUsers(right) {
      const { revokeRight } = this.mappers()
      this.confirmMessage(
        this.$t('users.revokeRightConfirmation', { right }),
        revokeRight(right)
      )
    },
    activateMultipleUsers() {
      const { activate } = this.mappers()
      this.confirmMessage(
        this.$t('users.activateMultipleUsersConfirmation'),
        activate
      )
    },
    deactivateMultipleUsers() {
      const { deactivate } = this.mappers()
      this.confirmMessage(
        this.$t('users.deactivateMultipleUsersConfirmation'),
        deactivate
      )
    },
    deleteMultipleUsers() {
      const { remove } = this.mappers()
      this.confirmMessage(
        this.$t('users.deleteMultipleUsersConfirmation'),
        remove
      )
    },
    requirePasswordReset() {
      const mailerEnabled = this.$store.state.user.nodeInfo.metadata.mailerEnabled

      if (!mailerEnabled) {
        this.$alert(this.$t('users.mailerMustBeEnabled'), 'Error', { type: 'error' })

        return
      }

      const { requirePasswordReset } = this.mappers()
      this.confirmMessage(
        this.$t('users.requirePasswordResetConfirmation'),
        requirePasswordReset
      )
    },
    addTagForMultipleUsers(tag) {
      const { addTag } = this.mappers()
      this.confirmMessage(
        this.$t('users.addTagForMultipleUsersConfirmation'),
        addTag(tag)
      )
    },
    removeTagFromMultipleUsers(tag) {
      const { removeTag } = this.mappers()
      this.confirmMessage(
        this.$t('users.removeTagFromMultipleUsersConfirmation'),
        removeTag(tag)
      )
    },
    approveAccountsForMultipleUsers() {
      const { approveAccounts } = this.mappers()
      this.confirmMessage(
        this.$t('users.approveAccountsConfirmation'),
        approveAccounts
      )
    },
    rejectAccountsForMultipleUsers() {
      const { remove } = this.mappers()
      this.confirmMessage(
        this.$t('users.rejectAccountsConfirmation'),
        remove
      )
    },
    confirmAccountsForMultipleUsers() {
      const { confirmAccounts } = this.mappers()
      this.confirmMessage(
        this.$t('users.confirmAccountsConfirmation'),
        confirmAccounts
      )
    },
    resendConfirmationForMultipleUsers() {
      const { resendConfirmation } = this.mappers()
      this.confirmMessage(
        this.$t('users.resendEmailConfirmation'),
        resendConfirmation
      )
    },
    confirmMessage(message, applyAction) {
      this.$confirm(message, {
        confirmButtonText: this.$t('users.ok'),
        cancelButtonText: this.$t('users.cancel'),
        type: 'warning'
      }).then(() => {
        applyAction()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('users.canceled')
        })
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .actions-button {
    text-align: left;
    width: 350px;
    padding: 10px;
  }
  .actions-button-container {
    display: flex;
    justify-content: space-between;
  }
  .el-dropdown {
    float: right;
  }
  .el-icon-edit {
    margin-right: 5px;
  }
  .tag-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tag-text {
    padding-right: 20px;
  }
  .no-hover:hover {
    color: #606266;
    background-color: white;
    cursor: auto;
  }
</style>
