<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="loggerData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="logger" :data="loggerData"/>
    </el-form>
    <el-divider v-if="logger" class="divider thick-line"/>
    <el-form :model="consoleData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="console" :data="consoleData"/>
    </el-form>
    <el-divider v-if="console" class="divider thick-line"/>
    <el-form :model="exsysloggerData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="exsyslogger" :data="exsysloggerData"/>
    </el-form>
    <el-divider v-if="exsyslogger" class="divider thick-line"/>
    <el-form :model="quackData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="quack" :data="quackData"/>
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
  name: 'Logger',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    console() {
      return this.settings.description.find(setting => setting.key === ':console')
    },
    consoleData() {
      return _.get(this.settings.settings, [':logger', ':console']) || {}
    },
    exsyslogger() {
      return this.settings.description.find(setting => setting.key === ':ex_syslogger')
    },
    exsysloggerData() {
      return _.get(this.settings.settings, [':logger', ':ex_syslogger']) || {}
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
    logger() {
      return this.settings.description.find(setting => setting.group === ':logger')
    },
    loggerData() {
      return _.get(this.settings.settings, [':logger', ':backends']) || {}
    },
    quack() {
      return this.settings.description.find(setting => setting.group === ':quack')
    },
    quackData() {
      return _.get(this.settings.settings, [':quack']) || {}
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
