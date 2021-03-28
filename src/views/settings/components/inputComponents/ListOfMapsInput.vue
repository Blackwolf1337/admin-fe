<template>
  <div :data-search="setting.key || setting.group">
    <div v-for="(mapItem, index) in mapData" :key="index">
      <div class="map-items-container">
        <div class="item-container">
          <div v-for="{ key, value, id } in mapItem" :key="id" class="item-values-container">
            <el-input :value="key" placeholder="key" class="item-key-input" @input="parseListOfMaps($event, 'key', index, id)"/> :
            <el-input :value="value" placeholder="value" class="item-value-input" @input="parseListOfMaps($event, 'value', index, id)"/>
          </div>
        </div>
        <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-minus" circle class="item-minus-button" @click="deleteRow(index)"/>
      </div>
      <div class="map-items-button-container">
        <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addValue(index)"/>
        <span class="items-button-desc">{{ $t('settings.addKeyValuePair') }}</span>
      </div>
      <el-divider class="divider"/>
    </div>
    <div class="map-items-button-container">
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addItemToListOfMap"/>
      <span class="items-button-desc">{{ $t('settings.addItemConfig') }}</span>
    </div>
  </div>
</template>

<script>
import Update from './Update'

export default {
  name: 'ListOfMapsInput',
  extends: Update,
  computed: {
    mapData() {
      return Array.isArray(this.data) ? this.data : []
    }
  },
  methods: {
    addItemToListOfMap() {
      const updatedValue = [...this.data, [{ key: '', value: '', id: this.generateID() }]]
      this.updateListOfMap(updatedValue)
    },
    addValue(index) {
      const updatedValue = this.data.map((item, i) => {
        if (i === index) {
          return [...item, { key: '', value: '', id: this.generateID() }]
        }
        return item
      })
      this.updateListOfMap(updatedValue)
    },
    deleteRow(index) {
      const filteredValues = this.data.filter((item, i) => i !== index)
      this.updateListOfMap(filteredValues)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    parseListOfMaps(value, inputType, index, id) {
      const updatedValue = this.data.map((item, i) => {
        if (i === index) {
          return item.map(setting => {
            if (setting.id === id) {
              return inputType === 'key'
                ? { ...setting, key: value }
                : { ...setting, value }
            }
            return setting
          })
        }
        return item
      })

      this.updateListOfMap(updatedValue)
    },
    updateListOfMap(value) {
      const updatedSettings = value.map(item => {
        return item.reduce((acc, { key, value }) => {
          return { ...acc, [key]: value }
        }, {})
      }, {})

      this.$store.dispatch('UpdateSettings', {
        group: this.settingGroup.group,
        key: this.settingGroup.key,
        input: this.setting.key,
        value: updatedSettings,
        type: this.setting.type
      })
      this.$store.dispatch('UpdateState', {
        group: this.settingGroup.group,
        key: this.settingGroup.key,
        input: this.setting.key,
        value
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
