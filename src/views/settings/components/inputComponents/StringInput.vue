<template>
  <el-input
    :value="data[setting.key]"
    :placeholder="setting.suggestions ? setting.suggestions[0] : null"
    :data-search="setting.key || setting.group"
    class="input"
    @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
</template>

<script>
import Update from './Update'

export default {
  name: 'StringInput',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
