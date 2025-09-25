<script setup>
import Toast from 'primevue/toast';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
</script>

<template class="bg-light">
  <div class="d-flex flex-column min-vh-100">
    <Header></Header>
    <Toast />
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>