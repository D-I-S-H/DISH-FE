<script setup>
import { ref, toRaw, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import MenuItemComponent from '../components/menuItemComponent.vue';

const API_URL = import.meta.env.VITE_APP_API_URL;
const $toast = useToast();

const menuItems = ref([]); // All menu items fetched from the API
const locations = ref([]); // Locations
const times = ref([]); // Times

const selectedLocation = ref(localStorage.getItem('selectedLocation') || locations.value[0]);
const selectedTime = ref(null); // Selected time

// Fetch locations from the API
axios.get(`${API_URL}/locations`)
  .then(response => {
    locations.value = response.data;
  })
  .catch(error => {
    console.error('Error fetching locations:', error);
    $toast.error('Error fetching locations');
  });

// Selected location
const changeLocation = (location) => {
  selectedLocation.value = location;
  localStorage.setItem('selectedLocation', location);

  // Fetch menu items for the selected location
  axios.get(`${API_URL}/menu?location=${location}`)
    .then(response => {
      menuItems.value = response.data;

      // Set times from response data and default selectedTime
      times.value = response.data.reduce((acc, item) => {
        if (!acc.includes(item.time)) {
          acc.push(item.time);
        }
        return acc;
      }, []);
      
      // Set selectedTime to the first time in the array if available
      if (times.value.length > 0) {
        selectedTime.value = times.value[0];
      }
    })
    .catch(error => {
      console.error('Error fetching menu items:', error);
      $toast.error('Error fetching menu items');
    });
}

// Fetch menu items for the initially selected location
axios.get(`${API_URL}/menu?location=${selectedLocation.value}`)
  .then(response => {
    menuItems.value = response.data;

    // Set times from response data
    times.value = response.data.reduce((acc, item) => {
      if (!acc.includes(item.time)) {
        acc.push(item.time);
      }
      return acc;
    }, []);
    
    // Set selectedTime to the first time in the array if available
    if (times.value.length > 0) {
      selectedTime.value = times.value[0];
    }
  })
  .catch(error => {
    console.error('Error fetching menu items:', error);
    $toast.error('Error fetching menu items');
  });

// Change selected time
const changeTime = (time) => {
  selectedTime.value = time;
};

// Filter menu items
const filteredMenuItems = computed(() => {
  return menuItems.value.filter(item => item.time === selectedTime.value);
});
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8 mb-3">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <button 
                v-for="time in times" 
                :key="time" 
                class="btn"
                :class="{'btn-active': time === selectedTime}"
                @click="changeTime(time)"
              >
                {{ time }}
              </button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Menu</h5>
            <p class="card-text">Select a menu item to view more details.</p>
            <div class="row row-cols-1 row-cols-md-2 g-4">
              <div 
                v-for="menuItem in filteredMenuItems" 
                :key="menuItem.id" 
                class="col"
              >
                <MenuItemComponent :menuItem="menuItem" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Location</h5>
            <ul class="list-group">
              <li 
                v-for="location in locations" 
                :key="location" 
                :class="['list-group-item', 'button-location', {'active': selectedLocation === location}]"
                @click="changeLocation(location)"
              >
                {{ location }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  setup() {
    return { 
      locations, 
      selectedLocation, 
      changeLocation, 
      menuItems, 
      times, 
      selectedTime, 
      changeTime, 
      filteredMenuItems 
    };
  }
};
</script>
