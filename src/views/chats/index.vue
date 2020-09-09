<template>
  <div v-if="!loadingPeers" class="chats-container">
    <div class="chats-header">
      <h1>
        {{ $t('chats.chats') }}
      </h1>
      <reboot-button/>
    </div>
    <div class="chats-header-container"/>

  </div>
</template>

<script>
import RebootButton from '@/components/RebootButton'

export default {
  name: 'Chats',
  components: {
    RebootButton
  },
  data() {
    return {
    }
  },
  computed: {
    allLoaded() {
      return this.$store.state.chat.chatsByInstance.allLoaded
    },
    buttonLoading() {
      return this.$store.state.chat.chatsByInstance.buttonLoading
    },
    currentInstance() {
      return this.selectedInstance === this.$store.state.user.authHost
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
    page() {
      return this.$store.state.chat.chatsByInstance.page
    },
    pageSize() {
      return this.$store.state.chat.chatsByInstance.pageSize
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
  },
  destroyed() {
    this.clearSelection()
    this.$store.dispatch('ClearState')
  },
  methods: {
    clearSelection() {
      this.selectedUsers = []
    },
    handleLoadMore() {
      this.$store.dispatch('HandlePageChange', this.page + 1)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.chats-container {
  padding: 0 15px;
  h1 {
    margin: 10px 0 15px 0;
  }
  .chat-container {
    margin: 0 0 10px;
  }
}
.chats-header-container {
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
.reboot-button {
  padding: 10px;
  margin: 0;
  width: 145px;
}
.select-instance {
  width: 396px;
}
.chats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chats-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chats-pagination {
  padding: 15px 0;
  text-align: center;
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
  .chats-header-container {
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
