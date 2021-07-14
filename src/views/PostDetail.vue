<template>
  <div class="post-detail-page">
    <Modal title="删除文章" :visible="isModalVisible"
      @modal-on-close="isModalVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确认删除文章吗?</p>
    </Modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img
        :src="currentImageUrl"
        alt="currentPost.title"
        class="rounded-lg img-fluid my-4"
        v-if="currentImageUrl"
      />
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div
        class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
      >
        <div class="col">
          <user-profile
            :user="currentPost.author"
            v-if="typeof currentPost.author === 'object'"
          ></user-profile>
        </div>
        <span class="text-muted col text-right font-italic"
          >发表于: {{ currentPost.createdAt }}</span
        >
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{ name: 'createPost', query: { id: currentPost._id } }"
        >
          编辑
        </router-link>
        <button type="button" class="btn btn-danger" @click.prevent="isModalVisible = true">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import MarkdownIt from 'markdown-it'
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PostProps, ImageProps, GlobalDataProps, UserProps, RespProps } from '@/testData'
import UserProfile from '@/components/UserProfile.vue'
import Modal from '@/components/Modal.vue'
import createMessage from '@/components/createMessage'
export default defineComponent({
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const currentId = route.params.id
    const md = new MarkdownIt()
    const isModalVisible = ref(false)
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const currentHTML = computed(() => {
      const { content, isHTML } = currentPost.value
      if (currentPost.value && content) {
        return isHTML ? content : md.render(content)
      } else {
        return ''
      }
    })
    const showEditArea = computed(() => {
      const { _id, isLogin } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const hideAndDelete = () => {
      isModalVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: RespProps<PostProps>) => {
        createMessage('删除成功，2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: rawData.data.column } })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea,
      isModalVisible,
      hideAndDelete
    }
  }
})
</script>

<style lang="css" scoped>

</style>
