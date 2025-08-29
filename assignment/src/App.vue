<script setup>
import UserManagement from './components/admin/UserManagement.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue'
</script>

<template class="bg-light">
  <div class="d-flex flex-column min-vh-100">
    <Header />
    <UserManagement />
    <Footer />
  </div>
</template>

<style scoped>
</style>