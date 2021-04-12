<template>
  <div class="editable-keyword-container">
    <div v-if="reversedKeywordWithString" :data-search="setting.key">
      <div v-for="element in keywordData" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input reversed" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input :value="getValue(element)" placeholder="value" class="value-input reversed" @input="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else-if="editableKeywordWithInteger" :data-search="setting.key || setting.group">
      <div v-for="element in keywordData" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input-number :value="getValue(element)" :min="0" size="large" class="value-input" @change="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else-if="editableKeywordWithString" :data-search="setting.key || setting.group">
      <div v-for="element in keywordData" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input :value="getValue(element)" placeholder="value" class="value-input" @input="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else-if="editableKeywordWithSelect" :data-search="setting.key || setting.group">
      <div v-for="element in keywordData" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-select :value="getValue(element)" multiple filterable allow-create class="value-input" @change="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
  </div>
</template>

<script>
import { processNested } from '@/store/modules/normalizers'
import _ from 'lodash'

export default {
  name: 'EditableKeywordInput',
  props: {
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    parents: {
      type: Array,
      default: function() {
        return []
      },
      required: false
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
    }
  },
  computed: {
    editableKeywordWithInteger() {
      return _.isEqual(this.setting.type, ['keyword', 'integer'])
    },
    editableKeywordWithSelect() {
      return _.isEqual(this.setting.type, ['keyword', ['list', 'string']])
    },
    editableKeywordWithString() {
      return _.isEqual(this.setting.type, ['keyword', 'string']) ||
        _.isEqual(this.setting.type, ['map', 'string'])
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    keywordData() {
      if (this.parents.length > 0) {
        return Array.isArray(this.data[this.setting.key]) ? this.data[this.setting.key] : []
      }
      return Array.isArray(this.data) ? this.data : []
    },
    reversedKeywordWithString() {
      return _.isEqual(this.setting.type, ['keyword', 'string', 'reversed'])
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    }
  },
  methods: {
    addRowToEditableKeyword() {
      const updatedValue = [...this.keywordData, { '': { value: '', id: this.generateID() }}]
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteEditableKeywordRow(element) {
      const deletedId = this.getId(element)
      const filteredValues = this.keywordData.filter(element => Object.values(element)[0].id !== deletedId)
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    getKey(element) {
      return Object.keys(element)[0]
    },
    getId(element) {
      const { id } = Object.values(element)[0]
      return id
    },
    getValue(element) {
      const { value } = Object.values(element)[0]
      return value
    },
    parseEditableKeyword(value, inputType, element) {
      const updatedId = this.getId(element)
      const updatedValue = this.keywordData.map((element, index) => {
        if (Object.values(element)[0].id === updatedId) {
          return inputType === 'key'
            ? { [value]: Object.values(this.keywordData[index])[0] }
            : { [Object.keys(element)[0]]: { ...Object.values(this.keywordData[index])[0], value }}
        }
        return element
      })

      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const wrappedSettings = this.wrapUpdatedSettings(value, input, type)

      if (this.parents.length > 0) {
        const { valueForState,
          valueForUpdatedSettings,
          setting } = processNested(value, wrappedSettings, group, key, this.parents.reverse(), this.settings, this.updatedSettings)
        this.$store.dispatch('UpdateSettings',
          { group, key, input: setting.key, value: valueForUpdatedSettings, type: setting.type })
        this.$store.dispatch('UpdateState',
          { group, key, input: setting.key, value: valueForState })
      } else {
        this.$store.dispatch('UpdateSettings', { group, key, input, value: wrappedSettings, type })
        this.$store.dispatch('UpdateState', { group, key, input, value })
      }
    },
    wrapUpdatedSettings(value, input, type) {
      if (_.isEqual(type, 'map')) {
        return value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: Object.values(element)[0].value }
        }, {})
      } else if (_.isEqual(type, ['keyword', 'string', 'reversed'])) {
        return value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: ['reversed', Object.values(element)[0].value] }
        }, {})
      } else {
        return value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: ['list', Object.values(element)[0].value] }
        }, {})
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
