<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click="toggleOpen">{{ title }}</a>
    <ul class="dropdown-menu" style="display:block;" v-if="isShowDropdown">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
import mitt from 'mitt'
type MittEvent = {
  'closeAfterClick': boolean; // 指定对应事件回调函数的参数的泛型
}
export const emitter = mitt<MittEvent>()
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const isShowDropdown = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null)
    const isClickOutside = useClickOutside(dropdownRef)
    const toggleOpen = () => {
      isShowDropdown.value = !isShowDropdown.value
    }
    watch(isClickOutside, () => {
      if (isClickOutside.value && isShowDropdown.value) {
        isShowDropdown.value = false
      }
    })
    emitter.on('closeAfterClick', (status) => {
      isShowDropdown.value = status
    })
    return {
      isShowDropdown,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>

<style lang="css" scoped>

</style>
