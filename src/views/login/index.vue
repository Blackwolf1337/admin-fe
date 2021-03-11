<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user"/>
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <div class="omit-host-note">{{ $t('login.omitHostname') }}</div>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-key"/>
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" class="login-button" type="primary" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
      <!-- Note: PleromaFE login feature relies on admin scope presence in PleromaFE token (older versions of PleromaFE don't support it) -->
      <el-button v-if="pleromaFEToken" :loading="loadingPleromaFE" class="login-button" type="primary" @click.native.prevent="handlePleromaFELogin">
        {{ $t('login.logInViaPleromaFE') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import SvgIcon from '@/components/element-ui/SvgIcon'
import localforage from 'localforage'
import _ from 'lodash'
import i18n from '@/lang'
import { authenticateWithPleromaFE } from '@/services/pleromaAuth'

export default {
  name: 'Login',
  components: { 'svg-icon': SvgIcon },
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      passwordType: 'password',
      loading: false,
      loadingPleromaFE: false,
      showDialog: false,
      redirect: undefined,
      pleromaFEToken: false,
      pleromaFEStateKey: 'vuex-lz',
      pleromaFEState: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  async mounted() {
    const pleromaFEState = await localforage.getItem(this.pleromaFEStateKey)
    this.pleromaFEState = pleromaFEState

    if (_.get(pleromaFEState, 'oauth.userToken') === undefined) {
      return
    }

    this.pleromaFEToken = true
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.loading = true
      const loginData = this.getLoginData()
      this.$store.dispatch('LoginByUsername', loginData).then(() => {
        this.loading = false
        this.$router.push({ path: this.redirect || '/users/index' })
      }).catch(() => {
        this.loading = false
      })
    },
    async handlePleromaFELogin() {
      this.loadingPleromaFE = true
      try {
        await authenticateWithPleromaFE(this.$store)
      } catch (error) {
        this.loadingPleromaFE = false
        this.$message.error(i18n.t('login.pleromaFELoginFailed'))
      }

      this.loadingPleromaFE = false

      this.$message.success(i18n.t('login.pleromaFELoginSucceed'))
      this.$router.push({ path: this.redirect || '/users/index' })
    },
    getLoginData() {
      const [username, authHost] = this.loginForm.username.split('@')

      return {
        username: username.trim(),
        authHost: authHost ? authHost.trim() : window.location.host,
        password: this.loginForm.password
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .login-button {
      width: 100%;
      margin: 0 0 10px 0;
    }
    .omit-host-note {
      color: #596f8c;
      font-size: 0.8em;
      font-style: italic;
      margin: -20px 0 15px 0;
      padding: 3px 0 0 15px;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size:18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
</style>
