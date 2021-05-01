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
        <el-select
          v-if="renderMultipleSelect(setting.type)"
          :value="inputValue"
          :data-search="setting.key || setting.group"
          multiple
          filterable
          allow-create
          class="input"
          @change="update($event, settingGroup.group, settingGroup.key, settingParent, setting.key, setting.type, nested)">
          <el-option v-for="(option, index) in setting.suggestions" :key="index" :value="option"/>
        </el-select>
        <!-- special inputs -->
        {{ setting.type }}
        <component
          :is="settingComponent"
          :data="data"
          :nested="nested"
          :parents="settingParent"
          :setting-group="settingGroup"
          :setting="setting"
          :setting-parent="settingParent"/>
        <editable-keyword-input v-if="editableKeyword(setting.key, setting.type)" :data="keywordData" :setting-group="settingGroup" :setting="setting" :parents="settingParent"/>
        <prune-input v-if="setting.key === ':prune'" :data="data[setting.key]" :setting-group="settingGroup" :setting="setting"/>
        <reg-invites-input v-if="[':registrations_open', ':invites_enabled'].includes(setting.key)" :data="data" :setting-group="settingGroup" :setting="setting"/>
        <!-------------------->
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
  KeywordMapInput,
  ListOfMapsInput,
  MultipleSelectInput,
  NumberInput,
  PruneInput,
  RegInvitesInput,
  SelectInput,
  SelectInputWithReducedLabels,
  StringInput,
  StringOrTupleInput,
  SwitchInput,
  TextareaInput,
  TupleOrPairOfTuplesInput } from './inputComponents'
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
    KeywordMapInput,
    ListOfMapsInput,
    MultipleSelectInput,
    NumberInput,
    PruneInput,
    RegInvitesInput,
    SelectInput,
    SelectInputWithReducedLabels,
    StringInput,
    StringOrTupleInput,
    SwitchInput,
    TextareaInput,
    TupleOrPairOfTuplesInput
  },
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
    valueMap() {
      return [
        { condition: _.isEqual(this.settingGroup.type, ['group', 'without_key']) && this.data[this.setting.key] &&
            this.setting.type === 'atom' && this.data[this.setting.key].value[0] === ':',
        value: () => this.data[this.setting.key].value.substr(1) },
        { condition: _.isEqual(this.settingGroup.type, ['group', 'without_key']) && this.data[this.setting.key],
          value: () => this.data[this.setting.key].value },
        { condition: this.setting.type === 'atom',
          value: () => this.data[this.setting.key] && this.data[this.setting.key][0] === ':' ? this.data[this.setting.key].substr(1) : this.data[this.setting.key] },
        { condition: _.isEqual(this.settingGroup.type, ['group', 'without_key', 'single_setting']),
          value: () => this.data.value },
        { condition: true,
          value: () => this.data[this.setting.key] }
      ]
    },
    inputValue() {
      const { value } = this.valueMap.find(({ condition }) => condition)
      return value()
    },
    // inputValue() {
    //   if ([':esshd', ':cors_plug', ':quack', ':tesla', ':swoosh'].includes(this.settingGroup.group) &&
    //     this.data[this.setting.key]) {
    //     return this.setting.type === 'atom' && this.data[this.setting.key].value[0] === ':'
    //       ? this.data[this.setting.key].value.substr(1)
    //       : this.data[this.setting.key].value
    //   } else if ((this.settingGroup.group === ':logger' && this.setting.key === ':backends') ||
    //     this.setting.key === 'Pleroma.Web.Auth.Authenticator' ||
    //     this.setting.key === ':admin_token') {
    //     return this.data.value
    //   } else if (this.settingGroup.group === ':mime' && this.settingParent[0].key === ':types') {
    //     return this.data ? this.data[this.setting.key] : []
    //   } else if (Array.isArray(this.setting.type) &&
    //       this.setting.type.find(el => Array.isArray(el) && el.includes('list'))) {
    //     return typeof this.data[this.setting.key] === 'string' ? [this.data[this.setting.key]] : this.data[this.setting.key]
    //   } else {
    //     return this.data[this.setting.key]
    //   }
    // },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    keywordData() {
      if (this.settingParent.length > 0 ||
        (Array.isArray(this.setting.type) && this.setting.type.includes('tuple') && this.setting.type.includes('list'))) {
        return Array.isArray(this.data[this.setting.key]) ? this.data[this.setting.key] : []
      }
      return Array.isArray(this.data) ? this.data : []
    },
    settingComponent() {
      return mapSetting(this.setting.type)
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    }
  },
  methods: {
    editableKeyword(key, type) {
      return Array.isArray(type) && (
        (type.includes('map') && type.findIndex(el => el.includes('list') && el.includes('string')) !== -1))
    },
    getFormattedDescription(desc) {
      return marked(desc)
    },
    processNestedData(value, group, parentKey, parents) {
      const { valueForState,
        valueForUpdatedSettings,
        setting } = processNested(value, value, group, parentKey, parents.reverse(), this.settings, this.updatedSettings)

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
    renderMultipleSelect(type) {
      return Array.isArray(type) && (
        this.setting.key === ':ip_whitelist' ||
        (!type.includes('keyword') && type.includes('regex') && type.includes('string'))
      )
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
