import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import store from '@/store'
import router from './router'
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

axios.defaults.baseURL = '/api'

axios.interceptors.request.use(config => {
  console.log('请求拦截器')
  store.commit('setError', { status: false, message: '' })
  store.commit('setLoading', true)
  const token = store.state.token // 从vuex内取出token
  if (token) { // 进行判断，如果有，保存到请求头authorization属性中
    config.headers.Authorization = 'Bearer ' + token
  } else { // 如果没有
    if (config.headers.needToken) { // 判断当前请求是否需要token，如果需要直接抛异常
      throw new Error('没有token,请重新登陆')
    }
  }
  return config
})

axios.interceptors.response.use(response => {
  store.commit('setLoading', false)
  return response.data
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return new Promise(() => { console.log('') }) // 中断promise链,语法检测报错
})
