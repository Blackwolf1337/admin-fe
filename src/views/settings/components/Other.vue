<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <editor-input v-model="termsOfServicesContent" :name="'terms-of-service'" @input="handleEditorUpdate"/>
    <el-divider class="divider thick-line"/>
    <el-form :model="backupData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="backup" :data="backupData"/>
    </el-form>
    <el-divider v-if="backup" class="divider thick-line"/>
    <el-form :model="mimeTypesData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="mimeTypes" :data="mimeTypesData"/>
    </el-form>
    <el-divider v-if="mimeTypes" class="divider thick-line"/>
    <el-form :model="remoteIpData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="remoteIp" :data="remoteIpData"/>
    </el-form>
    <el-divider v-if="remoteIpData" class="divider thick-line"/>
    <el-form :model="modulesData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="modules" :data="modulesData"/>
    </el-form>
    <el-divider v-if="castAndValidate" class="divider thick-line"/>
    <el-form :model="castAndValidateData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="castAndValidate" :data="castAndValidateData"/>
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
  name: 'Other',
  components: { EditorInput, Setting },
  data() {
    return {
      termsOfServices: ''
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    backup() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.User.Backup')
    },
    backupData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.User.Backup']) || {}
    },
    castAndValidate() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.ApiSpec.CastAndValidate')
    },
    castAndValidateData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Web.ApiSpec.CastAndValidate']) || {}
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
    mimeTypes() {
      return this.settings.description.find(setting => setting.group === ':mime')
    },
    mimeTypesData() {
      return _.get(this.settings.settings, [':mime']) || {}
    },
    modules() {
      return this.settings.description.find(setting => setting.key === ':modules')
    },
    modulesData() {
      return _.get(this.settings.settings, [':pleroma', ':modules']) || {}
    },
    remoteIp() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.Plugs.RemoteIp')
    },
    remoteIpData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Web.Plugs.RemoteIp']) || {}
    },
    termsOfServicesContent: {
      get() {
        return this.$store.state.settings.termsOfServices
      },
      set(content) {
        this.termsOfServices = content
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('FetchInstanceDocument', 'terms-of-service')
  },
  methods: {
    handleEditorUpdate(content) {
      this.editorContent = content
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
        await this.$store.dispatch('UpdateInstanceDocs', { name: 'terms-of-service', content: this.editorContent })
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
