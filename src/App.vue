<script setup>
  import navComponent from "./components/navComponent.vue";
  import footerComponent from "./components/footerComponent.vue";
</script>
<template>
  <div class="d-flex flex-column min-vh-100">
    <navComponent />
    <main class="flex-grow-1 mb-4">
      <RouterView />
    </main>
    <footerComponent/>
  </div>
</template>
