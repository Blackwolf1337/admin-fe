<template>
  <el-select
    :value="data[setting.key]"
    :data-search="setting.key || setting.group"
    multiple
    filterable
    allow-create
    class="input"
    @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
    <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
  </el-select>
</template>

<script>
import Update from './Update'

export default {
  name: 'MultipleSelectInput',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>

