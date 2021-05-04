import { processNested } from '@/store/modules/normalizers'
import valueMap from './valueMap'

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
    parents: {
      type: Array,
      default: function() {
        return []
      },
      required: false
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
      const { value } = valueMap(
        this.setting.key,
        this.setting.type,
        this.settingParent[0],
        this.settingGroup.type,
        this.data[this.setting.key],
        this.data
      ).find(({ condition }) => condition)
      return value()
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
