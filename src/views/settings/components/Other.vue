<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
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
import _ from 'lodash'

export default {
  name: 'Other',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
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
      return this.settings.description.find(setting => setting.key === 'Pleroma.Plugs.RemoteIp')
    },
    remoteIpData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Plugs.RemoteIp']) || {}
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
