<template>
  <el-select
    :value="inputValue === false ? 'false' : inputValue"
    :data-search="setting.key || setting.group"
    clearable
    class="input"
    @change="updateSelect($event)">
    <el-option
      v-for="(option, index) in setting.suggestions"
      :value="option"
      :key="index"/>
  </el-select>
</template>

<script>
import Update from './Update'
import { getBooleanValue } from '@/store/modules/normalizers'

export default {
  name: 'SelectInput',
  extends: Update,
  methods: {
    updateSelect(value) {
      const selectValue = getBooleanValue(value)
      this.update(
        selectValue,
        this.settingGroup.group,
        this.settingGroup.key,
        this.settingParent,
        this.setting.key,
        this.setting.type,
        this.nested
      )
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
