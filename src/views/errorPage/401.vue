<template>
  <div class="error-page-container">
    <div class="error-page">
      <i class="el-icon-warning"/>
      <h1 class="error-title">{{ $t('errLog.error401') }}</h1>
      <h2 class="error-title">{{ $t('errLog.unauth') }}</h2>
      <div class="buttons-group">
        <el-button @click="back">{{ $t('errLog.back') }}</el-button>
        <el-button type="primary" @click="login">{{ $t('errLog.login') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page401',
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/login' })
      } else {
        this.$router.go(-1)
      }
    },
    login() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .error-page-container {
    min-height: 100%;
    width: 100%;
    background-color: #2d3a4b;
    overflow: hidden;
    .buttons-group {
      margin-top: 4em;
    }
    .el-icon-warning {
      font-size: 4.2em;
      color: #eee;
      margin: 0 auto;
    }
    .error-page {
      width: 45rem;
      max-width: 100%;
      margin: 16rem auto;
      text-align: center;
    }
    .error-title {
      color: #eee;
    }
  }
</style>
