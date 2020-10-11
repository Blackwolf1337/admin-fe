<template>
  <el-dialog
    :visible.sync="isVisible"
    :show-close="false"
    :title="$t('users.createAccount')"
    custom-class="create-user-dialog"
    @open="resetForm">
    <el-form ref="newUserForm" :model="newUserForm" :rules="rules" :label-width="getLabelWidth" status-icon>
      <el-form-item :label="$t('users.username')" prop="nickname" class="create-account-form-item">
        <el-input v-model="newUserForm.nickname" name="nickname" autofocus/>
      </el-form-item>
      <el-form-item :label="$t('users.email')" prop="email" class="create-account-form-item">
        <el-input v-model="newUserForm.email" name="email" type="email"/>
      </el-form-item>
      <el-form-item :label="$t('users.password')" prop="password" class="create-account-form-item-without-margin">
        <el-input v-model="newUserForm.password" type="password" name="password" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeDialogWindow">{{ $t('users.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm('newUserForm')">{{ $t('users.create') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'NewAccountDialog',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      newUserForm: {
        nickname: '',
        email: '',
        password: ''
      },
      rules: {
        nickname: [
          { validator: this.validateUsername, trigger: 'blur' }
        ],
        email: [
          { validator: this.validateEmail, trigger: 'blur' }
        ],
        password: [
          { validator: this.validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isVisible: {
      get() {
        return this.$props.dialogFormVisible
      },
      set() {
        this.closeDialogWindow()
      }
    },
    getLabelWidth() {
      return this.isDesktop ? '120px' : '85px'
    }
  },
  methods: {
    closeDialogWindow() {
      this.$emit('closeWindow')
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs['newUserForm'].resetFields()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('createNewAccount', this.$data.newUserForm)
        } else {
          this.$message({
            type: 'error',
            message: this.$t('users.submitFormError')
          })
          return false
        }
      })
    },
    validateEmail(rule, value, callback) {
      if (value === '') {
        return callback(new Error(this.$t('users.emptyEmailError')))
      } else if (!this.validEmail(value)) {
        return callback(new Error(this.$t('users.invalidEmailError')))
      } else {
        return callback()
      }
    },
    validatePassword(rule, value, callback) {
      if (value === '') {
        return callback(new Error(this.$t('users.emptyPasswordError')))
      } else {
        return callback()
      }
    },
    validateUsername(rule, value, callback) {
      if (value === '') {
        return callback(new Error(this.$t('users.emptyNicknameError')))
      } else if (!this.validNickname(value)) {
        return callback(new Error(this.$t('users.invalidNicknameError')))
      } else {
        return callback()
      }
    },
    validEmail(email) {
      var re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      return re.test(email)
    },
    validNickname(nickname) {
      var re = /^[a-zA-Z\d_-]+$/
      return re.test(nickname)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.el-dialog__body {
  padding: 20px 20px 20px 20px
}
.create-account-form-item {
  margin-bottom: 20px;
}
.create-account-form-item-without-margin {
  margin-bottom: 0px;
}

@media only screen and (max-width:480px) {
  .create-user-dialog {
    width: 85%
  }
  .create-account-form-item {
    margin-bottom: 20px;
  }
  .el-dialog__body {
    padding: 20px 20px 20px 20px
  }
}
</style>
