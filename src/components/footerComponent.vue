<script setup>
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
<template>
    <footer class="py-4 mt-auto border-top border-dark d-none d-md-block">
    <div class="container">
        <div class="row justify-content-between">
        <!-- Left Section: Brand and Social Links -->
        <div class="col-md-6">
            <h5 class="mb-3">🍽️ D.I.S.H</h5>
            <p>View MTU's dining hall menus in comfort</p>
            <div class="d-flex">
                <FontAwesomeIcon :icon="faGithub" size="2x" class="me-3" />
                <div class="my-auto">
                    <a href="https://github.com/D-I-S-H/DISH-FE" class="me-3">Frontend</a>
                    <a href="https://github.com/D-I-S-H/DISH-API" class="me-3">Backend</a>
                </div>
            </div>
        </div>
        <!-- Right Section: Disclaimer, privacy policy, bug report link -->
        <div class="col-md-6 text-md-end">
            <h6 class="fw-bold">Disclaimer</h6>
            <p class="mb-3">Dining Information Served Here (DISH) is still in early development and may have bugs.</p>
            <a href="https://github.com/D-I-S-H/DISH-FE/issues/new" class="me-3">Report Bug</a>
            <router-link to="/privacy">Privacy Policy</router-link>
        </div>
        </div>
    </div>
    </footer>
</template>