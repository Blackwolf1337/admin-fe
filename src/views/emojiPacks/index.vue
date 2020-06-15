<template>
  <div class="emoji-packs">
    <div class="emoji-packs-header">
      <h1>{{ $t('emoji.emojiPacks') }}</h1>
      <reboot-button/>
    </div>
    <div class="emoji-header-container">
      <div class="emoji-packs-header-button-container">
        <el-button type="primary" class="reload-emoji-button" @click="reloadEmoji">{{ $t('emoji.reloadEmoji') }}</el-button>
        <el-tooltip :content="$t('emoji.importEmojiTooltip')" effects="dark" placement="bottom" popper-class="import-pack-button">
          <el-button type="primary" @click="importFromFS">
            {{ $t('emoji.importPacks') }}
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <el-divider class="divider"/>
    <el-form :label-width="labelWidth" class="emoji-packs-form">
      <el-form-item :label="$t('emoji.localPacks')">
        <el-button type="primary" @click="refreshLocalPacks">{{ $t('emoji.refreshLocalPacks') }}</el-button>
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
        <el-collapse v-for="(pack, name) in localPacks" :key="name" v-model="activeLocalPack">
          <local-emoji-pack :name="name" :pack="sortPack(pack)" :host="$store.getters.authHost" :is-local="true" />
        </el-collapse>
      </el-form-item>
      <el-divider class="divider"/>
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
        <el-collapse v-for="(pack, name) in remotePacks" :key="name" v-model="activeRemotePack" @change="setActiveCollapseItems">
          <remote-emoji-pack :name="name" :pack="sortPack(pack)" :host="$store.getters.authHost" :is-local="false" />
        </el-collapse>
      </el-form-item>
    </el-form>
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
      newPackName: '',
      activeLocalPack: [],
      activeRemotePack: [],
      fullscreenLoading: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelWidth() {
      if (this.isMobile) {
        return '10.5rem'
      } else if (this.isTablet) {
        return '18rem'
      } else {
        return '24rem'
      }
    },
    localPacks() {
      return this.$store.state.emojiPacks.localPacks
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

          this.$store.dispatch('SetLocalEmojiPacks')
          this.$store.dispatch('ReloadEmoji')
        })
    },
    importFromFS() {
      this.$store.dispatch('ImportFromFS')
        .then(() => {
          this.$store.dispatch('SetLocalEmojiPacks')
          this.$store.dispatch('ReloadEmoji')
        })
    },
    sortPack(pack) {
      const orderedFiles = Object.keys(pack.files).sort((a, b) => a.localeCompare(b))
        .map(key => [key, pack.files[key]])
      return { ...pack, files: orderedFiles }
    },
    refreshLocalPacks() {
      try {
        this.$store.dispatch('SetLocalEmojiPacks')
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
    setActiveCollapseItems(activeItems) {
      const items = Array.isArray(activeItems) ? activeItems : [activeItems]
      this.$store.dispatch('SetActiveCollapseItems', items)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.emoji-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1.5rem 2.2rem 1.5rem;
}
.emoji-packs-header-button-container {
  display: flex;
}
.create-pack {
  display: flex;
  justify-content: space-between
}
.create-pack-button {
  margin-left: 1rem;
}
.emoji-packs-form {
  margin: 0 3rem;
}
.emoji-packs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.import-pack-button {
  margin-left: 1rem;
  width: 30%;
  max-width: 70rem;
}
h1 {
  margin: 0;
}
.line {
  width: 100%;
  height: 0;
  border: 1px solid #eee;
  margin-bottom: 2.2rem;
}
.reboot-button {
  padding: 1rem;
  margin: 0;
  width: 14.5rem;
}

@media only screen and (min-width: 182.4rem) {
  .emoji-packs {
    max-width: 182.4rem;
    margin: auto;
  }
}

@media only screen and (max-width:48rem) {
  .create-pack {
    height: 8.2rem;
    flex-direction: column;
  }
  .create-pack-button {
    margin-left: 0;
  }
  .divider {
    margin: 1.5rem 0;
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
    margin: 0 .7rem;
    label {
      padding-right: .8rem;
    }
    .el-form-item {
      margin-bottom: 1.5rem;
    }
  }
  .emoji-packs-header {
    margin: 1.5rem;
  }
  .emoji-packs-header-button-container {
    height: 8.2rem;
    flex-direction: column;
    .el-button+.el-button {
      margin: .7rem 0 0 0;
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
