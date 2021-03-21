<template>
  <el-input-number
    :value="data[setting.key] || undefined"
    :placeholder="setting.suggestions ? setting.suggestions[0].toString() : null"
    :min="0"
    :size="isDesktop ? 'large' : 'medium'"
    :data-search="setting.key || setting.group"
    @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
</template>

<script>
import Update from './Update'

export default {
  name: 'NumberInput',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
