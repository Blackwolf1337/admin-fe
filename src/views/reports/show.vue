<template>
  <div v-if="!loading">
    <header class="report-page-header-container">
      <div class="report-page-header">
        <div v-if="propertyExists(report.account, 'nickname')" class="avatar-name-container">
          <h1 >{{ $t('reports.reportOn') }}</h1>
          <el-avatar v-if="propertyExists(report.account, 'avatar')" :src="report.account.avatar" size="large" class="report-page-avatar"/>
          <h1>{{ report.account.nickname }}</h1>
          <a v-if="propertyExists(report.account, 'url')" :href="report.account.url" target="_blank">
            <i :title="$t('userProfile.openAccountInInstance')" class="el-icon-top-right"/>
          </a>
        </div>
        <h1 v-else>{{ $t('reports.report') }}</h1>
        <h4 v-if="propertyExists(report.account, 'id')" class="id">{{ $t('reports.id') }}: {{ report.id }}</h4>
      </div>
      <reboot-button/>
    </header>
    <el-card class="report">
      <report-content :report="report"/>
    </el-card>
  </div>
</template>

<script>
import RebootButton from '@/components/RebootButton'
import ReportContent from './components/ReportContent'

export default {
  name: 'ReportsShow',
  components: { RebootButton, ReportContent },
  computed: {
    loading() {
      return this.$store.state.reports.loading
    },
    report() {
      return this.$store.state.reports.singleReport
    }
  },
  mounted: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchSingleReport', this.$route.params.id)
  },
  methods: {
    propertyExists(account, property, _secondProperty) {
      if (_secondProperty) {
        return account[property] && account[_secondProperty]
      }
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.report-page-header {
  display: flex;
  flex-direction: column;
  margin: 22px 15px 22px 20px;
  padding: 0;
  h1 {
    display: inline;
    margin: 0;
  }
  h4 {
    margin-top: 10px;
  }
  .avatar-name-container {
    display: flex;
    align-items: center;
    .el-icon-top-right {
      font-size: 2em;
      line-height: 36px;
      color: #606266;
    }
  }
  .id {
    color: gray;
  }
  .report-page-avatar {
    margin: 0 7px 0 12px;
  }
}
.report-page-header-container {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
