<template>
  <div :class="rebootIsSidebarOpen" class="settings-container">
    <div class="reboot-button-container">
      <reboot-button/>
    </div>
    <div v-if="isDesktop">
      <div :class="isSidebarOpen">
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
      <component :is="chooseTab" :tab="tab"/>
    </div>
    <div v-if="isMobile || isTablet">
      <div :class="isSidebarOpen" class="settings-header-container">
        <h1 class="settings-header">{{ $t('settings.settings') }}</h1>
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
      <div class="settings-search-container">
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
      <component :is="chooseTab" :tab="tab"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Frontend, Emoji, Instance, Other } from './components'
import Tab from './components/Tab'
import RebootButton from '@/components/RebootButton'

export default {
  components: { Frontend, Emoji, Instance, Other, RebootButton, Tab },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters([
      'listOfTabs',
      'settings',
      'listOfTabs',
      'description'

    ]),
    chooseTab() {
      return this.mapTab[this.tab] || Tab
    },
    configDisabled() {
      return this.settings.configDisabled
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
    mapTab() {
      return {
        'emoji': Emoji,
        'frontend': Frontend,
        'instance': Instance,
        'other': Other
      }
    },
    rebootIsSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'reboot-sidebar-opened' : 'reboot-sidebar-closed'
    },
    searchData() {
      return this.settings.searchData
    },
    tab() {
      const { tab } = this.listOfTabs.length > 0 &&
        this.listOfTabs.find(tab => tab.path === this.$route.path.split('/settings/').pop())
      return tab
    },
    tabs() {
      return this.listOfTabs.map(tabObject => {
        return {
          ...tabObject,
          settings: this.description.reduce((acc, { tab, key, group, type, children }) => {
            if (tabObject.tab === tab) {
              return type.includes('single_setting')
                ? [...acc, children[0].key]
                : [...acc, key || group]
            } return acc
          }, []) }
      }).map(tabObject => {
        if (tabObject.tab === 'other') {
          return { ...tabObject, settings: [...tabObject.settings, ':terms_of_services'] }
        } else if (tabObject.tab === 'instance') {
          return { ...tabObject, settings: [...tabObject.settings, ':instance_panel'] }
        } return tabObject
      })
    }
  },
  mounted: function() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchSettings')
  },
  methods: {
    handleSearchSelect(selectedValue) {
      this.$store.dispatch('SetSearchQuery', selectedValue.key)
      const tab = this.tabs.find(tabObject => {
        return tabObject.settings.includes(selectedValue.group === ':pleroma' ? selectedValue.key : selectedValue.group)
      })

      if (!tab) return
      const path = tab.path
      if (this.$router.currentRoute.path === `/settings/${path}`) {
        this.scrollTo(selectedValue.key)
      } else if (path) {
        this.$router.push({ path: `/settings/${path}` })
      }
    },
    scrollTo(searchQuery) {
      const selectedSetting = document.querySelector(`[data-search="${searchQuery}"]`)
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
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
@import '../styles/settings';
@include settings
</style>
