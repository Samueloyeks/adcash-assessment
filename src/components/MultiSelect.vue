<template>
  <div class="multi-select">
    <div v-if="showInput" class="multi-select__input-container">
      <input
        type="text"
        ref="searchInput"
        id="multi-select__search-input"
        class="multi-select__search-input"
        @focus="showOptions()"
        v-model="search"
      />
      <div
        class="multi-select__search-input-items"
        id="multi-select__search-input-items"
        v-show="open"
      >
        <div
          class="multi-select__search-input-item"
          v-for="option in options"
          :key="option.id"
          @click.self="selectValue(option)"
        >
          {{ option.name }}
        </div>
      </div>
    </div>

    <PillInput
      v-else
      :values="selectedValues.list"
      @deleteValue="handleDeleteValue"
      @showInput="handleShowInput()"
    />
  </div>
  <div class="multi-select__button-container">
    <button
      id="multi-select__clear-button"
      class="multi-select__button danger"
      @click="handleClear"
    >
      Clear
    </button>
    <button
      id="multi-select__add-button"
      class="multi-select__button"
      @click="handleAddRules"
    >
      Add Rule(s)
    </button>
  </div>
</template>

<script>
import { toRefs, ref, computed, reactive, watchEffect } from "vue";
import PillInput from "./PillInput.vue";
export default {
  emits: ["addRules"],
  components: {
    PillInput,
  },
  props: {
    values: { type: Array, required: true },
    savedRules: { type: Array, required: true },
    targetType: { type: String, required: true },
  },
  setup(props, { emit, expose }) {
    const { values: propValues } = toRefs(props);
    let showInput = ref(false);
    let open = ref(true);
    let search = ref(null);
    const searchInput = ref(null);
    let selectedValues = reactive({ list: [] });
    let savedRulesList = reactive({ list: [] });

    const isSelected = (value) => {
      return (
        selectedValues.list.find((el) => el.id == value.id) ||
        savedRulesList.list.find((el) => el.rule.id == value.id)
      );
    };

    const options = computed(() => {
      if (search.value) {
        return propValues.value.filter((item) => {
          return (
            search.value
              .toLowerCase()
              .split(" ")
              .every((v) => item.name.toLowerCase().includes(v)) &&
            !isSelected(item)
          );
        });
      }
      return propValues.value.filter((value) => !isSelected(value));
    });

    const handleDeleteValue = (id) => {
      selectedValues.list = selectedValues.list.filter(
        (value) => value.id !== id
      );
    };

    const showOptions = () => (open.value = true);

    const handleShowInput = () => {
      showInput.value = true;
    };

    const selectValue = (value) => {
      selectedValues.list.push(value);
      showInput.value = false;
      search.value = null;
    };

    watchEffect(() => {
      savedRulesList.list = props.savedRules.find(
        (savedRule) => savedRule.type === props.targetType
      ).rules;
      if (!searchInput.value) return;
      searchInput.value.focus();
    });

    const handleClear = () => {
      selectedValues.list = [];
    };

    const handleAddRules = () => {
      emit("addRules", selectedValues.list);
      selectedValues.list = [];
    };

    if (process.env.NODE_ENV === "development") {
      expose({
        selectValue,
        selectedValues: selectedValues.list,
        handleShowInput,
      });
    }

    return {
      options,
      showInput,
      selectValue,
      handleDeleteValue,
      handleShowInput,
      selectedValues,
      showOptions,
      open,
      search,
      searchInput,
      handleClear,
      handleAddRules,
    };
  },
};
</script>

<style scoped lang="scss">
.multi-select {
  min-height: 45px;
  background-color: #2c3e50;
  border-radius: 6px;
  border: 1px solid #666666;
  color: #fff;
  box-sizing: border-box;

  &__input-container {
    position: relative;
    width: 100%;
    text-align: left;
    outline: none;
    height: 47px;
    line-height: 47px;
    min-width: 200px;
    z-index: 1;
  }

  &__search-input {
    width: 100%;
    border: none;
    padding: 0;
    z-index: 1;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: transparent;
    caret-color: white;
    color: white;

    &-items {
      color: #fff;
      border-radius: 0px 0px 6px 6px;
      overflow: hidden;
      border-right: 1px solid #ffa67f;
      border-left: 1px solid #ffa67f;
      border-bottom: 1px solid #ffa67f;
      position: absolute;
      background-color: #2c3e50;
      left: 0;
      right: 0;
      z-index: 1;

      & div {
        color: #fff;
        padding-left: 1em;
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: #ffa67f;
        }
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
