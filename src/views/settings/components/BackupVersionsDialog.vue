<template>
  <el-dialog
    v-loading="loading"
    :visible="dialogOpen"
    :title="$t('settings.backupVersions')"
    custom-class="backup-versions-dialog"
    @close="closeDialog">
    <el-table :data="versions">
      <el-table-column property="date" label="Date" width="150"/>
      <el-table-column property="id" label="ID" width="200"/>
      <el-table-column property="currentVersion">
        <template slot-scope="scope">
          <span v-if="scope.row.currentVersion">{{ $t('settings.currentVersion') }}</span>
          <el-button v-else plain>{{ $t('settings.restore') }}</el-button>
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
      return this.$store.state.settings.loading
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
    }
  }
}
</script>
