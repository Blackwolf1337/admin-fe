<template>
  <span>
    <router-link
      v-if="propertyExists(actor, 'id')"
      :to="{ name: 'UsersShow', params: { id: actor.id }}"
      class="router-link">
      <span v-if="propertyExists(actor, 'nickname')" style="font-weight: 600">
        @{{ actor.nickname }}
      </span>
    </router-link>
    <span>{{ logEntryMessage }}</span>
  </span>
</template>

<script>

export default {
  name: 'LogEntryMessage',
  props: {
    actor: {
      type: Object,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    logEntryMessage() {
      return this.message.split(this.actor.nickname)[1]
    }
  },
  methods: {
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
 .router-link {
    text-decoration: none;
  }
</style>
