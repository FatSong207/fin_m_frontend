import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Index from '../views/index/Index.vue'
import { useLauncherInfoStore } from '../store/launcher'

const routes = [
  {
    path: '/',
    component: Index,
    redirect: '/checkInfo',
    children: [
      {
        path: '/:catchAll(.*)',
        redirect: '/404'
      },
      {
        path: `/checkInfo/launcher/:launcher/key/:key`,
        name: 'checkInfo',
        component: () => import('../views/index/CheckInfo.vue')
      },
      {
        path: '/cardInfo',
        name: 'cardInfo',
        component: () => import('../views/index/CardInfo.vue')
      },
      {
        path: '/channel',
        name: 'channel',
        component: () => import('../views/index/Channel.vue')
      },
      {
        path: '/amount/:key',
        name: 'amount',
        component: () => import('../views/index/Amount.vue')
      },
      {
        path: '/final',
        name: 'final',
        component: () => import('../views/index/Final.vue')
      },
      {
        path: '/error',
        name: 'error',
        component: () => import('../views/error/ParamErr.vue')
      },
      {
        path: '/404',
        name: 'Page404',
        component: () => import('../views/error/404.vue')
      },
      {
        path: '/failed',
        name: 'failed',
        component: () => import('../views/error/Failed.vue')
      },
      {
        path: '/403',
        name: 'Page403',
        component: () => import('../views/error/403.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: true
})

router.beforeEach(async (to, from) => {
  // console.log(to);
  const launcherInfoStore = useLauncherInfoStore()
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
