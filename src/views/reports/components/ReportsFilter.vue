<template>
  <el-select
    v-model="filter"
    :placeholder="$t('reportsFilter.inputPlaceholder')"
    clearable
    class="select-field"
    value-key="value"
    @change="toggleFilters">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">{{ item.label }}</el-option>
  </el-select>
</template>

<script>
import i18n from '@/lang'

export default {
  data() {
    return {
      filter: 'open',
      options: [
        {
          value: 'open',
          label: i18n.t('reportsFilter.open')
        },
        {
          value: 'closed',
          label: i18n.t('reportsFilter.closed')
        },
        {
          value: 'resolved',
          label: i18n.t('reportsFilter.resolved')
        }
      ]
    }
  },
  created() {
    this.$store.dispatch('SetReportsFilter', this.$data.filter)
  },
  methods: {
    toggleFilters() {
      this.$store.dispatch('SetReportsFilter', this.$data.filter)
      this.$store.dispatch('ClearFetchedReports')
      this.$store.dispatch('FetchReports', 1)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.select-field {
  width: 350px;
}

@media only screen and (max-width:480px) {
  .select-field {
    width: 100%;
    margin-bottom: 5px;
  }
}

@media only screen and (max-width:801px) and (min-width: 481px) {
  .select-field {
    width: 50%;
  }
}
</style>
