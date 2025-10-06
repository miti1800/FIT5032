<template>
    <div class="d-flex align-items-center login-background min-vh-100 primary-color">
        <div class="col-md-6"></div>
        <div class="col-md-6 d-flex justify-content-center">
            <div class="w-100 card p-5 shadow-lg primary-color" style="max-width: 430px;">
                <div class="text-center mt-2 mb-4 primary-color">
                    <h2 class="h3 fw-bold mb-2">Forgot Your Password?</h2>
                    <p>Enter your email and we will send you a password reset link.</p>
                </div>

                <form @submit.prevent="handleForgotPassword" class="mb-2">
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

                    <div v-if="errors.firebase" class="error-box py-1 px-2 mt-1 mb-2 small d-flex align-items-center">
                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                        {{ errors.firebase }}
                    </div>

                    <button type="submit" class="btn primary-btn w-100 mb-3">
                        Send code
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import users from '../assets/json/users.json';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from 'primevue/usetoast';
import { getFirebaseErrorMessage } from '@/helpers/firebase/firebaseHelpers';

const toast = useToast();

const auth = getAuth();

const formData = ref({
    email: ''
});

const errors = ref({
    email: null,
    firebase: null
});

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

const handleForgotPassword = async () => {
    validateEmail(true);

    if(!errors.value.email) {
        try {
            await sendPasswordResetEmail(auth, formData.value.email);
            toast.add({
                severity: "success",
                summary: "Email sent!!",
                detail: "Check your email for the password reset link!",
                life: 3000,
            });
            clearForm();
            router.push({ name: 'Login' });
        } catch (error) {
            console.error(error);
            errors.value.firebase = getFirebaseErrorMessage(error.code);
        }
    }
};

const clearForm = () => {
    formData.value = {
        email: ''
    }
};
</script>

<style scoped>
.login-background {
  background: url('@/assets/images/login_bg.png') no-repeat center center;
  background-size: cover;
}
</style>