<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="mailerData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="mailer" :data="mailerData"/>
    </el-form>
    <el-divider v-if="mailer" class="divider thick-line"/>
    <el-form :model="swooshData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="swoosh" :data="swooshData"/>
    </el-form>
    <el-divider v-if="swoosh" class="divider thick-line"/>
    <el-form :model="emailNotificationsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="emailNotifications" :data="emailNotificationsData"/>
    </el-form>
    <el-divider v-if="emailNotifications" class="divider thick-line"/>
    <el-form :model="userEmailData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="userEmail" :data="userEmailData"/>
    </el-form>
    <el-divider v-if="userEmail" class="divider thick-line"/>
    <el-form :model="newUsersDigestEmailData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="newUsersDigestEmail" :data="newUsersDigestEmailData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">{{ $t('settings.submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Mailer',
  components: {
    Setting
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    emailNotifications() {
      return this.settings.description.find(setting => setting.key === ':email_notifications')
    },
    emailNotificationsData() {
      return _.get(this.settings.settings, [':pleroma', ':email_notifications']) || {}
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'sidebar-opened' : 'sidebar-closed'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'right'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    loading() {
      return this.$store.state.settings.loading
    },
    mailer() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.Mailer')
    },
    mailerData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Emails.Mailer']) || {}
    },
    newUsersDigestEmail() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.NewUsersDigestEmail')
    },
    newUsersDigestEmailData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Emails.NewUsersDigestEmail']) || {}
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    swoosh() {
      return this.settings.description.find(setting => setting.group === ':swoosh')
    },
    swooshData() {
      return _.get(this.settings.settings, [':swoosh']) || {}
    },
    userEmail() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Emails.UserEmail')
    },
    userEmailData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Emails.UserEmail']) || {}
    }
  },
  mounted() {
    if (this.searchQuery.length > 0) {
      const selectedSetting = document.querySelector(`[data-search="${this.searchQuery}"]`)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
      this.$store.dispatch('SetSearchQuery', '')
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
