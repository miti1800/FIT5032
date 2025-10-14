<template>
  <header class="d-flex justify-content-between align-items-center px-1 px-sm-3 p-3 bg-white shadow header">
    <div class="d-flex align-items-center">
        <button
            v-if="userStore.currentUser"
            class="icon-btn hamburger primary-color"
            @click="toggleSidebar"
        >
            <i class="bi bi-list fs-3 primary-color"></i>
        </button>
        <h3 v-if="!userStore.currentUser" class="px-2 mb-0 fw-bold primary-color">
            <img :src="logo" alt="App logo" class="app-logo"/> 
            NutriED
        </h3>
    </div>

    <div v-if="!userStore.currentUser" class="d-flex d-lg-none">
        <button
            class="icon-btn hamburger primary-color"
            @click="toggleMenu"
        >
            <i class="bi bi-list fs-3 primary-color"></i>
        </button>
    </div>
    
    <div v-if="!userStore.currentUser" id="menu" class="d-lg-flex align-items-center primary-color menu-options px-2 pb-lg-0 pb-3" :class="{ open: isMenuOpen }">
        <router-link to="/" class="nav-link p-2" active-class="active">
            Home
        </router-link>
        <router-link to="/contact-us" class="nav-link p-2" active-class="active">
            Contact Us
        </router-link>
        <div class="d-flex align-items-center m-2 my-lg-0 mx-2">
            <router-link to="/login" class="btn primary-btn fw-semibold me-3">
                Login
            </router-link>
            <router-link to="/register" class="btn primary-btn fw-semibold">
                Register
            </router-link>
        </div>
        
    </div>
    
    <div v-if="userStore.currentUser" class="d-flex align-items-center" style="position: relative;">
        <div class="px-3">
            <button
                class="icon-btn primary-color"
            >
                <i class="bi bi-bell-fill fs-5 primary-color"></i>
            </button>
        </div>
        <button
            class="icon-btn primary-color"
            @click="toggleDropdown"
        >
            <strong>{{userStore.currentUser.firstName[0] }}{{ userStore.currentUser.lastName[0] }}</strong>
        </button>

        <div v-if="dropdownOpen" class="dropdown-menu-custom shadow-lg">
            <div class="px-3 py-2 border-bottom">
                <strong>{{ userStore.currentUser.firstName }} {{ userStore.currentUser.lastName }}</strong>
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
import { ref, defineEmits } from 'vue';
import profile from '@/assets/images/profile.jpg';
import users from '@/assets/json/users.json';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import logo from '@/assets/images/logo.png';

const emit = defineEmits(["toggle-sidebar"]);

const userStore = useUserStore();

const dropdownOpen = ref(false);

const toggleSidebar = () => {
  emit("toggle-sidebar");
};

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
};

const logout = () => {
    dropdownOpen.value = false;
    userStore.logout();
    router.push({ name: 'Login'});
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
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

.hamburger {
    display: none;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  object-fit: cover;
}

.app-logo {
    height: 35px;
}

@media (max-width: 992px) {
    .hamburger {
        display: block;
    }

    .menu-options {
        flex-direction: column;
        align-items: start !important;
        background: var(--white);
        position: absolute;
        top: 100%;
        left: 0%;
        width: 100%;
        transform: translateY(-60px);
        transition: transform 0.3s ease-in;
        display: none;
    } 

    .menu-options.open {
        display: flex;
        transform: translateY(0px);
    }

    .nav-link {
        border: none;
        transition: border-left 0.5s ease;
    }

    .nav-link:hover {
        border-bottom: 0px;
        border-left: 2px solid var(--primary);
    }

    .nav-link.active {
        border-bottom: none;
        border-left: 2px solid var(--primary);
    }
}
</style>