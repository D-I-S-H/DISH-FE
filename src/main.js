// Import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// Custom styles
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import { createWebHistory, createRouter } from "vue-router";

// Import views
import HomeView from './views/HomeView.vue'
import AboutView from "./views/AboutView.vue";
import NotFound from "./views/NotFound.vue";
import SignIn from "./views/SignIn.vue";

// Routes
const routes = [
  { name: "Home", path: "/", component: HomeView }, // Home page
  { name: "About", path: "/about", component: AboutView }, // About page
  {name: "Sign In", path: "/signin", component: SignIn}, // Sign In page
  { name: "404 - Page not found", path: '/404', component: NotFound }, // 404 page
  { path: '/:catchAll(.*)', redirect: '/404' }, // Catch all redirect to 404
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});


const app = createApp(App);
app.use(router);
app.mount("#app");
