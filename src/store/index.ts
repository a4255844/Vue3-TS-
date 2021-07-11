import { createStore, Commit } from 'vuex'
import { GlobalErrorProps, GlobalDataProps } from '@/testData'
import { objToArr, arrToObj } from '@/helper'
import axios from 'axios'
const asyncAndCommit = async (
  url: string,
  mutation: string,
  commit: Commit,
  extraData?: any
) => {
  const resp = await axios.get(url)
  if (extraData) {
    console.log(resp, extraData)
    commit(mutation, { resp, extraData })
  } else {
    commit(mutation, resp)
  }
  return resp
}
const asyncAndCommitPost = async (
  url: string,
  data: any,
  mutation: string,
  commit: Commit
) => {
  const resp = await axios.post(url, data)
  commit(mutation, resp)
  return resp
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    isLoading: false,
    columns: [],
    posts: { data: {}, loadedColumns: [] },
    user: { isLogin: false, _id: '' }
  },
  mutations: {
    // login (state) {
    //   state.user = { isLogin: true, name: 'syb', columnId: 1 }
    // },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, { resp: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
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
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      return asyncAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, cid)
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      console.log(currentPost)
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    login ({ commit }, loginData) {
      return asyncAndCommitPost('/user/login', loginData, 'login', commit)
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
      return asyncAndCommitPost('/posts', payload, 'createPost', commit)
    }

  },
  /* getters相当于全局计算属性,可供多个组件使用 */
  getters: {
    getCloumnById: (state) => (id:string) => state.columns.find(columns => columns._id === id),
    // getPostsById: (state) => (id:string) => state.posts.filter(post => post.column === id)
    getPostsById: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => state.posts.data[id]
  }
})
export default store
