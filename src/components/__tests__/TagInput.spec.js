import TagInput from "../TagInput.vue";
import { shallowMount } from "@vue/test-utils";

describe("TagInput.vue", () => {
  const wrapper = shallowMount(TagInput, {
    propsData: {
      savedRules: [
        { type: "Country", rules: [] },
        { type: "Category", rules: [] },
        { type: "Device", rules: [] },
        { type: "URL keywords", rules: [] },
      ],
    },
  });


  test("adds rule to list on commas-seperated text input", async () => {
    const input = wrapper.find("input[name='tag']");
    const modifyTags = jest.spyOn(wrapper.vm, "modifyTags");
    const valuesLen = wrapper.vm.values.list.length;

    await input.setValue("Test Rule,");

    const keyUpEvent = new KeyboardEvent("keyup", {
      key: ",",
      keyCode: 188
    });

    input.element.dispatchEvent(keyUpEvent);
    expect(modifyTags).toHaveBeenCalled();
    expect(wrapper.vm.values.list.length).toBe(valuesLen + 1);
  });
});

// TODO: Write more test coverage for saved rules
