<template>
  <div class="image-upload-area">
    <div class="input-row">
      <div :style="dimensions" class="image-upload-wrapper">
        <div :style="dimensions" class="image-upload-overlay">
          <input
            :aria-label="$t('settings.changeImage')"
            class="input-file"
            type="file"
            accept=".jpg,.jpeg,.png"
            @change="handleFiles" >
          <div class="caption">
            {{ $t('settings.changeImage') }}
          </div>
          <el-image
            v-loading="loading"
            :src="imageUrl"
            :style="dimensions"
            class="uploaded-image"
            fit="cover" />
        </div>
      </div>
    </div>
    <div class="image-button-group">
      <el-button class="upload-button" size="small">
        {{ $t('settings.uploadImage') }}
        <input
          :aria-label="$t('settings.changeImage')"
          class="input-file"
          type="file"
          accept=".jpg,.jpeg,.png"
          @change="handleFiles">
      </el-button>
      <el-button v-if="!isDefault" type="danger" size="small" style="margin-left: 5px;" @click="removeFile">
        {{ $t('settings.remove') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { baseName } from '@/api/utils'
import { uploadMedia } from '@/api/mediaUpload'
import Update from './Update'

export default {
  name: 'ImageUploadInput',
  extends: Update,
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'authHost'
    ]),
    fullSize() {
      return _.isEqual(this.setting.type, ['string', 'image', 'full_size'])
    },
    dimensions() {
      return {
        width: this.fullSize ? '100%' : '100px',
        height: this.fullSize ? '250px' : '100px'
      }
    },
    imageUrl() {
      const url = this.inputValue
      if (_.isString(url)) {
        const isUrl = url.startsWith('http') || url.startsWith('https')
        return isUrl ? url : this.baseName + url
      } else {
        return this.defaultImage
      }
    },
    isDefault() {
      return this.defaultImage === this.inputValue
    },
    defaultImage() {
      return this.baseName + _.get(this.setting, 'suggestions[0]')
    },
    baseName() {
      return baseName(this.authHost)
    }
  },
  methods: {
    handleFiles(event) {
      const file = event.target.files[0]
      if (!file) { return }
      const reader = new FileReader()
      reader.onload = ({ target }) => {
        const formData = new FormData()
        formData.append('file', file)
        this.loading = true
        uploadMedia({ formData, authHost: this.authHost }).then(response => {
          this.loading = false
          this.update(
            response.url,
            this.settingGroup.group,
            this.settingGroup.key,
            this.settingParent,
            this.setting.key,
            this.setting.type,
            this.nested
          )
        })
      }
      reader.readAsDataURL(file)
    },
    removeFile() {
      this.update(
        this.defaultImage,
        this.settingGroup.group,
        this.settingGroup.key,
        this.settingParent,
        this.setting.key,
        this.setting.type,
        this.nested
      )
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../../styles/settings';
@include settings;
</style>
