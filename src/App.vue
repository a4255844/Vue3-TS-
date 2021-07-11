<template>
  <div class="container">
    <GlobalHeader :user="user"/>
    <Loader v-if="isLoading"/>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 知乎专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from '@/components/Loader.vue'
// import Message from '@/components/Message.vue'
import createMessage from '@/components/createMessage'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/testData'
import 'bootstrap/dist/css/bootstrap.min.css'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)
    const isLoading = computed(() => store.state.isLoading)
    const error = computed(() => store.state.error)
    /* 监视error状态的变化, 创建全局提示的组件 */
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    // onMounted(() => {
    //   setTimeout(() => { // 不加定时器,不走拦截器,因为axios的全局配置还未生效
    //     if (store.state.token && !user.value.isLogin) {
    //       store.dispatch('fetchUserInfo')
    //     }
    //   }, 0)
    // })
    return {
      user,
      isLoading
    }
  }
})
</script>
