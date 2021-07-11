<template>
  <div class="input-container">
    <div v-if="setting.type === 'keyword'" class="keyword-container">
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
    <el-form-item v-if="setting.type !== 'keyword'" :label-width="customLabelWidth" :class="labelClass" :style="isDesktop ? '' : `margin-left:${margin}px`">
      <span slot="label">
        {{ setting.label }}
        <el-tooltip v-if="canBeDeleted && (isDesktop || isMobile)" :content="$t('settings.removeFromDB')" placement="bottom-end">
          <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeSetting"/>
        </el-tooltip>
      </span>
      <div class="input-row">
        <component
          :is="settingComponent"
          :data="data"
          :nested="nested"
          :parents="settingParent"
          :setting-group="settingGroup"
          :setting="setting"
          :setting-parent="settingParent"/>
        <el-tooltip v-if="canBeDeleted && isTablet" :content="$t('settings.removeFromDB')" placement="bottom-end" class="delete-setting-button-container">
          <el-button icon="el-icon-delete" circle size="mini" class="delete-setting-button" @click="removeSetting"/>
        </el-tooltip>
      </div>
      <div
        v-if="setting.description && setting.type !== 'keyword'"
        class="expl"
        v-html="getFormattedDescription(setting.description)"/>
    </el-form-item>
  </div>
</template>

<script>
import i18n from '@/lang'
import {
  AtomInput,
  EditableKeywordInput,
  ImageUploadInput,
  IpInput,
  BooleanCombinedInput,
  BooleanWithConfirmation,
  KeywordMapInput,
  ListOfMapsInput,
  MultipleSelectInput,
  NumberInput,
  SelectInput,
  SelectInputWithReducedLabels,
  StringInput,
  StringOrTupleInput,
  SwitchInput,
  TextareaInput,
  TupleOrPairOfTuplesInput } from './inputComponents'
import TabMethods from './TabMethods'
import { processNested } from '@/store/modules/normalizers'
import { mapSetting } from './mapping'
import _ from 'lodash'
import marked from 'marked'

export default {
  name: 'Inputs',
  components: {
    AtomInput,
    EditableKeywordInput,
    ImageUploadInput,
    IpInput,
    BooleanCombinedInput,
    BooleanWithConfirmation,
    KeywordMapInput,
    ListOfMapsInput,
    MultipleSelectInput,
    NumberInput,
    SelectInput,
    SelectInputWithReducedLabels,
    StringInput,
    StringOrTupleInput,
    SwitchInput,
    TextareaInput,
    TupleOrPairOfTuplesInput
  },
  extends: TabMethods,
  props: {
    customLabelWidth: {
      type: String,
      default: function() {
        return this.labelWidth
      },
      required: false
    },
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    labelClass: {
      type: String,
      default: function() {
        return 'label'
      },
      required: false
    },
    margin: {
      type: Number,
      default: function() {
        return 0
      },
      required: false
    },
    nested: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    setting: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingGroup: {
      type: Object,
      default: function() {
        return {}
      }
    },
    settingParent: {
      type: Array,
      default: function() {
        return []
      },
      required: false
    }
  },
  computed: {
    canBeDeleted() {
      const { group, key } = this.settingGroup
      return _.get(this.$store.state.settings.db, [group, key]) &&
        this.$store.state.settings.db[group][key].includes(this.setting.key)
    },
    settingComponent() {
      return mapSetting(this.setting.type)
    },
    settings() {
      return this.$store.state.settings.settings
    }
  },
  methods: {
    getFormattedDescription(desc) {
      return marked(desc)
    },
    processNestedData(value, group, parentKey, parents) {
      const { valueForState,
        valueForUpdatedSettings,
        setting } = processNested(
        value,
        value,
        group,
        parentKey,
        parents.reverse(),
        this.settings,
        this.$store.state.settings.updatedSettings
      )

      this.$store.dispatch('UpdateSettings',
        { group, key: parentKey, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
      this.$store.dispatch('UpdateState',
        { group, key: parentKey, input: setting.key, value: valueForState })
    },
    async removeSetting() {
      this.$confirm(
        this.$t('settings.removeSettingConfirmation'),
        {
          confirmButtonText: this.$t('users.ok'),
          cancelButtonText: this.$t('users.cancel'),
          type: 'warning'
        }).then(async() => {
        const config = this.settingGroup.key
          ? [{ group: this.settingGroup.group, key: this.settingGroup.key, delete: true, subkeys: [this.setting.key] }]
          : [{ group: this.settingGroup.group, key: this.setting.key, delete: true }]
        try {
          await this.$store.dispatch('RemoveSetting', config)
        } catch (e) {
          return
        }
        this.$message({
          type: 'success',
          message: i18n.t('settings.successfullyRemoved')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('users.canceled')
        })
      })
    },
    update(value, group, key, parents, input, type, nested) {
      nested
        ? this.processNestedData(value, group, key, parents)
        : this.updateSetting(value, group, key, input, type)
    },
    updateSetting(value, group, key, input, type) {
      this.$store.dispatch('UpdateSettings', { group, key, input, value, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings
</style>
