import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

const disabledFeatures = process.env.DISABLED_FEATURES || []
const settingsDisabled = disabledFeatures.includes('settings')
const settings = {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/settings/index'),
      name: 'Settings',
      meta: { title: 'Settings', icon: 'el-icon-setting', noCache: true }
    }
  ]
}

const statusesDisabled = disabledFeatures.includes('statuses')
const statuses = {
  path: '/statuses',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/statuses/index'),
      name: 'Statuses',
      meta: { title: 'Statuses', icon: 'el-icon-chat-line-square', noCache: true }
    }
  ]
}

const reportsDisabled = disabledFeatures.includes('reports')
const reports = {
  path: '/reports',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/reports/index'),
      name: 'Reports',
      meta: { title: 'Reports', icon: 'el-icon-receiving', noCache: true }
    }
  ]
}

const invitesDisabled = disabledFeatures.includes('invites')
const invites = {
  path: '/invites',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/invites/index'),
      name: 'Invites',
      meta: { title: 'Invites', icon: 'el-icon-postcard', noCache: true }
    }
  ]
}

const emojiPacksDisabled = disabledFeatures.includes('emoji-packs')
const emojiPacks = {
  path: '/emoji_packs',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/emojiPacks/index'),
      name: 'Emoji Packs',
      meta: { title: 'Emoji Packs', icon: 'el-icon-picture-outline-round', noCache: true }
    }
  ]
}

const moderationLogDisabled = disabledFeatures.includes('moderation-log')
const moderationLog = {
  path: '/moderation_log',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/moderationLog/index'),
      name: 'Moderation Log',
      meta: { title: 'moderationLog', icon: 'el-icon-notebook-2', noCache: true }
    }
  ]
}

const mediaProxyCacheDisabled = disabledFeatures.includes('media-proxy-cache')
const mediaProxyCache = {
  path: '/media_proxy_cache',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/mediaProxyCache/index'),
      name: 'MediaProxy Cache',
      meta: { title: 'mediaProxyCache', icon: 'example', noCache: true }
    }
  ]
}

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login-pleroma',
    component: () => import('@/views/login/pleroma'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/users/index'
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/users/index'),
        name: 'Users',
        meta: { title: 'users', icon: 'el-icon-user', noCache: true }
      }
    ]
  },
  ...(statusesDisabled ? [] : [statuses]),
  ...(reportsDisabled ? [] : [reports]),
  ...(invitesDisabled ? [] : [invites]),
  ...(emojiPacksDisabled ? [] : [emojiPacks]),
  ...(moderationLogDisabled ? [] : [moderationLog]),
  ...(mediaProxyCacheDisabled ? [] : [mediaProxyCache]),
  ...(settingsDisabled ? [] : [settings]),
  {
    path: '/users/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'UsersShow',
        component: () => import('@/views/users/show')
      }
    ],
    hidden: true
  },
  {
    path: '/statuses/:id',
    component: Layout,
    children: [
      {
        path: '',
        name: 'StatusShow',
        component: () => import('@/views/statuses/show')
      }
    ],
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]
