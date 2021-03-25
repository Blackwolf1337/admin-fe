<template>
  <div class="emoji-packs">
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
      <el-tab-pane v-if="!emojiPacksDisabled" :label="$t('emoji.localPacks')" name="local">
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
            <span class="emoji-name-warning">{{ $t('emoji.emojiWarning') }}</span>
          </el-form-item>
          <el-form-item v-if="Object.keys(localPacks).length > 0" :label="$t('emoji.packs')">
            <el-collapse v-for="(pack, name) in localPacks" :key="name" v-model="activeLocalPack" accordion @change="closeRemoteTabs">
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
            @current-change="handleLocalPageChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="!emojiPacksDisabled" :label="$t('emoji.remotePacks')" name="remote">
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
            <el-collapse v-for="(pack, name) in remotePacks" :key="name" v-model="activeRemotePack" accordion @change="closeLocalTabs">
              <remote-emoji-pack ref="remoteEmojiPack" :active-tab="activeRemotePack" :name="name" :pack="pack" :host="$store.getters.authHost" :is-local="false" />
            </el-collapse>
          </el-form-item>
        </el-form>
        <div class="pagination">
          <el-pagination
            :total="remotePacksCount"
            :current-page="currentRemotePacksPage"
            :page-size="pageSize"
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="handleRemotePageChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('settings.settings')" name="settings">
        <div v-if="!loading" :class="isSidebarOpen" class="form-container">
          <div v-for="(setting, index) in settingsPerTab" :key="setting.key">
            <el-form :label-position="labelPosition" :label-width="settingsLabelWidth" :data-search="setting.key">
              <setting :setting-group="settingDesc(setting)" :data="settingData(setting)"/>
            </el-form>
            <el-divider v-if="showDivider(index, setting)" class="divider thick-line"/>
          </div>
          <div class="submit-button-container">
            <el-button class="submit-button" type="primary" @click="onSubmit">{{ $t('settings.submit') }}</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/lang'
import LocalEmojiPack from '../../emojiPacks/LocalEmojiPack'
import RemoteEmojiPack from '../../emojiPacks/RemoteEmojiPack'
import Setting from './Setting'
import _ from 'lodash'

export default {
  name: 'Emoji',
  components: { LocalEmojiPack, RemoteEmojiPack, Setting },
  data() {
    return {
      activeTab: 'local',
      newPackName: '',
      activeLocalPack: '',
      activeRemotePack: '',
      fullscreenLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    currentLocalPacksPage() {
      return this.$store.state.emojiPacks.currentLocalPacksPage
    },
    currentRemotePacksPage() {
      return this.$store.state.emojiPacks.currentRemotePacksPage
    },
    emojiPacksDisabled() {
      const disabledFeatures = process.env.DISABLED_FEATURES || []
      return disabledFeatures.includes('emoji-packs')
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isSidebarOpen() {
      return this.$store.state.app.sidebar.opened ? 'sidebar-opened' : 'sidebar-closed'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'right'
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
    loading() {
      return this.settings.loading
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
    },
    remotePacksCount() {
      return this.$store.state.emojiPacks.remotePacksCount
    },
    searchQuery() {
      return this.$store.state.settings.searchQuery
    },
    settingsLabelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    settingsPerTab() {
      return this.settings.description.filter(setting => setting.tab === 'emoji')
    }
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.refreshLocalPacks()

    if (this.searchQuery.length > 0) {
      this.activeTab = 'settings'
      const selectedSetting = document.querySelector(`[data-search="${this.searchQuery}"]`)
      console.log(selectedSetting)
      if (selectedSetting) {
        selectedSetting.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }

      this.$store.dispatch('SetSearchQuery', '')
    }
  },
  methods: {
    descriptionMap(setting) {
      return [
        { selector: 'group',
          fn: settingDesc => settingDesc.key === setting.key,
          keysToGetData: [setting.group, setting.key] },
        { selector: ['group', 'without_key'],
          fn: settingDesc => settingDesc.group === setting.group,
          keysToGetData: [setting.group] },
        { selector: ['group', 'without_key', 'single_setting'],
          fn: settingDesc => settingDesc.children && settingDesc.children[0].key === setting.children[0].key,
          keysToGetData: [setting.group, setting.children[0].key] }
      ]
    },
    closeLocalTabs() {
      this.collapseExistingEmojis()
      this.activeLocalPack = ''
    },
    closeRemoteTabs() {
      this.collapseExistingEmojis()
      this.activeRemotePack = ''
    },
    collapseExistingEmojis() {
      if (this.$refs.localEmojiPack && this.$refs.localEmojiPack.length > 0) {
        this.$refs.localEmojiPack.forEach(el => el.collapse())
      }
      if (this.$refs.remoteEmojiPack && this.$refs.remoteEmojiPack.length > 0) {
        this.$refs.remoteEmojiPack.forEach(el => el.collapse())
      }
    },
    createLocalPack() {
      this.$store.dispatch('CreatePack', { name: this.newPackName })
        .then(() => {
          this.newPackName = ''

          this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage)
          this.$store.dispatch('ReloadEmoji')
        })
    },
    handleLocalPageChange(page) {
      this.$store.dispatch('FetchLocalEmojiPacks', page)
    },
    handleRemotePageChange(page) {
      this.$store.dispatch('SetRemoteEmojiPacks', { page, remoteInstance: this.remoteInstanceAddress })
    },
    importFromFS() {
      this.$store.dispatch('ImportFromFS')
        .then(() => {
          this.$store.dispatch('FetchLocalEmojiPacks', this.currentLocalPacksPage)
          this.$store.dispatch('ReloadEmoji')
        })
    },
    async onSubmit() {
      try {
        await this.$store.dispatch('SubmitChanges')
      } catch (e) {
        return
      }
      this.$message({
        type: 'success',
        message: i18n.t('settings.success')
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
      await this.$store.dispatch('SetRemoteEmojiPacks', { page: 1, remoteInstance: this.remoteInstanceAddress })
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
    settingData(setting) {
      const { keysToGetData } = this.descriptionMap(setting).find(({ selector }) => _.isEqual(selector, setting.type))
      return _.get(this.settings.settings, keysToGetData) || {}
    },
    settingDesc(setting) {
      const { fn } = this.descriptionMap(setting).find(({ selector }) => _.isEqual(selector, setting.type))
      return this.settings.description.find(fn)
    },
    showDivider(index, setting) {
      return this.settingDesc(setting) && index < this.settingsPerTab.length - 1
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/settings';
@include settings;
@include emoji;
</style>
