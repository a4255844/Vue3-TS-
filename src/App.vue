<template>
  <div class="container">
    <GlobalHeader :user="user"/>
    <!-- <ColumnList :list="list"/> -->
    <ValidateForm @from-submit="onFormSubmit">
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
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const testData : ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '测试专栏test1,很好很强大',
    avatar: ''
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '测试专栏test2,很好很强大',
    avatar: 'http....'
  },
  {
    id: 3,
    title: 'test2的专栏',
    description: '测试专栏test2,很好很强大',
    avatar: ''
  },
  {
    id: 4,
    title: 'test2的专栏',
    description: '测试专栏test2,很好很强大',
    avatar: 'http....'
  }
]
const testUser : UserProps = {
  isLogin: true,
  name: 'syb'
}
export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
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
    const onFormSubmit = (result: boolean) => {
      console.log('result:', result)
    }

    return {
      list: testData,
      user: testUser,
      emailRules,
      emailVal,
      passwardRules,
      pwdVal,
      onFormSubmit
    }
  }
})
</script>
