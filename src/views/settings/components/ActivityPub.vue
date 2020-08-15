<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="activitypubData" :label-position="labelPosition" :label-width="labelWidth" data-search=":activitypub">
      <setting :setting-group="activitypub" :data="activitypubData"/>
    </el-form>
    <el-divider v-if="user" class="divider thick-line"/>
    <el-form :model="userData" :label-position="labelPosition" :label-width="labelWidth" data-search=":user">
      <setting :setting-group="user" :data="userData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'ActivityPub',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    activitypub() {
      return this.settings.description.find(setting => setting.key === ':activitypub')
    },
    activitypubData() {
      return _.get(this.settings.settings, [':pleroma', ':activitypub']) || {}
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
    user() {
      return this.settings.description.find(setting => setting.key === ':user')
    },
    userData() {
      return _.get(this.settings.settings, [':pleroma', ':user']) || {}
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
@import '../styles/main';
@include settings
</style>
