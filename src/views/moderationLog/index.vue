<template>
  <div v-if="!loading" class="moderation-log-container">
    <div class="moderation-log-header-container">
      <h1>{{ $t('moderationLog.moderationLog') }}</h1>
      <reboot-button/>
    </div>
    <div class="moderation-log-nav-container">
      <el-select
        v-model="user"
        class="moderation-log-user-select"
        clearable
        placeholder="Filter by admin/moderator"
        @change="fetchLogWithFilters">
        <el-option-group
          v-for="group in users"
          :key="group.label"
          :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"/>
        </el-option-group>
      </el-select>
      <el-input
        v-model="search"
        placeholder="Search logs"
        clearable
        class="moderation-log-search"
        @input="handleDebounceSearchInput"/>
    </div>
    <el-date-picker
      :default-time="['00:00:00', '23:59:59']"
      v-model="dateRange"
      type="daterange"
      start-placeholder="Start date"
      end-placeholder="End date"
      unlink-panels
      class="moderation-log-date-panel"
      @change="fetchLogWithFilters" />
    <el-timeline>
      <el-timeline-item
        v-for="(logEntry, index) in log"
        :key="index"
        :timestamp="normalizeTimestamp(logEntry.time)">
        <component :is="processedMessage(logEntry)"/>
      </el-timeline-item>
    </el-timeline>
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :hide-on-single-page="true"
        :page-size="50"
        :total="total"
        :small="isMobile"
        layout="prev, pager, next"
        @current-change="fetchLogWithFilters" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import debounce from 'lodash.debounce'
import RebootButton from '@/components/RebootButton'
import ReportLink from './ReportLink'
import UserLink from './UserLink'
import Vue from 'vue'
Vue.component('user-link', UserLink)
Vue.component('report-link', ReportLink)

export default {
  components: { RebootButton },
  data() {
    return {
      dateRange: '',
      search: '',
      user: '',
      currentPage: 1
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    loading() {
      return this.$store.state.moderationLog.logLoading &&
             this.$store.state.moderationLog.adminsLoading
    },
    log() {
      return this.$store.state.moderationLog.fetchedLog
    },
    total() {
      return this.$store.state.moderationLog.logItemsCount
    },
    users() {
      return [
        {
          label: 'Admins',
          options: this.$store.state.moderationLog.admins.users
        },
        {
          label: 'Moderators',
          options: this.$store.state.moderationLog.moderators.users
        }
      ]
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.fetchLogWithFilters()
    }, 500)
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchModerationLog')
    this.$store.dispatch('FetchAdmins')
  },
  methods: {
    fetchLogWithFilters() {
      const filters = _.omitBy({
        start_date: this.dateRange ? this.dateRange[0].toISOString() : null,
        end_date: this.dateRange ? this.dateRange[1].toISOString() : null,
        user_id: this.user,
        search: this.search,
        page: this.currentPage
      }, val => val === '' || val === null)

      this.$store.dispatch('FetchModerationLog', filters)
    },
    normalizeTimestamp(timestamp) {
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm')
    },
    processedMessage(logEntry) {
      const html = [...logEntry.message.matchAll(/\@(?<nickname>([\w-]+))/g)].map(res => res.groups.nickname)
        .reduce((acc, nickname) => {
          return acc.replace(`@${nickname}`, `<user-link actor="${nickname}"/>`)
        }, logEntry.message)
      if (this.propertyExists(logEntry.data, 'subject') && logEntry.data.subject.type === 'report') {
        const updatedHtml = [...html.matchAll(/\#(?<reportId>([\w]+))/g)].map(res => res.groups.reportId)
          .reduce((acc, id) => {
            return acc.replace(`#${id}`, `<report-link id="${id}"/>`)
          }, html)
        return {
          template: '<div>' + updatedHtml + '</div>'
        }
      }
      return {
        template: '<div>' + html + '</div>'
      }
    },
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.moderation-log-container {
  margin: 0 15px;
}
h1 {
  margin: 0;
}
.el-timeline {
  margin: 25px 45px 0 0;
  padding: 0px;
}
.moderation-log-date-panel {
  width: 350px;
}
.moderation-log-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 15px 0;
}
.moderation-log-nav-container {
  display: flex;
  justify-content: space-between;
}
.moderation-log-search {
  width: 350px;
}
.moderation-log-user-select {
  margin: 0 0 20px;
  width: 350px;
}
.reboot-button {
  padding: 10px;
  margin: 0;
  width: 145px;
}
.router-link {
  text-decoration: none;
}
.search-container {
  text-align: right;
}
.pagination {
  text-align: center;
}

@media only screen and (max-width:480px) {
  h1 {
    font-size: 24px;
  }
  .moderation-log-date-panel {
    width: 100%;
  }
  .moderation-log-user-select {
    margin: 0 0 10px;
    width: 55%;
  }
  .moderation-log-search {
    width: 40%;
  }
}

@media only screen and (max-width:801px) and (min-width: 481px) {
  .moderation-log-date-panel {
    width: 55%;
  }
  .moderation-log-user-select {
    margin: 0 0 10px;
    width: 55%;
  }
  .moderation-log-search {
    width: 40%;
  }
}
</style>
