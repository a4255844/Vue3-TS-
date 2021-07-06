<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click="toggleOpen">{{ title }}</a>
    <ul class="dropdown-menu" style="display:block;" v-if="isShowDropdown">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
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
