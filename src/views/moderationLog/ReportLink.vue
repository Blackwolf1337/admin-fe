<template>
  <router-link
    :to="{ name: 'ReportsShow', params: { id }}"
    class="router-link">
    <span style="font-weight: 600">#{{ id }}</span>
  </router-link>
</template>

<script>

export default {
  name: 'UserLink',
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>
