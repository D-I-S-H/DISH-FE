<script setup>
import { ref, toRaw } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import MenuItemComponent from '../components/menuItemComponent.vue';
const API_URL = import.meta.env.VITE_APP_API_URL;
const $toast = useToast();
const menuItems = ref([]); // Menu items
const locations = ref([]); // Locations
const times = ref([]); // Times

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
const selectedLocation = ref(localStorage.getItem('selectedLocation') || locations.value[0]);
const changeLocation = (location) => { // Update the selected location
  selectedLocation.value = location;
  localStorage.setItem('selectedLocation', location);
  // Fetch menu items for the selected location
  axios.get(`${API_URL}/menu?location=${location}`)
    .then(response => {
      menuItems.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching menu items:', error);
      $toast.error('Error fetching menu items');
    });
}

// Get menu items from API
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
  })
  .catch(error => {
    console.error('Error fetching menu items:', error);
    $toast.error('Error fetching menu items');
  });

  // Selected time


  console.log('Menu items:', toRaw(menuItems)); // Debug
  console.log('Locations:', toRaw(locations)); // Debug
  console.log('Selected location:', selectedLocation.value); // Debug
  console.log('Times', toRaw(times)); // Debug

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
                class="btn btn-primary"
                @click="changeTime"
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
                v-for="menuItem in menuItems" 
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
    return { locations, selectedLocation, changeLocation };
  },

  methods: {
    changeLocation(location) {
      selectedLocation = location;
    }
  }
}
</script>