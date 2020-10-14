<template>
  <div>
    <div v-if="isLocal" :class="isMobile ? 'emoji-container-flex' : 'emoji-container-grid'">
      <img
        :src="addressOfEmojiInPack(host, packName, file)"
        class="emoji-preview-img">
      <el-input v-model="emojiName" :placeholder="$t('emoji.shortcode')" class="emoji-info"/>
      <el-input v-model="emojiFile" :placeholder="$t('emoji.file')" class="emoji-info"/>
      <div class="emoji-buttons">
        <el-button type="primary" @click="update">{{ $t('emoji.update') }}</el-button>
        <el-button class="remove-emoji-button" @click="remove">{{ $t('emoji.remove') }}</el-button>
      </div>
    </div>

    <div v-if="!isLocal" :class="isMobile ? 'emoji-container-flex' : 'remote-emoji-container-grid'">
      <img
        :src="addressOfEmojiInPack(remoteInstance, packName, file)"
        class="emoji-preview-img">
      <el-input :value="emojiName" :placeholder="$t('emoji.shortcode')" class="emoji-info"/>
      <el-input :value="emojiFile" :placeholder="$t('emoji.file')" class="emoji-info"/>
      <el-popover v-model="copyPopoverVisible" placement="left-start" popper-class="copy-popover" class="copy-pack-container">
        <p>{{ $t('emoji.selectLocalPack') }}</p>
        <el-select v-model="copyToLocalPackName" :placeholder="$t('emoji.localPack')" class="copy-pack-select">
          <el-option
            v-for="(_pack, name) in localPacks"
            :key="name"
            :label="name"
            :value="name" />
        </el-select>
        <p>{{ $t('emoji.specifyShortcode') }}</p>
        <el-input v-model="copyToShortcode" :placeholder="$t('emoji.leaveEmptyShortcode')"/>
        <p>{{ $t('emoji.specifyFilename') }}</p>
        <el-input v-model="copyToFilename" :placeholder="$t('emoji.leaveEmptyFilename')"/>
        <el-button
          :disabled="!copyToLocalPackName"
          type="primary"
          class="copy-to-local-pack-button"
          @click="copyToLocal">{{ $t('emoji.copy') }}</el-button>
        <el-button slot="reference" type="primary" class="emoji-button">{{ $t('emoji.copyToLocalPack') }}</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>

import { addressOfEmojiInPack } from '@/api/emojiPacks'
export default {
  props: {
    host: {
      type: String,
      required: true
    },
    packName: {
      type: String,
      required: true
    },
    shortcode: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    isLocal: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      newShortcode: null,
      newFile: null,
      copyToLocalPackName: null,
      copyPopoverVisible: false,
      copyToShortcode: '',
      copyToFilename: ''
    }
  },
  computed: {
    emojiName: {
      get() {
        // Return a modified shortcode if it was modified, otherwise return the old shortcode
        return this.newShortcode !== null ? this.newShortcode : this.shortcode
      },
      set(val) { this.newShortcode = val }
    },
    emojiFile: {
      get() {
        // Return a modified file name if it was modified, otherwise return the old file name
        return this.newFile !== null ? this.newFile : this.file
      },
      set(val) { this.newFile = val }
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    localPacks() {
      return this.$store.state.emojiPacks.localPacks
    },
    remoteInstance() {
      return this.$store.state.emojiPacks.remoteInstance
    }
  },
  methods: {
    async update() {
      try {
        this.$store.dispatch('UpdateEmojiFile', {
          packName: this.packName,
          shortcode: this.shortcode,
          newShortcode: this.emojiName,
          newFilename: this.emojiFile,
          force: true
        })
      } catch (e) {
        return
      }
      this.newShortcode = null
      this.newFile = null

      this.$store.dispatch('ReloadEmoji')
    },
    remove() {
      this.$confirm('This will delete the emoji, are you sure?', 'Warning', {
        confirmButtonText: 'Yes, delete the emoji',
        cancelButtonText: 'No, leave it be',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('DeleteEmojiFile', {
          packName: this.packName,
          shortcode: this.shortcode
        }).then(() => {
          this.newShortcode = null
          this.newFile = null

          this.$store.dispatch('ReloadEmoji')
        })
      })
    },
    copyToLocal() {
      try {
        this.$store.dispatch('AddNewEmojiFile', {
          packName: this.copyToLocalPackName,
          file: this.addressOfEmojiInPack(this.remoteInstance, this.packName, this.file),
          shortcode: this.copyToShortcode.trim() !== '' ? this.copyToShortcode.trim() : this.shortcode,
          filename: this.copyToFilename.trim() !== '' ? this.copyToFilename.trim() : this.file
        })
      } catch (e) {
        return
      }
      this.copyToLocalPackName = null
      this.copyToLocalVisible = false
      this.copyToShortcode = ''
      this.copyToFilename = ''

      this.$store.dispatch('ReloadEmoji')
    },
    addressOfEmojiInPack
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.copy-popover {
  width: 330px
}
.copy-to-local-pack-button {
  margin-top: 15px;
  float: right;
}
.emoji-buttons {
  place-self: center;
  min-width: 200px
}
.emoji-container-grid {
  display: grid;
  grid-template-columns: 75px 1fr 1fr 200px;
  grid-column-gap: 15px;
  margin-bottom: 10px;
}
.emoji-preview-img {
  max-width: 100%;
  place-self: center;
}
.emoji-info {
  place-self: center;
}
.copy-pack-container {
  place-self: center stretch;
}
.copy-pack-select {
  width: 100%;
}
.remote-emoji-container-grid {
  display: grid;
  grid-template-columns: 75px 1fr 1fr 160px;
  grid-column-gap: 15px;
  margin-bottom: 10px;
}
@media only screen and (max-width:480px) {
  .emoji-container-flex {
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    padding: 15px;
    margin: 0 15px 15px 0;
  }
  .emoji-preview-img {
    margin-bottom: 10px;
  }
  .emoji-info {
    margin-bottom: 10px;
  }
  .emoji-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    button {
      padding: 10px 5px;
      width: 47%;
    }
  }
}

@media only screen and (max-width:801px) and (min-width: 481px) {
  .emoji-container-grid {
    grid-column-gap: 10px;
  }
  .emoji-buttons {
    .el-button+.el-button {
      margin-left: 5px;
    }
  }
  .remote-emoji-container-grid {
    grid-column-gap: 10px;
  }
}
</style>
