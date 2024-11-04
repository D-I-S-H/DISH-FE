import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import HomeView from "../../views/HomeView.vue";
import axios from 'axios';

vi.mock('axios');

// Mock the environment variable for the API URL
beforeAll(() => {
  process.env.VITE_APP_API_URL = 'http://localhost:8080';
});

describe('HomeView.vue', () => {
  let wrapper;

  beforeEach(async () => {
    axios.get.mockClear(); // Clear any previous mock data

    // Mock localStorage to set a default selected location for testing
    vi.spyOn(localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'selectedLocation') return 'Location 1';
      return null;
    });

    // Mock API responses with a detailed menu item
    axios.get.mockImplementation((url) => {
      if (url.includes('/locations')) {
        return Promise.resolve({ data: ['Location 1', 'Location 2'] });
      }
      if (url.includes('/menu?location=Location%201')) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              name: "Blueberry Coffee Muffin",
              ingredients: [
                "White Cake Mix",
                "Water",
                "Blueberries",
                "Brown Sugar (sugar, cane syrups)",
                "All Purpose Flour",
                "Cinnamon"
              ],
              portion: "1 each",
              description: "Baked Blueberries inside a Fluffy Coffee Cake Muffin",
              nutrients: [
                { name: "Calories", value: "140", uom: "kcal" },
                { name: "Protein (g)", value: "2", uom: "g" },
                { name: "Total Carbohydrates (g)", value: "27", uom: "g" },
                { name: "Sugar (g)", value: "17", uom: "g" },
                { name: "Total Fat (g)", value: "3", uom: "g" },
                { name: "Saturated Fat (g)", value: "1.5", uom: "g" },
                { name: "Cholesterol (mg)", value: "0", uom: "mg" },
                { name: "Dietary Fiber (g)", value: "0", uom: "g" },
                { name: "Sodium (mg)", value: "210", uom: "mg" },
                { name: "Potassium (mg)", value: "30", uom: "mg" },
                { name: "Calcium (mg)", value: "20", uom: "mg" },
                { name: "Iron (mg)", value: "0.6", uom: "mg" },
                { name: "Trans Fat (g)", value: "-", uom: "g" },
                { name: "Vitamin D (IU)", value: "0", uom: "IU" },
                { name: "Vitamin C (mg)", value: "0", uom: "mg" },
                { name: "Calories From Fat", value: "25", uom: "kcal" },
                { name: "Vitamin A (RE)", value: "0+", uom: "RE" },
                { name: "Saturated Fat + Trans Fat (g)", value: "0+", uom: "g" }
              ],
              calories: 140,
              time: "Breakfast",
              location: "McNair",
              allergens: ["Gluten", "Milk", "Wheat", "Egg", "MSG*", "Soy"],
              labels: ["Vegetarian", "How Good Friendly"]
            }
          ]
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    wrapper = mount(HomeView);
    await wrapper.vm.$nextTick(); // Wait for the component to update after mounting
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('calls the API to get the locations', () => {
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/locations');
  });

  // Select the first location by default
  it('displays the first location by default', () => {
    expect(wrapper.vm.selectedLocation).toBe('Location 1');
  });

  // Check if menu was called
  it('calls the API to get the menu for the selected location', () => {
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/menu?location=Location 1');
  });



});
