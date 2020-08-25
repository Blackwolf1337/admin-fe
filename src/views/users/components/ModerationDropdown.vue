<template>
  <el-dropdown :hide-on-click="false" size="small" trigger="click" placement="top-start" @click.native.stop>
    <div>
      <el-button v-if="page === 'users'" type="text" class="el-dropdown-link">
        {{ $t('users.moderation') }}
        <i v-if="isDesktop" class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-button v-if="page === 'userPage' || page === 'statusPage'" class="moderate-user-button">
        <span class="moderate-user-button-container">
          <span>
            <i class="el-icon-edit" />
            {{ $t('users.moderateUser') }}
          </span>
          <i class="el-icon-arrow-down el-icon--right"/>
        </span>
      </el-button>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        class="actor-type-dropdown">
        <el-select v-model="actorType" :placeholder="$t('userProfile.actorType')" class="actor-type-select">
          <el-option :label="$t('users.service')" value="Service"/>
          <el-option :label="$t('users.person')" value="Person"/>
        </el-select>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showAdminAction(user)"
        divided
        @click.native="toggleUserRight(user, 'admin')">
        {{ user.roles.admin ? $t('users.revokeAdmin') : $t('users.grantAdmin') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showAdminAction(user)"
        @click.native="toggleUserRight(user, 'moderator')">
        {{ user.roles.moderator ? $t('users.revokeModerator') : $t('users.grantModerator') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(user.id) && page !== 'statusPage'"
        :divided="showAdminAction(user)"
        @click.native="toggleActivation(user)">
        {{ user.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(user.id) && page !== 'statusPage'"
        @click.native="handleDeletion(user)">
        {{ $t('users.deleteAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local && user.approval_pending"
        divided
        @click.native="handleAccountApproval(user)">
        {{ $t('users.approveAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local && user.approval_pending"
        @click.native="handleAccountRejection(user)">
        {{ $t('users.rejectAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local && user.confirmation_pending"
        divided
        @click.native="handleEmailConfirmation(user)">
        {{ $t('users.confirmAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local && user.confirmation_pending"
        @click.native="handleConfirmationResend(user)">
        {{ $t('users.resendConfirmation') }}
      </el-dropdown-item>
      <el-dropdown-item
        :divided="showAdminAction(user)"
        :class="{ 'active-tag': user.tags.includes('mrf_tag:media-force-nsfw') }"
        @click.native="toggleTag(user, 'mrf_tag:media-force-nsfw')">
        {{ $t('users.forceNsfw') }}
        <i v-if="user.tags.includes('mrf_tag:media-force-nsfw')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': user.tags.includes('mrf_tag:media-strip') }"
        @click.native="toggleTag(user, 'mrf_tag:media-strip')">
        {{ $t('users.stripMedia') }}
        <i v-if="user.tags.includes('mrf_tag:media-strip')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': user.tags.includes('mrf_tag:force-unlisted') }"
        @click.native="toggleTag(user, 'mrf_tag:force-unlisted')">
        {{ $t('users.forceUnlisted') }}
        <i v-if="user.tags.includes('mrf_tag:force-unlisted')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': user.tags.includes('mrf_tag:sandbox') }"
        @click.native="toggleTag(user, 'mrf_tag:sandbox')">
        {{ $t('users.sandbox') }}
        <i v-if="user.tags.includes('mrf_tag:sandbox')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        :class="{ 'active-tag': user.tags.includes('mrf_tag:disable-remote-subscription') }"
        @click.native="toggleTag(user, 'mrf_tag:disable-remote-subscription')">
        {{ $t('users.disableRemoteSubscription') }}
        <i v-if="user.tags.includes('mrf_tag:disable-remote-subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        :class="{ 'active-tag': user.tags.includes('mrf_tag:disable-any-subscription') }"
        @click.native="toggleTag(user, 'mrf_tag:disable-any-subscription')">
        {{ $t('users.disableAnySubscription') }}
        <i v-if="user.tags.includes('mrf_tag:disable-any-subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        divided
        @click.native="getPasswordResetToken(user.nickname)">
        {{ $t('users.getPasswordResetToken') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        @click.native="requirePasswordReset(user)">
        {{ $t('users.requirePasswordReset') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="user.local"
        @click.native="disableMfa(user.nickname)">
        {{ $t('users.disableMfa') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'ModerationDropdown',
  props: {
    user: {
      type: Object,
      default: function() {
        return {}
      }
    },
    page: {
      type: String,
      default: 'users'
    },
    statusId: {
      type: String,
      default: ''
    }
  },
  computed: {
    actorType: {
      get() {
        return this.user.actor_type
      },
      set(type) {
        this.$store.dispatch('UpdateActorType', {
          user: this.user,
          type,
          _userId: this.user.id,
          _statusId: this.statusId
        })
      }
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  methods: {
    disableMfa(nickname) {
      this.$store.dispatch('DisableMfa', nickname)
    },
    getPasswordResetToken(nickname) {
      this.$emit('open-reset-token-dialog')
      this.$store.dispatch('GetPasswordResetToken', nickname)
    },
    handleConfirmationResend(user) {
      this.$store.dispatch('ResendConfirmationEmail', [user])
    },
    handleDeletion(user) {
      this.$confirm(
        this.$t('users.deleteUserConfirmation'),
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        this.$store.dispatch('DeleteUsers', { users: [user], _userId: user.id })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    handleAccountApproval(user) {
      this.$store.dispatch('ApproveUsersAccount', { users: [user], _userId: user.id, _statusId: this.statusId })
    },
    handleAccountRejection(user) {
      this.$confirm(
        this.$t('users.rejectAccountConfirmation'),
        {
          confirmButtonText: 'Reject',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        this.$store.dispatch('DeleteUsers', { users: [user], _userId: user.id })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Reject canceled'
        })
      })
    },
    handleEmailConfirmation(user) {
      this.$store.dispatch('ConfirmUsersEmail', { users: [user], _userId: user.id, _statusId: this.statusId })
    },
    requirePasswordReset(user) {
      const mailerEnabled = this.$store.state.user.nodeInfo.metadata.mailerEnabled
      if (!mailerEnabled) {
        this.$alert(this.$t('users.mailerMustBeEnabled'), 'Error', { type: 'error' })
        return
      }
      this.$store.dispatch('RequirePasswordReset', [user])
    },
    showAdminAction({ local, id }) {
      return local && this.showDeactivatedButton(id)
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleActivation(user) {
      user.deactivated
        ? this.$store.dispatch('ActivateUsers', { users: [user], _userId: user.id })
        : this.$store.dispatch('DeactivateUsers', { users: [user], _userId: user.id })
    },
    toggleTag(user, tag) {
      user.tags.includes(tag)
        ? this.$store.dispatch('RemoveTag', { users: [user], tag, _userId: user.id, _statusId: this.statusId })
        : this.$store.dispatch('AddTag', { users: [user], tag, _userId: user.id, _statusId: this.statusId })
    },
    toggleUserRight(user, right) {
      user.roles[right]
        ? this.$store.dispatch('DeleteRight', { users: [user], right, _userId: user.id, _statusId: this.statusId })
        : this.$store.dispatch('AddRight', { users: [user], right, _userId: user.id, _statusId: this.statusId })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .el-dropdown-menu--small  .el-dropdown-menu__item.el-dropdown-menu__item--divided.actor-type-dropdown:before {
    margin: 0 0;
    height: 0;
  }
  .el-dropdown-menu--small .actor-type-dropdown {
    padding: 0;
  }
  .actor-type-select {
    width: 100%;
    input {
      border-color: transparent;
      color: #606266;
    }
    .el-input__inner:hover {
      border-color: transparent;
      background-color: #ecf5ff;
    }
    .el-input.is-focus {
      border-color: transparent;
    }
    .el-input__suffix-inner {
      pointer-events: none;
    }
    .el-select .el-input__inner:focus {
      border-color: transparent;
    }
    .el-input.is-active .el-input__inner, .el-input__inner:focus {
      border-color: transparent;
    }
  }
  .actor-type-select .el-input.is-focus .el-input__inner {
      border-color: transparent;
    }
  .moderate-user-button {
    text-align: left;
    width: 350px;
    padding: 10px;
  }
  .moderate-user-button-container {
    display: flex;
    justify-content: space-between;
  }
  @media only screen and (max-width:480px) {
    .moderate-user-button {
      width: 100%
    }
  }
</style>
