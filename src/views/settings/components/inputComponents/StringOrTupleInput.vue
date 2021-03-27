<template>
  <div :data-search="setting.key || setting.group" class="proxy-url-input">
    <proxy-url-input v-if="setting.key === ':proxy_url'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting" :parents="settingParent"/>
    <sender-input v-if="setting.key === ':sender'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting" :parents="settingParent"/>
  </div>
</template>

<script>
import Update from './Update'
import ProxyUrlInput from './ProxyUrlInput'
import SenderInput from './SenderInput'

export default {
  name: 'StringOrTupleInput',
  components: { ProxyUrlInput, SenderInput },
  extends: Update
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
