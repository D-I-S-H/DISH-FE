<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars, faHouse, faQuestion, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import {useToast} from 'vue-toast-notification';
const API_URL = import.meta.env.VITE_APP_API_URL;
const router = useRouter();

const $toast = useToast();
import 'vue-toast-notification/dist/theme-sugar.css';

const username = ref('');
const password = ref('');
const uid = ref(null); // To track the uid

/**
 * Check for uid in localStorage when the component is mounted
 */
onMounted(() => {
  uid.value = localStorage.getItem('uid');
});

/**
 * Sign in the user using the provided username and password
 */
const signIn = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: username.value,
      password: password.value
    });
    if (response.data.uid) { // If valid response, store user data and uid, then redirect to home
      localStorage.setItem('uid', response.data.uid);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      uid.value = response.data.uid; // Update uid
      router.push('/');
    }
  } catch (error) {
    console.error('Login failed', error);
    $toast.error('Login failed');
  }
};
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        D.I.S.H
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav w-100">
          <li class="nav-item d-none d-lg-block me-3">
            <router-link to="/" class="btn btn-primary rounded-circle hover-enlarge">
              <FontAwesomeIcon :icon="faHouse" />
            </router-link>
          </li>
          <li class="nav-item d-none d-lg-block">
            <router-link to="/about" class="btn btn-primary rounded-circle hover-enlarge">
              <FontAwesomeIcon :icon="faQuestion" />
            </router-link>
          </li>
          <li v-if="!uid" class="nav-item ms-auto d-none d-lg-block me-3 dropdown">
            <router-link to="/" class="btn btn-primary rounded-circle hover-enlarge" id="sign-in-button" data-bs-toggle="dropdown" aria-expanded="false">
              <FontAwesomeIcon :icon="faRightToBracket" />
            </router-link>
            <ul class="dropdown-menu dropdown-menu-end p-3 sign-in-dropdown" aria-labelledby="sign-in-button">
              <form @submit.prevent="signIn">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username" />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password" />
                </div>
                <button type="submit" class="btn btn-primary w-100">Sign In</button>
              </form>
            </ul>
          </li>
          <li class="nav-item d-none d-lg-block" :class="{ 'ms-auto': uid }">
            <router-link to="/" class="btn btn-primary rounded-circle hover-enlarge" id="extra-options-button" data-bs-toggle="dropdown" aria-expanded="false">
              <FontAwesomeIcon :icon="faBars" />
            </router-link>
            <ul class="dropdown-menu dropdown-menu-end p-3 sign-in-dropdown" aria-labelledby="extra-options-button">
              <li>
                <a href="#" class="dropdown-item">Settings</a>
              </li>
              <li>
                <a href="#" class="dropdown-item">Help</a>
              </li>
              <li>
                <a href="#" class="dropdown-item">Contact</a>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-none">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <FontAwesomeIcon :icon="faHouse" />
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">
              <FontAwesomeIcon :icon="faQuestion" />
              About
            </router-link>
          </li>
          <li v-if="!uid" class="nav-item">
            <router-link to="/login" class="nav-link">
              <FontAwesomeIcon :icon="faRightToBracket" />
              Login
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
