<template>
  <div class="reports-container">
    <div class="reports-header-container">
      <h1>
        {{ $t('reports.reports') }}
        <span class="report-count">({{ normalizedReportsCount }})</span>
      </h1>
      <reboot-button/>
    </div>
    <div class="reports-filter-container">
      <reports-filter/>
    </div>
    <div class="block">
      <report v-loading="loading" :reports="reports"/>
      <div v-if="reports.length === 0" class="no-reports-message">
        <p>There are no reports to display</p>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import Report from './components/Report'
import ReportsFilter from './components/ReportsFilter'
import RebootButton from '@/components/RebootButton'

export default {
  components: { RebootButton, Report, ReportsFilter },
  computed: {
    loading() {
      return this.$store.state.reports.loading
    },
    normalizedReportsCount() {
      return numeral(this.$store.state.reports.totalReportsCount).format('0a')
    },
    reports() {
      return this.$store.state.reports.fetchedReports
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchTagPolicySetting')
    this.$store.dispatch('FetchReports', 1)
    this.$store.dispatch('ListTags')
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.reports-container {
  .reboot-button {
    padding: 10px;
    margin: 0;
    width: 145px;
  }
  .reports-filter-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 45px 22px 15px;
    padding-bottom: 0
  }
  .reports-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 15px;
  }
  h1 {
    margin: 0;
  }
  .no-reports-message {
    color: gray;
    margin-left: 19px
  }
  .report-count {
    color: gray;
    font-size: 28px;
  }
}

@media only screen and (max-width:480px) {
  .reports-container {
    h1 {
      margin: 7px 10px 15px 10px;
    }
    .reboot-button {
      margin: 0 0 5px 10px;
      width: 145px;
    }
    .report-count {
      font-size: 22px;
    }
    .reports-filter-container {
      margin: 0 10px;
    }
  }
}
</style>
