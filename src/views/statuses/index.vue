<template>
  <div v-if="!loadingPeers" class="statuses-container">
    <div class="statuses-header">
      <h1>
        {{ $t('statuses.statuses') }}
      </h1>
      <reboot-button/>
    </div>
    <div class="statuses-header-container">
      <el-button-group>
        <el-button plain class="direct-button">
          {{ $t('statuses.direct') }}: {{ normalizedCount(statusVisibility.direct) }}
        </el-button>
        <el-button plain class="private-button">
          {{ $t('statuses.private') }}: {{ normalizedCount(statusVisibility.private) }}
        </el-button>
        <el-button plain class="public-button">
          {{ $t('statuses.public') }}: {{ normalizedCount(statusVisibility.public) }}
        </el-button>
        <el-button plain class="unlisted-button">
          {{ $t('statuses.unlisted') }}: {{ normalizedCount(statusVisibility.unlisted) }}
        </el-button>
      </el-button-group>
    </div>
    <div class="filter-container">
      <el-select
        v-model="selectedInstance"
        :placeholder="$t('statuses.instanceFilter')"
        :no-data-text="$t('statuses.noInstances')"
        filterable
        clearable
        class="select-instance"
        @change="handleFilterChange">
        <el-option
          v-for="(instance,index) in instances"
          :key="index"
          :label="instance"
          :value="instance"/>
      </el-select>
      <multiple-users-menu
        :selected-users="selectedUsers"
        @apply-action="clearSelection"/>
    </div>
    <div v-if="currentInstance" class="checkbox-container">
      <!-- <el-checkbox v-model="showLocal" class="show-private-statuses">
        {{ $t('statuses.onlyLocalStatuses') }}
      </el-checkbox> -->
      <el-checkbox v-model="showPrivate" class="show-private-statuses">
        {{ $t('statuses.showPrivateStatuses') }}
      </el-checkbox>
    </div>
    <p v-if="statuses.length === 0" class="no-statuses">{{ $t('userProfile.noStatuses') }}</p>
    <el-timeline v-if="!loading" :reverse="true" class="statuses">
      <el-timeline-item v-for="status in statuses" :key="status.id">
        <status
          :status="status"
          :account="status.account"
          :show-checkbox="isDesktop"
          :fetch-statuses-by-instance="true"
          @status-selection="handleStatusSelection" />
      </el-timeline-item>
    </el-timeline>
    <el-pagination
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      class="instance-statuses-pagination"
      background
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import MultipleUsersMenu from '@/views/users/components/MultipleUsersMenu'
import Status from '@/components/Status'
import RebootButton from '@/components/RebootButton'
import numeral from 'numeral'

export default {
  name: 'Statuses',
  components: {
    MultipleUsersMenu,
    RebootButton,
    Status
  },
  data() {
    return {
      selectedUsers: []
    }
  },
  computed: {
    currentInstance() {
      return this.selectedInstance === this.$store.state.user.authHost
    },
    currentPage() {
      return this.$store.state.statusesByInstance.currentPage
    },
    instances() {
      return [this.$store.state.user.authHost, ...this.$store.state.peers.fetchedPeers]
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    loading() {
      return this.$store.state.statusesByInstance.loading
    },
    loadingPeers() {
      return this.$store.state.peers.loading
    },
    pageSize() {
      return this.$store.state.statusesByInstance.pageSize
    },
    selectedInstance: {
      get() {
        return this.$store.state.statusesByInstance.selectedInstance
      },
      set(instance) {
        this.$store.dispatch('HandleFilterChange', instance)
      }
    },
    // showLocal: {
    //   get() {
    //     return this.$store.state.statusesByInstance.showLocal
    //   },
    //   set(value) {
    //     this.$store.dispatch('HandleLocalCheckboxChange', value)
    //   }
    // },
    showPrivate: {
      get() {
        return this.$store.state.statusesByInstance.showPrivate
      },
      set(value) {
        this.$store.dispatch('HandleGodmodeCheckboxChange', value)
      }
    },
    statuses() {
      return this.$store.state.statusesByInstance.fetchedStatuses
    },
    statusVisibility() {
      return this.$store.state.statusesByInstance.visibility
    },
    total() {
      return this.$store.state.statusesByInstance.total
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchPeers')
    this.$store.dispatch('FetchStatusesCount')
  },
  destroyed() {
    this.clearSelection()
    this.$store.dispatch('ClearState')
  },
  methods: {
    clearSelection() {
      this.selectedUsers = []
    },
    handleFilterChange() {
      this.$store.dispatch('FetchStatusesByInstance', 1)
    },
    handlePageChange(page) {
      this.$store.dispatch('FetchStatusesByInstance', page)
    },
    handleStatusSelection(user) {
      if (this.selectedUsers.find(selectedUser => user.id === selectedUser.id) !== undefined) {
        return
      }
      this.selectedUsers = [...this.selectedUsers, user]
    },
    normalizedCount(count) {
      return numeral(count).format('0a')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.statuses-container {
  padding: 0 15px;
  h1 {
    margin: 10px 0 15px 0;
  }
  .statuses {
    padding: 0 20px 0 0;
  }
}
.statuses-header-container {
  .el-button.is-plain:focus, .el-button.is-plain:hover {
    border-color: #DCDFE6;
    color: #606266;
    cursor: default
  }
}
.checkbox-container {
  margin-bottom: 15px;
}
.filter-container {
  display: flex;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  margin: 22px 0 15px 0;
}
.instance-statuses-pagination {
  margin: 25px 0;
  text-align: center;
}
.reboot-button {
  padding: 10px;
  margin: 0;
  width: 145px;
}
.select-instance {
  width: 396px;
}
.statuses-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statuses-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media only screen and (max-width:480px) {
  .checkbox-container {
    margin-bottom: 10px;
  }
  .filter-container {
    display: flex;
    height: 36px;
    flex-direction: column;
    margin: 10px 0;
  }
  .select-field {
    width: 100%;
    margin-bottom: 5px;
  }
  .select-instance {
    width: 100%;
  }
  .statuses-header-container {
    flex-direction: column;
    align-items: flex-start;
    .el-button-group {
      width: 100%;
    }
    .el-button {
      padding: 10px 6.5px;
      width: 50%;
    }
    .el-button-group>.el-button:first-child {
      border-bottom-left-radius: 0;
    }
    .el-button-group>.el-button:not(:first-child):not(:last-child).private-button {
      border-top-right-radius: 4px;
    }
    .el-button-group>.el-button:not(:first-child):not(:last-child).public-button {
      border-bottom-left-radius: 4px;
      border-top: white;
    }
    .el-button-group>.el-button:last-child {
      border-top-right-radius: 0;
      border-top: white;
    }
    .reboot-button {
      margin: 10px 0 0 0;
    }
  }
}
</style>
