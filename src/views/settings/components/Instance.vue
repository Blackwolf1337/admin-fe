<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <editor-input />
    <el-form :model="instanceData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="instance" :data="instanceData"/>
    </el-form>
    <el-divider v-if="instance" class="divider thick-line"/>
    <el-form :model="restrictUnauthenticatedData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="restrictUnauthenticated" :data="restrictUnauthenticatedData"/>
    </el-form>
    <el-divider v-if="restrictUnauthenticated" class="divider thick-line"/>
    <el-form :model="adminTokenData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="adminToken" :data="adminTokenData"/>
    </el-form>
    <el-divider v-if="adminToken" class="divider thick-line"/>
    <el-form :model="welcomeData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="welcome" :data="welcomeData"/>
    </el-form>
    <el-divider v-if="welcome" class="divider thick-line"/>
    <el-form :model="scheduledActivityData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="scheduledActivity" :data="scheduledActivityData"/>
    </el-form>
    <el-divider v-if="scheduledActivity" class="divider thick-line"/>
    <el-form :model="manifestData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="manifest" :data="manifestData"/>
    </el-form>
    <el-divider v-if="manifest" class="divider thick-line"/>
    <el-form :model="pleromaUserData" :label-position="labelPosition" :label-width="labelWidth" data-search="Pleroma.User">
      <setting :setting-group="pleromaUser" :data="pleromaUserData"/>
    </el-form>
    <el-divider v-if="pleromaUser" class="divider thick-line"/>
    <el-form :model="faviconsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="favicons" :data="faviconsData"/>
    </el-form>
    <el-divider v-if="favicons" class="divider thick-line"/>
    <el-form :model="uriSchemesData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="uriSchemes" :data="uriSchemesData"/>
    </el-form>
    <el-divider v-if="uriSchemes" class="divider thick-line"/>
    <el-form :model="feedData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="feed" :data="feedData"/>
    </el-form>
    <el-divider v-if="feed" class="divider thick-line"/>
    <el-form :model="streamerData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="streamer" :data="streamerData"/>
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
import { EditorInput } from './inputComponents'
import _ from 'lodash'

export default {
  name: 'Instance',
  components: {
    EditorInput,
    Setting
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    adminToken() {
      return this.settings.description.find(setting => setting.children && setting.children[0].key === ':admin_token')
    },
    adminTokenData() {
      return _.get(this.settings.settings, [':pleroma', ':admin_token']) || {}
    },
    favicons() {
      return this.settings.description.find(setting => setting.key === ':instances_favicons')
    },
    faviconsData() {
      return _.get(this.settings.settings, [':pleroma', ':instances_favicons']) || {}
    },
    feed() {
      return this.settings.description.find(setting => setting.key === ':feed')
    },
    feedData() {
      return _.get(this.settings.settings, [':pleroma', ':feed']) || {}
    },
    instance() {
      return this.settings.description.find(setting => setting.key === ':instance')
    },
    instanceData() {
      return _.get(this.settings.settings, [':pleroma', ':instance']) || {}
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
      return this.settings.loading
    },
    manifest() {
      return this.settings.description.find(setting => setting.key === ':manifest')
    },
    manifestData() {
      return _.get(this.settings.settings, [':pleroma', ':manifest']) || {}
    },
    pleromaUser() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.User')
    },
    pleromaUserData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.User']) || {}
    },
    restrictUnauthenticated() {
      return this.settings.description.find(setting => setting.key === ':restrict_unauthenticated')
    },
    restrictUnauthenticatedData() {
      return _.get(this.settings.settings, [':pleroma', ':restrict_unauthenticated']) || {}
    },
    scheduledActivity() {
      return this.$store.state.settings.description.find(setting => setting.key === 'Pleroma.ScheduledActivity')
    },
    scheduledActivityData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.ScheduledActivity']) || {}
    },
    streamer() {
      return this.$store.state.settings.description.find(setting => setting.key === ':streamer')
    },
    streamerData() {
      return _.get(this.settings.settings, [':pleroma', ':streamer']) || {}
    },
    uriSchemes() {
      return this.settings.description.find(setting => setting.key === ':uri_schemes')
    },
    uriSchemesData() {
      return _.get(this.settings.settings, [':pleroma', ':uri_schemes']) || {}
    },
    welcome() {
      return this.settings.description.find(setting => setting.key === ':welcome')
    },
    welcomeData() {
      return _.get(this.settings.settings, [':pleroma', ':welcome']) || {}
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
