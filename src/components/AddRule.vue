<template>
  <div class="add-rule" v-if="targetTypes.length > 0">
    <div class="add-rule__input-container">
      <div class="add-rule__types">
        <label for="targetTypes">Type</label>
        <div class="add-rule__types__custom-select" @blur="close()">
          <div
            class="add-rule__types__custom-select-selected"
            id="add-rule__types__custom-select-selected"
            :class="{ open: open }"
            @click="toggleOpen()"
          >
            {{ selected.name }}
          </div>
          <div
            class="add-rule__types__custom-select-items"
            id="add-rule__types__custom-select-items"
            v-show="open"
          >
            <div
              v-for="(targetType, i) of targetTypes"
              class="add-rule__types__custom-select-item"
              :key="i"
              @click="
                selectTarget(targetType);
                getRules();
              "
            >
              {{ targetType.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="add-rule__rules">
        <label>Rules</label>
        <div v-if="fetchError && !loading">No options</div>
        <div v-else>
          <MultiSelect
            v-if="hasOptions && typeOptions.length > 0"
            :values="typeOptions"
            @addRules="handleAddRules"
            :savedRules="savedRules"
            :targetType="selected.name"
          />
          <div v-else>
            <TagInput @addRules="handleAddRules" :savedRules="savedRules" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>Unable to get types</div>
  <NotificationBadge ref="notificationRef" />
</template>

<script>
import { ref, onMounted } from "vue";
import { BASE_URL, TARGETING_TYPES } from "../constants";
import MultiSelect from "./MultiSelect.vue";
import TagInput from "./TagInput.vue";
import NotificationBadge from "./NotificationBadge.vue";

export default {
  components: {
    MultiSelect,
    TagInput,
    NotificationBadge,
  },
  props: {
    targetTypes: { type: Array, required: true },
    savedRules: { type: Array },
  },
  emits: ["updateGeneratedRules"],
  setup(props, { emit, expose }) {
    let selected = ref(
      props.targetTypes.length > 0 ? props.targetTypes[0] : null
    );
    let open = ref(false);
    let fetchError = ref(false);
    let loading = ref(false);
    let hasOptions = ref(true);
    let module = ref("");
    let typeOptions = ref([]);
    let notificationRef = ref();

    const close = () => (open.value = false);
    const toggleOpen = () => (open.value = !open.value);
    const selectTarget = (targetType) => {
      selected.value = targetType;
      open.value = false;
    };

    onMounted(() => {
      getRules();
    });

    const getRules = async () => {
      fetchError = false;
      loading = true;
      switch (selected.value.name) {
        case TARGETING_TYPES.CATEGORY:
          module.value = "categories";
          hasOptions.value = true;
          break;
        case TARGETING_TYPES.COUNTRY:
          module.value = "countries";
          hasOptions.value = true;
          break;
        case TARGETING_TYPES.DEVICE:
          module.value = "devices";
          hasOptions.value = true;
          break;
        default:
          module.value = "";
          hasOptions.value = false;
      }

      if (module.value !== "") {
        await fetch(`${BASE_URL}/${module.value}`)
          .then((response) => response.json())
          .then((data) => (typeOptions.value = data))
          .catch(() => {
            fetchError = true;
            loading = false;
          });
      }
    };

    const handleAddRules = async (rules) => {
      if (rules.length > 0) {
        let data = {
          targeting_type_id: selected.value.id,
          rules: rules.map((rule) => rule.name),
        };

        // create rule
        let generatedRules = rules.map((rule) => {
          return { targetingType: selected.value, rule: rule };
        });

        await fetch(`${BASE_URL}/rules`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === "true") {
              updateGeneratedRules(generatedRules);
              notificationRef.value.showNotification(
                "success",
                "Rule(s) Added"
              );
            }
          })
          .catch(() => {
            notificationRef.value.showNotification("success", "Rule(s) Added");
          });
      }
    };

    const updateGeneratedRules = (generatedRules) => {
      emit("updateGeneratedRules", generatedRules);
    };

    if (process.env.NODE_ENV === "development") {
      expose({ getRules });
    }

    return {
      selected,
      open,
      close,
      toggleOpen,
      selectTarget,
      getRules,
      typeOptions,
      fetchError,
      loading,
      hasOptions,
      handleAddRules,
      notificationRef,
    };
  },
};
</script>

<style scoped lang="scss">
.add-rule {
  border: 1px solid gray;
  border-radius: 6px;
  background-color: #ffa67f;

  &__input-container {
    display: flex;
    padding: 20px;
    gap: 20px;
  }

  &__types {
    label {
      text-align: left;
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
    }

    &__custom-select {
      position: relative;
      width: 100%;
      text-align: left;
      outline: none;
      height: 45px;
      line-height: 45px;
      min-width: 200px;

      &-selected {
        background-color: #2c3e50;
        border-radius: 6px;
        border: 1px solid #666666;
        color: #fff;
        padding-left: 1em;
        cursor: pointer;
        user-select: none;

        &.open {
          border: 1px solid #ffa67f;
          border-radius: 6px 6px 0px 0px;
        }

        &:after {
          position: absolute;
          content: "";
          top: 22px;
          right: 1em;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-color: #fff transparent transparent transparent;
        }
      }

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
  }

  &__rules {
    display: block;
    width: 100%;
    label {
      text-align: left;
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
