<template>
  <div class="login-container">
    <el-card class="login-form-card">
      <div class="title-container">
        <h2 class="title">
          {{ $t('login.title') }}
        </h2>
      </div>
      <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
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
        <div class="expl omit-host-note">{{ $t('login.omitHostname') }}</div>

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
    </el-card>
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
.login-button {
  width: 100%;
  margin: 2.8rem 0 4rem 0;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #f4f4f5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .el-form-item {
    border-radius: .4rem;
    border: 1px solid #DCDFE6;
    color: #454545;
  }

  .el-input {
    display: inline-block;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0rem;
      padding: 1.2rem .5rem 1.2rem 1.5rem;
      color: #303133;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0rem 100rem #ffffff inset !important;
      }
    }
  }
}

.login-form-card {
  width: 52rem;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;

  .el-card__body {
    height: 100%;
    padding-top: 4rem;
  }
}

.omit-host-note {
  margin: -1.5rem 0 2rem 0;
}

.svg-container {
  padding: .6rem .5rem .6rem 1.5rem;
  vertical-align: middle;
  width: 3rem;
  display: inline-block;
}

.title-container {
  position: relative;
  margin-bottom: 5rem;

  .title {
    text-align: center;

  }
}
.show-pwd {
  right: 1rem;
  vertical-align: middle;
  display: inline-block;
  font-size: 1.4rem;
  cursor: pointer;
  user-select: none;
}
</style>
