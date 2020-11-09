<template>
  <div>
    <div class="report-account-container">
      <span class="report-row-key">{{ $t('reports.account') }}:</span>
      <div class="report-account">
        <router-link
          v-if="propertyExists(report.account, 'id')"
          :to="{ name: 'UsersShow', params: { id: report.account.id }}"
          class="router-link">
          <img
            v-if="propertyExists(report.account, 'avatar')"
            :src="report.account.avatar"
            alt="avatar"
            class="avatar-img">
          <span v-if="propertyExists(report.account, 'nickname')" class="report-account-name">{{ report.account.nickname }}</span>
          <span v-else class="report-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
        </router-link>
        <span v-else class="report-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
        <a v-if="propertyExists(report.account, 'url')" :href="report.account.url" target="_blank" class="account">
          {{ $t('userProfile.openAccountInInstance') }}
          <i class="el-icon-top-right"/>
        </a>
      </div>
    </div>
    <div v-if="report.content && report.content.length > 0">
      <el-divider class="divider"/>
      <span class="report-row-key">{{ $t('reports.content') }}:
        <span>{{ report.content }}</span>
      </span>
    </div>
    <el-divider class="divider"/>
    <div :style="showStatuses(report.statuses) ? '' : 'margin-bottom:15px'" class="report-account-container">
      <span class="report-row-key">{{ $t('reports.actor') }}:</span>
      <div class="report-account">
        <router-link
          v-if="propertyExists(report.actor, 'id')"
          :to="{ name: 'UsersShow', params: { id: report.actor.id }}"
          class="router-link">
          <img
            v-if="propertyExists(report.actor, 'avatar')"
            :src="report.actor.avatar"
            alt="avatar"
            class="avatar-img">
          <span v-if="propertyExists(report.actor, 'nickname')" class="report-account-name">{{ report.actor.nickname }}</span>
          <span v-else class="report-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
        </router-link>
        <span v-else class="report-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
        <a v-if="propertyExists(report.actor, 'url')" :href="report.actor.url" target="_blank" class="account">
          {{ $t('userProfile.openAccountInInstance') }}
          <i class="el-icon-top-right"/>
        </a>
      </div>
    </div>
    <div v-if="showStatuses(report.statuses)" class="reported-statuses">
      <el-collapse>
        <el-collapse-item :title="getStatusesTitle(report.statuses)">
          <div v-for="status in report.statuses" :key="status.id">
            <status :status="status" :account="status.account.nickname ? status.account : report.account" :show-checkbox="false" :page="currentPage"/> // check why it's currentPage here
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-collapse>
        <el-collapse-item :title="getNotesTitle(report.notes)">
          <note-card v-for="(note, index) in report.notes" :key="index" :note="note" :report="report"/>
        </el-collapse-item>
      </el-collapse>
      <div class="report-note-form">
        <el-input
          v-model="notes[report.id]"
          :placeholder="$t('reports.leaveNote')"
          type="textarea"
          rows="2"/>
        <div class="report-post-note">
          <el-button @click="handleNewNote(report.id)">{{ $t('reports.postNote') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteCard from './NoteCard'
import Status from '@/components/Status'

export default {
  name: 'ReportContent',
  components: { NoteCard, Status },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      notes: {}
    }
  },
  computed: {
    currentPage() {
      return this.$store.state.reports.currentPage
    }
  },
  methods: {
    getNotesTitle(notes = []) {
      return `Notes: ${notes.length} item(s)`
    },
    getStatusesTitle(statuses = []) {
      return `Reported statuses: ${statuses.length} item(s)`
    },
    handleNewNote(reportID) {
      this.$store.dispatch('CreateReportNote', { content: this.notes[reportID], reportID })
      this.notes[reportID] = ''
    },
    propertyExists(account, property, _secondProperty) {
      if (_secondProperty) {
        return account[property] && account[_secondProperty]
      }
      return account[property]
    },
    showStatuses(statuses = []) {
      return statuses.length > 0
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
  .account {
    line-height: 26px;
    font-size: 13px;
    color: #606266;
  }
  .account:hover {
    text-decoration: underline;
  }
  .avatar-img {
    vertical-align: bottom;
    width: 15px;
    height: 15px;
  }
  .deactivated {
    color: gray;
  }
  .divider {
    margin: 15px 0;
  }
  .report-account {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-grow: 2;
  }
  .report-account-container {
    display: flex;
    align-items: baseline;
  }
  .report-account-name {
    font-size: 15px;
    font-weight: 500;
  }
  .report-note-form {
    margin: 15px 0 0 0;
  }
  .report-post-note {
    margin: 5px 0 0 0;
    text-align: right;
  }
  .report-row-key {
    font-size: 14px;
    font-weight: 500;
    padding-right: 5px;
  }
  .reported-statuses {
    margin-top: 15px;
  }
  .router-link {
    text-decoration: none;
  }
</style>
