import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import AboutView from "../../views/AboutView.vue";

describe("Render about page", () => {
  it("renders properly", () => {
    const wrapper = mount(AboutView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
