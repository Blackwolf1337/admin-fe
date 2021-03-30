<template>
  <div class="multiple-select-container">
    <el-select
      :value="inputValue"
      :data-search="setting.key || setting.group"
      multiple
      filterable
      allow-create
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
    </el-select>
  </div>
</template>

<script>
import Update from './Update'

export default {
  name: 'StringOrTupleMultipleSelect',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
