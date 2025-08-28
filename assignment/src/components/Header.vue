<template>
  <header class="d-flex justify-content-between align-items-center p-3 bg-white shadow">
    <div class="d-flex align-items-center">
        <button
            class="icon-btn primary-color"
        >
            <i class="bi bi-list fs-3 primary-color"></i>
        </button>

        <h3 class="px-2 mb-0 text-bold fw-bold primary-color">
            NutriED
        </h3>
    </div>
    
    <div class="d-flex align-items-center">
        <div class="px-2">
            <button
                class="icon-btn primary-color"
            >
                <i class="bi bi-bell-fill fs-4 primary-color"></i>
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
.icon-btn,
.avatar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color .15s ease;
}

.icon-btn:hover,
.avatar-btn:hover {
  background-color: #f3f4f6;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 9999px;
  object-fit: cover;
}
</style>