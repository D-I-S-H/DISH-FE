import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest'; 
import HomeView from "../../views/HomeView.vue";

describe('HomeView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(HomeView);
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the menu card', () => {
    const menuCard = wrapper.find('.card-title');
    expect(menuCard.exists()).toBe(true);
    expect(menuCard.text()).toBe('Menu');
  });

  it('displays the location card', () => {
    const locationCard = wrapper.findAll('.card-title').at(1);
    expect(locationCard.exists()).toBe(true);
    expect(locationCard.text()).toBe('Location');
  });

});