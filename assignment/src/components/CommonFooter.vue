<template>
  <footer class="primary-bg">
    <div class="container-fluid p-4">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="d-flex align-items-center mb-3">
            <h5 class="mb-0 fw-semibold">
              <i class="bi bi-leaf-fill fs-4"></i>
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
              <small>info@nutried.org</small>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <h5 class="py-1 mb-3 fw-semibold">Quick Links</h5>
          <div class="row g-2">
            <div class="col-6">
              <a href="" class="footer-link d-block small">
                Home
              </a>
            </div>
            <div class="col-6">
              <a href="" class="footer-link d-block small">
                Services
              </a>
            </div>
            <div class="col-6">
              <a href="" class="footer-link d-block small">
                About Us
              </a>
            </div>
            <div class="col-6">
              <a href="" class="footer-link d-block small">
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-12">
          <h5 class="py-1 mb-3 fw-semibold">Get Involved</h5>
          <div class="d-grid mb-3">
            <button class="btn secondary-btn fw-medium mx-0">
              Sign-Up
            </button>
          </div>
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
    <AuthenticatedFooter />
  </footer>
</template>

<script setup>
import AuthenticatedFooter from './AuthenticatedFooter.vue';
</script>