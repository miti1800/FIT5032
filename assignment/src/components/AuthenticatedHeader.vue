<template>
  <header class="d-flex justify-content-between align-items-center px-1 px-sm-3 p-3 bg-white shadow">
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
    
    <div class="d-flex align-items-center">
        <div class="px-3">
            <button
                class="icon-btn primary-color"
            >
                <i class="bi bi-bell-fill fs-5 primary-color"></i>
            </button>
        </div>
        <button
            class="avatar-btn primary-color"
        >
            <img :src="profile" alt="profile" class="avatar"/>
        </button>
    </div>
  </header>
</template>

<script setup>
import profile from '@/assets/images/profile.jpg'
</script>

<style scoped>
.hamburger, .avatar-btn {
  background: transparent;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  object-fit: cover;
}
</style>