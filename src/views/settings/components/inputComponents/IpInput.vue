<template>
  <el-input
    :value="inputValue"
    :data-search="setting.key || setting.group"
    placeholder="xxx.xxx.xxx.xx"
    class="input"
    @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
</template>

<script>
import Update from './Update'

export default {
  name: 'IpInput',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
