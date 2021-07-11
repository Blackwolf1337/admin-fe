<template>
  <el-switch
    :value="data[setting.key]"
    :data-search="setting.key"
    class="switch-input"
    @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)"/>
</template>

<script>
export default {
  name: 'BooleanWithConfirmation',
  props: {
    data: {
      type: [Object, Array],
      default: function() {
        return {}
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
    }
  },
  methods: {
    updateSetting(value, group, key, input, type) {
      const registrationsOpen = this.$store.state.settings.settings[group][key][':registrations_open']
      const invitesEnabled = this.$store.state.settings.settings[group][key][':invites_enabled']
      if (input === ':registrations_open' && value && invitesEnabled) {
        this.$confirm(
          'Enabling this setting requires invites to be disabled. Are you sure you want to open registrations?',
          'Warning',
          { confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
          this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
          this.$store.dispatch('UpdateSettings', { group, key, input: ':invites_enabled', value: false, type })
          this.$store.dispatch('UpdateState', { group, key, input, value })
          this.$store.dispatch('UpdateState', { group, key, input: ':invites_enabled', value: false })
        })
      } else if (input === ':invites_enabled' && value && registrationsOpen) {
        this.$confirm(
          'Enabling this setting requires registrations to be disabled. Are you sure you want to enable invitations?',
          'Warning',
          { confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
          this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
          this.$store.dispatch('UpdateSettings', { group, key, input: ':registrations_open', value: false, type })
          this.$store.dispatch('UpdateState', { group, key, input, value })
          this.$store.dispatch('UpdateState', { group, key, input: ':registrations_open', value: false })
        })
      } else {
        this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
        this.$store.dispatch('UpdateState', { group, key, input, value })
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
