<template>
  <div>
    <div v-if="setting.type.includes('string')" :data-search="setting.key || setting.group">
      <el-switch :value="booleanValue" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input
        v-if="booleanValue"
        :value="stringValue"
        @input="processTwoTypeValue($event, setting.key)"/>
    </div>
    <div v-if="setting.type.includes('integer')" :data-search="setting.key || setting.group">
      <el-switch :value="booleanValue" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input-number
        v-if="booleanValue"
        :value="integerValue"
        @input="processTwoTypeValue($event, setting.key)"/>
    </div>
    <div v-if="setting.type.includes('atom')" :data-search="setting.key || setting.group">
      <el-switch :value="booleanValue" @change="processTwoTypeValue($event, setting.key)"/>
      <el-input
        v-if="booleanValue"
        :value="atomValue"
        @input="processTwoTypeValue($event, setting.key)">
        <template slot="prepend">:</template>
      </el-input>
    </div>
    <div v-if="setting.type.includes('tuple_of_three')" :data-search="setting.key || setting.group">
      <el-switch :value="booleanValue" @change="processTupleTwoTypeValue($event, setting.key)"/>
      <div v-if="booleanValue" class="tuple-input-container">
        <el-input
          v-for="(item, index) in tupleOfThreeValue"
          :value="item"
          :key="index"
          :placeholder="getPlaceholder[index] || ''"
          class="tuple-input"
          @input="processTupleTwoTypeValue($event, setting.key, index)"/>
      </div>
    </div>
  </div>
</template>

<script>
import Update from './Update'

export default {
  name: 'BooleanCombinedInput',
  extends: Update,
  computed: {
    atomValue() {
      return this.data[this.setting.key] &&
        this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key]
    },
    booleanValue() {
      const value = this.data[this.setting.key]
      return typeof value !== 'boolean'
    },
    getPlaceholder() {
      return this.setting.placeholders
    },
    integerValue() {
      const value = this.data[this.setting.key]
      return value || 0
    },
    stringValue() {
      const value = this.data[this.setting.key]
      return value || ''
    },
    tupleOfThreeValue() {
      const value = this.data[this.setting.key]
      return value || ['', '', '']
    }
  },
  methods: {
    processTupleTwoTypeValue(value, input, _index) {
      if (value === false) {
        this.updateSetting(value, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else if (value === true) {
        this.updateSetting(['', '', ''], this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else {
        const data = [...this.tupleOfThreeValue]
        data[_index] = value
        this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      }
    },
    processTwoTypeValue(value, input) {
      if (value === true) {
        const data = this.setting.type.includes('integer') ? 0 : ''
        this.updateSetting(data, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      } else {
        this.updateSetting(value, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
