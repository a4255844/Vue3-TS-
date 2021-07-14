import { createStore, Commit } from 'vuex'
import { GlobalErrorProps, GlobalDataProps } from '@/testData'
import { objToArr, arrToObj } from '@/helper'
import axios, { AxiosRequestConfig } from 'axios'
const asyncAndCommit = async (
  url: string,
  mutation: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any
) => {
  const resp = await axios(url, config)
  if (extraData) {
    console.log(resp, extraData)
    commit(mutation, { resp, extraData })
  } else {
    commit(mutation, resp)
  }
  return resp
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    isLoading: false,
    columns: { data: {}, total: 0, currentPage: 1 },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false, _id: '' }
  },
  mutations: {
    // login (state) {
    //   state.user = { isLogin: true, name: 'syb', columnId: 1 }
    // },
    createPost (state, newPost) {
      state.posts.data[newPost.data._id] = newPost.data
    },
    fetchColumns (state, rawData) {
      const { list, count } = rawData.data
      let { currentPage } = rawData.data
      state.columns = {
        data: { ...state.columns.data, ...arrToObj(list) },
        total: count,
        currentPage: ++currentPage
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { resp: rawData, extraData: columnId }) {
      const { list, count } = rawData.data
      let currentPage = rawData.data.currentPage
      state.posts.data = { ...state.posts.data, ...arrToObj(list) }
      state.posts.loadedColumns[columnId] = { total: count, currentPage: ++currentPage }
    },
    fetchPost (state, rawData) {
      console.log(rawData)
      state.posts.data[rawData.data._id] = rawData.data
    },
    setLoading (state, status) {
      state.isLoading = status
    },
    login (state, data) {
      console.log(data)
      const { token } = data.data
      localStorage.setItem('token', token) // 储存到本地
      state.token = token
    },
    fetchUserInfo (state, data) {
      state.user = { ...data.data, isLogin: true }
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    loginout (state) {
      state.token = ''
      state.user.isLogin = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    /* 初始化posts缓存数据, 第一时间拿到栏目id并初始化此栏目的total和currentPage数据,以便在组件中使用 */
    initLoadedColumns (state, clounmId) {
      if (!state.posts.loadedColumns[clounmId]) {
        state.posts.loadedColumns[clounmId] = { total: 0, currentPage: 1 }
      }
    }
  },
  actions: {
    fetchColumns ({ state, commit }, { currentPage = 1, pageSize = 6 }) {
      // if (!state.columns.isLoaded) {
      //   return asyncAndCommit('/columns', 'fetchColumns', commit)
      // }
      if (state.columns.currentPage <= currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, { clounmId, currentPage = 1, pageSize = 6 }) {
      // if (!state.posts.loadedColumns.includes(cid)) {
      //   return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      // }
      const { loadedColumns } = state.posts
      if (!loadedColumns[clounmId] || currentPage >= loadedColumns[clounmId].currentPage) {
        return asyncAndCommit(`/columns/${clounmId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, clounmId)
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    login ({ commit }, loginData) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: loginData })
    },
    fetchUserInfo ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchUserInfo', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        dispatch('fetchUserInfo')
      })
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    updatePost ({ commit }, { id, payload }) {
      console.log(id, payload)
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, { method: 'patch', data: payload })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    }
  },
  /* getters相当于全局计算属性,可供多个组件使用 */
  getters: {
    getCloumnById: (state) => (id:string) => state.columns.data[id],
    getCloumnsById: (state) => objToArr(state.columns.data),
    // getPostsById: (state) => (id:string) => state.posts.filter(post => post.column === id)
    getPostsById: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => state.posts.data[id]
  }
})
export default store
