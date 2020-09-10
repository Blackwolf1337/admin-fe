<template>
  <el-card v-if="!message.deleted" class="message-card" @click.native="handleRouteChange()">
    <div slot="header">
      <div class="message-header">
        <div class="chat-particiants-sender">
          <img v-if="propertyExists(author, 'avatar')" :src="author.avatar" class="chat-avatar-img">
          <span v-if="propertyExists(author, 'username')" class="chat-account-name">{{ author.username }}</span>
          <span v-else>
            <span v-if="propertyExists(author, 'username')" class="chat-account-name">
              {{ author.username }}
            </span>
            <span v-else class="chat-account-name deactivated">({{ $t('users.invalidNickname') }})</span>
          </span>
        </div>
        {{ message.created_at }}
      </div>
    </div>
    <div class="message-body">
      {{ message.content }}
    </div>
  </el-card>

</template>

<script>

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true
    },
    author: {
      type: Object,
      required: true
    },
    page: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  methods: {
    propertyExists(account, property) {
      return account[property]
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.chat-card {
  margin-bottom: 10px;
  cursor: pointer;
  .account {
    line-height: 26px;
    font-size: 13px;
    color: #606266;
  }
  .account:hover {
    text-decoration: underline;
  }
  .deactivated {
    color: gray;
    line-height: 28px;
    vertical-align: middle;
  }
  .image {
    width: 20%;
    img {
      width: 100%;
    }
  }
  .router-link {
    text-decoration: none;
  }
  .show-more-button {
    margin-left: 5px;
  }
  .chat-account {
    display: flex;
    align-items: center;
  }
  .chat-avatar-img {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .chat-account-name {
    display: inline-block;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
  }
  .chat-body {
    display: flex;
    flex-direction: column;
  }
  .chat-card-header {
    display: flex;
    align-items: center;
  }
  .chat-checkbox {
    margin-right: 7px;
  }
  .chat-content {
    font-size: 15px;
    line-height: 26px;
  }
  .chat-created-at {
    font-size: 13px;
    color: #606266;
  }
  .chat-deleted {
    font-style: italic;
    margin-top: 3px;
  }
  .chat-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chat-tags {
    display: inline;
  }
  .chat-without-content {
    font-style: italic;
  }
}

@media only screen and (max-width:480px) {
  .el-message {
    min-width: 80%;
  }
  .el-message-box {
    width: 80%;
  }
  .chat-card {
    .el-card__header {
      padding: 10px 17px;
    }
    .el-tag {
      margin: 3px 0;
    }
    .chat-account-container {
      margin-bottom: 5px;
    }
    .chat-actions-button {
      margin: 3px 0 3px;
    }
    .chat-actions {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .chat-footer {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 10px;
    }
    .chat-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
