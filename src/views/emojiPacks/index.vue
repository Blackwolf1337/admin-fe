<template>
  <div class="emoji-packs">
    <div class="emoji-packs-header">
      <h1>{{ $t('emoji.emojiPacks') }}</h1>
      <reboot-button/>
    </div>
    <div class="emoji-header-container">
      <div class="emoji-packs-header-button-container">
        <el-button class="reload-emoji-button" @click="reloadEmoji">{{ $t('emoji.reloadEmoji') }}</el-button>
        <el-tooltip :content="$t('emoji.importEmojiTooltip')" effects="dark" placement="bottom" popper-class="import-pack-button">
          <el-button @click="importFromFS">
            {{ $t('emoji.importPacks') }}
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <el-tabs v-model="activeTab" type="card" class="emoji-packs-tabs">
      <el-tab-pane :label="$t('emoji.localPacks')" name="local">
        <el-form :label-width="labelWidth" class="emoji-packs-form">
          <el-form-item :label="$t('emoji.localPacks')">
            <el-button @click="refreshLocalPacks">{{ $t('emoji.refreshLocalPacks') }}</el-button>
          </el-form-item>
          <el-form-item :label="$t('emoji.createLocalPack')">
            <div class="create-pack">
              <el-input v-model="newPackName" :placeholder="$t('users.name')" />
              <el-button
                :disabled="newPackName.trim() === ''"
                class="create-pack-button"
                @click="createLocalPack">
                {{ $t('users.create') }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="Object.keys(localPacks).length > 0" :label="$t('emoji.packs')">
            <el-collapse v-for="(pack, name) in localPacks" :key="name" v-model="activeLocalPack" accordion @change="setActiveTab">
              <local-emoji-pack ref="localEmojiPack" :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="true" />
            </el-collapse>
          </el-form-item>
        </el-form>
        <div class="pagination">
          <el-pagination
            :total="localPacksCount"
            :current-page="currentLocalPacksPage"
            :page-size="pageSize"
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('emoji.remotePacks')" name="remote">
        <el-form :label-width="labelWidth" class="emoji-packs-form">
          <el-form-item :label="$t('emoji.remotePacks')">
            <div class="create-pack">
              <el-input
                v-model="remoteInstanceAddress"
                :placeholder="$t('emoji.remoteInstanceAddress')" />
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :disabled="remoteInstanceAddress.trim() === ''"
                class="create-pack-button"
                @click="refreshRemotePacks">
                {{ $t('emoji.refreshRemote') }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="Object.keys(remotePacks).length > 0" :label="$t('emoji.packs')">
            <el-collapse v-for="(pack, name) in remotePacks" :key="name" v-model="activeRemotePack" accordion @change="setActiveTab">
              <remote-emoji-pack :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="false" />
            </el-collapse>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LocalEmojiPack from './components/LocalEmojiPack'
import RemoteEmojiPack from './components/RemoteEmojiPack'
import i18n from '@/lang'
import RebootButton from '@/components/RebootButton'

export default {
  components: { LocalEmojiPack, RebootButton, RemoteEmojiPack },
  data() {
    return {
      activeTab: 'local',
      newPackName: '',
      activeLocalPack: [],
      activeRemotePack: [],
      fullscreenLoading: false
    }
  },
  computed: {
    currentLocalPacksPage() {
      return this.$store.state.emojiPacks.currentLocalPacksPage
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '105px'
      } else if (this.isTablet) {
        return '180px'
      } else {
        return '200px'
      }
    },
    localPacks() {
      return this.$store.state.emojiPacks.localPacks
    },
    localPacksCount() {
      return this.$store.state.emojiPacks.localPacksCount
    },
    pageSize() {
      return this.$store.state.emojiPacks.pageSize
    },
    remoteInstanceAddress: {
      get() {
        return this.$store.state.emojiPacks.remoteInstance
      },
      set(instance) {
        this.$store.dispatch('SetRemoteInstance', instance)
      }
    },
    remotePacks() {
      return this.$store.state.emojiPacks.remotePacks
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.refreshLocalPacks()
  },
  methods: {
    createLocalPack() {
      this.$store.dispatch('CreatePack', { name: this.newPackName })
        .then(() => {
          this.newPackName = ''

          this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage)
          this.$store.dispatch('ReloadEmoji')
        })
    },
    handlePageChange(page) {
      this.$store.dispatch('FetchLocalEmojiPacks', page)
    },
    importFromFS() {
      this.$store.dispatch('ImportFromFS')
        .then(() => {
          this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage)
          this.$store.dispatch('ReloadEmoji')
        })
    },
    refreshLocalPacks() {
      try {
        this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage)
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('emoji.refreshed')
      })
    },
    async refreshRemotePacks() {
      this.fullscreenLoading = true
      await this.$store.dispatch('SetRemoteEmojiPacks', { remoteInstance: this.remoteInstanceAddress })
      this.fullscreenLoading = false
    },
    async reloadEmoji() {
      try {
        this.$store.dispatch('ReloadEmoji')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('emoji.reloaded')
      })
    },
    setActiveTab(activeTab) {
      this.$refs.localEmojiPack.forEach(el => el.collapse())
      this.$store.dispatch('SetActiveTab', activeTab)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.create-pack {
  display: flex;
  justify-content: space-between
}
.create-pack-button {
  margin-left: 10px;
}
.emoji-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 15px 22px 15px;
}
.emoji-packs-header-button-container {
  display: flex;
}
.emoji-packs-form {
  margin-top: 15px;
}
.emoji-packs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 15px 15px 15px;
}
.emoji-packs-tabs {
  margin: 0 15px 15px 15px;
}
.import-pack-button {
  margin-left: 10px;
  width: 30%;
  max-width: 700px;
}
h1 {
  margin: 0;
}
.line {
  width: 100%;
  height: 0;
  border: 1px solid #eee;
  margin-bottom: 22px;
}
.pagination {
  margin: 25px 0;
  text-align: center;
}
.reboot-button {
  padding: 10px;
  margin: 0;
  width: 145px;
}

@media only screen and (min-width: 1824px) {
  .emoji-packs {
    max-width: 1824px;
    margin: auto;
  }
}

@media only screen and (max-width:480px) {
  .create-pack {
    height: 82px;
    flex-direction: column;
  }
  .create-pack-button {
    margin-left: 0;
  }
  .divider {
    margin: 15px 0;
  }
  .el-message {
    min-width: 80%;
  }
  .el-message-box {
    width: 80%;
  }
  .emoji-header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .emoji-packs-form {
    margin: 0 7px;
    label {
      padding-right: 8px;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  .emoji-packs-header {
    margin: 15px;
  }
  .emoji-packs-header-button-container {
    height: 82px;
    flex-direction: column;
    .el-button+.el-button {
      margin: 7px 0 0 0;
      width: fit-content;
    }
  }
  .import-pack-button {
    width: 90%;
  }
  .reload-emoji-button {
    width: fit-content;
  }
}
</style>
