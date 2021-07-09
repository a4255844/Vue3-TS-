import { createStore, Commit } from 'vuex'
import { ColumnProps, PostProps, GlobalErrorProps } from '@/testData'
import axios from 'axios'
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  isLoading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const asyncAndCommit = async (
  url: string,
  mutation: string,
  commit: Commit
) => {
  const resp = await axios.get(url)
  commit(mutation, resp.data)
}
const asyncAndCommitPost = async (
  url: string,
  data: any,
  mutation: string,
  commit: Commit
) => {
  const resp = await axios.post(url, data)
  commit(mutation, resp.data)
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    isLoading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { isLogin: true, name: 'syb', columnId: 1 }
    // },
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
    },
    login (state, data) {
      console.log(data)
      const { token } = data
      localStorage.setItem('token', token) // 储存到本地
      state.token = token
    },
    fetchUserInfo (state, data) {
      state.user = { ...data, isLogin: true }
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
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
    },
    login ({ commit }, loginData) {
      return asyncAndCommitPost('/user/login', loginData, 'login', commit)
    },
    fetchUserInfo ({ commit }) {
      asyncAndCommit('/user/current', 'fetchUserInfo', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        dispatch('fetchUserInfo')
      })
    }
  },
  /* getters相当于全局计算属性,可供多个组件使用 */
  getters: {
    getCloumnById: (state) => (id:string) => state.columns.find(columns => columns._id === id),
    getPostsById: (state) => (id:string) => state.posts.filter(post => post.column === id)
  }
})
export default store
