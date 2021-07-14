<template>
  <div class="validate-input-container pb-3">
    <!-- $attrs: 获取组件context内的非props标签属性对象,并使用v-bind添加到input标签上 -->
    <input
      v-if="tag === 'input'"
      type="text" class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <textarea  rows="10"
      v-else
      type="text" class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    </textarea>
    <span v-show="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const pwdReg = /^[a-z0-9]\d{5,11}$/
interface RuleProp {
  type: 'required' | 'email' | 'password' | 'custom';
  message: string;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type tagType = 'input' | 'textarea'

export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    // 给组件绑定v-model: 1.组件接收一个modelValue的props属性,2.发送事件,update:modelValue
    modelValue: String,
    tag: {
      type: String as PropType<tagType>,
      default: 'input'
    }
  },
  inheritAttrs: false, // 禁止attribute继承
  setup (props, context) {
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    const inputRef = reactive({
      val: computed<string>({
        get () {
          return props.modelValue || ''
        },
        set (newVal) {
          context.emit('update:modelValue', newVal)
        }
      }),
      error: false,
      message: ''
    })
    // console.log(context.attrs) // 获取标签上的非props属性
    // const updateInput = (event: KeyboardEvent) => {
    //   const targetValue = (event.target as HTMLInputElement).value
    //   inputRef.val = targetValue
    //   context.emit('update:modelValue', targetValue)
    // }
    const validateInput = () => { // 验证回调
      if (props.rules) {
        const allPassed = props.rules.every(rule => { // 全部验证通过返回true,有一个失败返回false
          let passed // 用于确认验证是否通过
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'password':
              passed = pwdReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    return {
      inputRef,
      validateInput
    }
  }
})
</script>

<style lang="css">

</style>
