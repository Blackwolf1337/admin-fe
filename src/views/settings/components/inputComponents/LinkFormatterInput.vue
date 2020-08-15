<template>
  <div>
    <div v-if="setting.type.includes('string')" :data-search="setting.key || setting.group">
      <el-switch :value="autoLinkerBooleanValue" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input
        v-if="autoLinkerBooleanValue"
        :value="autoLinkerStringValue"
        @input="processTwoTypeValue($event, setting.key)"/>
    </div>
    <div v-if="setting.type.includes('integer')" :data-search="setting.key || setting.group">
      <el-switch :value="autoLinkerBooleanValue" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input-number
        v-if="autoLinkerBooleanValue"
        :value="autoLinkerIntegerValue"
        @input="processTwoTypeValue($event, setting.key)"/>
    </div>
    <div v-if="setting.type.includes('atom')" :data-search="setting.key || setting.group">
      <el-switch :value="autoLinkerBooleanValue" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input
        v-if="autoLinkerBooleanValue"
        :value="autoLinkerAtomValue"
        @input="processTwoTypeValue($event, setting.key)">
        <template slot="prepend">:</template>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkFormatterInput',
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
  computed: {
    autoLinkerAtomValue() {
      return this.data[this.setting.key] &&
        this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key]
    },
    autoLinkerBooleanValue() {
      const value = this.data[this.setting.key]
      return typeof value === 'string' || typeof value === 'number'
    },
    autoLinkerIntegerValue() {
      const value = this.data[this.setting.key]
      return value || 0
    },
    autoLinkerStringValue() {
      const value = this.data[this.setting.key]
      return value || ''
    }
  },
  methods: {
    processTwoTypeValue(value, input) {
      if (value === true) {
        const data = input === ':truncate' ? 0 : ''
        this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else {
        this.updateSetting(value, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      }
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
