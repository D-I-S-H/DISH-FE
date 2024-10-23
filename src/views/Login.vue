<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card p-4">
            <div class="card-body">
              <h5 class="card-title">Sign In</h5>
              <form @submit.prevent="signIn">
                <div class="form-group mb-3">
                  <label for="username">Username</label>
                  <input type="text" class="form-control" id="username" v-model="username" required>
                </div>
                <div class="form-group mb-3">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mt-3">Sign In</button>
              </form>
              <p class="text-center mt-3">
                Don't have an account? <router-link to="/register">Register</router-link>
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
      loading: false // Add loading state for UX improvement
    };
  },
  methods: {
    /**
     * Sign in the user using the provided username and password
     */
    async signIn() {
      // Start loading
      this.loading = true;

      try {
        // Make the API request to sign in
        const response = await axios.post(`${API_URL}/auth/login`, {
          username: this.username,
          password: this.password
        });

        // Check if the response contains the user ID
        if (response.data.uid) {
          localStorage.setItem('uid', response.data.uid);
          localStorage.setItem('user', JSON.stringify(response.data)); // Store the whole user data
          router.push('/'); // Navigate to home after login
          $toast.success('Login successful');
        } else {
          $toast.error('Login failed: Invalid credentials');
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              $toast.error('Login failed: Incorrect username or password');
              break;
            case 500:
              $toast.error('Server error: Please try again later');
              break;
            default:
              $toast.error('Login failed: Unknown error');
          }
        } else {
          // Network or other errors
          $toast.error('Network error: Please check your connection');
        }

        console.error('Login failed:', error);
      } finally {
        // Stop loading
        this.loading = false;
      }
    }
  }
};
</script>
