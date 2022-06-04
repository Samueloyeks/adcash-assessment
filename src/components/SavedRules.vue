<template>
  <div class="saved-rules">
    <label class="saved-rules__title">Saved targeting rules</label>
    <table class="saved-rules__table">
      <tr class="saved-rules__table-row">
        <th class="cell">Type</th>
        <th class="cell">Rules</th>
        <th class="saved-rules__table-row-right-cell cell">Actions</th>
      </tr>
      <tr
        class="saved-rules__table-row"
        v-for="(savedRule, i) of savedRules"
        :key="savedRule.type"
      >
        <td class="cell">{{ savedRule.type }}</td>
        <td>
          <PillInput :values="savedRule.rules" @deleteValue="handleDelete" />
        </td>
        <td class="saved-rules__table-row-right-cell cell">
          <button
            v-if="savedRule.rules.length > 0"
            @click="
              handleDelete(
                savedRule.rules.map((rule) => rule.id),
                savedRule.rules[0].targeting_type_id,
                i
              )
            "
          >
            Delete
          </button>
        </td>
      </tr>
    </table>
    <ConfirmModal ref="modal" />
    <NotificationBadge ref="notificationRef" />
  </div>
</template>

<script>
import { ref } from "vue";
import PillInput from "./PillInput.vue";
import ConfirmModal from "./ConfirmModal.vue";
import NotificationBadge from "./NotificationBadge.vue";
import { BASE_URL } from "../constants";

export default {
  components: {
    PillInput,
    ConfirmModal,
    NotificationBadge,
  },
  props: {
    savedRules: { type: Array, required: true },
  },
  emits: ["changedSavedRules"],
  setup(props, { emit }) {
    const modal = ref(null);
    const result = ref("");
    let notificationRef = ref();

    const handleDelete = async (ids, targetinTypeId, ruleIndex) => {
      if (typeof ids === "number") {
        if (!targetinTypeId) {
          for (let index in props.savedRules) {
            for (let rule of props.savedRules[index].rules) {
              if (rule.id == ids) {
                targetinTypeId = rule.targeting_type_id;
                ruleIndex = Number(index);
              }
            }
          }
        }
        ids = [ids];
      }

      const confirm = await modal.value.show();
      if (confirm) {
        deleteRules(targetinTypeId, ids, ruleIndex);
      }
    };

    const deleteRules = async (targetinTypeId, ids, ruleIndex) => {
      let data = {
        targeting_type_id: targetinTypeId,
        rules: ids,
      };
      await fetch(`${BASE_URL}/rules`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status === 200) {
          emit("changedSavedRules", {
            rules: props.savedRules[ruleIndex].rules.filter(
              (rule) => ids.indexOf(rule.id) == -1
            ),
            ruleIndex,
          });
          notificationRef.value.showNotification("success", "Rule(s) deleted");
        } else {
          notificationRef.value.showNotification(
            "danger",
            "Error deleting rule(s)"
          );
        }
      });
    };

    return {
      modal,
      result,
      handleDelete,
      notificationRef,
      deleteRules,
    };
  },
};
</script>

<style scoped lang="scss">
.saved-rules {
  padding: 20px;
  margin-top: 10px;
  border: 1px solid gray;
  border-radius: 6px;
  background-color: #2c3e50;
  color: white;

  &__title {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 20px;
  }
  &__table {
    width: 100%;
    border-top: 1px solid #2c3e50;

    &-row {
      td,
      th {
        text-align: left;

        &.cell {
          vertical-align: top;
          padding: 10px 20px;
        }
      }

      &-right-cell {
        text-align: right !important;

        & button {
          border: none;
          color: white;
          background-color: #ff00009e;
          border-radius: 6px;
          padding: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
