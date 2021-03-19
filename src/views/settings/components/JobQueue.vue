<template>
  <div v-if="!loading" :class="isSidebarOpen" class="form-container">
    <el-form :model="obanQueuesData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="obanQueues" :data="obanQueuesData"/>
    </el-form>
    <el-divider v-if="obanQueues" class="divider thick-line"/>
    <el-form :model="workersData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="workers" :data="workersData"/>
    </el-form>
    <el-divider v-if="workers" class="divider thick-line"/>
    <el-form :model="activityExpirationData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="activityExpiration" :data="activityExpirationData"/>
    </el-form>
    <el-divider v-if="activityExpiration" class="divider thick-line"/>
    <el-form :model="connectionsPoolsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="connectionsPools" :data="connectionsPoolsData"/>
    </el-form>
    <el-divider v-if="connectionsPools" class="divider thick-line"/>
    <el-form :model="poolsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="pools" :data="poolsData"/>
    </el-form>
    <el-divider v-if="pools" class="divider thick-line"/>
    <el-form :model="hackneyPoolsData" :label-position="labelPosition" :label-width="labelWidth">
      <setting :setting-group="hackneyPools" :data="hackneyPoolsData"/>
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
  name: 'JobQueue',
  components: { Setting },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    activityExpiration() {
      return this.settings.description.find(setting => setting.key === 'Pleroma.Workers.PurgeExpiredActivity')
    },
    activityExpirationData() {
      return _.get(this.settings.settings, [':pleroma', 'Pleroma.Workers.PurgeExpiredActivity']) || {}
    },
    connectionsPools() {
      return this.settings.description.find(setting => setting.key === ':connections_pool')
    },
    connectionsPoolsData() {
      return _.get(this.settings.settings, [':pleroma', ':connections_pool']) || {}
    },
    hackneyPools() {
      return this.settings.description.find(setting => setting.key === ':hackney_pools')
    },
    hackneyPoolsData() {
      return _.get(this.settings.settings, [':pleroma', ':hackney_pools']) || {}
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
    obanQueues() {
      return this.settings.description.find(setting => setting.key === 'Oban')
    },
    obanQueuesData() {
      return _.get(this.settings.settings, [':pleroma', 'Oban']) || {}
    },
    pools() {
      return this.settings.description.find(setting => setting.key === ':pools')
    },
    poolsData() {
      return _.get(this.settings.settings, [':pleroma', ':pools']) || {}
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    workers() {
      return this.settings.description.find(setting => setting.key === ':workers')
    },
    workersData() {
      return _.get(this.settings.settings, [':pleroma', ':workers']) || {}
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
