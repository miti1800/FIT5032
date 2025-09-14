<script setup>
import Toast from 'primevue/toast';
import CommonFooter from './components/CommonFooter.vue';
import CommonHeader from './components/CommonHeader.vue';
import AuthenticatedHeader from './components/AuthenticatedHeader.vue';
import AuthenticatedFooter from './components/AuthenticatedFooter.vue';
</script>

<template class="bg-light">
  <div class="d-flex flex-column min-vh-100">
    <Toast />
    <router-view></router-view>
  </div>
</template>