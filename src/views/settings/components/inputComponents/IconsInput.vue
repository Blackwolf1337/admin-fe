<template>
  <div :data-search="setting.key || setting.group" class="mascot-container">
    <div v-for="(icon, index) in data" :key="index" class="mascot">
      <div class="icons-container">
        <div class="icon-container">
          <div v-for="{ key, value, id } in icon" :key="id" class="icon-values-container">
            <el-input :value="key" placeholder="key" class="icon-key-input" @input="parseIcons($event, 'key', index, id)"/> :
            <el-input :value="value" placeholder="value" class="icon-value-input" @input="parseIcons($event, 'value', index, id)"/>
          </div>
        </div>
        <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-minus" circle class="icon-minus-button" @click="deleteIcondRow(index)"/>
      </div>
      <div class="icons-button-container">
        <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addValueToIcons(index)"/>
        <span class="icons-button-desc">{{ $t('settings.addKeyValuePair') }}</span>
      </div>
      <el-divider class="divider"/>
    </div>
    <div class="icons-button-container">
      <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="addIconToIcons"/>
      <span class="icons-button-desc">{{ $t('settings.addIconConfig') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableKeywordInput',
  props: {
    data: {
      type: Array,
      default: function() {
        return {}
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
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  methods: {
    addIconToIcons() {
      const updatedValue = [...this.data, [{ key: '', value: '', id: this.generateID() }]]
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    addValueToIcons(index) {
      const updatedValue = this.data.map((icon, i) => {
        if (i === index) {
          return [...icon, { key: '', value: '', id: this.generateID() }]
        }
        return icon
      })
      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    deleteIcondRow(index) {
      const filteredValues = this.data.filter((icon, i) => i !== index)
      this.updateSetting(filteredValues, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    generateID() {
      return `f${(~~(Math.random() * 1e8)).toString(16)}`
    },
    parseIcons(value, inputType, index, id) {
      const updatedValue = this.data.map((icon, i) => {
        if (i === index) {
          return icon.map(setting => {
            if (setting.id === id) {
              return inputType === 'key'
                ? { ...setting, key: value }
                : { ...setting, value }
            }
            return setting
          })
        }
        return icon
      })

      this.updateSetting(updatedValue, this.settingGroup.group, this.settingGroup.key, this.setting.key, this.setting.type)
    },
    updateSetting(value, group, key, input, type) {
      const updatedSettings = value.map(icon => {
        return icon.reduce((acc, { key, value }) => {
          return { ...acc, [key]: value }
        }, {})
      }, {})
      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedSettings, type })
      this.$store.dispatch('UpdateState', { group, key, input, value })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings
</style>
