<template>
  <div v-if="!loading" class="chat-show-container">
    <header v-if="isDesktop || isTablet" class="user-page-header">
      <div class="avatar-name-container"/>
    </header>
    <div v-if="isMobile" class="chat-page-header-container">
      <header class="user-page-header">
        <div class="avatar-name-container"/>
        <reboot-button/>
      </header>
    </div>

    <div class="chat-container">
      <div class="chat-card-header">
        <h1>
          {{ $t('chats.chatHistory') }}
        </h1>
        <div class="chat-card-participants">
          <div class="chat-particiants-sender">
            <img v-if="propertyExists(chat.sender, 'avatar')" :src="chat.sender.avatar" class="chat-avatar-img">
            <span v-if="propertyExists(chat.sender, 'username')" class="chat-account-name">{{ chat.sender.username }}</span>
            <span v-else>
              <span v-if="propertyExists(chat.sender, 'username')" class="chat-account-name">
                {{ chat.sender.username }}
              </span>
              <span v-else class="chat-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
            </span>
          </div>
          <div class="chat-particiants-receiver">
            <img v-if="propertyExists(chat.receiver, 'avatar')" :src="chat.receiver.avatar" class="chat-avatar-img">
            <span v-if="propertyExists(chat.receiver, 'username')" class="chat-account-name">{{ chat.receiver.username }}</span>
            <span v-else>
              <span v-if="propertyExists(chat.receiver, 'username')" class="chat-account-name">
                {{ chat.receiver.username }}
              </span>
              <span v-else class="chat-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
            </span>
          </div>
        </div>
      </div>

      <div class="chat-messages">
        <div v-for="message in chatMessages" :key="message.id" class="">
          <chat-message :message="message" :author="getAuthor(message.account_id)"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ChatMessage from '@/components/ChatMessage'
import RebootButton from '@/components/RebootButton'

export default {
  name: 'ChatShow',
  components: { RebootButton, ChatMessage },
  data() {
    return {

    }
  },
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
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.avatar-name-container {
  display: flex;
  align-items: center;
  .el-icon-top-right {
    font-size: 2em;
    line-height: 36px;
    color: #606266;
  }
}
.avatar-name-header {
  display: flex;
  height: 40px;
  align-items: center;
}
.invalid {
  color: gray;
}
.no-chats {
  margin-left: 28px;
  color: #606266;
}
.password-reset-token {
  margin: 0 0 14px 0;
}
.password-reset-token-dialog {
  width: 50%
}
.reboot-button {
  padding: 10px;
  margin-left: 6px;
}

.recent-chats-container-show {
  display: flex;
  flex-direction: column;
  .el-timeline-item {
    margin-left: 20px;
  }
  .recent-chats {
    margin-left: 20px;
  }
  .show-private-chats {
    margin-left: 20px;
    margin-bottom: 20px;
  }
}
.reset-password-link {
  text-decoration: underline;
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
.user-page-header {
  display: flex;
  justify-content: space-between;
  margin: 22px 15px 22px 20px;
  padding: 0;
  align-items: center;
  h1 {
    display: inline;
    margin: 0 0 0 10px;
  }
}

@media only screen and (min-width: 1824px) {
  .chat-show-container {
    max-width: 1824px;
    margin: auto;
  }
}

@media only screen and (max-width:480px) {
  .avatar-name-container {
    margin-bottom: 10px;
  }
  .el-timeline-item__wrapper {
    padding-left: 18px;
  }
  .left-header-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .password-reset-token-dialog {
    width: 85%
  }
  .recent-chats {
    margin: 20px 10px 15px 10px;
  }
  .recent-chats-container-show {
    width: 100%;
    margin: 0 0 0 10px;
    .el-timeline-item {
      margin-left: 0;
    }
    .recent-chats {
      margin-left: 0;
    }
    .show-private-chats {
      margin: 0 10px 20px 0;
    }
  }
  .chat-card {
    .el-card__body {
      padding: 15px;
    }
  }
  .chat-container {
    margin: 0 10px;
  }
  .chats {
    padding-right: 10px;
    margin-left: 0;
    .el-timeline-item__wrapper {
      margin-right: 10px;
    }
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 5px 10px;
  }
  .chat-page-header-container {
    width: 100%;
    .el-dropdown {
      width: stretch;
      margin: 0 10px 15px 10px;
    }
  }
}
@media only screen and (max-width:801px) and (min-width: 481px) {
  .recent-chats-container-show {
    width: 97%;
    margin: 0 20px;
    .el-timeline-item {
      margin-left: 2px;
    }
    .recent-chats {
      margin: 20px 10px 15px 0;
    }
    .show-private-chats {
      margin: 0 10px 20px 0;
    }
  }
  .show-private-chats {
    margin: 0 10px 20px 0;
  }
  .user-page-header {
    padding: 0;
    margin: 7px 15px 20px 20px;
  }
}
</style>
