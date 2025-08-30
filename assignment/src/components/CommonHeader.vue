<template>
  <header class="d-flex justify-content-between align-items-center p-3 bg-white shadow">
    <div class="d-flex align-items-center">
        <i class="bi bi-leaf-fill px-2 fs-3"></i>    
        <h3 class="mb-0 fw-bold primary-color">
            NutriED
        </h3>
    </div>
    
    <div class="d-flex align-items-center primary-color">
        <a href="#" class="nav-link">
            Home
        </a>
        <a href="#" class="nav-link">
            Services
        </a>
        <a href="#" class="nav-link">
            About Us
        </a>
        <a href="#" class="nav-link fw-bold active">
            Contact Us
        </a>
        <button class="btn primary-btn fw-semibold me-2">
            Login
        </button>
        <button class="btn primary-btn fw-semibold">
            Register
        </button>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
    margin: 5px 20px;
    border-bottom: none;
    transition: border-bottom 0.5s ease;
}

.nav-link:hover {
    border-bottom: 2px solid #284b63;
}

.nav-link.active {
    border-bottom: 2px solid #284b63;
}
</style>