<template>
  <div class="users-container">
    <div class="users-header-container">
      <h1>
        {{ $t('users.users') }}
        <span class="user-count">({{ normalizedUsersCount }})</span>
      </h1>
      <reboot-button/>
    </div>
    <div class="filter-container">
      <users-filter/>
      <el-input
        :placeholder="$t('users.search')"
        v-model="search"
        prefix-icon="el-icon-search"
        class="search"
        @input="handleDebounceSearchInput"/>
    </div>
    <div class="actions-container">
      <el-button class="actions-button" @click="createAccountDialogOpen = true">
        <span class="create-account">
          <i class="el-icon-plus"/>
          {{ $t('users.createAccount') }}
        </span>
      </el-button>
      <multiple-users-menu
        :selected-users="selectedUsers"
        @apply-action="clearSelection"/>
    </div>
    <new-account-dialog
      :dialog-form-visible="createAccountDialogOpen"
      @createNewAccount="createNewAccount"
      @closeWindow="createAccountDialogOpen = false"/>
    <el-table
      v-loading="loading"
      ref="usersTable"
      :data="users"
      row-key="id"
      style="width: 100%"
      @row-click="handleRowClick($event)"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-if="isDesktop"
        type="selection"
        reserve-selection
        width="44"
        align="center"/>
      <el-table-column :min-width="width" :label="$t('users.id')" prop="id" />
      <el-table-column :label="$t('users.name')" prop="nickname">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
          <el-tag v-if="isDesktop" type="info" size="mini">
            <span>{{ scope.row.local ? $t('users.local') : $t('users.external') }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :min-width="width" :label="$t('users.status')">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.deactivated & !scope.row.approval_pending" type="success">
            <span v-if="isDesktop">{{ $t('users.active') }}</span>
            <i v-else class="el-icon-circle-check"/>
          </el-tag>
          <el-tag v-if="scope.row.deactivated & !scope.row.approval_pending" type="danger">
            <span v-if="isDesktop">{{ $t('users.deactivated') }}</span>
            <i v-else class="el-icon-circle-close"/>
          </el-tag>
          <el-tooltip :content="$t('users.unapprovedAccount')" effect="dark">
            <el-tag v-if="scope.row.approval_pending" type="info">
              <span v-if="isDesktop">{{ $t('users.unapproved') }}</span>
              <i v-else class="el-icon-warning-outline"/>
            </el-tag>
          </el-tooltip>
          <el-tag v-if="scope.row.roles.admin">
            <span>{{ isDesktop ? $t('users.admin') : getFirstLetter($t('users.admin')) }}</span>
          </el-tag>
          <el-tag v-if="scope.row.roles.moderator">
            <span>{{ isDesktop ? $t('users.moderator') : getFirstLetter($t('users.moderator')) }}</span>
          </el-tag>
          <el-tooltip :content="$t('users.unconfirmedEmail')" effect="dark">
            <el-tag v-if="scope.row.confirmation_pending" type="info">
              {{ isDesktop ? $t('users.unconfirmed') : getFirstLetter($t('users.unconfirmed')) }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="pendingView && isDesktop" :label="$t('users.registrationReason')">
        <template slot-scope="scope">
          <el-tooltip
            v-if="regReason(scope.row.registration_reason)"
            :content="scope.row.registration_reason"
            popper-class="reason-tooltip"
            effect="dark">
            <span>
              "{{ scope.row.registration_reason | truncate(100, '...') }}"
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="$t('users.actions')" fixed="right">
        <template slot-scope="scope">
          <moderation-dropdown
            v-if="propertyExists(scope.row, 'nickname')"
            :user="scope.row"
            :page="'users'"
            @open-reset-token-dialog="openResetPasswordDialog"/>
          <el-button v-else type="text" disabled>
            {{ $t('users.moderation') }}
            <i v-if="isDesktop" class="el-icon-arrow-down el-icon--right"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <reset-password-dialog
      :reset-password-dialog-open="resetPasswordDialogOpen"
      @close-reset-token-dialog="closeResetPasswordDialog"/>
    <div v-if="!loading" class="pagination">
      <el-pagination
        :total="usersCount"
        :current-page="currentPage"
        :page-size="pageSize"
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import numeral from 'numeral'
import UsersFilter from './components/UsersFilter'
import MultipleUsersMenu from './components/MultipleUsersMenu'
import NewAccountDialog from './components/NewAccountDialog'
import ModerationDropdown from './components/ModerationDropdown'
import RebootButton from '@/components/RebootButton'
import ResetPasswordDialog from './components/ResetPasswordDialog'

export default {
  name: 'Users',
  components: {
    NewAccountDialog,
    ModerationDropdown,
    MultipleUsersMenu,
    RebootButton,
    ResetPasswordDialog,
    UsersFilter
  },
  filters: {
    truncate: function(text, length, suffix) {
      return text.length < length ? text : text.substring(0, length) + suffix
    }
  },
  data() {
    return {
      search: '',
      selectedUsers: [],
      createAccountDialogOpen: false,
      resetPasswordDialogOpen: false
    }
  },
  computed: {
    loading() {
      return this.$store.state.users.loading
    },
    normalizedUsersCount() {
      return numeral(this.$store.state.users.totalUsersCount).format('0a')
    },
    pageSize() {
      return this.$store.state.users.pageSize
    },
    currentPage() {
      return this.$store.state.users.currentPage
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    users() {
      return this.$store.state.users.fetchedUsers
    },
    usersCount() {
      return this.$store.state.users.totalUsersCount
    },
    pendingView() {
      return this.$store.state.users.filters['need_approval']
    },
    width() {
      return this.isMobile ? 55 : false
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.$store.dispatch('SearchUsers', { query, page: 1 })
    }, 500)
  },
  mounted: function() {
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchTagPolicySetting')
    this.$store.dispatch('FetchUsers', { page: 1 })
    this.$store.dispatch('ListTags')
  },
  destroyed() {
    this.$store.dispatch('ClearUsersState')
  },
  methods: {
    clearSelection() {
      this.$refs.usersTable.clearSelection()
    },
    closeResetPasswordDialog() {
      this.resetPasswordDialogOpen = false
      this.$store.dispatch('RemovePasswordToken')
    },
    async createNewAccount(accountData) {
      await this.$store.dispatch('CreateNewAccount', accountData)
      this.createAccountDialogOpen = false
    },
    getFirstLetter(str) {
      return str.charAt(0).toUpperCase()
    },
    handlePageChange(page) {
      const searchQuery = this.$store.state.users.searchQuery
      if (searchQuery === '') {
        this.$store.dispatch('FetchUsers', { page })
      } else {
        this.$store.dispatch('SearchUsers', { query: searchQuery, page })
      }
    },
    handleRowClick(row) {
      if (row.id) {
        this.$router.push({ name: 'UsersShow', params: { id: row.id }})
      }
    },
    handleSelectionChange(value) {
      this.$data.selectedUsers = value
    },
    openResetPasswordDialog() {
      this.resetPasswordDialogOpen = true
    },
    propertyExists(account, property) {
      return account[property]
    },
    regReason(reason) {
      return reason && reason.length > 0
    },
    showDeactivatedButton(id) {
      return this.$store.state.user.id !== id
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.actions-button {
  text-align: left;
  width: 350px;
  padding: 10px;
}
.actions-container {
  display: flex;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  margin: 0 15px 10px 15px;
  .el-dropdown {
    margin-left: 10px;
  }
}
.active-tag {
  color: #409EFF;
  font-weight: 700;
  .el-icon-check {
    color: #409EFF;
    float: right;
    margin: 7px 0 0 15px;
  }
}
.active-tag.is-disabled {
  .el-icon-check {
    color: #bbb;
  }
}
.el-dropdown-link:hover {
    cursor: pointer;
    color: #409EFF;
  }
.create-account > .el-icon-plus {
  margin-right: 5px;
}
.password-reset-token {
  margin: 0 0 14px 0;
}
.password-reset-token-dialog {
  width: 50%
}
.reason-tooltip {
  max-width: 450px;
}
.reset-password-link {
  text-decoration: underline;
}
.users-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.users-container {
  h1 {
    margin: 10px 0 0 15px;
    height: 40px;
  }
  .cell {
    word-break: break-word;
  }
  .el-table__row:hover {
    cursor: pointer;
  }
  .pagination {
    margin: 25px 0;
    text-align: center;
  }
  .reboot-button {
    margin: 0 15px 0 0;
    padding: 10px;
    width: 145px;
  }
  .search {
    width: 350px;
    float: right;
    margin-left: 10px;
  }
  .filter-container {
    display: flex;
    height: 36px;
    justify-content: space-between;
    align-items: center;
    margin: 15px
  }
  .user-count {
    color: gray;
    font-size: 28px;
  }
}

@media only screen and (max-width:480px) {
  .password-reset-token-dialog {
    width: 85%
  }
  .users-container {
    h1 {
      margin: 0;
    }
    .actions-button {
      width: 100%;
    }
    .actions-container {
      display: flex;
      flex-direction: column;
      margin: 0 10px 7px 10px
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .search {
      width: 100%;
      margin-left: 0;
    }
    .filter-container {
      display: flex;
      height: 82px;
      flex-direction: column;
      margin: 0 10px
    }
    .el-table__row {
      .el-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        margin-bottom: 4px;
        font-weight: bold;
      }
    }
    .reboot-button {
      margin: 0;
    }
    .users-header-container {
      margin: 7px 10px 12px 10px;
    }
    .user-count {
      color: gray;
      font-size: 22px;
    }
  }
}

@media only screen and (max-width:801px) and (min-width: 481px) {
  .actions-button {
    width: 49%;
  }
  .search {
    width: 49%;
  }
}
</style>
