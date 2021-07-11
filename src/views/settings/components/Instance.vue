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
import i18n from '@/lang'
import Setting from './Setting'
import TabMethods from './TabMethods'
import { EditorInput } from './inputComponents'

export default {
  name: 'Instance',
  components: {
    EditorInput,
    Setting
  },
  extends: TabMethods,
  data() {
    return {
      editorContent: ''
    }
  },
  computed: {
    instancePanelContent: {
      get() {
        return this.$store.state.settings.instancePanel
      },
      set(content) {
        this.editorContent = content
      }
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
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
