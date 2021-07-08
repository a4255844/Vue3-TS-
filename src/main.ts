import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import router from './router'
import axios from 'axios'
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

axios.defaults.baseURL = '/api'

axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})

axios.interceptors.response.use(response => {
  store.commit('setLoading', false)
  return response.data
}, e => {
  // const { error } = e.response.data
  store.commit('setLoading', false)
  return Promise.reject(e.response.data)
})
