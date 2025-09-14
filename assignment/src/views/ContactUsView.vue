<template>
    <CommonHeader />
    <div class="primary-color">
        <div class="container-fluid p-5">
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
                </div>

                <div class="col-lg-6 px-0 px-md-4">
                    <div class="card shadow-lg border-0 rounded-3 primary-color">
                        <div class="p-5">
                            <h4 class="mb-3 fw-bold">Contact Us</h4>
                            <form @submit.prevent="submitForm">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name
                                        <span class="error-color">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="name" placeholder="Enter your name"
                                        @blur="() => validateName(true)"
                                        @input="() => validateName(false)"
                                        v-model="formData.name"
                                        :class="{
                                            invalid: errors.name != null
                                        }"
                                    />
                                    <div v-if="errors.name" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                        {{ errors.name }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="email" class="form-label">Email
                                        <span class="error-color">*</span>
                                    </label>
                                    <input type="email" class="form-control" id="email" placeholder="Enter your email"
                                        @blur="() => validateEmail(true)"
                                        @input="() => validateEmail(false)"
                                        v-model="formData.email"
                                        :class="{
                                            invalid: errors.email != null
                                        }"
                                    />
                                    <div v-if="errors.email" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                        {{ errors.email }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="phone" class="form-label">Phone</label>
                                    <input type="tel" class="form-control" id="phone" placeholder="Enter your mobile no" 
                                        @blur="() => validatePhone(true)"
                                        @input="() => validatePhone(false)"
                                        v-model="formData.phone"
                                        :class="{
                                            invalid: errors.phone != null
                                        }"
                                    />
                                    <div v-if="errors.phone" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                        {{ errors.phone }}
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label for="message" class="form-label">Message
                                        <span class="error-color">*</span>
                                    </label>
                                    <textarea class="form-control" rows="4" id="message" placeholder="Write your message..."
                                        @blur="() => validateMessage(true)"
                                        @input="() => validateMessage(false)"
                                        v-model="formData.message"
                                        :class="{
                                            invalid: errors.message != null
                                        }"
                                    ></textarea>
                                    <div v-if="errors.message" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                                        {{ errors.message }}
                                    </div>
                                </div>

                                <button type="submit" class="btn secondary-btn fw-bold px-4">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CommonFooter />
</template>

<script setup>
import { ref } from 'vue';
import contact from '@/assets/images/contact_us.png';
import { useToast } from 'primevue/usetoast';
import CommonHeader from '@/components/CommonHeader.vue';
import CommonFooter from '@/components/CommonFooter.vue';

const toast = useToast();

const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Message sent!', life: 3000 });
}

const formData = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
});

const submitForm = () => {
    validateName(true);
    validateEmail(true);
    validatePhone(true);
    validateMessage(true);
    if(!errors.value.name && !errors.value.email && !errors.value.phone && !errors.value.message) {
        showSuccess();
        clearForm();
    }
};

const clearForm = () => {
    formData.value = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };
};

const errors = ref({
    name: null,
    email: null,
    phone: null,
    message: null
});

const validateName = (blur) => {
    const hasOnlyAlphabets = /^[A-Za-z']+$/.test(formData.value.name);
    if (formData.value.name.length < 3) {
        if(blur) errors.value.name = "Name must be atleast 3 characters.";
    }
    else if (!hasOnlyAlphabets) {
        if(blur) errors.value.name = "Name must only contain alphabets.";
    }
    else {
        errors.value.name = null;
    }
}

const validateEmail = (blur) => {
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.value.email);
    if (formData.value.email.length < 1) {
        if(blur) errors.value.email = "Email cannot be empty.";
    } else if (!isValidEmail) {
        if(blur) errors.value.email = "Email is not valid.";
    } else {
        errors.value.email = null;
    }
}

const validatePhone = (blur) => {
    if(formData.value.phone.length != 0) {
        const isValidPhone = /^(\+61\s?|0)[2-478](\s?\d){8}$/.test(formData.value.phone);
        if (!isValidPhone) {
            if(blur) errors.value.phone = "Phone number is not valid australian number.";
        } else {
            errors.value.phone = null;
        }
    } else {
        errors.value.phone = null;
    }
}

const validateMessage = (blur) => {
    if (formData.value.message.trim().length < 10) {
        if(blur) errors.value.message = "Message must be atleast 10 characters.";
    } else if (formData.value.message.trim().length > 1000) {
        if(blur) errors.value.message = "Message can’t exceed 1000 characters.";
    } else {
        errors.value.message = null;
    }
}
</script>