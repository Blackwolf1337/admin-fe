<template>
  <div :data-search="setting.key || setting.group">
    <el-radio-group v-model="prune" class="prune-options">
      <el-radio label=":disabled">Disabled</el-radio>
      <el-radio label=":maxlen">Limit-based</el-radio>
      <el-radio label=":maxage">Time-based</el-radio>
    </el-radio-group>
    <el-form-item v-if="prune === ':maxlen'" label="Max length" label-width="100" label-position="left">
      <el-input-number
        :value="data[1]"
        :min="0"
        placeholder="1500"
        size="large"
        class="top-margin"
        @change="updateIntInput($event, ':maxlen')"/>
    </el-form-item>
    <el-form-item v-if="prune === ':maxage'" label="Max age" label-width="100" label-position="left">
      <el-input-number
        :value="data[1]"
        :min="0"
        placeholder="3600"
        size="large"
        class="top-margin"
        @change="updateIntInput($event, ':maxage')"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'PruneInput',
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
    prune: {
      get: function() {
        return this.data[0]
      },
      set: function(value) {
        this.updateRadioInput(value)
      }
    }
  },
  methods: {
    updateIntInput(value, input) {
      this.updateSetting([input, value], this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const updatedSetting = value.includes(':disabled') ? ':disabled' : value
      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedSetting, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    },
    updateRadioInput(value) {
      const processedValue = value === ':disabled' ? [value] : [value, 0]
      this.updateSetting(processedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
