<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
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
          发表文章
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps } from '@/store'
import { PostProps } from '@/testData'
export default defineComponent({
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const titleVal = ref('')
    const contentVal = ref('')
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
        const { column } = store.state.user
        if (!column) return
        const newPost: PostProps = {
          _id: Date.now() + '',
          title: titleVal.value,
          content: contentVal.value,
          createdAt: new Date().toLocaleString(),
          column: '1321321321'
        }
        store.commit('creaePost', newPost)
        router.push(`/column/${column}`)
      }
    }
    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      onFormSubmit
    }
  }
})
</script>

<style lang="css" scoped>

</style>
