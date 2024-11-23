<script setup>
import { ref, toRaw, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import MenuItemComponent from '../components/menuItemComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFilter, faShopSlash } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_APP_API_URL;
const $toast = useToast();

const menuItems = ref([]); // All menu items fetched from the API
const locations = ref([]); // Locations
const times = ref([]); // Times
const loading = ref(true); // Loading state for menu items

const selectedLocation = ref(localStorage.getItem('selectedLocation') || locations.value[0]);
const selectedTime = ref(null); // Selected time
const selectedDate = ref(new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })); // YYYY-MM-DD


// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Search state
const searchQuery = ref(''); // Search query
const selectedLabels = ref([]); // Selected labels for filtering
const showFilters = ref(false); // Toggle state for filters

// Custom tag filter state
const excludeTags = ref([]); // List of tags to exclude
const tagInput = ref(''); // Input field for new tag

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


  // Fetch menu items for the selected location and date
  axios.get(`${API_URL}/menu?location=${location}&date=${selectedDate.value}`)
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

// Fetch menu items for the initially selected location and date
axios.get(`${API_URL}/menu?location=${selectedLocation.value}&date=${selectedDate.value}`)
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

const uniqueLabels = computed(() => {
  return [...new Set(menuItems.value.flatMap(item => item.labels || []))];
});

// Add new tag to excludeTags when pressing Enter
const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !excludeTags.value.includes(tag)) {
    excludeTags.value.push(tag);
  }
  tagInput.value = ''; // Clear input after adding the tag
};

// Remove a tag from excludeTags
const removeTag = (tag) => {
  excludeTags.value = excludeTags.value.filter(t => t !== tag);
};

// Filter menu items based on selectedTime, searchQuery, selectedLabels, and excludeTags
const filteredMenuItems = computed(() => {
  return menuItems.value
    .filter(item => item.time === selectedTime.value)
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ((item.description || '').toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
    .filter(item =>
      // Check if item.labels contains all selected labels
      selectedLabels.value.length === 0 || selectedLabels.value.every(label => (item.labels || []).includes(label))
    )
    .filter(item =>
      // Exclude items that have any of the tags in excludeTags in either ingredients or allergens, case-insensitively and ignoring trailing asterisks
      excludeTags.value.length === 0 || !excludeTags.value.some(tag => {
        const lowercaseTag = tag.toLowerCase();
        
        // Normalize ingredients and allergens by removing trailing asterisk and converting to lowercase
        const ingredients = (item.ingredients || []).map(i => i.toLowerCase().replace(/\*$/, ''));
        const allergens = (item.allergens || []).map(a => a.toLowerCase().replace(/\*$/, ''));
        
        return ingredients.includes(lowercaseTag) || allergens.includes(lowercaseTag);
      })
    );
});



const paginationPages = computed(() => {
  const pages = [];
  const range = 2;

  for (let i = currentPage.value - range; i <= currentPage.value + range; i++) {
    if (i > 0 && i <= totalPages.value) {
      pages.push(i);
    }
  }
  return pages;
});

const paginatedMenuItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMenuItems.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredMenuItems.value.length / itemsPerPage));

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const toggleLabel = (label) => {
  const index = selectedLabels.value.indexOf(label);
  if (index === -1) selectedLabels.value.push(label);
  else selectedLabels.value.splice(index, 1);
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8 mb-3">
        <!-- Filters card -->
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2 align-items-center justify-content-center justify-content-md-start">
              <!-- Time select -->
              <button 
                v-for="time in times" 
                :key="time" 
                class="btn"
                :class="{'btn-active': time === selectedTime}"
                @click="changeTime(time)"
              >
                {{ time }}
              </button>
              
              <!-- Filter button -->
              <button 
                class="btn btn-secondary ms-md-auto" 
                @click="showFilters = !showFilters"
              >
                <font-awesome-icon :icon="faFilter" />
                {{ showFilters ? 'Hide Filters' : 'Filters' }}
              </button>
            </div>
            <!-- Filters -->
            <div v-if="showFilters" class="mt-3">
              <h6>Filter by Labels</h6>
              <div v-for="label in uniqueLabels" :key="label" class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :value="label" 
                  v-model="selectedLabels"
                >
                <label class="form-check-label">
                  {{ label }}
                </label>
              </div>
              <!-- Exclude Tag Filter -->
              <h6 class="mt-3">Exclude Ingredients/Allergens</h6>
              <div class="d-flex gap-2 mb-3">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Type a tag and press Enter" 
                  v-model="tagInput"
                  @keyup.enter="addTag"
                />
              </div>
              <div class="d-flex flex-wrap gap-2">
                <span 
                  v-for="tag in excludeTags" 
                  :key="tag" 
                  class="badge bg-danger exclude-tag"
                  @click="removeTag(tag)"
                >
                  {{ tag }} <font-awesome-icon :icon="faTimes" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu card -->
        <div class="card">
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="paginatedMenuItems.length > 0">
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
                <!-- Generate MenuItemComponents for each menu item -->
                <div 
                  v-for="menuItem in paginatedMenuItems" 
                  :key="menuItem.id" 
                  class="col"
                >
                  <MenuItemComponent :menuItem="menuItem" />
                </div>
              </div>
              <!-- Pagination -->
              <nav v-if="totalPages > 1" aria-label="Page navigation">
                <ul class="pagination justify-content-center mt-3">
                  <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li class="page-item" v-if="currentPage > 3">
                    <a class="page-link" href="#" @click.prevent="changePage(1)">1</a>
                  </li>
                  <li class="page-item" v-if="currentPage > 4">
                    <span class="page-link">...</span>
                  </li>
                  <li class="page-item" 
                      v-for="page in paginationPages" 
                      :key="page" 
                      :class="{ 'active': page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" v-if="currentPage < totalPages - 3">
                    <span class="page-link">...</span>
                  </li>
                  <li class="page-item" v-if="currentPage < totalPages - 2">
                    <a class="page-link" href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
                  </li>
                  <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div v-else class="w-100 text-center">
                  <h4>This dining hall is closed today</h4>
                  <FontAwesomeIcon :icon="faShopSlash" size="3x" />
            </div>
          </div>
        </div>
      </div>
      <!-- Location select -->
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
      selectedLabels,
      filteredMenuItems, 
      paginatedMenuItems, 
      currentPage, 
      totalPages, 
      changePage, 
      loading,
      uniqueLabels,
      toggleLabel 
    };
  }
};
</script>
