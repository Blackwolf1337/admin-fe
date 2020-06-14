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
      :title="isTokenCreated() ? $t('invites.tokenCreated') : $t('invites.createInviteToken')"
      :width="isTokenCreated() ? '60%' : '30%'"
      custom-class="create-new-token-dialog">
      <el-card v-if="isTokenCreated()">
        <el-form label-width="9rem" class="new-token-card">
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
      <h3 v-if="isTokenCreated()" class="create-another-token-header">{{ $t('invites.createAnotherToken') }}</h3>
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
      return this.isDesktop ? '10rem' : '8.5rem'
    },
    inviteLink() {
      return `${baseName(this.authHost)}/registration/${this.newToken.token}`
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
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
    isTokenCreated() {
      return 'token' in this.newToken
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
    height: 3.6rem;
    justify-content: space-between;
    align-items: center;
    margin: 1.5rem 1.5rem 1.5rem 1.5rem;
  }
  .create-another-token-header {
    font-size: 1.8rem;
  }
  .create-invite-token {
    text-align: left;
    width: 35rem;
    padding: 1rem;
  }
  .create-new-token-dialog {
    .el-card__body {
      padding: 1rem 2rem;
    }
  }
  .el-form-item__label {
    font-weight: 500;
  }
  .el-dialog__body {
    padding: .5rem 2rem 0 2rem
  }
  h1 {
    margin: 0;
  }
  .icon {
    margin-right: .5rem;
  }
  .invite-link-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    button {
      margin-left: 1rem;
    }
  }
  .invite-token-table {
    width: 100%;
    margin: 0 1.5rem;
  }
  .invite-via-email {
    text-align: left;
    width: 35rem;
    padding: 1rem;
  }
  .invite-via-email-dialog {
    width: 50%
  }
  .invites-header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 1.5rem;
  }
  .info {
    color: #666666;
    font-size: 1.3rem;
    line-height: 2rem;
    margin: 0 0 1rem 0;
  }
  .new-token-card {
    .el-form-item {
      margin: 0;
    }
  }
  .reboot-button {
    padding: 1rem;
    margin: 0;
    width: 14.5rem;
  }
}

@media only screen and (max-width:480px) {
  .invites-container {
    .actions-container {
      display: flex;
      height: 8.2rem;
      flex-direction: column;
      align-items: center;
      margin: 1.5rem 1rem 0.7rem 1rem;
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
      width: 15rem;
    }
    .el-dialog__body {
      padding: .5rem 1.5rem 0 1.5rem
    }
    h1 {
      margin: 0;
    }
    .invite-token-table {
      width: 100%;
      margin: 0 .5rem;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .invite-via-email {
      width: 100%;
      margin: 1rem 0 0 0;
    }
    .invite-via-email-dialog {
      width: 85%
    }
    .invites-header-container {
      margin: 0 1rem;
    }
    .info {
      margin: 0 0 1rem .5rem;
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
