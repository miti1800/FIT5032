<template>
    <div class="primary-color">
        <div class="container p-5">
            <div class="row align-items-center">
                <div class="col-12 mb-4 text-center">
                    <h2 class="fw-bold mb-3">Get in Touch</h2>
                    <p>
                        Have questions about our services? Fill out the form and our team will get back to you shortly.
                        We’d love to hear from you!
                    </p>
                </div>
            </div>
            <div class="row align-items-center">    
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <img :src="contact" alt="Contact us" class="w-100"/>
                    <!-- <ul class="list-unstyled mt-3">
                        <li><i class="bi bi-telephone-fill me-2 text-primary"></i> +1 (555) 123-4567</li>
                        <li><i class="bi bi-envelope-fill me-2 text-primary"></i> support@nutried.com</li>
                        <li><i class="bi bi-geo-alt-fill me-2 text-primary"></i> 123 Nutri Street, Healthy City</li>
                    </ul> -->
                </div>

                <div class="col-lg-6 px-5">
                    <div class="card shadow-lg border-0 rounded-3 primary-bg">
                        <div class="card-body p-4">
                            <h4 class="mb-3 fw-bold">Contact Us</h4>
                            <form>
                                <div class="mb-3">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" class="form-control" placeholder="Enter your name" />
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" placeholder="Enter your email" />
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="phone" class="form-control" placeholder="Enter your mobile no" />
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Message</label>
                                    <textarea class="form-control" rows="4" placeholder="Write your message..."></textarea>
                                </div>

                                <button type="submit" class="btn secondary-btn fw-bold">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import contact from '@/assets/images/contact_us.png'
</script>