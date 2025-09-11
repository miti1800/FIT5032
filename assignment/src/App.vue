<script setup>
import Toast from 'primevue/toast';
import CommonFooter from './components/CommonFooter.vue';
import CommonHeader from './components/CommonHeader.vue';
</script>

<template class="bg-light">
  <div class="d-flex flex-column min-vh-100">
    <Toast />
    <CommonHeader />
    <router-view></router-view>
    <CommonFooter />
  </div>
</template>