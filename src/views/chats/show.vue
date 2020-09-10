<template>
  <div v-if="!loading" class="chat-show-container">
    <header v-if="isDesktop || isTablet" class="chat-page-header">
      <h1>
        {{ $t('chats.chatHistory') }}:
      </h1>
      <div class="chat-card-participants">
        <div class="chat-particiants-sender">
          <div class="avatar-name-container">
            <el-avatar v-if="propertyExists(chat.sender, 'avatar')" :src="chat.sender.avatar" size="large" />
            <h1 v-if="propertyExists(chat.sender, 'display_name')" class="particiant-display-name">{{ chat.sender.display_name }}</h1>
            <h1 v-else class="particiant-display-name invalid">({{ $t('users.invalidNickname') }})</h1>
            <a v-if="propertyExists(chat.sender, 'url')" :href="chat.sender.url" target="_blank">
              <i :title="$t('userProfile.openAccountInInstance')" class="el-icon-top-right"/>
            </a>
          </div>
        </div>
        <div class="chat-particiants-receiver">
          <div class="avatar-name-container">
            <el-avatar v-if="propertyExists(chat.receiver, 'avatar')" :src="chat.receiver.avatar" size="large" />
            <h1 v-if="propertyExists(chat.receiver, 'display_name')" class="particiant-display-name">{{ chat.receiver.display_name }}</h1>
            <h1 v-else class="particiant-display-name invalid">({{ $t('users.invalidNickname') }})</h1>
            <a v-if="propertyExists(chat.receiver, 'url')" :href="chat.receiver.url" target="_blank">
              <i :title="$t('userProfile.openAccountInInstance')" class="el-icon-top-right"/>
            </a>
          </div>
        </div>
      </div>
    </header>
    <div v-if="isMobile" class="chat-page-header-container">
      <header class="chat-page-header">
        <div class="avatar-name-container"/>
        <reboot-button/>
      </header>
    </div>

    <div class="chat-messages-container">

      <el-timeline v-if="!loading" class="messages">
        <el-timeline-item v-for="message in chatMessages" :key="message.id">
          <chat-message :message="message" :author="getAuthor(message.account_id)"/>
        </el-timeline-item>
        <p v-if="chatMessages.length === 0" class="no-messages">{{ $t('userProfile.noMessages') }}</p>
        <div v-if="chatMessages.length === 20" class="statuses-pagination">
          <el-button v-if="!allLoaded" :loading="buttonLoading" @click="handleLoadMore">{{ $t('statuses.loadMore') }}</el-button>
          <el-button v-else icon="el-icon-check" circle/>
        </div>
      </el-timeline>
    </div>

  </div>
</template>

<script>
import ChatMessage from '@/components/ChatMessage'
import RebootButton from '@/components/RebootButton'

export default {
  name: 'ChatShow',
  components: { RebootButton, ChatMessage },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    allLoaded() {
      return this.$store.state.chat.allLoaded
    },
    buttonLoading() {
      return this.$store.state.chat.buttonLoading
    },
    loading() {
      return this.$store.state.chat.loading
    },
    chat() {
      return this.$store.state.chat.fetchedChat
    },
    chatMessages() {
      return this.$store.state.chat.fetchedChatMessages
    }
  },
  beforeMount: function() {
    this.$store.dispatch('HandlePageChange', null)
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('FetchChat', this.$route.params.id)
    this.$store.dispatch('FetchChatMessages', this.$route.params.id)
  },
  methods: {
    propertyExists(account, property) {
      return account[property]
    },
    getAuthor(account_id) {
      const sender = this.chat.sender
      const receiver = this.chat.receiver
      return account_id === sender.id ? sender : receiver
    },
    handleLoadMore() {
      const max_id = this.chatMessages.pop().id
      this.$store.dispatch('HandlePageChange', max_id)
      this.$store.dispatch('FetchChatMessages', this.$route.params.id)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.chat-page-header {
  display: flex;
  margin: 22px 15px 22px 20px;
  padding: 0;
  h1 {
    display: inline
  }
}
.chat-card-participants {
  display: flex;
  margin: 0 20px;
}
.avatar-name-container {
  padding-right: 20px;
  display: flex;
  align-items: center;
  .el-icon-top-right {
    font-size: 2em;
    line-height: 36px;
    color: #606266;
  }
  .particiant-display-name {
    padding-left: 5px;
  }
}
.el-avatar h1 {
  padding-right: 5px;
}
.chat-messages-container {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  .el-timeline-item {
    margin-left: 20px;
  }
}
.no-chats {
  margin-left: 28px;
  color: #606266;
}
.reboot-button {
  padding: 10px;
  margin-left: 6px;
}
.router-link {
  text-decoration: none;
}
.chat-container {
  margin: 0 15px 0 20px;
}
.chats {
  padding: 0 20px 0 0;
}
.statuses-pagination {
  padding: 15px 0;
  text-align: center;
}

@media only screen and (min-width: 1824px) {

}

@media only screen and (max-width:480px) {
  .chat-page-header {
    padding: 0;
    margin: 7px 15px 15px 10px;
  }
  .avatar-name-container {
    margin-bottom: 10px;
  }

  .el-timeline-item__wrapper {
    padding-left: 18px;
  }
}
@media only screen and (max-width:801px) and (min-width: 481px) {

}
</style>
