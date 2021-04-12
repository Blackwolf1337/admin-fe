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
    <span v-if="subject.type === 'report' && propertyExists(subject, 'id')">
      {{ logEntryMessageWithoutId[0] }}
      <router-link
        :to="{ name: 'ReportsShow', params: { id: subject.id }}"
        class="router-link">
        <span style="font-weight: 600">#{{ subject.id }}</span>
      </router-link>
      {{ logEntryMessageWithoutId[1] }}
    </span>
    <span v-else>{{ logEntryMessage }}</span>
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
    },
    subject: {
      type: [Object, Array],
      required: false,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    logEntryMessage() {
      return this.actor.nickname ? this.message.split(this.actor.nickname)[1] : this.message
    },
    logEntryMessageWithoutId() {
      return this.logEntryMessage.split(`#${this.subject.id}`)
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
