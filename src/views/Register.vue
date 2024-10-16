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
                <button type="submit" class="btn btn-primary w-100 mt-3">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  

<script>
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import the router

import {useToast} from 'vue-toast-notification';
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
      password: ''
    };
  },
  methods: {
    /**
     * Sign in the user using the provided username and password
     */
    async register() {
      try {
        if(this.password !== this.confirmPassword){
          $toast.error('Passwords do not match');
          return;
        }
        const response = await axios.post(`${API_URL}/register`, {
          username: this.username,
          password: this.password
        });
        if (response.data.uid) { // If valid response, store user data and redirect to home
          localStorage.setItem('uid', response.data.uid);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.router.push('/'); // Use this.router to navigate
        } else {
          $toast.error('Register failed');
        }
      } catch (error) {
        console.error('Register failed', error);
        $toast.error('Register failed');
      }
    }
  }
};
</script>