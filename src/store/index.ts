import { createStore, Commit } from 'vuex'
import { ColumnProps, PostProps } from '@/testData'
import axios from 'axios'
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

export interface GlobalDataProps {
  isLoading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const asyncAndCommit = async ( // 处理异步请求的action公共函数
  url: string,
  mutation: string,
  commit: Commit
) => {
  const resp = await axios.get(url)
  commit(mutation, resp.data)
}
const store = createStore<GlobalDataProps>({
  state: {
    isLoading: false,
    columns: [],
    posts: [],
    user: { isLogin: false, name: 'syb', columnId: 1 }
  },
  mutations: {
    login (state) {
      state.user = { isLogin: true, name: 'syb', columnId: 1 }
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.list
    },
    setLoading (state, status) {
      state.isLoading = status
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      asyncAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) { // 使用async,await的方式发请求
      asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    }
  },
  /* getters相当于全局计算属性,可供多个组件使用 */
  getters: {
    getCloumnById: (state) => (id:string) => state.columns.find(columns => columns._id === id),
    getPostsById: (state) => (id:string) => state.posts.filter(post => post.column === id)
  }
})
export default store
