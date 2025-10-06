<script setup>
import Toast from 'primevue/toast';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const userStore = useUserStore();
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};
</script>

<template>
  <div class="app-layout d-flex min-vh-100">
    <Sidebar
      v-if="userStore.currentUser"
      :is-open="showSidebar"
      @close-sidebar="closeSidebar"
      @toggle-sidebar="toggleSidebar"
    />

    <div class="d-flex flex-column flex-grow-1">
      <Header @toggle-sidebar="toggleSidebar" />
      <Toast />
      <main style="max-height: 100%; overflow-y: scroll;">
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}
</style>