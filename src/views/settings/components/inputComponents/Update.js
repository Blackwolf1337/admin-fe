import { processNested } from '@/store/modules/normalizers'

export default {
  props: {
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    nested: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    setting: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingParent: {
      type: Array,
      default: function() {
        return []
      },
      required: false
    }
  },
  computed: {
    inputValue() {
      if ([':esshd', ':cors_plug', ':quack', ':tesla', ':swoosh'].includes(this.settingGroup.group) &&
        this.data[this.setting.key]) {
        return this.setting.type === 'atom' && this.data[this.setting.key].value[0] === ':'
          ? this.data[this.setting.key].value.substr(1)
          : this.data[this.setting.key].value
      } else if (this.setting.type === 'atom') {
        return this.data[this.setting.key] && this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key]
      } else if ((this.settingGroup.group === ':logger' && this.setting.key === ':backends') ||
        this.setting.key === 'Pleroma.Web.Auth.Authenticator' ||
        this.setting.key === ':admin_token') {
        return this.data.value
      } else if (this.settingGroup.group === ':mime' && this.settingParent[0].key === ':types') {
        return this.data ? this.data[this.setting.key] : []
      } else if (Array.isArray(this.setting.type) &&
          this.setting.type.find(el => Array.isArray(el) && el.includes('list'))) {
        return typeof this.data[this.setting.key] === 'string' ? [this.data[this.setting.key]] : this.data[this.setting.key]
      } else {
        return this.data[this.setting.key]
      }
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    }
  },
  methods: {
    processNestedData(value, group, parentKey, parents) {
      const { valueForState,
        valueForUpdatedSettings,
        setting } = processNested(value, value, group, parentKey, parents.reverse(), this.settings, this.updatedSettings)

      this.$store.dispatch('UpdateSettings',
        { group, key: parentKey, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
      this.$store.dispatch('UpdateState',
        { group, key: parentKey, input: setting.key, value: valueForState })
    },
    update(value, group, key, parents, input, type, nested) {
      nested
        ? this.processNestedData(value, group, key, parents)
        : this.updateSetting(value, group, key, input, type)
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
