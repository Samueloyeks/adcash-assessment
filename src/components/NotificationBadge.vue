<template>
  <div
    class="notification-badge"
    :class="{
      visible: visible,
      success: type === 'success',
      danger: type === 'danger',
    }"
  >
    {{ message }}
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    let type = ref(null);
    let message = ref("");
    let visible = ref(false);

    const showNotification = (notifType, notifMessage) => {
      type.value = notifType;
      message.value = notifMessage;
      visible.value = true;
    };

    return {
      showNotification,
      type,
      message,
      visible,
    };
  },
};
</script>

<style scoped lang="scss">
.notification-badge {
  width: 200px;
  height: 50px;
  color: white;
  border-radius: 3px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 100px;
  right: -200px;

  &.success {
    background: green;
  }
  &.danger {
    background: #ff00009e;
  }

  &.visible {
    animation: movein 0.5s ease forwards, moveout 0.5s 3s ease forwards;
  }
}

@keyframes movein {
  from {
    right: -200px;
  }
  to {
    right: 10px;
  }
}

@keyframes moveout {
  from {
    right: 10px;
  }
  to {
    right: -200px;
  }
}
</style>
