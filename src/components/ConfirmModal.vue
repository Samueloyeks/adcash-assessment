<template>
  <Modal ref="baseModal">
    <div class="confirm-modal__container">
      <p>
        Are you sure you want to delete rule(s)?
      </p>
    </div>
    <div class="confirm-modal__buttons-container">
      <button class="confirm-modal__button" @click="confirm">Delete</button>
      <button class="confirm-modal__button danger" @click="cancel">
        Cancel
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from "./BaseModal.vue";
import { ref } from "vue";

export default {
  name: "ConfirmationModal",
  components: {
    Modal,
  },
  setup() {
    const baseModal = ref(null);
    const resolvePromise = ref(null);

    const show = () => {
      baseModal.value.open();
      return new Promise((resolve) => {
        resolvePromise.value = resolve;
      });
    };

    const confirm = () => {
      baseModal.value.close();
      resolvePromise.value(true);
    };

    const cancel = () => {
      baseModal.value.close();
      resolvePromise.value(false);
    };
    return { baseModal, show, confirm, cancel };
  },
};
</script>

<style scoped lang="scss">
.confirm-modal {
  &__button {
    padding: 10px;
    border-radius: 6px;
    background-color: #ffa67f;
    cursor: pointer;
    border: none;
    margin: 0 10px;

    &.danger {
      background-color: #ff00009e;
    }
  }
}
</style>
