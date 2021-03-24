<template>
  <el-switch
    v-if="![':registrations_open', ':invites_enabled'].includes(setting.key)"
    :value="inputValue"
    :data-search="setting.key || setting.group"
    class="switch-input"
    @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)"/>
</template>

<script>
import Update from './Update'

export default {
  name: 'SwitchInput',
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
