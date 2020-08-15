<template>
  <div v-if="!loading" class="status-show-container">
    <header v-if="isDesktop || isTablet" class="user-page-header">
      <div class="avatar-name-container">
        <router-link
          v-if="propertyExists(user, 'id')"
          :to="{ name: 'UsersShow', params: { id: user.id }}"
          class="router-link">
          <div class="avatar-name-header">
            <el-avatar v-if="propertyExists(user, 'avatar')" :src="user.avatar" size="large" />
            <h1 v-if="propertyExists(user, 'nickname')">{{ user.nickname }}</h1>
            <h1 v-else class="invalid">({{ $t('users.invalidNickname') }})</h1>
          </div>
        </router-link>
        <a v-if="propertyExists(user, 'url')" :href="user.url" target="_blank">
          <i :title="$t('userProfile.openAccountInInstance')" class="el-icon-top-right"/>
        </a>
      </div>
      <div class="left-header-container">
        <moderation-dropdown
          :user="user"
          :page="'statusPage'"
          :status-id="status.id"
          @open-reset-token-dialog="openResetPasswordDialog"/>
        <reboot-button/>
      </div>
    </header>
    <div v-if="isMobile" class="status-page-header-container">
      <header class="user-page-header">
        <div class="avatar-name-container">
          <el-avatar v-if="propertyExists(user, 'avatar')" :src="user.avatar" size="large" />
          <h1 v-if="propertyExists(user, 'nickname')">{{ user.nickname }}</h1>
        </div>
        <reboot-button/>
      </header>
      <moderation-dropdown
        :user="user"
        :page="'statusPage'"
        @open-reset-token-dialog="openResetPasswordDialog"/>
    </div>
    <reset-password-dialog
      :reset-password-dialog-open="resetPasswordDialogOpen"
      @close-reset-token-dialog="closeResetPasswordDialog"/>
    <div class="status-container">
      <status :status="status" :account="user" :show-checkbox="false" :godmode="showPrivate"/>
    </div>
    <div class="recent-statuses-container-show">
      <h2 v-if="propertyExists(user, 'nickname')" class="recent-statuses">
        {{ $t('userProfile.recentStatuses') }} by {{ user.nickname }}
      </h2>
      <h2 v-else class="recent-statuses">{{ $t('userProfile.recentStatuses') }}</h2>
      <el-checkbox v-model="showPrivate" class="show-private-statuses" @change="onTogglePrivate">
        {{ $t('statuses.showPrivateStatuses') }}
      </el-checkbox>
      <el-timeline v-if="!statusesLoading" class="statuses">
        <el-timeline-item v-for="status in statuses" :key="status.id">
          <status :status="status" :account="status.account" :show-checkbox="false" :user-id="user.id" :godmode="showPrivate"/>
        </el-timeline-item>
        <p v-if="statuses.length === 0" class="no-statuses">{{ $t('userProfile.noStatuses') }}</p>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import Status from '@/components/Status'
import ModerationDropdown from '../users/components/ModerationDropdown'
import RebootButton from '@/components/RebootButton'
import ResetPasswordDialog from '@/views/users/components/ResetPasswordDialog'

export default {
  name: 'StatusShow',
  components: { ModerationDropdown, RebootButton, ResetPasswordDialog, Status },
  data() {
    return {
      showPrivate: false,
      resetPasswordDialogOpen: false
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    loading() {
      return this.$store.state.status.loading
    },
    status() {
      return this.$store.state.status.fetchedStatus
    },
    statuses() {
      return this.$store.state.userProfile.statuses
    },
    statusesLoading() {
      return this.$store.state.userProfile.statusesLoading
    },
    user() {
      return this.$store.state.status.statusAuthor
    }
  },
  beforeMount: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchStatus', this.$route.params.id)
  },
  methods: {
    closeResetPasswordDialog() {
      this.resetPasswordDialogOpen = false
      this.$store.dispatch('RemovePasswordToken')
    },
    onTogglePrivate() {
      this.$store.dispatch('FetchUserStatuses', { userId: this.user.id, godmode: this.showPrivate })
    },
    openResetPasswordDialog() {
      this.resetPasswordDialogOpen = true
    },
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.avatar-name-container {
  display: flex;
  align-items: center;
  .el-icon-top-right {
    font-size: 2em;
    line-height: 36px;
    color: #606266;
  }
}
.avatar-name-header {
  display: flex;
  height: 40px;
  align-items: center;
}
.invalid {
  color: gray;
}
.no-statuses {
  margin-left: 28px;
  color: #606266;
}
.password-reset-token {
  margin: 0 0 14px 0;
}
.password-reset-token-dialog {
  width: 50%
}
.reboot-button {
  padding: 10px;
  margin-left: 6px;
}

.recent-statuses-container-show {
  display: flex;
  flex-direction: column;
  .el-timeline-item {
    margin-left: 20px;
  }
  .recent-statuses {
    margin-left: 20px;
  }
  .show-private-statuses {
    margin-left: 20px;
    margin-bottom: 20px;
  }
}
.reset-password-link {
  text-decoration: underline;
}
.router-link {
  text-decoration: none;
}
.status-container {
  margin: 0 15px 0 20px;
}
.statuses {
  padding: 0 20px 0 0;
}
.user-page-header {
  display: flex;
  justify-content: space-between;
  margin: 22px 15px 22px 20px;
  padding: 0;
  align-items: center;
  h1 {
    display: inline;
    margin: 0 0 0 10px;
  }
}

@media only screen and (min-width: 1824px) {
  .status-show-container {
    max-width: 1824px;
    margin: auto;
  }
}

@media only screen and (max-width:480px) {
  .avatar-name-container {
    margin-bottom: 10px;
  }
  .el-timeline-item__wrapper {
    padding-left: 18px;
  }
  .left-header-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .password-reset-token-dialog {
    width: 85%
  }
  .recent-statuses {
    margin: 20px 10px 15px 10px;
  }
  .recent-statuses-container-show {
    width: 100%;
    margin: 0 0 0 10px;
    .el-timeline-item {
      margin-left: 0;
    }
    .recent-statuses {
      margin-left: 0;
    }
    .show-private-statuses {
      margin: 0 10px 20px 0;
    }
  }
  .status-card {
    .el-card__body {
      padding: 15px;
    }
  }
  .status-container {
    margin: 0 10px;
  }
  .statuses {
    padding-right: 10px;
    margin-left: 0;
    .el-timeline-item__wrapper {
      margin-right: 10px;
    }
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 5px 10px;
  }
  .status-page-header-container {
    width: 100%;
    .el-dropdown {
      width: stretch;
      margin: 0 10px 15px 10px;
    }
  }
}
@media only screen and (max-width:801px) and (min-width: 481px) {
  .recent-statuses-container-show {
    width: 97%;
    margin: 0 20px;
    .el-timeline-item {
      margin-left: 2px;
    }
    .recent-statuses {
      margin: 20px 10px 15px 0;
    }
    .show-private-statuses {
      margin: 0 10px 20px 0;
    }
  }
  .show-private-statuses {
    margin: 0 10px 20px 0;
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 20px 20px;
  }
}
</style>
