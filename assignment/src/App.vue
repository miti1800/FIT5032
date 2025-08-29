<script setup>
import UserManagement from './components/admin/UserManagement.vue';
import AuthenticatedFooter from './components/AuthenticatedFooter.vue';
import AuthenticatedHeader from './components/AuthenticatedHeader.vue';
import ContactUs from './components/common/ContactUs.vue';
import NormalHeader from './components/NormalHeader.vue';
</script>

<template class="bg-light">
  <div class="d-flex flex-column min-vh-100">
    <!-- <AuthenticatedHeader />
    <UserManagement />
    <AuthenticatedFooter /> -->

    <NormalHeader />
    <ContactUs />
  </div>
</template>

<style scoped>
</style>