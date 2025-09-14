<template>
  <header class="d-flex justify-content-between align-items-center px-1 px-sm-3 p-3 bg-white shadow header">
    <div class="d-flex align-items-center">
        <button
            class="icon-btn hamburger primary-color"
        >
            <i class="bi bi-list fs-3 primary-color"></i>
        </button>
        <h3 class="px-2 mb-0 fw-bold primary-color">
            <i class="bi bi-leaf-fill fs-3 primary-color"></i>
            NutriED
        </h3>
    </div>
    
    <div class="d-flex align-items-center" style="position: relative;">
        <div class="px-3">
            <button
                class="icon-btn primary-color"
            >
                <i class="bi bi-bell-fill fs-5 primary-color"></i>
            </button>
        </div>
        <button
            class="avatar-btn primary-color"
            @click="toggleDropdown"
        >
            <img :src="profile" alt="profile" class="avatar"/>
        </button>

        <div v-if="dropdownOpen" class="dropdown-menu-custom shadow-lg">
            <div class="px-3 py-2 border-bottom">
                <strong>{{ userStore.currentUser.first_name }} {{ userStore.currentUser.last_name }}</strong>
            </div>
            <small class="dropdown-item">
                <i class="bi bi-gear-fill me-2"></i>
                Settings
            </small>
            <button class="dropdown-item small" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
            </button>
        </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import profile from '@/assets/images/profile.jpg';
import users from '@/assets/json/users.json';
import router from '@/router';
import { useUserStore } from '@/stores/user'
const userStore = useUserStore();

const dropdownOpen = ref(false);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
};

const logout = () => {
    dropdownOpen.value = false;
    userStore.logout();
    router.push({ name: 'Login'});
};
</script>

<style scoped>
.header {
    position: sticky;
    top: 0;
    z-index: 100;
}

.hamburger, .avatar-btn {
  background: transparent;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  object-fit: cover;
}

.dropdown-menu-custom {
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 200px;
  background: var(--white);
  border-radius: 8px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--secondary);
}
</style>