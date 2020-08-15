<template>
  <div class="input">
    <el-select
      v-if="renderMultipleSelect(setting.type)"
      :value="inputValue"
      :data-search="setting.key"
      multiple
      filterable
      allow-create
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option v-for="(option, index) in options(setting.suggestions)" :key="index" :value="option.value" :label="option.label" />
    </el-select>
    <el-select
      v-if="setting.type === 'module' || (setting.type.includes('atom') && setting.type.includes('dropdown'))"
      :value="inputValue === false ? 'false' : inputValue"
      :data-search="setting.key || setting.group"
      clearable
      class="input"
      @change="updateSetting($event, settingGroup.group, settingGroup.key, setting.key, setting.type)">
      <el-option
        v-for="(option, index) in options(setting.suggestions)"
        :value="option.value"
        :label="option.label"
        :key="index"/>
    </el-select>
  </div>
</template>

<script>
import { getBooleanValue } from '@/store/modules/normalizers'

export default {
  name: 'SelectInputWithReducedLabels',
  props: {
    data: {
      type: [Array, Object],
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
    inputValue() {
      if (this.setting.key === 'Pleroma.Web.Auth.Authenticator') {
        return this.data.value
      } else if (this.setting.key === ':policies') {
        return typeof this.data[this.setting.key] === 'string'
          ? [this.data[this.setting.key]]
          : this.data[this.setting.key]
      } else {
        return this.data[this.setting.key]
      }
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  methods: {
    options(suggestions) {
      const prefixes = {
        ':policies': 'Pleroma.Web.ActivityPub.MRF.',
        'Pleroma.Web.Auth.Authenticator': 'Pleroma.Web.Auth.',
        ':method': 'Pleroma.Captcha.',
        ':adapter': 'Swoosh.Adapters.',
        ':providers': 'Pleroma.Web.Metadata.Providers.',
        ':parsers': 'Pleroma.Web.RichMedia.Parsers.',
        ':ttl_setters': 'Pleroma.Web.RichMedia.Parser.',
        ':scrub_policy': 'Pleroma.HTML.',
        ':federation_publisher_modules': 'Pleroma.Web.',
        ':uploader': 'Pleroma.Uploaders.',
        ':filters': 'Pleroma.Upload.Filter.'
      }

      return suggestions.map(element => {
        const label = element.split(prefixes[this.setting.key])[1]
          ? element.split(prefixes[this.setting.key])[1]
          : element
        return { value: element, label }
      })
    },
    renderMultipleSelect(type) {
      return Array.isArray(type) && this.setting.key !== ':backends' && this.setting.key !== ':args' && (
        type.includes('module') ||
        (type.includes('list') && type.includes('string')) ||
        (type.includes('list') && type.includes('atom')) ||
        (type.includes('regex') && type.includes('string')) ||
        this.setting.key === ':args'
      )
    },
    updateSetting(value, group, key, input, type) {
      const updatedValue = getBooleanValue(value)
      this.$store.dispatch('UpdateSettings', { group, key, input, value: updatedValue, type })
      this.$store.dispatch('UpdateState', { group, key, input, value: updatedValue })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings
</style>
