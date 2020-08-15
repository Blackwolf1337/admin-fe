<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="httpData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="http" :data="httpData"/>
    </el-form>
    <el-divider v-if="http" class="divider thick-line"/>
    <el-form :model="corsPlugData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="corsPlug" :data="corsPlugData"/>
    </el-form>
    <el-divider v-if="corsPlug" class="divider thick-line"/>
    <el-form :model="httpSecurityData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="httpSecurity" :data="httpSecurityData"/>
    </el-form>
    <el-divider v-if="httpSecurity" class="divider thick-line"/>
    <el-form :model="webCacheTtlData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="webCacheTtl" :data="webCacheTtlData"/>
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
  name: 'HTTP',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    corsPlug() {
      return this.settings.description.find(setting => setting.group === ':cors_plug')
    },
    corsPlugData() {
      return _.get(this.settings.settings, [':cors_plug']) || {}
    },
    http() {
      return this.settings.description.find(setting => setting.key === ':http')
    },
    httpData() {
      return _.get(this.settings.settings, [':pleroma', ':http']) || {}
    },
    httpSecurity() {
      return this.settings.description.find(setting => setting.key === ':http_security')
    },
    httpSecurityData() {
      return _.get(this.settings.settings, [':pleroma', ':http_security']) || {}
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
    webCacheTtl() {
      return this.settings.description.find(setting => setting.key === ':web_cache_ttl')
    },
    webCacheTtlData() {
      return _.get(this.settings.settings, [':pleroma', ':web_cache_ttl']) || {}
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
