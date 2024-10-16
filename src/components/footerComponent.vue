<template>
    <footer class="text-light py-4 mt-auto border-top border-dark d-none d-md-block">
    <div class="container">
        <div class="row justify-content-between">
        <!-- Left Section: Brand and Social Links -->
        <div class="col-md-6">
            <h5 class="mb-3">🍽️ D.I.S.H</h5>
            <p>View MTU's dining hall menus in comfort</p>
            <div class="d-flex">
            <a href="https://github.com/D-I-S-H/DISH-FE" class="text-light me-3">Frontend</a>
            <a href="https://github.com/D-I-S-H/DISH-API" class="text-light me-3">Backend</a>
            </div>
        </div>
        <!-- Right Section: Disclaimer and DMCA -->
        <div class="col-md-6 text-md-end">
            <h6 class="fw-bold">Disclaimer</h6>
            <p class="mb-3">Dining Information Served Here (DISH) is still in early development and may have bugs.</p>
            <router-link to="/privacy" class="text-light">Privacy Policy</router-link>
        </div>
        </div>
    </div>
    </footer>

</template>