<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars, faHouse, faQuestion, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

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
          <li class="nav-item ms-auto d-none d-lg-block me-3">
            <router-link to="/" class="btn btn-primary rounded-circle hover-enlarge">
              <FontAwesomeIcon :icon="faRightToBracket" />
            </router-link>
          </li>
          <li class="nav-item d-none d-lg-block">
            <router-link to="/" class="btn btn-primary rounded-circle hover-enlarge">
              <FontAwesomeIcon :icon="faBars" />
            </router-link>
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
          <li class="nav-item">
            <a href="#" class="nav-link">
              <FontAwesomeIcon :icon="faRightToBracket" />
              Login
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
