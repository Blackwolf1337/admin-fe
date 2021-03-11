<template>
  <div class="invites-container">
    <div class="invites-header-container">
      <h1>{{ $t('invites.inviteTokens') }}</h1>
      <reboot-button/>
    </div>
    <div class="actions-container">
      <el-button class="create-invite-token" @click="createTokenDialogVisible = true">
        <span>
          <i class="icon el-icon-plus"/>
          {{ $t('invites.createInviteToken') }}
        </span>
      </el-button>
      <el-button class="invite-via-email" @click="inviteUserDialogVisible = true">
        <span>
          <i class="icon el-icon-message"/>
          {{ $t('invites.inviteUserViaEmail') }}
        </span>
      </el-button>
    </div>
    <el-dialog
      :visible.sync="createTokenDialogVisible"
      :show-close="false"
      :title="$t('invites.createInviteToken')"
      :width="isTokenCreated ? '60%' : '30%'"
      custom-class="create-new-token-dialog">
      <el-form ref="newTokenForm" :model="newTokenForm" :label-width="getLabelWidth" status-icon>
        <el-form-item :label="$t('invites.maxUse')">
          <el-input-number
            v-model="newTokenForm.maxUse"
            :min="0"
            :size="isDesktop ? 'medium' : 'small'"
            name="maxUse"/>
        </el-form-item>
        <el-form-item :label="$t('invites.expiresAt')">
          <el-date-picker
            v-model="newTokenForm.expiresAt"
            :placeholder="$t('invites.pickDate')"
            class="pick-date"
            type="date"
            name="date"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="invites-close-dialog" @click="closeDialogWindow">{{ $t('invites.cancel') }}</el-button>
        <el-button type="primary" @click="createToken">{{ $t('invites.create') }}</el-button>
      </span>
      <el-card v-if="'token' in newToken">
        <div slot="header" class="clearfix">
          <span>{{ $t('invites.tokenCreated') }}</span>
        </div>
        <el-form label-width="85px" class="new-token-card">
          <el-form-item :label="$t('invites.inviteLink')">
            <div class="invite-link-container">
              <el-link :href="inviteLink" :underline="false" target="_blank">
                {{ inviteLink }}
              </el-link>
              <el-button type="text" size="small" @click="handleCopy($event)">{{ $t('invites.copyLink') }}</el-button>
            </div>
          </el-form-item>
          <el-form-item :label="$t('invites.token')">
            {{ newToken.token }}
          </el-form-item>
          <el-form-item :label="$t('invites.maxUse')">
            {{ newToken.maxUse }}
          </el-form-item>
          <el-form-item :label="$t('invites.expiresAt')">
            {{ newToken.expiresAt || '(not set)' }}
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
    <el-dialog
      :visible.sync="inviteUserDialogVisible"
      :show-close="false"
      :title="$t('invites.sendRegistration')"
      custom-class="invite-via-email-dialog">
      <div>
        <p class="info">{{ $t('invites.inviteViaEmailAlert') }}</p>
        <el-form ref="inviteUserForm" :model="inviteUserForm" :rules="rules" :label-width="getLabelWidth" status-icon>
          <el-form-item :label="$t('invites.email')" prop="email">
            <el-input v-model="inviteUserForm.email" name="email" type="email" autofocus/>
          </el-form-item>
          <el-form-item :label="$t('invites.name')" prop="name">
            <el-input v-model="inviteUserForm.name" name="name"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="closeDialogWindow">{{ $t('invites.cancel') }}</el-button>
        <el-button type="primary" @click="inviteUserViaEmail">{{ $t('invites.create') }}</el-button>
      </span>
    </el-dialog>
    <el-table
      v-loading="loading"
      :data="tokens"
      :default-sort = "{prop: 'used', order: 'ascending'}"
      class="invite-token-table">
      <el-table-column
        v-if="isDesktop"
        :label="$t('invites.id')"
        min-width="60"
        prop="id"
        sortable/>
      <el-table-column
        :label="$t('invites.token')"
        :min-width="isDesktop ? 320 : 120"
        prop="token"/>
      <el-table-column
        v-if="isDesktop"
        :label="$t('invites.expiresAt')"
        align="center"
        header-align="center"
        min-width="110"
        prop="expires_at"
        sortable/>
      <el-table-column
        :label="$t('invites.maxUse')"
        align="center"
        header-align="center"
        min-width="60"
        prop="max_use"
        sortable/>
      <el-table-column
        v-if="isDesktop"
        :label="$t('invites.uses')"
        align="center"
        header-align="center"
        min-width="60"
        prop="uses"/>
      <el-table-column
        :label="$t('invites.used')"
        :min-width="isDesktop ? 60 : 50"
        align="center"
        header-align="center"
        prop="used"
        sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.used ? 'danger' : 'success'"
            disable-transitions>
            {{ scope.row.used ? $t('invites.used') : $t('invites.active') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('invites.actions')"
        :min-width="isDesktop ? 100 : 50"
        align="center"
        header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native="revokeInviteToken(scope.row.token)">
            {{ $t('invites.revoke') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import clip from '@/utils/clipboard'
import RebootButton from '@/components/RebootButton'
import { mapGetters } from 'vuex'
import { baseName } from '@/api/utils'

export default {
  components: { RebootButton },
  data() {
    return {
      rules: {
        email: [
          { validator: this.validateEmail, trigger: 'blur' }
        ]
      },
      newTokenForm: {
        maxUse: 1,
        expiresAt: ''
      },
      inviteUserForm: {
        email: '',
        name: ''
      },
      createTokenDialogVisible: false,
      inviteUserDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'authHost'
    ]),
    getLabelWidth() {
      return this.isDesktop ? '100px' : '85px'
    },
    inviteLink() {
      return `${baseName(this.authHost)}/registration/${this.newToken.token}`
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isTokenCreated() {
      return 'token' in this.newToken
    },
    loading() {
      return this.$store.state.invites.loading
    },
    newToken() {
      return this.$store.state.invites.newToken
    },
    tokens() {
      return this.$store.state.invites.inviteTokens
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchInviteTokens')
  },
  methods: {
    closeDialogWindow() {
      this.inviteUserDialogVisible = false
      this.createTokenDialogVisible = false
      this.$store.dispatch('RemoveNewToken')
      this.$data.inviteUserForm.email = ''
      this.$data.inviteUserForm.name = ''
      this.$data.newTokenForm.maxUse = 1
      this.$data.newTokenForm.expiresAt = ''
    },
    createToken() {
      this.$store.dispatch('GenerateInviteToken', this.$data.newTokenForm)
    },
    handleCopy(event) {
      clip(this.inviteLink, event)
    },
    async inviteUserViaEmail() {
      this.$refs['inviteUserForm'].validate(async(valid) => {
        if (valid) {
          await this.$store.dispatch('InviteUserViaEmail', this.$data.inviteUserForm)
          this.closeDialogWindow()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('invites.submitFormError')
          })
          return false
        }
      })
    },
    revokeInviteToken(token) {
      this.$store.dispatch('RevokeToken', token)
    },
    validateEmail(rule, value, callback) {
      if (value === '') {
        return callback(new Error(this.$t('invites.emptyEmailError')))
      } else if (!this.validEmail(value)) {
        return callback(new Error(this.$t('invites.invalidEmailError')))
      } else {
        return callback()
      }
    },
    validEmail(email) {
      const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      return re.test(email)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.invites-container {
  .actions-container {
    display: flex;
    height: 36px;
    justify-content: space-between;
    align-items: center;
    margin: 15px 15px 15px 15px;
  }
  .create-invite-token {
    text-align: left;
    width: 350px;
    padding: 10px;
  }
  .create-new-token-dialog {
    a {
      margin-bottom: 3px;
    }
    .el-card__body {
      padding: 10px 20px;
    }
  }
  .el-dialog__body {
    padding: 5px 20px 0 20px
  }
  h1 {
    margin: 0;
  }
  .icon {
    margin-right: 5px;
  }
  .invite-link-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    button {
      margin-left: 15px;
    }
  }
  .invite-token-table {
    width: 100%;
    margin: 0 15px;
  }
  .invite-via-email {
    text-align: left;
    width: 350px;
    padding: 10px;
  }
  .invite-via-email-dialog {
    width: 50%
  }
  .invites-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 15px;
  }
  .info {
    color: #666666;
    font-size: 13px;
    line-height: 22px;
    margin: 0 0 10px 0;
  }
  .new-token-card {
    .el-form-item {
      margin: 0;
    }
  }
  .reboot-button {
    padding: 10px;
    margin: 0;
    width: 145px;
  }
}

@media only screen and (max-width:480px) {
  .invites-container {
    .actions-container {
      display: flex;
      height: 82px;
      flex-direction: column;
      align-items: center;
      margin: 15px 10px 7px 10px;
    }
    .cell {
      padding: 0;
    }
    .create-invite-token {
      width: 100%;
    }
    .create-new-token-dialog {
      width: 85%
    }
    .el-date-editor {
      width: 150px;
    }
    .el-dialog__body {
      padding: 5px 15px 0 15px
    }
    h1 {
      margin: 0;
    }
    .invite-token-table {
      width: 100%;
      margin: 0 5px;
      font-size: 12px;
      font-weight: 500;
    }
    .invite-via-email {
      width: 100%;
      margin: 10px 0 0 0;
    }
    .invite-via-email-dialog {
      width: 85%
    }
    .invites-header-container {
      margin: 0 10px;
    }
    .info {
      margin: 0 0 10px 5px;
    }
    th {
      .cell {
        padding: 0;
      }
    }
  }
  .create-invite-token {
    width: 100%
  }
  .invite-via-email {
    width: 100%
  }
}
</style>
