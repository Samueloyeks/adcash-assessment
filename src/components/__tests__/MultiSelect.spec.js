import MultiSelect from "../MultiSelect.vue";
import { shallowMount } from "@vue/test-utils";

describe("MultiSelect.vue", () => {
  const wrapper = shallowMount(MultiSelect, {
    propsData: {
      values: [{ id: 1, name: "Test" }],
      savedRules: [
        { type: "Category", rules: [{ id: 1, rule: { name: "Test rule 1" } }] },
      ],
      targetType: "Category",
    },
  });

  test("it shows options and adds rule to list on select", async () => {
    const selectedValuesLen = wrapper.vm.selectedValues.list.length;
    const selectValue = jest.spyOn(wrapper.vm, 'selectValue');

    await wrapper.vm.handleShowInput();

    const selectInput = wrapper.find("#multi-select__search-input");
    selectInput.element.dispatchEvent(new FocusEvent("focus"));

    expect(wrapper.get("#multi-select__search-input").isVisible()).toBe(true);
    expect(wrapper.get("#multi-select__search-input-items").isVisible()).toBe(true);

    const selectItemsContainer = wrapper.get(
      "#multi-select__search-input-items"
    );

    const selectItem = selectItemsContainer.find(
      ".multi-select__search-input-item:first-of-type"
    );

    await selectItem.trigger("click");
    expect(selectValue).toHaveBeenCalled();

    const newSelectedValues = wrapper.vm.selectedValues;

    expect(newSelectedValues.list.length).toBe(selectedValuesLen + 1);
  });

  test("it clears select input on button click", async () => {
    const clearButton = wrapper.find("#multi-select__clear-button");

    await clearButton.trigger("click");

    expect(wrapper.vm.selectedValues.list.length).toBe(0);
  });

  test("it calls handleAddRules method on button click", async () => {
    const addRuleButton = wrapper.find("#multi-select__add-button");
    const handleAddRules = jest.spyOn(wrapper.vm, 'handleAddRules');

    await addRuleButton.trigger("click");

    expect(handleAddRules).toHaveBeenCalled();

  });
});
