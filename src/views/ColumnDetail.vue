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
        <button
          class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
          @click="loadMorePage"
          v-if="!isLastPage"
        >
          加载更多
        </button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostList from '@/components/PostList.vue'
import { ColumnProps, GlobalDataProps } from '@/testData'
import useLoadMore from '@/hooks/useLoadMore'
export default defineComponent({
  components: {
    PostList
  },
  setup () {
    const route = useRoute() // vue3内获取路由参数信息
    const currentId = route.params.id
    const store = useStore<GlobalDataProps>()
    /* 拿到栏目id要及时更新store内的数据,否则下面的计算属性会报错 */
    store.commit('initLoadedColumns', currentId)
    const currentPage = computed(() => store.state.posts.loadedColumns[currentId as string].currentPage)
    const total = computed(() => store.state.posts.loadedColumns[currentId as string].total)
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { clounmId: currentId, pageSize: 2 })
    })
    const column = computed<ColumnProps | undefined>(() => store.getters.getCloumnById(currentId))
    const posts = computed(() => store.getters.getPostsById(currentId))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, { clounmId: currentId as string, currentPage, pageSize: 2 })
    return {
      column,
      posts,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style lang="css" scoped>

</style>
