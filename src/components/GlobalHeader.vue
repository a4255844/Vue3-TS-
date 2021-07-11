<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">之乎者也专栏</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <Dropdown :title="`欢迎 ${user.nickName}`">
          <DropdownItem >
            <router-link to="/createPost" class="dropdown-item">新建文章</router-link>
          </DropdownItem>
          <DropdownItem disabled>
            <a href="#" class="dropdown-item">编辑资料</a>
          </DropdownItem>
          <DropdownItem >
            <span href="#" class="dropdown-item" @click.prevent="loginout">退出登录</span>
          </DropdownItem>
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import { UserProps } from '@/testData'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const loginout = () => {
      store.commit('loginout')
      router.push('/login')
    }
    return {
      loginout
    }
  }
})
</script>

<style lang="css" scoped>

</style>
