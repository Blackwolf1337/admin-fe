<template>
  <el-collapse-item :title="name" :name="name" class="has-background">
    <div v-if="loadRemotePack">
      <el-form :label-width="labelWidth" label-position="left" size="small" class="emoji-pack-metadata remote-pack-metadata">
        <el-form-item :label=" $t('emoji.sharePack')">
          <el-switch v-model="share" disabled />
        </el-form-item>
        <el-form-item v-if="homepage" :label=" $t('emoji.homepage')">
          <span>{{ homepage }}</span>
        </el-form-item>
        <el-form-item v-if="description" :label=" $t('emoji.description')">
          <span>{{ description }}</span>
        </el-form-item>
        <el-form-item v-if="license" :label=" $t('emoji.license')">
          <span>{{ license }}</span>
        </el-form-item>
        <el-form-item v-if="fallbackSrc" :label=" $t('emoji.fallbackSrc')">
          <span>{{ fallbackSrc }}</span>
        </el-form-item>
        <el-form-item
          v-if="fallbackSrc && fallbackSrc.trim() !== ''"
          :label=" $t('emoji.fallbackSrcSha')">
          {{ pack.pack["fallback-src-sha256"] }}
        </el-form-item>
        <el-form-item>
          <el-link
            v-if="pack.pack['can-download'] && pack.pack['fallback-src']"
            :href="pack.pack['fallback-src']"
            :underline="false"
            type="primary"
            target="_blank">
            <el-button class="download-archive">{{ $t('emoji.downloadPackArchive') }}</el-button>
          </el-link>
        </el-form-item>
      </el-form>
      <el-collapse v-model="showPackContent" class="contents-collapse">
        <el-collapse-item :title=" $t('emoji.manageEmoji')" name="manageEmoji" class="no-background">
          <div v-if="pack.files && Object.keys(pack.files).length > 0">
            <single-emoji-editor
              v-for="(file, shortcode) in pack.files"
              :key="shortcode"
              :host="host"
              :pack-name="name"
              :shortcode="shortcode"
              :file="file"
              :is-local="isLocal" />
          </div>
          <span v-else class="expl">{{ $t('emoji.emptyPack') }}</span>
        </el-collapse-item>
        <el-collapse-item :title=" $t('emoji.downloadPack')" name="downloadPack" class="no-background">
          <p>
            {{ $t('emoji.thisWillDownload') }} "{{ name }}" {{ $t('emoji.downloadToCurrentInstance') }}
            "{{ downloadSharedAs.trim() === '' ? name : downloadSharedAs }}" ({{ $t('emoji.canBeChanged') }}).
            {{ $t('emoji.willBeUsable') }}.
          </p>
          <div class="download-shared-pack">
            <el-input v-model="downloadSharedAs" :placeholder=" $t('emoji.downloadAsOptional')"/>
            <el-button type="primary" class="download-shared-pack-button" @click="downloadFromInstance">
              {{ isDesktop ? $t('emoji.downloadSharedPack') : $t('emoji.downloadSharedPackMobile') }}
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-collapse-item>
</template>

<script>
import SingleEmojiEditor from './SingleEmojiEditor.vue'

export default {
  components: { SingleEmojiEditor },
  props: {
    name: {
      type: String,
      required: true
    },
    pack: {
      type: Object,
      required: true
    },
    host: {
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
      showPackContent: [],
      downloadSharedAs: ''
    }
  },
  computed: {
    currentPage() {
      return this.$store.state.emojiPacks.currentPage
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
    labelWidth() {
      if (this.isMobile) {
        return '90px'
      } else if (this.isTablet) {
        return '120px'
      } else {
        return '120px'
      }
    },
    loadRemotePack() {
      return this.$store.state.emojiPacks.activeTab === this.name
    },
    remoteInstanceAddress() {
      return this.$store.state.emojiPacks.remoteInstance
    },
    share: {
      get() { return this.pack.pack['share-files'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'share-files', value }
        )
      }
    },
    homepage: {
      get() { return this.pack.pack['homepage'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'homepage', value }
        )
      }
    },
    description: {
      get() { return this.pack.pack['description'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'description', value }
        )
      }
    },
    license: {
      get() { return this.pack.pack['license'] },
      set(value) {
        this.$store.dispatch(
          'UpdateLocalPackVal',
          { name: this.name, key: 'license', value }
        )
      }
    },
    fallbackSrc: {
      get() { return this.pack.pack['fallback-src'] },
      set(value) {
        if (value.trim() !== '') {
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src', value }
          )
        } else {
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src', value: null }
          )
          this.$store.dispatch(
            'UpdateLocalPackVal',
            { name: this.name, key: 'fallback-src-sha256', value: null }
          )
        }
      }
    }
  },
  methods: {
    downloadFromInstance() {
      this.$store.dispatch(
        'DownloadFrom',
        { instanceAddress: this.remoteInstanceAddress, packName: this.name, as: this.downloadSharedAs }
      ).then(() => this.$store.dispatch('ReloadEmoji'))
        .then(() => this.$store.dispatch('FetchLocalEmojiPacks', this.currentPage))
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.download-archive {
  width: 250px
}
.download-pack-button-container {
  width: 265px;
  .el-link {
    width: inherit;
    span {
      width: inherit;
      .download-archive {
        width: inherit;
      }
    }
  }
}
.download-shared-pack {
  display: flex;
  margin-bottom: 10px;
}
.download-shared-pack-button {
  margin-left: 10px;
}
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-collapse-item__header {
  height: 36px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.emoji-pack-card {
  margin-top: 5px;
}
.emoji-pack-metadata {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.has-background .el-collapse-item__header {
  background: #f6f6f6;
}
.no-background .el-collapse-item__header {
  background: white;
}
.pack-button-container {
  margin: 0 0 18px 120px;
}
.save-pack-button-container {
  margin-bottom: 8px;
  width: 265px;
  display: flex;
  justify-content: space-between;
}
@media only screen and (max-width:480px) {
  .delete-pack-button {
    width: 45%;
  }
  .download-pack-button-container {
    width: 100%;
  }
  .download-shared-pack {
    flex-direction: column;
  }
  .download-shared-pack-button {
    margin-left: 0;
    margin-top: 10px;
    padding: 10px;
  }
  .pack-button-container {
    width: 100%;
    margin: 0 0 22px 0;
  }
  .remote-pack-metadata {
    .el-form-item__content {
      line-height: 24px;
      margin-top: 4px;
    }
  }
  .save-pack-button {
    width: 54%;
  }
  .save-pack-button-container {
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    button {
      padding: 10px 5px;
    }
    .el-button+.el-button {
      margin-left: 3px;
    }
  }
}
</style>
