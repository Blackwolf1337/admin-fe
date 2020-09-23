<template>
  <div class="media-proxy-cache-container">
    <div class="media-proxy-cache-header-container">
      <h1>{{ $t('mediaProxyCache.mediaProxyCache') }}</h1>
      <reboot-button/>
    </div>
    <div v-if="mediaProxyEnabled">
      <p class="media-proxy-cache-header">{{ $t('mediaProxyCache.evictObjectsHeader') }}</p>
      <div class="url-input-container">
        <el-input
          :placeholder="$t('mediaProxyCache.url')"
          v-model="urls"
          type="textarea"
          autosize
          clearable
          class="url-input"/>
        <el-checkbox v-model="ban">{{ $t('mediaProxyCache.ban') }}</el-checkbox>
        <el-button class="evict-button" @click="evictURL">{{ $t('mediaProxyCache.evict') }}</el-button>
      </div>
      <span class="expl url-input-expl">{{ $t('mediaProxyCache.multipleInput') }}</span>
      <p class="media-proxy-cache-header">{{ $t('mediaProxyCache.listBannedUrlsHeader') }}</p>
      <el-table
        v-loading="loading"
        :data="bannedUrls"
        class="banned-urls-table"
        @selection-change="handleSelectionChange">>
        <el-table-column
          type="selection"
          align="center"
          width="55"/>
        <el-table-column :min-width="isDesktop ? 320 : 120" prop="url">
          <template slot="header" slot-scope="scope">
            <el-input
              :placeholder="$t('users.search')"
              v-model="search"
              size="mini"
              prefix-icon="el-icon-search"
              @input="handleDebounceSearchInput"/>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <el-button
              :disabled="removeSelectedDisabled"
              size="mini"
              class="remove-url-button"
              @click="removeSelected()">{{ $t('mediaProxyCache.removeSelected') }}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="remove-url-button"
              @click="removeUrl(scope.row.url)">{{ $t('mediaProxyCache.remove') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!loading" class="pagination">
        <el-pagination
          :total="urlsCount"
          :current-page="currentPage"
          :page-size="pageSize"
          hide-on-single-page
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    <div v-else class="enable-mediaproxy-container">
      <el-button type="text" @click="enableMediaProxy">{{ $t('mediaProxyCache.enable') }}</el-button>
      {{ $t('mediaProxyCache.invalidationAndMediaProxy') }}
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import RebootButton from '@/components/RebootButton'

export default {
  name: 'MediaProxyCache',
  components: { RebootButton },
  data() {
    return {
      urls: '',
      ban: false,
      search: '',
      selectedUrls: []
    }
  },
  computed: {
    bannedUrls() {
      return this.$store.state.mediaProxyCache.bannedUrls
    },
    currentPage() {
      return this.$store.state.mediaProxyCache.currentPage
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    loading() {
      return this.$store.state.mediaProxyCache.loading
    },
    mediaProxyEnabled() {
      return this.$store.state.mediaProxyCache.mediaProxyEnabled
    },
    pageSize() {
      return this.$store.state.mediaProxyCache.pageSize
    },
    removeSelectedDisabled() {
      return this.selectedUrls.length === 0
    },
    urlsCount() {
      return this.$store.state.mediaProxyCache.totalUrlsCount
    }
  },
  created() {
    this.handleDebounceSearchInput = debounce((query) => {
      this.$store.dispatch('SearchUrls', { query, page: 1 })
    }, 500)
  },
  mounted() {
    this.$store.dispatch('GetNodeInfo')
    this.$store.dispatch('NeedReboot')
    this.$store.dispatch('FetchMediaProxySetting')
    this.$store.dispatch('ListBannedUrls', { page: 1 })
  },
  methods: {
    enableMediaProxy() {
      this.$confirm(
        this.$t('mediaProxyCache.confirmEnablingMediaProxy'),
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('mediaProxyCache.enableMediaProxySuccessMessage')
        })
        this.$store.dispatch('EnableMediaProxy')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled'
        })
      })
    },
    evictURL() {
      const urls = this.splitUrls(this.urls)
      this.$store.dispatch('PurgeUrls', { urls, ban: this.ban })
      this.urls = ''
    },
    handlePageChange(page) {
      this.$store.dispatch('ListBannedUrls', { page })
    },
    handleSelectionChange(value) {
      this.$data.selectedUrls = value
    },
    removeSelected() {
      const urls = this.selectedUrls.map(el => el.url)
      this.$store.dispatch('RemoveBannedUrls', urls)
      this.selectedUrls = []
    },
    removeUrl(url) {
      this.$store.dispatch('RemoveBannedUrls', [url])
    },
    splitUrls(urls) {
      return urls.split(',').map(url => url.trim()).filter(el => el.length > 0)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
h1 {
  margin: 0;
}
.enable-mediaproxy-container {
  margin: 10px 15px;
  button {
    font-size: 16px;
  }
}
.expl {
  color: #666666;
  font-size: 13px;
  line-height: 22px;
  margin: 5px 0 0 0;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}
.banned-urls-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
.evict-button {
  margin-left: 15px;
}
.media-proxy-cache-header {
  margin-left: 15px;
  margin-top: 22px;
  font-weight: 500;
}
.media-proxy-cache-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 15px;
}
.pagination {
  margin: 25px 0;
  text-align: center;
}
.remove-url-button {
  width: 150px;
}
.url-input {
  margin-right: 15px;
}
.url-input-container {
  display: flex;
  align-items: baseline;
  margin: 15px 15px 5px 15px;
}
.url-input-expl {
  margin-left: 15px;
}

@media only screen and (max-width:480px) {
  .url-input {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
