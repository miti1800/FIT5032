<template>
    <CommonHeader />
    <div class="d-flex align-items-center login-background min-vh-100 primary-color">
        <div class="col-md-6"></div>
        <div class="col-md-6 d-flex justify-content-center">
            <div class="w-100 card p-5 shadow-lg primary-color" style="max-width: 430px;">
                <div class="text-center mt-2 mb-4 primary-color">
                    <h2 class="h3 fw-bold mb-2">Welcome Back!</h2>
                    <p>Sign in to access your secured account.</p>
                </div>

                <form @submit.prevent="handleLogin" class="mb-2">
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

                    <div class="mb-4" style="position: relative;">
                        <label for="password" class="form-label primary-color">
                            Password <span class="error-color">*</span>
                        </label>
                        <div style="position: relative;">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                class="form-control"
                                id="password"
                                placeholder="Enter your password"
                                @blur="() => validatePassword(true)"
                                @input="() => validatePassword(false)"
                                v-model="formData.password"
                                :class="{ invalid: errors.password != null }"
                            />
                            <button
                                type="button"
                                class="btn showPassword-btn"
                                @click="togglePassword"
                                :class="{ invalid: errors.password != null }"
                            >
                                <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                            </button>
                        </div>
                        <div v-if="errors.password" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.password }}
                        </div>
                    </div>

                    <button type="submit" class="btn primary-btn w-100 mb-3">
                        Sign In
                    </button>

                    <div class="d-flex justify-content-center mb-2 primary-color">
                        <router-link to="/login" class="nav-link mx-0">
                            Forgot Password?
                        </router-link>
                    </div>

                    <div class="primary-color d-flex justify-content-center">
                        <span>Don't have an account?</span>
                        <router-link to="/register" class="nav-link fw-bold">
                            Sign Up
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <CommonFooter />
</template>

<script setup>
import router from '@/router';
import users from '../assets/json/users.json';
import { ref } from 'vue';
import CommonHeader from '@/components/CommonHeader.vue';
import CommonFooter from '@/components/CommonFooter.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const formData = ref({
    email: '',
    password: ''
});

const errors = ref({
    email: null,
    password: null
});

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validateEmail = (blur) => {
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.value.email);
    const exists = users.some(user => user.email === formData.value.email);
    if (formData.value.email.length < 1) {
        if(blur) errors.value.email = "Email cannot be empty.";
    } else if (!isValidEmail) {
        if(blur) errors.value.email = "Email is not valid.";
    } else if (!exists) {
        if(blur) errors.value.email = "Email does not exist, please sign up.";
    } else {
        errors.value.email = null;
    }
};

const validatePassword = (blur) => {
    const password = formData.value.password;
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const existingUser = users.find(user => user.email === formData.value.email);

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
    } else if (existingUser && existingUser.password !== formData.value.password) {
        if (blur) errors.value.password = "Incorrect password.";
    } else {
        errors.value.password = null;
    }
};

const handleLogin = () => {
    validateEmail(true);
    validatePassword(true);

    if(!errors.value.email && !errors.value.password) {
        const existingUser = users.find(user => user.email === formData.value.email);
        userStore.setUser(existingUser);
        if(existingUser.role === "admin") {
            router.push({ name: 'Admin Dashboard'});
        }
        else {
            router.push({ name: 'Dashboard' });
        }
        clearForm();
    }
};

const clearForm = () => {
    formData.value = {
        email: '',
        password: ''
    }
};
</script>

<style scoped>
.login-background {
  background: url('@/assets/images/login_bg.png') no-repeat center center;
  background-size: cover;
}
</style>