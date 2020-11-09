<template>
  <el-dropdown :hide-on-click="false" trigger="click">
    <el-button :disabled="!account.id" :size="renderedFrom === 'showPage' ? 'medium' : 'small'" plain icon="el-icon-files">
      {{ $t('reports.moderateUser') }}
      <i class="el-icon-arrow-down el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown" class="moderate-user-dropdown">
      <el-dropdown-item
        v-if="showDeactivatedButton(account)"
        @click.native="handleDeactivation(account)">
        {{ account.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(account.id)"
        @click.native="handleDeletion(account)">
        {{ $t('users.deleteAccount') }}
      </el-dropdown-item>
      <el-dropdown-item divided/>
      <div v-if="tagPolicyEnabled">
        <el-dropdown-item
          v-for="option in tags"
          :key="option.tag"
          :class="{ 'active-tag': account.tags.includes(option.tag) }"
          @click.native="toggleTag(account, option.tag)">
          {{ option.label }}
          <i v-if="account.tags.includes(option.tag)" class="el-icon-check"/>
        </el-dropdown-item>
      </div>
      <el-dropdown-item
        v-if="!tagPolicyEnabled"
        divided
        class="no-hover"
        @click.native="enableTagPolicy">
        {{ $t('users.enableTagPolicy') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'ModerateUserDropdown',
  props: {
    account: {
      type: Object,
      required: true
    },
    reportId: {
      type: String,
      required: true
    },
    renderedFrom: {
      type: String,
      required: true
    }
  },
  computed: {
    mapTags() {
      return {
        'mrf_tag:media-force-nsfw': 'Force posts to be NSFW',
        'mrf_tag:media-strip': 'Force posts to not have media',
        'mrf_tag:force-unlisted': 'Force posts to be unlisted',
        'mrf_tag:sandbox': 'Force posts to be followers-only',
        'mrf_tag:verified': 'Verified',
        'mrf_tag:disable-remote-subscription': 'Disallow following user from remote instances',
        'mrf_tag:disable-any-subscription': 'Disallow following user at all'
      }
    },
    tagPolicyEnabled() {
      return this.$store.state.users.mrfPolicies.includes('Pleroma.Web.ActivityPub.MRF.TagPolicy')
    },
    tags() {
      return this.$store.state.users.tags.map(tag => {
        if (this.mapTags[tag]) {
          return { tag, label: this.mapTags[tag] }
        } else {
          return { tag, label: tag.charAt(0).toUpperCase() + tag.slice(1) }
        }
      }, {})
    }
  },
  methods: {
    enableTagPolicy() {
      this.$confirm(
        this.$t('users.confirmEnablingTagPolicy'),
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('users.enableTagPolicySuccessMessage')
        })
        this.$store.dispatch('EnableTagPolicy')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
    },
    handleDeactivation(user) {
      if (this.renderedFrom === 'showPage') {
        user.deactivated
          ? this.$store.dispatch('ActivateUserFromReportShow', user)
          : this.$store.dispatch('DeactivateUserFromReportShow', user)
      } else if (this.renderedFrom === 'reportsPage') {
        user.deactivated
          ? this.$store.dispatch('ActivateUserFromReports', { user, reportId: this.reportId })
          : this.$store.dispatch('DeactivateUserFromReports', { user, reportId: this.reportId })
      }
    },
    handleDeletion(user) {
      this.$confirm(
        this.$t('users.deleteUserConfirmation'),
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        this.$store.dispatch('DeleteUserFromReports', { user, reportId: this.reportId })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleTag(user, tag) {
      if (this.renderedFrom === 'showPage') {
        user.tags.includes(tag)
          ? this.$store.dispatch('RemoveTagFromReportsFromReportShow', { user, tag })
          : this.$store.dispatch('AddTagFromReportsFromReportShow', { user, tag })
      } else if (this.renderedFrom === 'reportsPage') {
        user.tags.includes(tag)
          ? this.$store.dispatch('RemoveTagFromReports', { user, tag, reportId: this.reportId })
          : this.$store.dispatch('AddTagFromReports', { user, tag, reportId: this.reportId })
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.moderate-user-dropdown {
  width: 350px;
}
</style>
