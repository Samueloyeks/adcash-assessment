<template>
  <div class="pill-input" @click.self="$emit('showInput')">
    <div v-for="value in propValues" :key="value.id" class="pill-input__pill">
      {{ value.name ?? value.rule.name }}
      <div
        class="pill-input__pill-remove"
        @click="$emit('deleteValue', value.id)"
      >
        X
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";
export default {
  props: {
    values: { type: Array, required: true },
  },
  setup(props) {
    const { values: propValues } = toRefs(props);

    return {
      propValues,
    };
  },
};
</script>

<style scoped lang="scss">
.pill-input {
  border-radius: 10px;
  display: flex;
  flex-flow: row wrap;
  align-content: space-between;
  padding: 10px 20px;
  gap: 10px;
  cursor: auto;
  min-height: 30px;

  &__pill {
    display: flex;
    background-color: #ffa67f;
    border-radius: 10px;
    text-align: center;
    gap: 10px;
    padding: 5px 8px;
    font-size: 10px;

    &-remove {
      cursor: pointer;
      font-weight: bold;
      color: black;
    }
  }
}
</style>
