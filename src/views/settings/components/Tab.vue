<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <div v-for="(setting, index) in settingsPerTab" :key="setting.key">
      <el-form v-if="showGroup(setting.key)" :label-position="labelPosition" :label-width="labelWidth" :data-search="setting.key">
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
import { groupFollowsRules } from '../rules'

export default {
  name: 'Tab',
  components: { Setting },
  extends: TabMethods,
  props: {
    tab: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  computed: {
    settingsPerTab() {
      return this.settings.description.filter(setting => setting.tab === this.tab)
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
    showDivider(index, setting) {
      return this.showGroup(setting.key) && this.settingDesc(setting) && index < this.settingsPerTab.length - 1
    },
    showGroup(groupKey) {
      return groupFollowsRules(groupKey, this.$store.state.settings.settings)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
