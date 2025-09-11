<template>
    <div class="d-flex align-items-center login-background min-vh-100 primary-color py-5">
        <div class="col-md-6"></div>
        <div class="col-md-6 d-flex justify-content-center">
            <div class="w-100 card p-5 shadow-lg primary-color" style="max-width: 430px;">
                <div class="text-center mb-4 primary-color">
                    <h2 class="h3 fw-bold mb-2">Create Your Account</h2>
                    <p>Get started on your journey to a healthier you!</p>
                </div>

                <form @submit.prevent="handleRegistration" class="mb-2">
                    <div class="mb-3">
                        <label for="name" class="form-label">
                            Name <span class="error-color">*</span>
                        </label>
                        <input type="name" class="form-control" id="name" placeholder="Enter your name"
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
                        <label for="email" class="form-label">
                            Email <span class="error-color">*</span>
                        </label>
                        <input type="text" class="form-control" id="email" placeholder="Enter your email"
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
                        <label for="dob" class="form-label">
                            Date of Birth <span class="error-color">*</span>
                        </label>
                        <Datepicker
                            v-model="formData.dob"
                            :upper-limit="new Date(new Date().setFullYear(new Date().getFullYear() - 18))"
                            :lower-limit="new Date(new Date().setFullYear(new Date().getFullYear() - 118))"
                            @blur="() => validateDob(true)"
                            @input="() => validateDob(false)"
                            class="form-control"
                            :class="{ invalid: errors.dob != null }"
                        />
                        <div v-if="errors.dob" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.dob }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label primary-color">
                            Create Password <span class="error-color">*</span>
                        </label>
                        <input type="password" class="form-control" id="password" placeholder="Create your password"
                            @blur="() => validatePassword(true)"
                            @input="() => validatePassword(false)"
                            v-model="formData.password"
                            :class="{
                                invalid: errors.password != null
                            }"
                        />
                        <div v-if="errors.password" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.password }}
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="confirm-password" class="form-label">
                            Confirm password
                            <span class="error-color">*</span>
                        </label>
                        <input
                            type="password"
                            class="form-control"
                            id="confirm-password"
                            placeholder="Confirm your password"
                            @blur="() => validateConfirmPassword(true)"
                            v-model="formData.confirmPassword"
                        />
                        <div v-if="errors.confirmPassword" class="text-danger">
                            {{ errors.confirmPassword }}
                        </div>
                    </div>

                    <button type="submit" class="btn primary-btn w-100 mb-3">
                        Sign Up
                    </button>

                    <div class="primary-color d-flex justify-content-center">
                        <span>Already have an account?</span>
                        <router-link to="/login" class="nav-link fw-bold">
                            Sign In
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import Datepicker from 'vue3-datepicker'

const formData = ref({
    name: '',
    email: '',
    dob: null,
    password: '',
    confirmPassword: ''
});

const errors = ref({
    name: null,
    email: null,
    dob: null,
    password: null,
    confirmPassword: null
});

const validateName = (blur) => {
    const name = formData.value.name.trim();
    const isValidName = /^[A-Za-z\s]+$/.test(name)
    if (name.length < 1) {
        if (blur) errors.value.name = 'Name cannot be empty.'
    } else if(!isValidName) {
        if (blur) errors.value.name = 'Name should only contain letters and spaces.'
    } else {
        errors.value.name = null
    }
};

const validateEmail = (blur) => {
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.value.email);
    if (formData.value.email.length < 1) {
        if(blur) errors.value.email = "Email cannot be empty.";
    } else if (!isValidEmail) {
        if(blur) errors.value.email = "Email is not valid.";
    } else {
        errors.value.email = null;
    }
};

const validateDob = (blur) => {
    const dob = formData.value.dob
    if (!dob) {
        if (blur) errors.value.dob = 'Date of Birth is required.'
    } else {
        errors.value.dob = null
    }
}

const validatePassword = (blur) => {
    const password = formData.value.password;
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
    } else if (!hasUppercase) {
        if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
    } else if (!hasLowercase) {
        if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
    } else if (!hasNumber) {
        if (blur) errors.value.password = "Password must contain at least one number.";
    } else if (!hasSpecialChar) {
        if (blur) errors.value.password = "Password must contain at least one special character.";
    } else {
        errors.value.password = null;
    }
};

const validateConfirmPassword = (blur) => {
    if (formData.value.password !== formData.value.confirmPassword) {
        if (blur) errors.value.confirmPassword = 'Passwords do not match.'
    } else {
        errors.value.confirmPassword = null
    }
};

const handleRegistration = () => {
    validateName(true);
    validateEmail(true);
    validateDob(true);
    validatePassword(true);
    validateConfirmPassword(true);
    if(!errors.value.email && !errors.value.password && !errors.value.name && !errors.value.confirmPassword && !errors.value.dob) {
        console.log(formData.value);
        clearForm();
    }
};

const clearForm = () => {
    formData.value = {
        name: '',
        email: '',
        dob: null,
        password: '',
        confirmPassword: ''
    }
};
</script>

<style scoped>
.login-background {
  background: url('@/assets/images/login_bg.png') no-repeat center center;
  background-size: cover;
}
</style>