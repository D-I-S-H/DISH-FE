<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card p-4">
            <div class="card-body">
              <h5 class="card-title">Register</h5>
              <form @submit.prevent="register">
                <div class="form-group mb-3">
                  <label for="username">Username</label>
                  <input type="text" class="form-control" id="username" v-model="username" required>
                </div>
                <div class="form-group mb-3">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="form-group mb-3">
                  <label for="confirm-password">Confirm Password</label>
                  <input type="password" class="form-control" id="confirm-password" v-model="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mt-3">Register</button>
              </form>
              <p class="text-center mt-3">
                Already have an account? <router-link to="/login">Sign In</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  

<script>
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import the router
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const API_URL = import.meta.env.VITE_APP_API_URL;

const $toast = useToast();

export default {
  setup() {
    const router = useRouter(); // Initialize the router
    return {
      router
    };
  },
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '' // Add confirmPassword to data
    };
  },
  methods: {
    /**
     * Register the user using the provided username and password, send as JSON
     */
    async register() {
      try {
        // Check if passwords match
        if (this.password !== this.confirmPassword) {
          $toast.error('Passwords do not match');
          return;
        }

        // API request to register
        const response = await axios.post(`${API_URL}/auth/register`, {
          username: this.username,
          password: this.password
        }, {
          headers: {
            'Content-Type': 'application/json' // Explicitly set Content-Type to JSON
          }
        });

        // If the registration is successful
        if (response.data.uid) {
          localStorage.setItem('uid', response.data.uid);
          localStorage.setItem('user', JSON.stringify(response.data)); // Store user data
          this.router.push('/'); // Navigate to home after registration
          $toast.success('Registration successful');
        } else {
          switch (response.status) { // Handle different HTTP status codes
            case 409:
              $toast.error('Username already exists');
              break;
            case 400:
              $toast.error('Invalid username or password');
              break;
            default:
              $toast.error('Registration failed');
              break;
          }
        }
      } catch (error) {
        console.error('Register failed', error); // More detailed error log
        if (error.response) {
          switch (error.response.status) { // Handle different errors from the server
            case 409:
              $toast.error('Username already exists');
              break;
            case 500:
              $toast.error('Internal server error');
              break;
            case 400:
              $toast.error('Invalid username or password');
              break;
            default:
              $toast.error('Registration failed');
          }
        } else {
          $toast.error('Network error or API not reachable');
        }
      }
    }
  }
};
</script>
