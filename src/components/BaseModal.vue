<template>
  <teleport to="body">
    <div class="base-modal__backdrop" v-if="isVisible">
      <div class="base-modal__container">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref } from "vue";
export default {
  name: "BaseModal",
  setup() {
    const isVisible = ref(false);

    const open = () => {
      isVisible.value = true;
    };

    const close = () => {
      isVisible.value = false;
    };

    return {
      isVisible,
      open,
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-modal {
  &__backdrop {
    z-index: 999;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #687383a1;
  }

  &__container {
    background: #2c3e50;
    max-width: 320px;
    width: 100%;
    padding: 1.5rem;
    color: white;
    border-radius: 6px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>
