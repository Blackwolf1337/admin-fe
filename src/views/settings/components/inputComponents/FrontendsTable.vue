<template>
  <el-form :label-position="labelPosition" :label-width="labelWidth" class="frontend-container">
    <el-form-item class="description-container">
      <span class="setting-label">{{ $t('settings.availableFrontends') }}</span>
      <span class="expl no-top-margin"><p>{{ $t('settings.installFrontends') }}</p></span>
    </el-form-item>
    <el-form-item>
      <el-table
        :data="availableFrontends"
        class="frontends-table">
        <el-table-column
          :label="$t('settings.name')"
          prop="name"
          width="120"/>
        <el-table-column
          :label="$t('settings.git')"
          prop="git"/>
        <el-table-column
          :label="$t('settings.installed')"
          prop="installed">
          <template slot-scope="scope">
            <frontend-status-button :frontend="scope.row"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="frontends-button-container">
        <el-button
          :size="isDesktop ? 'medium' : 'mini'"
          :icon="frontendInputOpen ? 'el-icon-minus' : 'el-icon-plus'"
          circle
          @click="toggleFrontendInput"/>
        <span class="icons-button-desc">{{ $t('settings.installAnotherFrontend') }}</span>
      </div>
      <el-form v-if="frontendInputOpen" ref="frontendFormData" :rules="rules" :model="frontendFormData" label-width="130px">
        <el-form-item :label="$t('settings.name')" class="frontend-form-input" prop="name">
          <el-input v-model="frontendFormData.name"/>
        </el-form-item>
        <el-form-item :label="$t('settings.ref')" class="frontend-form-input">
          <el-input v-model="frontendFormData.ref"/>
        </el-form-item>
        <el-form-item :label="$t('settings.file')" class="frontend-form-input">
          <el-input v-model="frontendFormData.file"/>
        </el-form-item>
        <el-form-item :label="$t('settings.buildUrl')" class="frontend-form-input">
          <el-input v-model="frontendFormData.buildUrl"/>
        </el-form-item>
        <el-form-item :label="$t('settings.buildDir')" class="frontend-form-input">
          <el-input v-model="frontendFormData.buildDir"/>
        </el-form-item>
        <el-form-item class="install-frontend-button">
          <el-button :loading="buttonLoading" type="primary" @click="installNewFrontend">{{ $t('settings.install') }}</el-button>
        </el-form-item>
      </el-form>
    </el-form-item>
  </el-form>
</template>

<script>
import i18n from '@/lang'
import { mapGetters } from 'vuex'
import FrontendStatusButton from './FrontendStatusButton'

export default {
  name: 'FrontendsTable',
  components: { FrontendStatusButton },
  data() {
    return {
      buttonLoading: false,
      frontendInputOpen: false,
      frontendFormData: {
        name: '',
        ref: '',
        file: '',
        buildUrl: '',
        buildDir: ''
      },
      rules: {
        name: { required: true, message: 'Please input Name', trigger: 'blur' }
      }
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    availableFrontends() {
      return this.settings.frontends
    },
    labelPosition() {
      return this.isMobile ? 'top' : 'right'
    },
    labelWidth() {
      if (this.isMobile) {
        return '120px'
      } else if (this.isTablet) {
        return '200px'
      } else {
        return '280px'
      }
    },
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    isTablet() {
      return this.$store.state.app.device === 'tablet'
    }
  },
  async mounted() {
    await this.$store.dispatch('FetchFrontends')
  },
  methods: {
    installNewFrontend() {
      this.$refs['frontendFormData'].validate(async(valid) => {
        if (valid) {
          this.buttonLoading = true
          try {
            await this.$store.dispatch('InstallFrontend', this.frontendFormData)
          } catch (e) {
            this.buttonLoading = false
            return
          }
          this.buttonLoading = false
          this.$message({
            message: i18n.t('settings.frontendSuccess'),
            type: 'success',
            duration: 5 * 1000
          })
          this.frontendFormData = {
            name: '',
            ref: '',
            file: '',
            buildUrl: '',
            buildDir: ''
          }
        } else {
          return false
        }
      })
    },
    toggleFrontendInput() {
      this.frontendInputOpen = !this.frontendInputOpen
    }
  }
}
</script>
