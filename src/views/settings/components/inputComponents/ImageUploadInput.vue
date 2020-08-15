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
            :src="imageUrl(inputValue)"
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
      <el-button v-if="!isDefault" type="danger" size="small" style="margin-left: 5px;" @click="removeFile()">
        {{ $t('settings.remove') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { baseName } from '../../../../api/utils'
import { uploadMedia } from '../../../../api/mediaUpload'

export default {
  name: 'ImageUploadInput',
  props: {
    inputValue: {
      type: [String, Object],
      default: function() {
        return {}
      }
    },
    setting: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
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
      if (_.includes([':background', ':nsfwCensorImage'], this.setting.key)) {
        return true
      }

      return false
    },
    dimensions() {
      return {
        width: this.fullSize ? '100%' : '100px',
        height: this.fullSize ? '250px' : '100px'
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
    imageUrl(url) {
      if (_.isString(url)) {
        const isUrl = url.startsWith('http') || url.startsWith('https')
        return isUrl ? url : this.baseName + url
      } else {
        return this.defaultImage
      }
    },
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
          this.$emit('change', response.url)
        })
      }
      reader.readAsDataURL(file)
    },
    removeFile() {
      this.$emit('change', this.defaultImage)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
@import '../../styles/main';
@include settings;

.image-upload-area {
  .input-row {
    display: flex;
    align-items: center;
  }

  .input-file {
    z-index: 100;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .image-button-group {
    margin-top: 20px;

    .upload-button {
      position: relative;
    }
  }

  .image-upload-wrapper {
    position: relative;

    .image-upload-overlay {
      transition: box-shadow .1s;
      border-radius: 5px;

      .caption {
        visibility: hidden;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 10px;
        text-transform: uppercase;;
        color: #fff;
        z-index: 9;
        transition: box-shadow .1s;
      }

      .uploaded-image {
        border-radius: 5px;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
      }

      &:hover {
        visibility: visible;
        cursor: pointer;
        border-radius: 5px;

        .el-image__error {
          visibility: hidden;
        }

        .caption {
          visibility: visible;
          box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1), inset 0 0 120px 25px rgba(0, 0, 0, 0.8);
          border-radius: 5px;
        }
      }
    }
  }
}

</style>
