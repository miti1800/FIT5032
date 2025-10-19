<template>
    <div class="hero-cover position-relative overflow-hidden">
        <div class="container position-relative py-5">
            <div class="row align-items-center pt-5">
                <div class="col-lg-7 col-xl-6">
                    <div class="hero-content py-5">
                        <div class="badge secondary-bg px-3 py-2 mb-4">
                            <i class="bi bi-trophy-fill me-2"></i>
                            #1 Nutrition Education Platform
                        </div>

                        <h1 class="display-2 fw-bold mb-4 lh-1 primary-color">
                            Master the
                            <span class="position-relative secondary-color">
                                Science
                            </span>
                            of Healthy Living
                        </h1>

                        <p class="mb-5 fs-5">
                            Build healthy habits, understand your body, and transform your relationship with food.
                        </p>

                        <div class="d-flex flex-column flex-sm-row gap-3 mb-5">
                            <router-link to="/login" class="btn primary-btn px-5 py-3 fw-bold">
                                Login
                            </router-link>
                            <router-link to="/register" class="btn secondary-btn px-5 py-3 fw-bold">
                                Register
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5 col-xl-6 d-none d-lg-block">
                    <div class="hero-visual position-relative">
                        <div class="main-image-container">
                            <div class="image-frame overflow-hidden">
                                <img :src=cover_image alt="Healthy nutrition"
                                    class="img-fluid w-100 h-100 object-fit-cover" style="border-radius: 4px;" />
                            </div>
                        </div>


                        <div class="floating-element element-1">
                            <div class="card border-0 shadow-lg rounded-4 p-3">
                                <div class="d-flex align-items-center">
                                    <div class="icon-circle success-box rounded-circle p-2 me-3">
                                        <i class="bi bi-capsule"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold success-color">Vitamins & Minerals</div>
                                        <small class="primary-color">Essential nutrients</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="floating-element element-2">
                            <div class="card border-0 shadow-lg rounded-4 p-3">
                                <div class="d-flex align-items-center">
                                    <div class="icon-circle warning-box rounded-circle p-2 me-3">
                                        <i class="bi bi-lightning-fill"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold warning-color">Natural Energy</div>
                                        <small class="primary-color">Sustained fuel</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="floating-element element-3">
                            <div class="card border-0 shadow-lg rounded-4 p-3">
                                <div class="d-flex align-items-center">
                                    <div class="icon-circle error-box rounded-circle p-2 me-3">
                                        <i class="bi bi-heart-pulse-fill"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold error-color">Protein Power</div>
                                        <small class="primary-color">Muscle building</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <section class="py-5">
        <div class="container">
            <div class="row text-center mb-5">
                <div class="col">
                    <h2 class="fw-bold mb-3">Why Nutrition Education Matters</h2>
                    <p>Understanding nutrition is key to living a healthier, more fulfilling life</p>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm primary-color">
                        <div class="card-body text-center p-4">
                            <div class="primary-bg secondary-color rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style="width: 70px; height: 70px;">
                                <i class="bi bi-book" style="font-size: 2rem;"></i>
                            </div>
                            <h4 class="fw-bold mb-3">Evidence-Based Learning</h4>
                            <p>
                                Access scientifically validated information from nutrition experts and researchers
                                worldwide.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4 primary-color">
                            <div class="secondary-color primary-bg rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style="width: 70px; height: 70px;">
                                <i class="bi bi-person-check" style="font-size: 2rem;"></i>
                            </div>
                            <h4 class="fw-bold mb-3">Personalized Guidance</h4>
                            <p>
                                Get tailored nutrition advice that fits your lifestyle, goals and dietary preferences.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body text-center p-4 primary-color">
                            <div class="secondary-color primary-bg rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style="width: 70px; height: 70px;">
                                <i class="bi bi-fork-knife" style="font-size: 2rem;"></i>
                            </div>
                            <h4 class="fw-bold mb-3">Curated Recipes</h4>
                            <p>
                                Access to curated healthy recipes developed by our expert dietitians. 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-3">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <img :src="expert"
                 alt="Nutrition Expert"
                 class="img-fluid rounded shadow" style="height: 400px;">
          </div>
          <div class="col-lg-6">
            <h2 class="fw-bold mb-4">Learn From Certified Experts</h2>
            <p class="mb-4">
              Our team of registered dietitians and nutrition scientists bring years of experience and cutting-edge research to help you understand the complex world of nutrition.
            </p>
            <ul class="list-unstyled">
              <li class="mb-3">
                <i class="bi bi-check-circle-fill primary-color me-2"></i>
                <strong>Certified Professionals:</strong> All instructors are APD licensed nutrition experts
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill primary-color me-2"></i>
                <strong>Updated Content:</strong> Access latest healthy recipes with their nutrition information
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill primary-color me-2"></i>
                <strong>Healthy Restaurants:</strong> Find nearby healthy restaurants for a busy day
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container text-center">
        <h2 class="fw-bold mb-3">Ready to Start Your Nutrition Journey?</h2>
        <p class="lead mb-4">Join thousands of students learning to live healthier lives</p>
        <router-link to="/register"><button class="btn primary-btn btn-lg px-5">Sign up</button></router-link>
      </div>
    </section>
</template>

<script setup>
import cover_image from '@/assets/images/cover_image.jpg';
import expert from '@/assets/images/expert.jpg'
</script>

<style scoped>
.hero-cover {
    background: linear-gradient(30deg, #f3f4f6 0%, #284B63 100%);
}

.hero-content {
    animation: slideInLeft 0.8s ease-out;
}

.hero-visual {
    animation: slideInRight 0.8s ease-out;
    height: 500px;
    position: relative;
}

.main-image-container {
    position: relative;
    height: 400px;
    width: 100%;
}

.image-frame {
    height: 100%;
    background: linear-gradient(135deg, #f3f4f6, #d9d9d9);
    padding: 8px;
    border-radius: 8px;
}

.floating-element {
    position: absolute;
    animation: float 3s ease-in-out infinite;
}

.element-1 {
    top: 50px;
    right: -20px;
    animation-delay: 0s;
}

.element-2 {
    top: 200px;
    left: -30px;
    animation-delay: 1s;
}

.element-3 {
    bottom: 50px;
    right: 20px;
    animation-delay: 2s;
}

.icon-circle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-15px);
    }
}

@media (max-width: 768px) {
    .display-2 {
        font-size: 2.5rem !important;
    }

    .hero-content {
        text-align: center;
    }
}

@media (max-width: 576px) {
    .display-2 {
        font-size: 2rem !important;
    }
}
</style>