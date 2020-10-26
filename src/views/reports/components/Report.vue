<template>
  <div>
    <el-timeline class="reports-timeline">
      <el-timeline-item
        v-for="report in reports"
        :timestamp="parseTimestamp(report.created_at)"
        :key="report.id"
        placement="top"
        class="timeline-item-container">
        <el-card class="report">
          <div class="report-header-container">
            <div class="title-container">
              <h3 v-if="propertyExists(report.account, 'nickname')" class="report-title">{{ $t('reports.reportOn') }} {{ report.account.nickname }}</h3>
              <h3 v-else class="report-title">{{ $t('reports.report') }}</h3>
              <h5 v-if="propertyExists(report.account, 'id')" class="id">{{ $t('reports.id') }}: {{ report.id }}</h5>
            </div>
            <div>
              <el-tag :type="getStateType(report.state)" size="large" class="report-tag">{{ capitalizeFirstLetter(report.state) }}</el-tag>
              <el-dropdown trigger="click">
                <el-button plain size="small" icon="el-icon-edit" class="report-actions-button">{{ $t('reports.changeState') }}<i class="el-icon-arrow-down el-icon--right"/></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="report.state !== 'resolved'" @click.native="changeReportState('resolved', report.id)">{{ $t('reports.resolve') }}</el-dropdown-item>
                  <el-dropdown-item v-if="report.state !== 'open'" @click.native="changeReportState('open', report.id)">{{ $t('reports.reopen') }}</el-dropdown-item>
                  <el-dropdown-item v-if="report.state !== 'closed'" @click.native="changeReportState('closed', report.id)">{{ $t('reports.close') }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <moderate-user-dropdown v-if="propertyExists(report.account, 'nickname')" :account="report.account" :report-id="report.id" />
            </div>
          </div>
          <el-divider class="divider"/>
          <report-content :report="report"/>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div v-if="!loading" class="reports-pagination">
      <el-pagination
        :total="totalReportsCount"
        :current-page="currentPage"
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ModerateUserDropdown from './ModerateUserDropdown'
import ReportContent from './ReportContent'

export default {
  name: 'Report',
  components: { ModerateUserDropdown, ReportContent },
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  computed: {
    loading() {
      return this.$store.state.reports.loading
    },
    pageSize() {
      return this.$store.state.reports.pageSize
    },
    totalReportsCount() {
      return this.$store.state.reports.totalReportsCount
    },
    currentPage() {
      return this.$store.state.reports.currentPage
    }
  },
  methods: {
    changeReportState(state, id) {
      this.$store.dispatch('ChangeReportState', [{ state, id }])
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    getStateType(state) {
      switch (state) {
        case 'closed':
          return 'info'
        case 'resolved':
          return 'success'
        default:
          return 'primary'
      }
    },
    handlePageChange(page) {
      this.$store.dispatch('FetchReports', page)
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('L HH:mm')
    },
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
  h4 {
    margin: 0;
    height: 17px;
  }
  .divider {
    margin: 15px 0;
  }
  .el-card__body {
    padding: 17px;
  }
  .el-card__header {
    background-color: #FAFAFA;
    padding: 10px 20px;
  }
  .el-collapse {
    border-bottom: none;
  }
  .el-collapse-item__header {
    height: 46px;
    font-size: 14px;
  }
  .el-collapse-item__content {
    padding-bottom: 7px;
  }
  .el-icon-arrow-right {
    margin-right: 6px;
  }
  .id {
    color: gray;
    margin-top: 6px;
  }
  .line {
    width: 100%;
    height: 0;
    border: 0.5px solid #EBEEF5;
    margin: 15px 0 15px;
  }
  .new-note {
    p {
      font-size: 14px;
      font-weight: 500;
      height: 17px;
      margin: 13px 0 7px;
    }
  }
  .note {
    box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
    margin-bottom: 10px;
  }
  .no-notes {
    font-style: italic;
    color: gray;
  }
  .report {
    .report-header-container {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      height: 40px;
    }
  }
  .report-title {
    margin: 0;
  }
  .reports-pagination {
    margin: 25px 0;
    text-align: center;
  }
  .reports-timeline {
    margin: 30px 45px 45px 19px;
    padding: 0px;
  }
  .submit-button {
    display: block;
    margin: 7px 0 17px auto;
  }
  .timestamp {
    margin: 0;
    font-style: italic;
    color: gray;
  }

  @media only screen and (max-width:480px) {
    .report {
      .report-header-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        height: auto;
      }
      .id {
        margin: 6px 0 0 0;
      }
      .report-actions-button {
        margin: 3px 0 6px;
      }
      .report-tag {
        margin: 3px 0 6px;
      }
      .title-container {
        margin-bottom: 7px;
      }
    }
    .reports-timeline {
      margin: 20px 10px;
      .el-timeline-item__wrapper {
        padding-left: 20px;
      }
    }
  }
</style>
