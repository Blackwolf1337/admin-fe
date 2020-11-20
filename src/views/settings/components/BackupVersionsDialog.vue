<template>
  <el-dialog
    v-loading="loading"
    :visible="dialogOpen"
    :title="$t('settings.backupVersions')"
    custom-class="backup-versions-dialog"
    @opened="listVersions"
    @close="closeDialog">
    <el-table :data="versions" max-height="400">
      <el-table-column property="date" label="Date" width="170"/>
      <el-table-column property="id" label="ID" width="150"/>
      <el-table-column property="currentVersion" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.currentVersion">{{ $t('settings.currentVersion') }}</span>
          <el-button v-else plain @click="restoreSettings(scope.row.id)">{{ $t('settings.restore') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import moment from 'moment'

export default {
  name: 'BackupVersionsDialog',
  props: {
    backupVersionsDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogOpen() {
      return this.backupVersionsDialogOpen
    },
    loading() {
      return this.$store.state.settings.versionsLoading
    },
    versions() {
      return this.$store.state.settings.backupVersions.map(version => {
        return {
          date: moment(version.inserted_at).format('YYYY-MM-DD HH:mm'),
          id: version.id,
          currentVersion: version.current }
      })
    }
  },
  mounted: function() {
    this.$store.dispatch('ListRollbackVersions')
  },
  methods: {
    closeDialog() {
      this.$emit('close-backup-versions-dialog')
    },
    async listVersions() {
      await this.$store.dispatch('ListRollbackVersions')
    },
    restoreSettings(id) {
      this.$store.dispatch('RestoreSettings', id)
      this.$emit('close-backup-versions-dialog')
      this.$store.dispatch('ListRollbackVersions')
    }
  }
}
</script>
