<template>
  <div class="keyword-container">
    <el-form-item
      :label-width="customLabelWidth"
      :class="labelClass"
      :style="`margin-left:${margin}px;margin-bottom:0`"
      :data-search="setting.key || setting.group">
      <span slot="label">
        {{ setting.label }}
        <el-tooltip v-if="canBeDeleted && isDesktop" :content="$t('settings.removeFromDB')" placement="bottom-end">
          <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeSetting"/>
        </el-tooltip>
      </span>
    </el-form-item>
    <el-form-item v-for="subSetting in setting.children" :key="subSetting.key">
      <inputs
        :setting-group="settingGroup"
        :setting-parent="[...settingParent, subSetting]"
        :setting="subSetting"
        :data="data[setting.key]"
        :custom-label-width="isMobile ? '100px' : '120px'"
        :label-class="subSetting.type === 'keyword' ? 'center-label' : ''"
        :margin="isDesktop ? margin + 15 : margin + 8"
        :nested="true"/>
    </el-form-item>
  </div>
</template>

<script>
import Inputs from '../Inputs'

export default {
  name: 'KeywordInput',
  extends: Inputs
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
