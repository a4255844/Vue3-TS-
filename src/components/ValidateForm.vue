<template>
  <div class="validate-form-container">
    <slot></slot>
    <div class="submit-area" @click.prevent="submitHandler">
      <slot name="submit">
        <button type="submit" class="btn btn-danger">Submit</button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type MittEvent = {
  'form-item-created': ValidateFunc; // 指定对应事件回调函数的参数的泛型
}
export const emitter = mitt<MittEvent>()
export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    const submitHandler = () => {
      const result = funcArr.map(func => func()).every(func => func)
      context.emit('form-submit', result)
    }
    const callback = (func: ValidateFunc) => {
      // console.log(func)
      funcArr.push(func)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitHandler
    }
  }
})
</script>

<style lang="css" scoped>

</style>
