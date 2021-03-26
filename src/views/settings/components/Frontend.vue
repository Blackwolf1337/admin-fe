<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <frontends-table />
    <el-divider class="divider thick-line"/>
    <div v-for="(setting, index) in settingsPerTab" :key="setting.key">
      <el-form :label-position="labelPosition" :label-width="labelWidth" :data-search="setting.key">
        <setting :setting-group="settingDesc(setting)" :data="settingData(setting)"/>
      </el-form>
      <el-divider v-if="showDivider(index, setting)" class="divider thick-line"/>
    </div>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">{{ $t('settings.submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import FrontendsTable from './inputComponents/FrontendsTable'
import _ from 'lodash'

export default {
  name: 'Frontend',
  components: { FrontendsTable, Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
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
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    settingsPerTab() {
      return this.settings.description.filter(setting => setting.tab === 'frontend')
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
    descriptionMap(setting) {
      return [
        { selector: 'group',
          fn: settingDesc => settingDesc.key === setting.key,
          keysToGetData: [setting.group, setting.key] },
        { selector: ['group', 'without_key'],
          fn: settingDesc => settingDesc.group === setting.group,
          keysToGetData: [setting.group] },
        { selector: ['group', 'without_key', 'single_setting'],
          fn: settingDesc => settingDesc.children && settingDesc.children[0].key === setting.children[0].key,
          keysToGetData: [setting.group, setting.children[0].key] }
      ]
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
    settingData(setting) {
      const { keysToGetData } = this.descriptionMap(setting).find(({ selector }) => _.isEqual(selector, setting.type))
      return _.get(this.settings.settings, keysToGetData) || {}
    },
    settingDesc(setting) {
      const { fn } = this.descriptionMap(setting).find(({ selector }) => _.isEqual(selector, setting.type))
      return this.settings.description.find(fn)
    },
    showDivider(index, setting) {
      return this.settingDesc(setting) && index < this.settingsPerTab.length - 1
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
