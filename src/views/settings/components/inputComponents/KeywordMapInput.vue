<template>
  <div :data-search="setting.key || setting.group" class="map-keyword-container">
    <div v-for="settingItem in data" :key="getId(settingItem)" class="map-keyword">
      <el-form-item :label="$t('settings.name')" label-width="85px" class="map-form-item">
        <div class="map-name-container">
          <el-input :value="getName(settingItem)" class="map-name-input" @input="parse($event, 'name', settingItem)"/>
          <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="deleteMapRow(settingItem)"/>
        </div>
      </el-form-item>
      <el-form-item v-for="{ key, label } in setting.map_keys" :key="key" :label="label" label-width="85px" class="map-form-item">
        <el-input :value="getValue(settingItem, key)" class="map-keyword-input" @input="parse($event, key, settingItem)"/>
      </el-form-item>
    </div>
    <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addRowToMap"/>
  </div>
</template>

<script>
import Update from './Update'

export default {
  name: 'KeywordMapInput',
  extends: Update,
  methods: {
    addRowToMap() {
      const newItem = this.setting.map_keys.reduce((acc, { key }) => {
        acc[key] = ''
        return acc
      }, { id: this.generateID() })
      const updatedValue = [...this.data, { '': newItem }]
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteMapRow(settingItem) {
      const deletedId = this.getId(settingItem)
      const filteredValues = this.data.filter(settingItem => Object.values(settingItem)[0].id !== deletedId)
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    getId(settingItem) {
      const { id } = Object.values(settingItem)[0]
      return id
    },
    getName(settingItem) {
      return Object.keys(settingItem)[0]
    },
    getValue(settingItem, key) {
      const [value] = Object.values(settingItem)
      return value[key]
    },
    parse(value, inputType, settingItem) {
      const updatedId = this.getId(settingItem)
      const updatedValue = this.data.map((settingItem, index) => {
        if (Object.values(settingItem)[0].id === updatedId) {
          return inputType === 'name'
            ? { [value]: Object.values(this.data[index])[0] }
            : { [Object.keys(settingItem)[0]]: { ...Object.values(this.data[index])[0], [inputType]: value }}
        }
        return settingItem
      })
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const settingItemsWithoutIDs = value.reduce((acc, settingItem) => {
        const { id, ...settingItemValue } = Object.values(settingItem)[0]
        return { ...acc, [Object.keys(settingItem)[0]]: ['', settingItemValue] }
      }, {})
      this.$store.dispatch('UpdateSettings', { group, key, input, value: settingItemsWithoutIDs, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
