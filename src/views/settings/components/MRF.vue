<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <div v-for="setting in mrfSettings" :key="setting.key">
      <el-form v-if="showMrfPolicy(setting.key)" :model="getSettingData(setting)" :label-position="labelPosition" :label-width="labelWidth">
        <setting :setting-group="setting" :data="getSettingData(setting)"/>
        <el-divider v-if="setting" class="divider thick-line"/>
      </el-form>
    </div>
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
  name: 'MRF',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
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
    mrfSettings() {
      return this.settings.description.filter(el => el.tab === 'mrf')
    }
  },
  methods: {
    getSettingData(setting) {
      return _.get(this.settings.settings, [setting.group, setting.key]) || {}
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
    },
    showMrfPolicy(key) {
      const selectedMrfPolicies = _.get(this.settings.settings, [':pleroma', ':mrf', ':policies'])
      const mappedPolicies = this.mrfSettings.reduce((acc, { key, related_policy }) => {
        if (key !== ':mrf') {
          acc[key] = related_policy
        }
        return acc
      }, {})
      return !Object.keys(mappedPolicies).includes(key) || selectedMrfPolicies.includes(mappedPolicies[key])
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../styles/main';
@include settings
</style>
