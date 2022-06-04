import AddRule from "../AddRule.vue";
import { mount, shallowMount } from "@vue/test-utils";

const TARGET_TYPES = [
  { id: 1, name: "Test target type 1" },
  { id: 1, name: "Test target type 1" },
];

describe("AddRule.vue", () => {

  test("it shows rule type dropdown", async () => {
    const wrapper = mount(AddRule, {
      propsData: {
        targetTypes: TARGET_TYPES,
        savedRules: [],
      },
    });
    const selectDiv = wrapper.find("#add-rule__types__custom-select-selected");

    await selectDiv.trigger("click");

    expect(
      wrapper.get("#add-rule__types__custom-select-items").isVisible()
    ).toBe(true);
  });

  test("it makes api call for rule options", async () => {
    const wrapper = shallowMount(AddRule, {
      propsData: {
        targetTypes: TARGET_TYPES,
        savedRules: [],
      },
    });
    const selectDiv = wrapper.find("#add-rule__types__custom-select-selected");
    const getRules = jest.spyOn(wrapper.vm, 'getRules');

    await selectDiv.trigger("click");
    const selectItemsContainer = wrapper.get(
      "#add-rule__types__custom-select-items"
    );
    const selectItem = selectItemsContainer.find(
      ".add-rule__types__custom-select-item:first-of-type"
    );
    await selectItem.trigger("click");

    expect(getRules).toHaveBeenCalled();
  });
});
