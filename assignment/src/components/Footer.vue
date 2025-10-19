<script setup lang="ts">
import router from '@/router';

</script>

<template>
  <footer class="primary-bg">
    <div class="container-fluid p-4">
      <div class="row g-4">
        <div class="col-lg-6 col-md-6">
          <div class="d-flex align-items-center mb-3">
            <h5 class="mb-0 fw-semibold">
              NutriED
            </h5>
          </div>
          <p class="mb-3 lh-base">
            Making a positive impact in our community through dedication, compassion, and meaningful action.
          </p>
          <div class="space-y-2">
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-geo-alt-fill me-2 flex-shrink-0"></i>
              <small>8 Claremont St, South Yarra, VIC - 3141</small>
            </div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-telephone-fill me-2 flex-shrink-0"></i>
              <small>(+61) 439683590</small>
            </div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-envelope-fill me-2 flex-shrink-0"></i>
              <small>nutried000@gmail.com</small>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <h5 class="py-1 mb-3 fw-semibold">Quick Links</h5>
          <div class="row g-2">
            <div class="col-6">
              <router-link to="/"class="footer-link d-block small">
                Home
              </router-link>
            </div>
            <div class="col-6">
              <router-link to="/restaurants" class="footer-link d-block small">
                Restaurants
              </router-link>
            </div>
            <div class="col-6">
              <router-link to="/contact-us" class="footer-link d-block small">
                Contact Us
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-lg-2 col-md-12">
          <h5 class="py-1 mb-3 fw-semibold">Get Involved</h5>
          <div class="d-flex gap-3">
            <a href="#" class="secondary-color" aria-label="Facebook">
              <i class="bi bi-facebook fs-5"></i>
            </a>
            <a href="#" class="secondary-color" aria-label="Twitter">
              <i class="bi bi-twitter-x fs-5"></i>
            </a>
            <a href="#" class="secondary-color" aria-label="Instagram">
              <i class="bi bi-instagram fs-5"></i>
            </a>
            <a href="#" class="secondary-color" aria-label="LinkedIn">
              <i class="bi bi-linkedin fs-5"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <hr class="m-0"/> 

    <div class="footer-section primary-bg mt-auto py-3 px-4">
      <div class="d-flex align-items-center justify-content-between">
          <p class="mb-0 small">
              © 2025 NutriED. All rights reserved. 
              <span class="d-none d-md-inline">| 501(c)(3) Non-Profit Organization</span>
          </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@media(max-width: 850px) {
    .footer-section {
        flex-direction: column;
    }
}
</style>