<template>
  <div :data-search="setting.key || setting.group" class="rate-limit-container">
    <div v-if="!rateLimitAuthUsers">
      <el-input-number
        :value="rateLimitAllUsers[0]"
        :controls="false"
        placeholder="scale"
        class="scale-input"
        @input="parseRateLimiter($event, setting.key, 'scale', 'oneLimit', rateLimitAllUsers)"/>
      <span>:</span>
      <el-input-number
        :value="rateLimitAllUsers[1]"
        :controls="false"
        placeholder="limit"
        class="limit-input"
        @input="parseRateLimiter($event, setting.key, 'limit', 'oneLimit', rateLimitAllUsers)"/>
      <div class="limit-button-container">
        <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="toggleLimits([['', ''], ['', '']], setting.key)"/>
        <p class="expl limit-expl">{{ $t('settings.setLimits') }}</p>
      </div>
    </div>
    <div v-if="rateLimitAuthUsers">
      <el-form-item class="rate-limit">
        <div class="rate-limit-label-container">
          <span class="rate-limit-label">
            {{ $t('settings.unauthenticatedUsers') }}:
          </span>
        </div>
        <div class="rate-limit-content">
          <el-input-number
            :value="rateLimitUnauthUsers[0]"
            :controls="false"
            placeholder="scale"
            class="scale-input"
            @input="parseRateLimiter(
              $event, setting.key, 'scale', 'unauthUsersLimit', [rateLimitUnauthUsers, rateLimitAuthUsers]
          )"/>
          <span>:</span>
          <el-input-number
            :value="rateLimitUnauthUsers[1]"
            :controls="false"
            placeholder="limit"
            class="limit-input"
            @input="parseRateLimiter(
              $event, setting.key, 'limit', 'unauthUsersLimit', [rateLimitUnauthUsers, rateLimitAuthUsers]
          )"/>
        </div>
      </el-form-item>
      <el-form-item class="rate-limit">
        <div class="rate-limit-label-container">
          <span class="rate-limit-label">
            {{ $t('settings.authenticatedUsers') }}:
          </span>
        </div>
        <div class="rate-limit-content">
          <el-input-number
            :value="rateLimitAuthUsers[0]"
            :controls="false"
            placeholder="scale"
            class="scale-input"
            @input="parseRateLimiter($event, setting.key, 'scale', 'authUserslimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/>
          <span>:</span>
          <el-input-number
            :value="rateLimitAuthUsers[1]"
            :controls="false"
            placeholder="limit"
            class="limit-input"
            @input="parseRateLimiter($event, setting.key, 'limit', 'authUserslimit', [rateLimitUnauthUsers, rateLimitAuthUsers])"/>
        </div>
      </el-form-item>
      <div class="limit-button-container">
        <el-button :size="isDesktop ? 'medium' : 'mini'" class="icon-minus-button" icon="el-icon-minus" circle @click="toggleLimits(['', ''], setting.key)"/>
        <p class="expl limit-expl">{{ $t('settings.setLimitsForAll') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RateLimitInput',
  props: {
    data: {
      type: [Object, Array],
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
    },
    rateLimitAllUsers() {
      return this.data[this.setting.key] ? this.data[this.setting.key] : ['', '']
    },
    rateLimitAuthUsers() {
      return this.data[this.setting.key] && Array.isArray(this.data[this.setting.key][0])
        ? this.data[this.setting.key][1]
        : false
    },
    rateLimitUnauthUsers() {
      return this.data[this.setting.key] && Array.isArray(this.data[this.setting.key][1])
        ? this.data[this.setting.key][0]
        : false
    }
  },
  methods: {
    parseRateLimiter(value, input, typeOfInput, typeOfLimit, currentValue) {
      let valueToSend
      if (typeOfLimit === 'oneLimit') {
        valueToSend = typeOfInput === 'scale' ? [value, currentValue[1]] : [currentValue[0], value]
      } else if (typeOfLimit === 'unauthUsersLimit') {
        valueToSend = typeOfInput === 'scale'
          ? [[value, currentValue[0][1]], [currentValue[1][0], currentValue[1][1]]]
          : [[currentValue[0][0], value], [currentValue[1][0], currentValue[1][1]]]
      } else if (typeOfLimit === 'authUserslimit') {
        valueToSend = typeOfInput === 'scale'
          ? [[currentValue[0][0], currentValue[0][1]], [value, currentValue[1][1]]]
          : [[currentValue[0][0], currentValue[0][1]], [currentValue[1][0], value]]
      }
      this.updateSetting(valueToSend, this.settingGroup.group, this.settingGroup.key, input, this.setting.type)
    },
    toggleLimits(value, input) {
      this.updateSetting(value, this.settingGroup.group, this.settingGroup.key, input)
    },
    updateSetting(value, group, key, input, type) {
      const updatedSettings = Array.isArray(value[0])
        ? value.map(element => { return { 'tuple': element } })
        : { 'tuple': value }
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
