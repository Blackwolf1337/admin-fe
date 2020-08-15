<template>
  <el-dropdown trigger="click">
    <el-button :disabled="!account.id" plain size="small" icon="el-icon-files">{{ $t('reports.moderateUser') }}
      <i class="el-icon-arrow-down el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-if="showDeactivatedButton(account)"
        @click.native="handleDeactivation(account)">
        {{ account.deactivated ? $t('users.activateAccount') : $t('users.deactivateAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="showDeactivatedButton(account.id)"
        @click.native="handleDeletion(account.id)">
        {{ $t('users.deleteAccount') }}
      </el-dropdown-item>
      <el-dropdown-item
        :divided="true"
        :class="{ 'active-tag': tags.includes('mrf_tag:media-force-nsfw') }"
        @click.native="toggleTag(account, 'mrf_tag:media-force-nsfw')">
        {{ $t('users.forceNsfw') }}
        <i v-if="tags.includes('mrf_tag:media-force-nsfw')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': tags.includes('mrf_tag:media-strip') }"
        @click.native="toggleTag(account, 'mrf_tag:media-strip')">
        {{ $t('users.stripMedia') }}
        <i v-if="tags.includes('mrf_tag:media-strip')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': tags.includes('mrf_tag:force-unlisted') }"
        @click.native="toggleTag(account, 'mrf_tag:force-unlisted')">
        {{ $t('users.forceUnlisted') }}
        <i v-if="tags.includes('mrf_tag:force-unlisted')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        :class="{ 'active-tag': tags.includes('mrf_tag:sandbox') }"
        @click.native="toggleTag(account, 'mrf_tag:sandbox')">
        {{ $t('users.sandbox') }}
        <i v-if="tags.includes('mrf_tag:sandbox')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="account.local"
        :class="{ 'active-tag': tags.includes('mrf_tag:disable-remote-subscription') }"
        @click.native="toggleTag(account, 'mrf_tag:disable-remote-subscription')">
        {{ $t('users.disableRemoteSubscription') }}
        <i v-if="tags.includes('mrf_tag:disable-remote-subscription')" class="el-icon-check"/>
      </el-dropdown-item>
      <el-dropdown-item
        v-if="account.local"
        :class="{ 'active-tag': tags.includes('mrf_tag:disable-any-subscription') }"
        @click.native="toggleTag(account, 'mrf_tag:disable-any-subscription')">
        {{ $t('users.disableAnySubscription') }}
        <i v-if="tags.includes('mrf_tag:disable-any-subscription')" class="el-icon-check"/>
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
    }
  },
  computed: {
    tags() {
      return this.account.tags || []
    }
  },
  methods: {
    handleDeactivation({ nickname }) {
      this.$store.dispatch('ToggleUserActivation', nickname)
    },
    handleDeletion(user) {
      this.$store.dispatch('DeleteUser', user)
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    },
    toggleTag(user, tag) {
      user.tags.includes(tag)
        ? this.$store.dispatch('RemoveTag', { users: [user], tag })
        : this.$store.dispatch('AddTag', { users: [user], tag })
    }
  }
}
</script>
