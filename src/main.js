// Import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// Custom styles
import "./assets/main.css";

// Import Vue
import { createApp } from "vue";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";

// Import toasts
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Import views
import HomeView from './views/HomeView.vue'
import AboutView from "./views/AboutView.vue";
import NotFound from "./views/NotFound.vue";
import Login from "./views/Login.vue";
import PrivacyPolicy from "./views/PrivacyPolicy.vue";

// Routes
export const routes = [
  { name: "Home", path: "/", component: HomeView }, // Home page
  { name: "About", path: "/about", component: AboutView }, // About page
  {name: "Sign In", path: "/login", component: Login}, // Sign In page
  {name: "Privacy Policy", path: "/privacy", component: PrivacyPolicy}, // Privacy Policy page
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
app.use(router); // Router
app.use(ToastPlugin); // Toasts
app.mount("#app");
