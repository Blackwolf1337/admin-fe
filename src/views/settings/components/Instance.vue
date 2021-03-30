<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <div v-for="(setting, index) in settingsPerTab" :key="setting.key">
      <el-form :label-position="labelPosition" :label-width="labelWidth" :data-search="setting.key">
        <setting :setting-group="settingDesc(setting)" :data="settingData(setting)"/>
      </el-form>
      <el-divider v-if="showDivider(index, setting)" class="divider thick-line"/>
    </div>
    <el-divider class="divider thick-line"/>
    <editor-input v-model="instancePanelContent" :name="'instance-panel'" @input="handleEditorUpdate"/>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">{{ $t('settings.submit') }}</el-button>
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
  data() {
    return {
      editorContent: ''
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    instancePanelContent: {
      get() {
        return this.$store.state.settings.instancePanel
      },
      set(content) {
        this.editorContent = content
      }
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
      return this.settings.description.filter(setting => setting.tab === 'instance')
    }
  },
  async mounted() {
    if (this.searchQuery.length > 0) {
      const selectedSetting = document.querySelector(`[data-search="${this.searchQuery}"]`)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
      this.$store.dispatch('SetSearchQuery', '')
    }

    await this.$store.dispatch('FetchInstanceDocument', 'instance-panel')
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
    handleEditorUpdate(content) {
      this.editorContent = content
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
        await this.$store.dispatch('UpdateInstanceDocs', {
          name: 'instance-panel',
          content: this.editorContent.length > 0 ? this.editorContent : this.instancePanelContent
        })
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
