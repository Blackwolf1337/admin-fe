<template>
  <el-input
    :value="inputValue"
    :placeholder="setting.suggestions ? setting.suggestions[0] : null"
    :data-search="setting.key || setting.group"
    type="textarea"
    class="input"
    @input="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
</template>

<script>
import Update from './Update'

export default {
  name: 'TextareaInput',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
