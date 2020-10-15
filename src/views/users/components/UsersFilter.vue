<template>
  <el-select
    v-model="value"
    :clearable="isDesktop"
    :placeholder="$t('usersFilter.inputPlaceholder')"
    multiple
    class="select-field"
    @change="toggleFilters">
    <el-option-group :label="$t('usersFilter.byAccountType')">
      <el-option value="local">{{ $t('usersFilter.local') }}</el-option>
      <el-option value="external">{{ $t('usersFilter.external') }}</el-option>
    </el-option-group>
    <el-option-group :label="$t('usersFilter.byStatus')">
      <el-option value="active">{{ $t('usersFilter.active') }}</el-option>
      <el-option value="deactivated">{{ $t('usersFilter.deactivated') }}</el-option>
      <el-option value="need_approval">{{ $t('usersFilter.pending') }}</el-option>
      <el-option value="unconfirmed">{{ $t('usersFilter.unconfirmed') }}</el-option>
    </el-option-group>
    <el-option-group :label="$t('usersFilter.byActorType')">
      <el-option value="Person">{{ $t('usersFilter.person') }}</el-option>
      <el-option value="Service">{{ $t('usersFilter.bot') }}</el-option>
      <el-option value="Application">{{ $t('usersFilter.application') }}</el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      value: ['local', 'active']
    }
  },
  computed: {
    isDesktop() {
      return this.$store.state.app.device === 'desktop'
    }
  },
  created() {
    const currentFilters = this.$data.value.reduce((acc, filter) => ({ ...acc, [filter]: true }), {})
    this.$store.dispatch('ToggleUsersFilter', currentFilters)
  },
  methods: {
    removeOppositeFilters() {
      const filtersQuantity = Object.keys(this.$store.state.users.filters).length
      const currentFilters = []
      const indexOfLocal = this.$data.value.indexOf('local')
      const indexOfExternal = this.$data.value.indexOf('external')
      const indexOfActive = this.$data.value.indexOf('active')
      const indexOfDeactivated = this.$data.value.indexOf('deactivated')
      const indexOfPending = this.$data.value.indexOf('need_approval')
      const indexOfUnconfirmed = this.$data.value.indexOf('unconfirmed')
      const indexOfPerson = this.$data.value.indexOf('Person')
      const indexOfService = this.$data.value.indexOf('Service')
      const indexOfApplication = this.$data.value.indexOf('Application')

      if (this.$data.value.length === filtersQuantity) {
        return []
      }

      Math.max(indexOfLocal, indexOfExternal) > -1
        ? currentFilters.push(this.$data.value[Math.max(indexOfLocal, indexOfExternal)])
        : currentFilters

      Math.max(indexOfActive, indexOfDeactivated, indexOfPending, indexOfUnconfirmed) > -1
        ? currentFilters.push(this.$data.value[Math.max(indexOfActive, indexOfDeactivated, indexOfPending, indexOfUnconfirmed)])
        : currentFilters

      const actorTypeFilters = [indexOfPerson, indexOfService, indexOfApplication].reduce((acc, index) => {
        if (index > -1) {
          currentFilters.push(this.$data.value[index])
          acc.push(this.$data.value[index])
        }
        return acc
      }, [])

      return [
        currentFilters,
        currentFilters.filter(filter => !actorTypeFilters.includes(filter)),
        actorTypeFilters
      ]
    },
    toggleFilters() {
      const [allFilters, filters, actorTypeFilters] = this.removeOppositeFilters()

      this.$data.value = allFilters
      const currentFilters = filters.reduce((acc, filter) => ({ ...acc, [filter]: true }), {})
      this.$store.dispatch('ToggleUsersFilter', currentFilters)
      this.$store.dispatch('ToggleActorTypeFilter', actorTypeFilters)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.select-field {
  width: 350px;
}

@media only screen and (max-width:480px) {
  .select-field {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>
