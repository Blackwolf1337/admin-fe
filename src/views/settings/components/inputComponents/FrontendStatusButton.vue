<template>
  <span>
    <el-button
      v-if="buttonLoading"
      :loading="true"
      disabled
      type="text"
      size="small">
      {{ $t('settings.inProcess') }}
    </el-button>
    <el-button
      v-else-if="frontend.installed"
      disabled
      type="text"
      size="small">
      {{ $t('settings.installed') }}
    </el-button>
    <el-button
      v-else
      type="text"
      size="small"
      @click="installFrontend(frontend)">
      {{ $t('settings.install') }}
    </el-button>
  </span>
</template>

<script>
import i18n from '@/lang'

export default {
  name: 'FrontendStatusButton',
  props: {
    frontend: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      buttonLoading: false
    }
  },
  methods: {
    async installFrontend({ name }) {
      this.buttonLoading = true
      try {
        await this.$store.dispatch('InstallFrontend', { name })
      } catch (e) {
        this.buttonLoading = false
        return
      }
      this.buttonLoading = false
      this.$message({
        message: i18n.t('settings.frontendSuccess'),
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
