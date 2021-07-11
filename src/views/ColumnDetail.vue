<template>
   <div class="column-detail-page w-75 mx-auto">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border w-100">
            </div>
            <div class="col-9">
                <h4>{{column.title}}</h4>
                <p class="text-muted">{{column.description}}</p>
            </div>
        </div>
        <post-list :list="posts"></post-list>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostList from '@/components/PostList.vue'
import { ColumnProps, GlobalDataProps } from '@/testData'
export default defineComponent({
  components: {
    PostList
  },
  setup () {
    const route = useRoute() // vue3内获取路由参数信息
    const currentId = route.params.id
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    const column = computed<ColumnProps | undefined>(() => store.getters.getCloumnById(currentId))
    const posts = computed(() => store.getters.getPostsById(currentId))
    return {
      column,
      posts
    }
  }
})
</script>

<style lang="css" scoped>

</style>
