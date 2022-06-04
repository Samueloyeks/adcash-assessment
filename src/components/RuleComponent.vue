<template>
  <div class="rule-component">
    <h3>Ad Targeting</h3>
    <AddRule
      v-if="targetTypes.length > 0"
      :target-types="targetTypes"
      @updateGeneratedRules="handleUpdateGeneratedRules"
      :savedRules="savedRules.list"
    />
    <SavedRules
      :savedRules="savedRules.list"
      @changedSavedRules="handleChangedSavedRules"
    />
    <button class="rule-component__button" @click="handleSaveChanages">
      Save Changes
    </button>
  </div>
</template>

<script>
import { reactive, toRaw, ref } from "vue";
import AddRule from "./AddRule.vue";
import SavedRules from "./SavedRules.vue";
import useFetch from "../composables/use-fetch";
import { BASE_URL } from "../constants";

export default {
  components: {
    AddRule,
    SavedRules,
  },
  setup() {
    let targetTypes = [];
    let savedRules = reactive({
      list: [
        { type: "Country", rules: [] },
        { type: "Category", rules: [] },
        { type: "Device", rules: [] },
        { type: "URL keywords", rules: [] },
      ],
    });

    let generatedRulesList = reactive({ list: [] });
    let lastRuleId = ref(null);

    const { response } = useFetch(`${BASE_URL}/types`);
    targetTypes = response;

    const handleUpdateSavedRules = () => {
      savedRules.list.forEach((savedRule) => {
        let ruleName = savedRule.type;

        for (let generatedRule of generatedRulesList.list) {
          if (generatedRule.targetingType.name === ruleName) {
            let ruleId = lastRuleId.value ? lastRuleId.value + 1 : 1;
            lastRuleId.value = ruleId;
            savedRule.rules.push({
              targeting_type_id: generatedRule.targetingType.id,
              id: ruleId,
              rule: generatedRule.rule,
            });
          }
        }
      });
      generatedRulesList.list = [];
    };

    const handleUpdateGeneratedRules = (generatedRules) => {
      let nextRuleId = generatedRulesList.list.length + 1;
      generatedRules.forEach((generatedRule) => {
        generatedRule.id = nextRuleId;
        nextRuleId++;
      });

      generatedRulesList.list.push(...generatedRules);
      handleUpdateSavedRules();
    };

    const handleChangedSavedRules = ({ rules, ruleIndex }) => {
      savedRules.list[ruleIndex].rules = rules;
    };

    const handleSaveChanages = () => {
      let ruleList = [];
      for (let savedRule of savedRules.list) {
        savedRule.rules.forEach((ruleItem) => {
          ruleItem.rule = ruleItem.rule.name;
          ruleList.push(toRaw(ruleItem));
        });
      }
      console.log(ruleList);
      savedRules.list = [
        { type: "Country", rules: [] },
        { type: "Category", rules: [] },
        { type: "Device", rules: [] },
        { type: "URL keywords", rules: [] },
      ];
      lastRuleId.value = null;
    };

    return {
      targetTypes,
      handleUpdateGeneratedRules,
      savedRules,
      generatedRulesList,
      handleChangedSavedRules,
      handleSaveChanages,
    };
  },
};
</script>

<style scoped lang="scss">
.rule-component {
  &__button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #2c3e50;
    border: none;
    color: white;
    border-radius: 6px;
    margin: 10px 20px;
    cursor: pointer;
  }
}
</style>
