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
import Setting from './Setting'
import TabMethods from './TabMethods'
import FrontendsTable from './inputComponents/FrontendsTable'

export default {
  name: 'Frontend',
  components: { FrontendsTable, Setting },
  extends: TabMethods,
  computed: {
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
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
