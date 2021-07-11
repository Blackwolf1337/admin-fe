import { mapGetters } from 'vuex'
import { get, isEqual } from 'lodash'
import i18n from '@/lang'

export default {
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
      const { keysToGetData } = this.descriptionMap(setting).find(({ selector }) => isEqual(selector, setting.type))
      return get(this.settings.settings, keysToGetData) || {}
    },
    settingDesc(setting) {
      const { fn } = this.descriptionMap(setting).find(({ selector }) => isEqual(selector, setting.type))
      return this.settings.description.find(fn)
    },
    showDivider(index, setting) {
      return this.settingDesc(setting) && index < this.settingsPerTab.length - 1
    }
  }
}
