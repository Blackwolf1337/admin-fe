<template>
  <div :class="rebootIsSidebarOpen" class="settings-container">
    <div class="reboot-button-container">
      <reboot-button/>
    </div>
    <div v-if="isDesktop">
      <div :class="isSidebarOpen" class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
        <div class="docs-search-container">
          <el-link
            :underline="false"
            href="https://docs-develop.pleroma.social/backend/administration/CLI_tasks/config/"
            target="_blank">
            <el-button class="settings-docs-button">
              <span>
                <i class="el-icon-document"/>
                {{ $t('settings.seeDocs') }}
              </span>
            </el-button>
          </el-link>
          <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            clearable
            placeholder="Search"
            prefix-icon="el-icon-search"
            class="settings-search-input"
            @select="handleSearchSelect"/>
        </div>
      </div>
      <el-tabs v-model="activeTab" tab-position="left">
        <el-tab-pane
          v-for="(value, componentName) in tabs"
          :label="$t(value.label)"
          :disabled="configDisabled || settingsCantBeChanged(value.settings)"
          :key="componentName"
          :name="componentName"
          lazy>
          <component :is="componentName"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="isMobile || isTablet">
      <div :class="isSidebarOpen" class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
      </div>
      <div class="nav-container">
        <el-select v-model="activeTab" class="settings-menu" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="configDisabled"/>
        </el-select>
        <el-link
          :underline="false"
          href="https://docs-develop.pleroma.social/backend/administration/CLI_tasks/config/"
          target="_blank">
          <el-button class="settings-docs-button">
            <span>
              <i class="el-icon-document"/>
              {{ $t('settings.seeDocs') }}
            </span>
          </el-button>
        </el-link>
      </div>
      <div class="settings-search-input-container"/>
      <activity-pub v-if="activeTab === 'activityPub'"/>
      <authentication v-if="activeTab === 'auth'"/>
      <link-formatter v-if="activeTab === 'linkFormatter'"/>
      <esshd v-if="activeTab === 'esshd'"/>
      <captcha v-if="activeTab === 'captcha'"/>
      <frontend v-if="activeTab === 'frontend'"/>
      <gopher v-if="activeTab === 'gopher'"/>
      <http v-if="activeTab === 'http'"/>
      <instance v-if="activeTab === 'instance'"/>
      <job-queue v-if="activeTab === 'jobQueue'"/>
      <logger v-if="activeTab === 'logger'"/>
      <mailer v-if="activeTab === 'mailer'"/>
      <media-proxy v-if="activeTab === 'mediaProxy'"/>
      <metadata v-if="activeTab === 'metadata'"/>
      <mrf v-if="activeTab === 'mrf'"/>
      <rate-limiters v-if="activeTab === 'rateLimiters'"/>
      <relays v-if="activeTab === 'relays'"/>
      <web-push v-if="activeTab === 'webPush'"/>
      <upload v-if="activeTab === 'upload'"/>
      <other v-if="activeTab === 'other'"/>
    </div>
  </div>
</template>

<script>
import i18n from '@/lang'
import { tabs } from './components/tabs'
import {
  ActivityPub,
  Authentication,
  Captcha,
  Esshd,
  Frontend,
  Gopher,
  Http,
  Instance,
  JobQueue,
  LinkFormatter,
  Logger,
  Mailer,
  MediaProxy,
  Metadata,
  Mrf,
  Other,
  RateLimiters,
  Relays,
  Upload,
  WebPush
} from './components'
import RebootButton from '@/components/RebootButton'

export default {
  components: {
    ActivityPub,
    Authentication,
    Captcha,
    Esshd,
    Frontend,
    Gopher,
    Http,
    Instance,
    JobQueue,
    LinkFormatter,
    Logger,
    Mailer,
    MediaProxy,
    Metadata,
    Mrf,
    Other,
    RateLimiters,
    Relays,
    RebootButton,
    Upload,
    WebPush
  },
  data() {
    return {
      options: [
        { value: 'activityPub', label: i18n.t('settings.activityPub') },
        { value: 'auth', label: i18n.t('settings.auth') },
        { value: 'linkFormatter', label: i18n.t('settings.linkFormatter') },
        { value: 'esshd', label: i18n.t('settings.esshd') },
        { value: 'captcha', label: i18n.t('settings.captcha') },
        { value: 'frontend', label: i18n.t('settings.frontend') },
        { value: 'gopher', label: i18n.t('settings.gopher') },
        { value: 'http', label: i18n.t('settings.http') },
        { value: 'instance', label: i18n.t('settings.instance') },
        { value: 'jobQueue', label: i18n.t('settings.jobQueue') },
        { value: 'logger', label: i18n.t('settings.logger') },
        { value: 'mailer', label: i18n.t('settings.mailer') },
        { value: 'mediaProxy', label: i18n.t('settings.mediaProxy') },
        { value: 'metadata', label: i18n.t('settings.metadata') },
        { value: 'mrf', label: i18n.t('settings.mrf') },
        { value: 'rateLimiters', label: i18n.t('settings.rateLimiters') },
        { value: 'relays', label: i18n.t('settings.relays') },
        { value: 'webPush', label: i18n.t('settings.webPush') },
        { value: 'upload', label: i18n.t('settings.upload') },
        { value: 'other', label: i18n.t('settings.other') }
      ],
      searchQuery: ''
    }
  },
  computed: {
    activeTab: {
      get() {
        return this.$store.state.settings.activeTab
      },
      set(tab) {
        this.$store.dispatch('SetActiveTab', tab)
      }
    },
    configDisabled() {
      return this.$store.state.settings.configDisabled
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'header-sidebar-opened' : 'header-sidebar-closed'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    rebootIsSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'reboot-sidebar-opened' : 'reboot-sidebar-closed'
    },
    searchData() {
      return this.$store.state.settings.searchData
    },
    tabs() {
      return tabs(this.$store.state.settings.description)
    }
  },
  mounted: function() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchSettings')
  },
  methods: {
    async handleSearchSelect(selectedValue) {
      const tab = Object.keys(this.tabs).find(tab => {
        return this.tabs[tab].settings.includes(selectedValue.group === ':pleroma' ? selectedValue.key : selectedValue.group)
      })
      await this.$store.dispatch('SetActiveTab', tab)
      const selectedSetting = document.querySelector(`[data-search="${selectedValue.key}"]`)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    },
    querySearch(queryString, cb) {
      const results = this.searchData.filter(searchObj => searchObj.search.find(el => el.includes(queryString.toLowerCase())))
        .map(searchObj => {
          return { value: `${searchObj.label} in ${searchObj.groupLabel}`, group: searchObj.groupKey, key: searchObj.key }
        })
      cb(results)
    },
    settingsCantBeChanged(settings) {
      const existingSettings = settings.filter(setting => {
        if ([':esshd', ':cors_plug', ':quack', ':logger', ':swoosh', ':mime'].includes(setting)) {
          return this.$store.state.settings.description.findIndex(el => el.group === setting) !== -1
        } else if (setting === 'Pleroma.Web.Auth.Authenticator' || setting === ':admin_token') {
          return this.$store.state.settings.description.findIndex(el => el.children[0].key === setting) !== -1
        } else if (setting === 'relays') {
          return [setting]
        } else {
          return this.$store.state.settings.description.findIndex(el => el.key === setting) !== -1
        }
      })
      return existingSettings.length === 0
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
@import './styles/main';
@include settings
</style>
