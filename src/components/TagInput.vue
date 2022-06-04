<template>
  <div class="tag-input">
    <div class="tag-input__input">
      <div class="tag-input__tags">
        <div
          class="tag-input__tags-pill"
          v-for="value in values.list"
          :key="value.id"
        >
          <label class="tag-input__tags-pill-name">{{ value.name }}</label>
          <span class="tag-input__tags-pill-remove" @click="deleteTag(value.id)"
            >X</span
          >
        </div>
      </div>
      <input
        type="text"
        name="tag"
        id="#tag-input__inner-input"
        class="tag-input__inner-input"
        @keyup="modifyTags"
        @click="focus()"
        ref="tagInput"
      />
    </div>
  </div>

  <div class="tag-input__button-container">
    <button class="tag-input__button danger" @click="handleClear">Clear</button>
    <button class="tag-input__button" @click="handleAddRules">
      Add Rule(s)
    </button>
  </div>
</template>

<script>
import { reactive, watchEffect, ref } from "vue";

export default {
  emits: ["addRules"],
  props: {
    savedRules: { type: Array, required: true },
  },
  setup(props, { emit, expose }) {
    let values = reactive({ list: [] });
    let tagInput = ref();

    const removeComma = (string) => string.slice(0, string.length - 1).trim();

    const isSavedRule = (word) => {
      for (let ruleItem of props.savedRules[3].rules) {
        if (ruleItem.rule.name === removeComma(word)) return true;
      }

      return false;
    };

    const isInvalid = (stringInput) => {
      if (isSavedRule(stringInput)) return true;
      const inputs = values.list;

      return (
        !/^[A-Za-z0-9]{3,}/.test(stringInput) ||
        inputs.some((value) => value.name === removeComma(stringInput))
      );
    };

    const modifyTags = (e) => {
      if (e.key === ",") {
        if (isInvalid(e.target.value)) {
          e.target.value = "";
          return;
        }

        addTag(removeComma(e.target.value));
        e.target.value = "";
      }

      if (e.key === "Backspace" && !e.target.value.length) {
        values.list.pop();
      }
    };

    const addTag = (textValue) => {
      const item = {
        id: textValue,
        name: textValue,
      };
      values.list.push(item);
    };

    const deleteTag = (id) => {
      values.list = values.list.filter((value) => value.id !== id);
    };

    const focus = () => {
      tagInput.value.focus();
    };

    watchEffect(() => {
      if (!tagInput.value) return;
      tagInput.value.focus();
    });

    const handleClear = () => {
      values.list = [];
      focus();
    };

    const handleAddRules = () => {
      emit("addRules", values.list);
      values.list = [];
    };

    if (process.env.NODE_ENV === "development") {
      expose({
        modifyTags,
        values: values.list
      });
    }

    return {
      modifyTags,
      focus,
      deleteTag,
      tagInput,
      values,
      handleClear,
      handleAddRules,
    };
  },
};
</script>

<style scoped lang="scss">
.tag-input {
  outline: none;
  box-sizing: border-box;

  &__input {
    border: 1px solid #666666;
    border-radius: 6px;
    padding: 0.5rem;
    cursor: text;
    text-align: left;
    background-color: #2c3e50;
    min-height: 45px;
    box-sizing: border-box;
  }

  &__inner-input {
    display: inline-block;
    border: none;
    font-size: 1.05rem;
    padding: 0.3rem 0;
    caret-color: white;
    color: white;
    background-color: transparent;

    &:focus {
      outline: none;
    }
  }

  &__tags {
    display: inline;

    &-pill {
      display: inline-block;
      margin: 2px 3px;
      background-color: #ffa67f;
      border-radius: 11px;
      text-align: center;
      gap: 10px;
      padding: 5px 8px;
      font-size: 10px;
      z-index: 1;
      color: white;

      &-remove {
        cursor: pointer;
        font-weight: bold;
        color: black;
        margin-left: 0.3rem;
        cursor: pointer;
      }
    }
  }

  &__button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #2c3e50;
    border: none;
    color: white;
    border-radius: 6px;
    margin: 10px 20px;
    cursor: pointer;

    &-container {
      display: flex;
      flex-direction: row-reverse;
    }

    &.danger {
      background-color: red !important;
    }
  }
}
</style>
