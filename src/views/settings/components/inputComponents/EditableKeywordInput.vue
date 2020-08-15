<template>
  <div class="editable-keyword-container">
    <div v-if="setting.key === ':crontab'" :data-search="setting.key" class="crontab">
      <el-form-item v-for="worker in data" :key="getId(worker)" :label="getCrontabWorkerLabel(worker)" class="crontab-container">
        <el-input
          :value="getValue(worker)"
          :placeholder="getSuggestion(worker) || null"
          class="input setting-input"
          @input="updateCrontab($event, 'value', worker)"/>
      </el-form-item>
    </div>
    <div v-else-if="editableKeywordWithInteger" :data-search="setting.key || setting.group">
      <div v-for="element in data" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" placeholder="key" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input-number :value="getValue(element)" :min="0" size="large" class="value-input" @change="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else-if="editableKeywordWithString" :data-search="setting.key || setting.group">
      <div v-for="element in data" :key="getId(element)" class="setting-input">
        <el-input :value="getKey(element)" :placeholder="keyPlaceholder" class="name-input" @input="parseEditableKeyword($event, 'key', element)"/> :
        <el-input :value="getValue(element)" :placeholder="valuePlaceholder" class="value-input" @input="parseEditableKeyword($event, 'value', element)"/>
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteEditableKeywordRow(element)"/>
      </div>
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToEditableKeyword"/>
    </div>
    <div v-else-if="editableKeywordWithSelect" :data-search="setting.key || setting.group">
      <div v-for="element in data" :key="getId(element)" class="setting-input">
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

export default {
  name: 'EditableKeywordInput',
  props: {
    data: {
      type: Array,
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
      return this.setting.type.includes('keyword') && this.setting.type.includes('integer')
    },
    editableKeywordWithSelect() {
      return (this.setting.type.includes('map') && this.setting.type.findIndex(el => el.includes('list') && el.includes('string')) !== -1) ||
        (this.setting.type.includes('keyword') && this.setting.type.findIndex(el => el.includes('list') && el.includes('string')) !== -1)
    },
    editableKeywordWithString() {
      return this.setting.key !== ':crontab' && (
        (this.setting.type.includes('keyword') && this.setting.type.includes('string')) ||
        (this.setting.type.includes('tuple') && this.setting.type.includes('list')) ||
        (this.setting.type.includes('map') && this.setting.type.includes('string'))
      )
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    keyPlaceholder() {
      return this.setting.key === ':replace' ? 'pattern' : 'key'
    },
    settings() {
      return this.$store.state.settings.settings
    },
    updatedSettings() {
      return this.$store.state.settings.updatedSettings
    },
    valuePlaceholder() {
      return this.setting.key === ':replace' ? 'replacement' : 'value'
    }
  },
  methods: {
    addRowToEditableKeyword() {
      const updatedValue = [...this.data, { '': { value: '', id: this.generateID() }}]
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteEditableKeywordRow(element) {
      const deletedId = this.getId(element)
      const filteredValues = this.data.filter(element => Object.values(element)[0].id !== deletedId)
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    getCrontabWorkerLabel(worker) {
      const workerKey = this.getKey(worker)
      return workerKey.includes('Pleroma.Workers.Cron.') ? workerKey.replace('Pleroma.Workers.Cron.', '') : workerKey
    },
    getKey(element) {
      return Object.keys(element)[0]
    },
    getId(element) {
      const { id } = Object.values(element)[0]
      return id
    },
    getSuggestion(worker) {
      return this.setting.suggestions.find(suggestion => suggestion[1] === this.getKey(worker))[0]
    },
    getValue(element) {
      const { value } = Object.values(element)[0]
      return value
    },
    parseEditableKeyword(value, inputType, element) {
      const updatedId = this.getId(element)
      const updatedValue = this.data.map((element, index) => {
        if (Object.values(element)[0].id === updatedId) {
          return inputType === 'key'
            ? { [value]: Object.values(this.data[index])[0] }
            : { [Object.keys(element)[0]]: { ...Object.values(this.data[index])[0], value }}
        }
        return element
      })

      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateCrontab(value, inputType, worker) {
      const updatedId = this.getId(worker)
      const updatedValue = this.data.map((worker, index) => {
        if (Object.values(worker)[0].id === updatedId) {
          return { [Object.keys(worker)[0]]: { ...Object.values(this.data[index])[0], value }}
        }
        return worker
      })
      const updatedValueWithType = updatedValue.reduce((acc, worker) => {
        return { ...acc, [Object.keys(worker)[0]]: ['reversed_tuple', Object.values(worker)[0].value] }
      }, {})

      this.$store.dispatch('UpdateSettings',
        { group: this.settingGroup.group, key: this.settingGroup.key, input: this.setting.key, value: updatedValueWithType, type: this.setting.type }
      )
      this.$store.dispatch('UpdateState',
        { group: this.settingGroup.group, key: this.settingGroup.key, input: this.setting.key, value: updatedValue }
      )
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
      return type === 'map'
        ? value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: Object.values(element)[0].value }
        }, {})
        : value.reduce((acc, element) => {
          return { ...acc, [Object.keys(element)[0]]: ['list', Object.values(element)[0].value] }
        }, {})
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
