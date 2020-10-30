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
      <el-dropdown-item
        v-if="tagPolicyEnabled"
        :divided="true"
        :class="{ 'active-tag': tags.includes('mrf_tag:media-force-nsfw') }"
        @click.native="toggleTag(account, 'mrf_tag:media-force-nsfw')">
        {{ $t('users.forceNsfw') }}
        <i v-if="tags.includes('mrf_tag:media-force-nsfw')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="tagPolicyEnabled"
        :class="{ 'active-tag': tags.includes('mrf_tag:media-strip') }"
        @click.native="toggleTag(account, 'mrf_tag:media-strip')">
        {{ $t('users.stripMedia') }}
        <i v-if="tags.includes('mrf_tag:media-strip')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="tagPolicyEnabled"
        :class="{ 'active-tag': tags.includes('mrf_tag:force-unlisted') }"
        @click.native="toggleTag(account, 'mrf_tag:force-unlisted')">
        {{ $t('users.forceUnlisted') }}
        <i v-if="tags.includes('mrf_tag:force-unlisted')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="tagPolicyEnabled"
        :class="{ 'active-tag': tags.includes('mrf_tag:sandbox') }"
        @click.native="toggleTag(account, 'mrf_tag:sandbox')">
        {{ $t('users.sandbox') }}
        <i v-if="tags.includes('mrf_tag:sandbox')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="tagPolicyEnabled && account.local"
        :class="{ 'active-tag': tags.includes('mrf_tag:disable-remote-subscription') }"
        @click.native="toggleTag(account, 'mrf_tag:disable-remote-subscription')">
        {{ $t('users.disableRemoteSubscription') }}
        <i v-if="tags.includes('mrf_tag:disable-remote-subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="tagPolicyEnabled && account.local"
        :class="{ 'active-tag': tags.includes('mrf_tag:disable-any-subscription') }"
        @click.native="toggleTag(account, 'mrf_tag:disable-any-subscription')">
        {{ $t('users.disableAnySubscription') }}
        <i v-if="tags.includes('mrf_tag:disable-any-subscription')" class="el-icon-check"/>
      </el-dropdown-item>
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
    tagPolicyEnabled() {
      return this.$store.state.users.mrfPolicies.includes('Pleroma.Web.ActivityPub.MRF.TagPolicy')
    },
    tags() {
      return this.account.tags || []
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
