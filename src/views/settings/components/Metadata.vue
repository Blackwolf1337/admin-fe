<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="metadataData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="metadata" :data="metadataData"/>
    </el-form>
    <el-divider v-if="metadata" class="divider thick-line"/>
    <el-form :model="richMediaData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="richMedia" :data="richMediaData"/>
    </el-form>
    <div class="submit-button-container">
      <el-button class="submit-button" type="primary" @click="onSubmit">{{ $t('settings.submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Metadata',
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
    metadata() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Web.Metadata')
    },
    metadataData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Web.Metadata']) || {}
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    richMedia() {
      return this.settings.description.find(setting => setting.key === ':rich_media')
    },
    richMediaData() {
      return _.get(this.settings.settings, [':pleroma', ':rich_media']) || {}
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
@import '../../styles/settings';
@include settings
</style>
