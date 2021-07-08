<template>
  <div class="container">
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <ValidateInput :rules="emailRules" v-model="emailVal" type="text" placeholder="请输入邮箱"/>
      </div>
       <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput :rules="passwardRules" v-model="pwdVal" type="password" placeholder="请输入密码"/>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary">Submit</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailRules: RulesProp = [
      { type: 'required', message: '邮箱不能为空!' },
      { type: 'email', message: '邮箱格式不正确!' }
    ]
    const passwardRules: RulesProp = [
      { type: 'required', message: '密码不能为空!' },
      { type: 'password', message: '密码格式不正确,必须是6-12位!' }
    ]
    const emailVal = ref('')
    const pwdVal = ref('')
    const router = useRouter() // vue3内使用router
    const store = useStore()
    const onFormSubmit = (result: boolean) => {
      console.log('result:', result)
      if (result) {
        store.commit('login')
        router.push('/')
      }
    }

    return {
      emailRules,
      emailVal,
      passwardRules,
      pwdVal,
      onFormSubmit
    }
  }
})
</script>
