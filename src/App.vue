<script setup>
  import navComponent from "./components/navComponent.vue";
  import footerComponent from "./components/footerComponent.vue";
</script>
<template>
  <navComponent />
  <main>
    <RouterView />
  </main>
  <footerComponent/>
</template>
