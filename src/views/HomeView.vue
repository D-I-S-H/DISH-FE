<script setup>
import { ref } from 'vue';

const locations = ["Wadsworth", "DHH", "Place"]; // Temporary list of locations until we fetch from API
const selectedLocation = ref(locations[0]);

const changeLocation = (location) => {
  selectedLocation.value = location;
  console.log('Selected location:', location);
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
      this.selectedLocation = location;
      console.log('Selected location:', location); // Debug
    }
  }
}
</script>