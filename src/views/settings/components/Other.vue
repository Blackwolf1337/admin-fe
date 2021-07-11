<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <editor-input v-model="termsOfServicesContent" :name="'terms-of-service'" @input="handleEditorUpdate"/>
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
import i18n from '@/lang'
import Setting from './Setting'
import TabMethods from './TabMethods'
import { EditorInput } from './inputComponents'

export default {
  name: 'Other',
  components: { EditorInput, Setting },
  extends: TabMethods,
  data() {
    return {
      termsOfServices: ''
    }
  },
  computed: {
    settingsPerTab() {
      return this.settings.description.filter(setting => setting.tab === 'other')
    },
    termsOfServicesContent: {
      get() {
        return this.$store.state.settings.termsOfServices
      },
      set(content) {
        this.termsOfServices = content
      }
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

    await this.$store.dispatch('FetchInstanceDocument', 'terms-of-service')
  },
  methods: {
    handleEditorUpdate(content) {
      this.termsOfServices = content
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
        await this.$store.dispatch('UpdateInstanceDocs', {
          name: 'terms-of-service',
          content: this.termsOfServices.length > 0 ? this.termsOfServices : this.termsOfServicesContent
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
