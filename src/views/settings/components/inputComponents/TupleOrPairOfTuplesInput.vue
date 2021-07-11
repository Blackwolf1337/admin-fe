<template>
  <div :data-search="setting.key || setting.group" class="pair-of-tuples-container">
    <div v-if="!valueIsAnArrayOfTuples">
      <el-input-number
        :value="tupleValue[0]"
        :controls="false"
        :placeholder="setting.placeholders[0]"
        class="setting-tuple-key-input"
        @input="parseTuples($event, setting.key, 'first', 'oneLimit', tupleValue)"/>
      <span>:</span>
      <el-input-number
        :value="tupleValue[1]"
        :controls="false"
        :placeholder="setting.placeholders[1]"
        class="setting-tuple-value-input"
        @input="parseTuples($event, setting.key, 'second', 'oneLimit', tupleValue)"/>
      <div class="limit-button-container">
        <el-button :size="isDesktop ? 'medium' : 'mini'" icon="el-icon-plus" circle @click="toggleLimits([['', ''], ['', '']], setting.key)"/>
        <p class="expl limit-expl">{{ $t('settings.setLimits') }}</p>
      </div>
    </div>
    <div v-if="valueIsAnArrayOfTuples">
      <el-form-item class="tuples-container">
        <div class="tuples-label-container">
          <span class="tuples-label">
            {{ $t('settings.unauthenticatedUsers') }}:
          </span>
        </div>
        <div class="tuples-content">
          <el-input-number
            :value="valueFirstTuple[0]"
            :controls="false"
            :placeholder="setting.placeholders[0]"
            class="setting-tuple-key-input"
            @input="parseTuples(
              $event, setting.key, 'first', 'firstTuple', [valueFirstTuple, valueSecondTuple]
          )"/>
          <span>:</span>
          <el-input-number
            :value="valueFirstTuple[1]"
            :controls="false"
            :placeholder="setting.placeholders[1]"
            class="setting-tuple-value-input"
            @input="parseTuples(
              $event, setting.key, 'second', 'firstTuple', [valueFirstTuple, valueSecondTuple]
          )"/>
        </div>
      </el-form-item>
      <el-form-item class="tuples-container">
        <div class="tuples-label-container">
          <span class="tuples-label">
            {{ $t('settings.authenticatedUsers') }}:
          </span>
        </div>
        <div class="tuples-content">
          <el-input-number
            :value="valueSecondTuple[0]"
            :controls="false"
            :placeholder="setting.placeholders[0]"
            class="setting-tuple-key-input"
            @input="parseTuples($event, setting.key, 'first', 'secondTuple', [valueFirstTuple, valueSecondTuple])"/>
          <span>:</span>
          <el-input-number
            :value="valueSecondTuple[1]"
            :controls="false"
            :placeholder="setting.placeholders[1]"
            class="setting-tuple-value-input"
            @input="parseTuples($event, setting.key, 'second', 'secondTuple', [valueFirstTuple, valueSecondTuple])"/>
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
  name: 'TupleOrPairOfTuplesInput',
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
    tupleValue() {
      return this.data[this.setting.key] ? this.data[this.setting.key] : ['', '']
    },
    valueIsAnArrayOfTuples() {
      return this.data[this.setting.key] && this.data[this.setting.key].every(value => Array.isArray(value))
    },
    valueFirstTuple() {
      return this.data[this.setting.key][0]
    },
    valueSecondTuple() {
      return this.data[this.setting.key][1]
    }
  },
  methods: {
    parseTuples(value, input, typeOfInput, typeOfLimit, currentValue) {
      let valueToSend
      if (typeOfLimit === 'oneLimit') {
        valueToSend = typeOfInput === 'first' ? [value, currentValue[1]] : [currentValue[0], value]
      } else if (typeOfLimit === 'firstTuple') {
        valueToSend = typeOfInput === 'first'
          ? [[value, currentValue[0][1]], [currentValue[1][0], currentValue[1][1]]]
          : [[currentValue[0][0], value], [currentValue[1][0], currentValue[1][1]]]
      } else if (typeOfLimit === 'secondTuple') {
        valueToSend = typeOfInput === 'first'
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
