<template>
  <div :data-search="setting.key || setting.group" class="sender-input">
    <el-input
      :value="sender.email"
      placeholder="email address"
      class="email-address-input"
      @input="updateSender($event, 'email')"/>
    <el-input
      :value="sender.nickname"
      placeholder="nickname"
      class="nickname-input"
      @input="updateSender($event, 'nickname')"/>
  </div>
</template>

<script>
import { processNested } from '@/store/modules/normalizers'

export default {
  name: 'SenderInput',
  props: {
    data: {
      type: [Object, Array],
      default: function() {
        return {}
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
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    },
    sender() {
      return Object.keys(this.data).length === 0 ? { email: null, nickname: null } : this.data
    }
  },
  methods: {
    updateSender(value, inputType) {
      let data
      if (inputType === 'email') {
        data = { ...this.sender, email: value }
      } else {
        data = { ...this.sender, nickname: value }
      }
      this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const assembledData = value.nickname
        ? [value.nickname, value.email]
        : value.email

      if (this.parents.length > 0) {
        const { valueForState,
          valueForUpdatedSettings,
          setting } = processNested(value, assembledData, group, key, this.parents.reverse(), this.settings, this.updatedSettings)

        this.$store.dispatch('UpdateSettings',
          { group, key, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
        this.$store.dispatch('UpdateState',
          { group, key, input: setting.key, value: valueForState })
      } else {
        this.$store.dispatch('UpdateSettings', { group, key, input, value: assembledData, type })
        this.$store.dispatch('UpdateState', { group, key, input, value })
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
