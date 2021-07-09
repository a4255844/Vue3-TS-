<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h4 class="my-4 text-center">注册之乎者也账号</h4>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <ValidateInput :rules="emailRules" v-model="email" type="text" placeholder="请输入邮箱"/>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <ValidateInput :rules="nameRules" v-model="nickName" type="text" placeholder="请输入昵称"/>
      </div>
       <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput :rules="passwordRules" v-model="password" type="password" placeholder="请输入密码"/>
      </div>
      <div class="mb-3">
        <label class="form-label">确认密码</label>
        <ValidateInput :rules="repeatPasswordRules" v-model="repeatPassword" type="password" placeholder="确认密码"/>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary">Submit</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '确认密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '两次密码不一致'
      }
    ]
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const router = useRouter()
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { email, password, nickName } = formData
        axios.post('/users', { email, password, nickName }).then(() => {
          createMessage('创建用户成功,请在登录页面登录', 'success')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        })
      }
    }
    return {
      ...toRefs(formData),
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules,
      onFormSubmit
    }
  }
})
</script>

<style lang="css" scoped>

</style>
