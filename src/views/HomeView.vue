<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const API_URL = import.meta.env.VITE_APP_API_URL;
const $toast = useToast();

const locations = ref([]);

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
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Menu</h5>
            <p class="card-text">Select a menu item to view more details.</p>
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
      console.log('Selected location:', location); // Debug
    }
  }
}
</script>