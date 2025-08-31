<template>
  <header class="d-flex justify-content-between align-items-center p-3 bg-white shadow">
    <div class="d-flex align-items-center"> 
        <h3 class="mb-0 fw-bold primary-color">
            <i class="bi bi-leaf-fill fs-3 primary-color"></i>   
            NutriED
        </h3>
    </div>

    <div class="d-flex d-lg-none">
        <button
            class="icon-btn hamburger primary-color"
            @click="toggleMenu"
        >
            <i class="bi bi-list fs-3 primary-color"></i>
        </button>
    </div>
    
    <div id="menu" class="d-lg-flex align-items-center primary-color menu-options px-2 pb-lg-0 pb-3" :class="{ open: isMenuOpen }">
        <a href="#" class="nav-link p-2">
            Home
        </a>
        <a href="#" class="nav-link p-2">
            Services
        </a>
        <a href="#" class="nav-link p-2">
            About Us
        </a>
        <a href="#" class="nav-link fw-bold active p-2">
            Contact Us
        </a>
        <div class="d-flex align-items-center m-2 my-lg-0 mx-2">
            <button class="btn primary-btn fw-semibold me-2">
                Login
            </button>
            <button class="btn primary-btn fw-semibold">
                Register
            </button>
        </div>
        
    </div>
    
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.nav-link {
    margin: 0px 10px;
    border-bottom: none;
    transition: border-bottom 0.3s ease;
}

.nav-link:hover {
    border-bottom: 2px solid var(--primary);
}

.nav-link.active {
    border-bottom: 2px solid var(--primary);
}

@media (max-width: 992px) {
    .menu-options {
        flex-direction: column;
        align-items: start !important;
        background: var(--white);
        position: absolute;
        top: 11%;
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