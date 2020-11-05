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
    <el-dropdown-menu slot="dropdown" class="moderation-dropdown-menu">
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
      <el-dropdown-item
        v-if="tagPolicyEnabled">
        {{ $t('users.tags') }}:
      </el-dropdown-item>
      <el-select
        v-if="tagPolicyEnabled"
        :value="selectedTags"
        multiple
        filterable
        allow-create
        placeholder="Select Tags"
        size="small"
        class="select-tags"
        @change="toggleTag($event, user)">
        <el-option-group :label="$t('users.defaultTags')">
          <el-option
            v-for="option in defaultTags"
            :value="option.tag"
            :key="option.tag"
            :label="option.label"
            :class="{ 'active-tag': user.tags.includes(option.tag) }">
            {{ option.label }}
          </el-option>
        </el-option-group>
        <el-option-group :label="$t('users.customTags')">
          <el-option
            v-for="option in customTags"
            :value="option.tag"
            :key="option.tag"
            :label="option.label"
            :class="{ 'active-tag': user.tags.includes(option.tag) }"
            class="capitalize">
            {{ option.label }}
          </el-option>
        </el-option-group>
      </el-select>
      <el-dropdown-item
        v-if="!tagPolicyEnabled"
        divided
        class="no-hover"
        @click.native="enableTagPolicy">
        {{ $t('users.enableTagPolicy') }}
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
    customTags() {
      return this.$store.state.users.tags
        .filter(tag => !Object.keys(this.mapTags).includes(tag))
        .map(tag => {
          return { tag, label: tag.charAt(0).toUpperCase() + tag.slice(1) }
        })
    },
    defaultTags() {
      const tagsByType = this.user.local ? Object.keys(this.mapTags) : Object.keys(this.mapRemoteTags)
      return tagsByType.filter(tag => this.$store.state.users.tags.includes(tag))
        .map(tag => {
          if (this.user.local) {
            return { tag, label: this.mapTags[tag] }
          } else {
            return { tag, label: this.mapRemoteTags[tag] }
          }
        }, {})
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    mapRemoteTags() {
      return {
        'mrf_tag:media-force-nsfw': 'NSFW',
        'mrf_tag:media-strip': 'Strip Media',
        'mrf_tag:force-unlisted': 'Unlisted',
        'mrf_tag:sandbox': 'Sandbox',
        'mrf_tag:verified': 'Verified'
      }
    },
    mapTags() {
      return {
        'mrf_tag:media-force-nsfw': 'NSFW',
        'mrf_tag:media-strip': 'Strip Media',
        'mrf_tag:force-unlisted': 'Unlisted',
        'mrf_tag:sandbox': 'Sandbox',
        'mrf_tag:verified': 'Verified',
        'mrf_tag:disable-remote-subscription': 'Disable remote subscription',
        'mrf_tag:disable-any-subscription': 'Disable any subscription'
      }
    },
    selectedTags() {
      return this.user.tags
    },
    tagPolicyEnabled() {
      return this.$store.state.users.mrfPolicies.includes('Pleroma.Web.ActivityPub.MRF.TagPolicy')
    }
  },
  methods: {
    disableMfa(nickname) {
      this.$store.dispatch('DisableMfa', nickname)
    },
    enableTagPolicy() {
      this.$confirm(
        this.$t('users.confirmEnablingTagPolicy'),
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('users.enableTagPolicySuccessMessage')
        })
        this.$store.dispatch('EnableTagPolicy')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
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
    toggleTag(tags, user) {
      tags.length > user.tags.length
        ? this.$store.dispatch('AddTag', { users: [user], tag: tags.filter(tag => !user.tags.includes(tag))[0] })
        : this.$store.dispatch('RemoveTag', { users: [user], tag: user.tags.filter(tag => !tags.includes(tag))[0] })
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
  .capitalize {
    text-transform: capitalize;
  }
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
  .custom-tags-titile {
    padding-left: 20px;
    font-size: 12px;
    color: #909399;
    line-height: 30px;
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
  .moderation-dropdown-menu {
    width: 350px;
    .el-dropdown-menu--small .el-dropdown-menu__item.el-dropdown-menu__item--divided {
      margin-top: 0;
    }
  }
  .select-tags {
    padding: 2px 15px 0 15px;
    width: 100%;
  }
  @media only screen and (max-width:480px) {
    .moderate-user-button {
      width: 100%
    }
    .moderation-dropdown-menu {
      width: auto;
    }
  }
</style>
