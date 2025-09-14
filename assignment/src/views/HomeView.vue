<template>
    <CommonHeader />
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
    <CommonFooter />
</template>

<script setup>
import CommonFooter from '@/components/CommonFooter.vue';
import CommonHeader from '@/components/CommonHeader.vue';
import cover_image from '@/assets/images/cover_image.jpg';
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