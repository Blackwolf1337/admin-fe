<template>
  <div class="input">
    <el-select
      v-if="setting.type.includes('multiple_select')"
      :value="inputValue"
      :data-search="setting.key"
      multiple
      filterable
      allow-create
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in options(setting.suggestions)" :key="index" :value="option.value" :label="option.label" />
    </el-select>
    <el-select
      v-if="setting.type.includes('select')"
      :value="inputValue === false ? 'false' : inputValue"
      :data-search="setting.key || setting.group"
      clearable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option
        v-for="(option, index) in options(setting.suggestions)"
        :value="option.value"
        :label="option.label"
        :key="index"/>
    </el-select>
  </div>
</template>

<script>
import { getBooleanValue } from '@/store/modules/normalizers'

export default {
  name: 'SelectInputWithReducedLabels',
  props: {
    data: {
      type: [Array, Object, String],
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
    inputValue() {
      return this.data[this.setting.key] || this.data
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  methods: {
    options(suggestions) {
      return suggestions.map(element => {
        const label = element.split(this.setting.prefix)[1]
          ? element.split(this.setting.prefix)[1]
          : element
        return { value: element, label }
      })
    },
    updateSetting(value, group, key, input, type) {
      const updatedValue = getBooleanValue(value)
      if (this.settingGroup.type !== 'group') {
        this.$store.dispatch('UpdateSettings', { group, key, input: null, value: updatedValue, type })
        this.$store.dispatch('UpdateState', { group, key, input: null, value: updatedValue })
      } else {
        this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedValue, type })
        this.$store.dispatch('UpdateState', { group, key, input, value: updatedValue })
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
