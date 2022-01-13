<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
      @open="handleOpen"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import router from '@/router'
import { asyncRouterMap } from '@/router'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'roles',
      'sidebar',
      'tabs'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.$store.dispatch('FetchOpenReportsCount')
  },
  methods: {
    getMergedRoutes() {
      const routes = router.getRoutes().filter(item => !item.hidden)
      return routes.reduce((acc, element) => {
        if (!element.parent || element.parent.path !== '/settings') {
          return acc
        } else {
          const index = acc.findIndex(route => route.path === '/settings')
          acc[index] = { ...acc[index], children: [...acc[index].children, element] }
          return acc
        }
      }, [...asyncRouterMap])
    },
    async handleOpen($event) {
      if ($event === '/settings') {
        let settingsTabs = localStorage.getItem('settingsTabs')
        if (settingsTabs === '[]') {
          localStorage.removeItem('settingsTabs')
          settingsTabs = null
        }
        if (!settingsTabs) {
          await this.$store.dispatch('FetchSettings')
          const menuItems = this.tabs
          localStorage.setItem('settingsTabs', JSON.stringify(menuItems))

          menuItems.forEach(({ label, path }) => {
            router.addRoute('Settings', {
              path,
              component: () => import(`@/views/settings`),
              name: label,
              meta: { title: label }
            })
          })
          const routes = this.getMergedRoutes()
          this.$store.dispatch('GenerateRoutes', { roles: this.roles, _routesWithSettings: routes })
        }
        let isRequesting = true
        const step = () => {
          document.querySelector('#settings').scrollIntoView({ block: 'start', behavior: 'smooth' })
          if (isRequesting) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        setTimeout(() => {
          isRequesting = false
        }, 300) // this equals to the hide-timeout of the el-submenu
      }
    }
  }
}
</script>
