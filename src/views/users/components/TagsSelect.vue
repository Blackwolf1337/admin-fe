<template>
  <div>
    <el-select
      v-if="tagPolicyEnabled"
      :value="tags"
      multiple
      filterable
      allow-create
      placeholder="Add Tags"
      size="small"
      class="select-tags"
      @change="toggleTag($event, user)">
      <el-option-group :label="$t('users.defaultTags')">
        <el-option
          v-for="option in defaultTags(user.local)"
          :value="option.tag"
          :key="option.tag"
          :label="option.label"
          :class="{ 'active-tag': user.tags.includes(option.tag) }">
          {{ option.label }}
        </el-option>
      </el-option-group>
      <el-option-group
        v-if="customTags().length > 0"
        :label="$t('users.customTags')">
        <el-option
          v-for="option in customTags()"
          :value="option.tag"
          :key="option.tag"
          :label="option.label"
          :class="{ 'active-tag': user.tags.includes(option.tag) }"
          class="capitalize">
          {{ option.label }}
        </el-option>
      </el-option-group>
    </el-select>
    <el-button v-if="!tagPolicyEnabled" type="text" @click.native.stop="enableTagPolicy">
      {{ $t('users.enableTagPolicy') }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'TagsSelect',
  props: {
    tags: {
      type: Array,
      default: function() {
        return {}
      }
    },
    user: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    mapRemoteTags() {
      return {
        'mrf_tag:media-force-nsfw': 'NSFW',
        'mrf_tag:media-strip': 'Strip Media',
        'mrf_tag:force-unlisted': 'Unlisted',
        'mrf_tag:sandbox': 'Sandbox',
        'mrf_tag:verified': 'Verified'
      }
    },
    mapTags() {
      return {
        'mrf_tag:media-force-nsfw': 'NSFW',
        'mrf_tag:media-strip': 'Strip Media',
        'mrf_tag:force-unlisted': 'Unlisted',
        'mrf_tag:sandbox': 'Sandbox',
        'mrf_tag:verified': 'Verified',
        'mrf_tag:disable-remote-subscription': 'Disable remote subscription',
        'mrf_tag:disable-any-subscription': 'Disable any subscription'
      }
    },
    tagPolicyEnabled() {
      return this.$store.state.users.mrfPolicies.includes('Pleroma.Web.ActivityPub.MRF.TagPolicy')
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
    customTags() {
      return this.$store.state.users.tags
        .filter(tag => !Object.keys(this.mapTags).includes(tag))
        .map(tag => {
          return { tag, label: tag.charAt(0).toUpperCase() + tag.slice(1) }
        })
    },
    defaultTags(userLocal) {
      const tagsByType = userLocal ? Object.keys(this.mapTags) : Object.keys(this.mapRemoteTags)
      return tagsByType.filter(tag => this.$store.state.users.tags.includes(tag))
        .map(tag => {
          if (userLocal) {
            return { tag, label: this.mapTags[tag] }
          } else {
            return { tag, label: this.mapRemoteTags[tag] }
          }
        }, {})
    },
    toggleTag(tags, user) {
      if (tags.length > user.tags.length) {
        const tag = tags.filter(tag => !user.tags.includes(tag))[0]
        const updatedUser = { ...user, tags: [...user.tags, tag] }
        this.$store.dispatch('AddTag', { users: [user], tag })
        this.$store.dispatch('UpdateUsersOnTagToggle', [updatedUser])
      } else {
        const tag = user.tags.filter(tag => !tags.includes(tag))[0]
        const updatedUser = { ...user, tags: user.tags.filter(userTag => userTag !== tag) }
        this.$store.dispatch('RemoveTag', { users: [user], tag })
        this.$store.dispatch('UpdateUsersOnTagToggle', [updatedUser])
      }
    }
  }
}
</script>
