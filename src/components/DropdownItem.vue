<template>
  <li
    class="dropdown-options"
    :class="{'is-disabled': disabled}"
    @click="closeAfterClick"
  >
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { emitter } from '@/components/Dropdown.vue'
export default defineComponent({
  props: {
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const closeAfterClick = () => {
      emitter.emit('closeAfterClick', props.disabled)
    }
    return {
      closeAfterClick
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
