import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'
import store from '@/store'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }

    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/createPost',
      name: 'createPost',
      component: CreatePost,
      meta: { requiredLogin: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { redirectAlreadyLogin, requiredLogin } = to.meta
  const { isLogin } = store.state.user
  if (!isLogin && requiredLogin) {
    next('/login')
  } else if (redirectAlreadyLogin && isLogin) {
    next('/')
  } else {
    next()
  }
})
export default router
