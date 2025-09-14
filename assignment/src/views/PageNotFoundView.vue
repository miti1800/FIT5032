<template>
  <div class="py-5 cover-gradient min-vh-100 d-flex flex-column align-items-center justify-content-center secondary-color">
    <i class="bi bi-emoji-frown-fill display-2 secondary-color"></i>
    <h1 class="display-2 fw-medium">Error: 404</h1>
    <h6 class="display-6 mb-4">Page not found !!</h6>
    <router-link to="/" class="btn primary-btn px-4 fs-4">Go back home</router-link>
  </div>
</template>

<style scoped>
.cover-gradient {
    background: linear-gradient(30deg, #f3f4f6 0%, #284B63 100%);
}
</style>