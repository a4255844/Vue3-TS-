import { ComputedRef, computed, reactive } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  clounmId?: string;
  currentPage: ComputedRef<number>;
  pageSize: number;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>,
  params: LoadParams) => {
  const store = useStore()
  /* currentPage的初始值必须为2,但是store内的初始值是1,这是为了满足缓存条件所做的限制 */
  const requestParams = reactive({ // 发请求的参数currentPage应该是响应式的数据
    currentPage: params.currentPage.value === 1 ? 2 : params.currentPage.value,
    pageSize: params.pageSize,
    clounmId: params.clounmId
  })
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams).then(() => {
      requestParams.currentPage++
    })
  }
  const isLastPage = computed(() => Math.ceil(total.value / params.pageSize) < requestParams.currentPage)
  return {
    loadMorePage,
    isLastPage,
    currentPage: requestParams.currentPage
  }
}
export default useLoadMore
