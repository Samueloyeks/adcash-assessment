import PillInput from "../PillInput.vue";
import { mount } from "@vue/test-utils";

const PILL_INPUT_VALUES = [
  { id: 1, name: "Test item 1" },
  { id: 2, name: "Test item 2" },
  { id: 3, name: "Test item 3" },
  { id: 4, name: "Test item 4" },
];

describe("PillInput.vue", () => {
  const wrapper = mount(PillInput, {
    propsData: {
      values: PILL_INPUT_VALUES,
    },
  });

  test("it renders pills", () => {
    const pills = wrapper.findAll(".pill-input__pill");
    expect(pills.length).toBe(4);
  });

  test("shows input names", () => {
    const pills = wrapper.findAll(".pill-input__pill");
    pills.forEach((pill, index) => {
      expect(pill.text()).toBe(`Test item ${index + 1}  X`);
    });
  });
});
