<script setup>
import Toast from 'primevue/toast';
import UserManagement from './components/admin/UserManagement.vue';
import AuthenticatedFooter from './components/AuthenticatedFooter.vue';
import AuthenticatedHeader from './components/AuthenticatedHeader.vue';
import ContactUs from './components/common/ContactUs.vue';
import CommonFooter from './components/CommonFooter.vue';
import CommonHeader from './components/CommonHeader.vue';
</script>

<template class="bg-light">
  <div class="d-flex flex-column min-vh-100">
    <Toast />
    <!-- <AuthenticatedHeader />
    <UserManagement />
    <AuthenticatedFooter /> -->

    <CommonHeader />
    <ContactUs />
    <CommonFooter />
  </div>
</template>