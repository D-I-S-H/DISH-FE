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
const loading = ref(true); // Loading state for menu items

const selectedLocation = ref(localStorage.getItem('selectedLocation') || locations.value[0]);
const selectedTime = ref(null); // Selected time

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Search state
const searchQuery = ref(''); // Search query

// Fetch locations from the API
axios.get(`${API_URL}/locations`)
  .then(response => {
    locations.value = response.data;
    
    // Set selectedLocation to the first location if not already set in localStorage
    if (!localStorage.getItem('selectedLocation') && locations.value.length > 0) {
      selectedLocation.value = locations.value[0];
      localStorage.setItem('selectedLocation', selectedLocation.value);
    }
  })
  .catch(error => {
    console.error('Error fetching locations:', error);
    $toast.error('Error fetching locations');
  });

// Selected location
const changeLocation = (location) => {
  selectedLocation.value = location;
  localStorage.setItem('selectedLocation', location);

  // Reset pagination and search
  currentPage.value = 1;
  searchQuery.value = '';
  loading.value = true; // Set loading to true before fetching

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
    })
    .finally(() => {
      loading.value = false; // Set loading to false after fetching
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
  })
  .finally(() => {
    loading.value = false; // Set loading to false after fetching
  });

// Change selected time
const changeTime = (time) => {
  selectedTime.value = time;

  // Reset pagination
  currentPage.value = 1;
};

const filteredMenuItems = computed(() => {
  return menuItems.value
    .filter(item => item.time === selectedTime.value)
    .filter(item => 
      (item.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      ((item.description || '').toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
});

const paginatedMenuItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredMenuItems.value.slice(start, end);
});

// Calculate total pages
const totalPages = computed(() => Math.ceil(filteredMenuItems.value.length / itemsPerPage));

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
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
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else>
              <div class="row mb-3">
                <div class="col-12 col-md-6 mb-2 mb-md-0">
                  <h5 class="card-title mb-2">Menu</h5>
                  <p class="card-text">Select a menu item to view more details.</p>
                </div>
                <div class="col-12 col-md-6">
                  <div class="d-flex justify-content-end">
                    <input 
                      type="text" 
                      class="form-control border-secondary"
                      placeholder="Search menu items..." 
                      v-model="searchQuery" 
                    />
                  </div>  
                </div>
              </div>
              <div class="row row-cols-1 row-cols-md-2 g-4">
                <div 
                  v-for="menuItem in paginatedMenuItems" 
                  :key="menuItem.id" 
                  class="col"
                >
                  <MenuItemComponent :menuItem="menuItem" />
                </div>
              </div>
              <nav v-if="totalPages > 1" aria-label="Page navigation">
                <ul class="pagination justify-content-center mt-3">
                  <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li 
                    class="page-item" 
                    :class="{ 'active': page === currentPage }" 
                    v-for="page in totalPages" 
                    :key="page"
                  >
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
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
      searchQuery,
      filteredMenuItems, 
      paginatedMenuItems, 
      currentPage, 
      totalPages, 
      changePage, 
      loading 
    };
  }
};
</script>
