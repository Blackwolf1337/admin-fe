<template>
  <el-card v-if="!message.deleted" class="message-card">
    <div slot="header">
      <div class="message-header">
        <div class="message-meta">
          <router-link
            v-if="propertyExists(author, 'id')"
            :to="{ name: 'UsersShow', params: { id: author.id }}"
            class="router-link"
            @click.native.stop>
            <div class="message-author">
              <img v-if="propertyExists(author, 'avatar')" :src="author.avatar" class="message-author-avatar-img">
              <span v-if="propertyExists(author, 'username')" class="message-author-name">{{ author.username }}</span>
              <span v-else>
                <span v-if="propertyExists(author, 'username')" class="message-author-name">
                  {{ author.username }}
                </span>
                <span v-else class="message-author-name deactivated">({{ $t('users.invalidNickname') }})</span>
              </span>
            </div>
          </router-link>
          <span class="message-timestamp">{{ parseTimestamp(message.created_at) }}</span>
        </div>
        <div class="message-actions">
          <el-dropdown trigger="click" @click.native.stop>
            <el-button plain size="small" icon="el-icon-edit" class="status-actions-button">
              {{ $t('reports.messageModeration') }}<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="deleteMessage()">
                {{ $t('reports.deleteMessage') }}
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="handleRouteChange()">
                {{ $t('users.moderateUser') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="message-body">
      <span class="message-content" v-html="message.content"/>
      <div v-if="message.attachment" class="image">
        <img :src="message.attachment.preview_url">
      </div>
    </div>
  </el-card>

</template>

<script>
import moment from 'moment'

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
    },
    parseTimestamp(timestamp) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm')
    },
    deleteMessage() {
      this.$confirm('Are you sure you want to delete this message?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeleteMessage', {
          chat_id: this.message.chat_id,
          message_id: this.message.id
        })
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    handleRouteChange() {
      this.$router.push({ name: 'UsersShow', params: { id: this.author.id }})
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.message-card {
  margin-bottom: 10px;
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
  .message-author {
    display: flex;
    align-items: center;
  }
  .message-author-avatar-img {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  .message-author-name {
    display: inline-block;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
  }
  .message-body {
    display: flex;
    flex-direction: column;
  }
  .message-card-header {
    display: flex;
    align-items: center;
  }

  .chat-content {
    font-size: 15px;
    line-height: 26px;
  }
  .message-timestamp {
    font-size: 13px;
    color: #606266;
    margin-left: 20px;
  }
  .message-deleted {
    font-style: italic;
    margin-top: 3px;
  }
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .message-meta {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
    }
  }

}

@media only screen and (max-width:480px) {
  .el-message {
    min-width: 80%;
  }
  .el-message-box {
    width: 80%;
  }
  .message-card {
    .el-card__header {
      padding: 10px 17px;
    }
    .el-tag {
      margin: 3px 0;
    }
    .message-author-container {
      margin-bottom: 5px;
    }
    .message-action-buttons {
      margin: 3px 0 3px;
    }
    .message-actions {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .message-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .message-actions-button {
    margin: 3px 0 3px;
  }
  .message-actions {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
