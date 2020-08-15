<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="esshdData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="esshd" :data="esshdData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </div>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Esshd',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    esshd() {
      return this.settings.description.find(setting => setting.group === ':esshd')
    },
    esshdData() {
      return _.get(this.settings.settings, [':esshd']) || {}
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
    }
  },
  methods: {
    toggleEsshd(value) {
      this.$store.dispatch('ToggleEsshd', value)
    },
    updateSetting(value, tab, input) {
      this.$store.dispatch('UpdateSettings', { tab, data: { [input]: value }})
    },
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
