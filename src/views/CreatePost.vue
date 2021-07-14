<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? "编辑文章" : "新建文章" }}</h4>
    <Uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="onFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span style="marign-left 50px" class="sr-only">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps" >
        <img :src="dataProps.uploadedData.url">
      </template>
      <template #error>
        上传失败
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        >
        </validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? "更新文章" : "发表文章" }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '@/helper'
import { RespProps, ImageProps, PostProps, GlobalDataProps } from '@/testData'
export default defineComponent({
  components: {
    ValidateForm,
    ValidateInput,
    Uploader
  },
  setup () {
    const titleVal = ref('')
    const contentVal = ref('')
    const uploadedData = ref() // 用于给编辑组件传递图片数据的回显
    let imageId = ''
    const route = useRoute()
    const isEditMode = !!route.query.id
    /* 用于编辑组件的逻辑 */
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rowData:RespProps<PostProps>) => {
          const currentPost = rowData.data
          if (currentPost.image) {
            uploadedData.value = currentPost.image
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content
        })
      }
    })
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const onFormSubmit = (result:boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (!column) return
        const newPost: PostProps = {
          title: titleVal.value,
          content: contentVal.value,
          column,
          author: _id
        }
        if (imageId) {
          newPost.image = imageId
        }
        const action = isEditMode ? 'updatePost' : 'createPost'
        const data = isEditMode ? { id: route.query.id, payload: newPost } : newPost
        store.dispatch(action, data).then(() => {
          createMessage(`${isEditMode ? '修改' : '添加'}文章成功,2秒后跳转至该栏目`, 'success')
          setTimeout(() => {
            router.push(`/column/${column}`)
          }, 2000)
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 0.2 })
      if (!result.passed) {
        if (result.error === 'size') {
          createMessage('图片大小不能超过0.2MB', 'error')
        }
        if (result.error === 'format') {
          createMessage('图片仅支持jpeg/png格式!', 'error')
        }
      }
      return result.passed
    }
    const onFileUploaded = (rowData: RespProps<ImageProps>) => {
      if (rowData.data._id) {
        imageId = rowData.data._id
      }
      createMessage(`上传成功${rowData.data._id}`, 'success')
    }
    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      uploadedData,
      onFormSubmit,
      uploadCheck,
      onFileUploaded,
      isEditMode
    }
  }
})
</script>

<style lang="css">
.create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
    height: hidden;
}
.create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
