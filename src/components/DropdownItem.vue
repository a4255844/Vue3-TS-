<template>
  <li
    class="dropdown-options"
    :class="{'is-disabled': disabled}"
  >
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  setup () {
    const isShowDropdown = ref(false)
    const toggleOpen = () => {
      isShowDropdown.value = !isShowDropdown.value
    }
    return {
      isShowDropdown,
      toggleOpen
    }
  }
})
</script>

<style lang="css">
.dropdown-options.is-disabled * {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
