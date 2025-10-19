<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
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
                        <label for="firstName" class="form-label">
                            First Name <span class="error-color">*</span>
                        </label>
                        <input type="text" class="form-control" id="firstName" placeholder="Enter your first name"
                            @blur="() => validateFirstName(true)"
                            @input="() => validateFirstName(false)"
                            v-model="formData.firstName"
                            :class="{
                                invalid: errors.firstName != null
                            }"
                        />
                        <div v-if="errors.firstName" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.firstName }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="lastName" class="form-label">
                            Last Name <span class="error-color">*</span>
                        </label>
                        <input type="text" class="form-control" id="lastName" placeholder="Enter your last name"
                            @blur="() => validateLastName(true)"
                            @input="() => validateLastName(false)"
                            v-model="formData.lastName"
                            :class="{
                                invalid: errors.lastName != null
                            }"
                        />
                        <div v-if="errors.lastName" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.lastName }}
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
                        <div style="position: relative;">
                            <Datepicker
                                v-model="formData.dob"
                                placeholder="Select your date of birth"
                                :upper-limit="new Date(new Date().setFullYear(new Date().getFullYear() - 18))"
                                :lower-limit="new Date(new Date().setFullYear(new Date().getFullYear() - 118))"
                                @focus="isDobFocused = true"
                                @blur="isDobFocused = false; validateDob(true)"
                                @input="() => validateDob(false)"
                                class="form-control"
                                :class="{ invalid: errors.dob != null }"
                            />
                            <span class="btn showPassword-btn" 
                                :class="{invalid: errors.dob != null}"
                            >
                                <i class="bi bi-calendar-event-fill primary-color" :class="{'error-color' : errors.dob != null }"></i>
                            </span>
                        </div>
                        <div v-if="errors.dob" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.dob }}
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label primary-color">
                            Create Password <span class="error-color">*</span>
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

                    <div class="mb-4">
                        <label for="confirmPassword" class="form-label">
                            Confirm password
                            <span class="error-color">*</span>
                        </label>
                        <div style="position: relative;">
                            <input
                                :type="showConfirmPassword ? 'text' : 'password'"
                                class="form-control"
                                id="confirmPassword"
                                placeholder="Enter your password"
                                @blur="() => validateConfirmPassword(true)"
                                v-model="formData.confirmPassword"
                                :class="{ invalid: errors.confirmPassword != null }"
                            />
                            <button
                                type="button"
                                class="btn showPassword-btn"
                                @click="toggleConfirmPassword"
                                :class="{ invalid: errors.confirmPassword != null }"
                            >
                                <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                            </button>
                        </div>
                        <div v-if="errors.confirmPassword" class="error-box py-1 px-2 mt-1 mb-2 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.confirmPassword }}
                        </div>
                    </div>


                    <div v-if="errors.firebase" class="error-box py-1 px-2 mt-1 mb-2 small d-flex align-items-center">
                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                        {{ errors.firebase }}
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

<script setup>
import router from '@/router'
import { ref } from 'vue'
import Datepicker from 'vue3-datepicker';
import { useUserStore } from '@/stores/user';
import DOMPurify from 'dompurify';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useToast } from 'primevue/usetoast';
import { getFirebaseErrorMessage } from '@/helpers/firebase/firebaseHelpers';

const toast = useToast();

const auth = getAuth();
const db = getFirestore();
const loading = ref(false);

const userStore = useUserStore();

const isDobFocused = ref(false)

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const showConfirmPassword = ref(false);

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    dob: null,
    password: '',
    confirmPassword: ''
});

const errors = ref({
    firstName: null,
    lastName: null,
    email: null,
    dob: null,
    password: null,
    confirmPassword: null,
    firebase: null
});

const validateFirstName = (blur) => {
    const name = formData.value.firstName.trim();
    const isValidName = /^[A-Za-z\s]+$/.test(name)
    if (name.length < 1) {
        if (blur) errors.value.firstName = 'First name cannot be empty.'
    } else if(!isValidName) {
        if (blur) errors.value.firstName = 'First name should only contain letters and spaces.'
    } else {
        errors.value.firstName = null
    }
};

const validateLastName = (blur) => {
    const name = formData.value.lastName.trim();
    const isValidName = /^[A-Za-z\s]+$/.test(name)
    if (name.length < 1) {
        if (blur) errors.value.lastName = 'Last name cannot be empty.'
    } else if(!isValidName) {
        if (blur) errors.value.lastName = 'Last name should only contain letters and spaces.'
    } else {
        errors.value.lastName = null
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

const handleRegistration = async () => {
    validateFirstName(true);
    validateLastName(true);
    validateEmail(true);
    validateDob(true);
    validatePassword(true);
    validateConfirmPassword(true);
    if(!errors.value.email && !errors.value.password && !errors.value.firstName && !errors.value.lastName && !errors.value.confirmPassword && !errors.value.dob) {
        loading.value = true;
        errors.value.firebase = null
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                firstName: DOMPurify.sanitize(formData.value.firstName),
                lastName: DOMPurify.sanitize(formData.value.lastName),
                dob: formData.value.dob,
                email: DOMPurify.sanitize(formData.value.email),
                createdAt: new Date(),
                status: "Setup pending",
                subscribe: false,
                role: "user"
            });

            toast.add({ severity: 'success', summary: 'Success', detail: 'Account created successfully!', life: 3000 });

            userStore.setUser({
                userId: user.uid,
                firstName: DOMPurify.sanitize(formData.value.firstName),
                lastName: DOMPurify.sanitize(formData.value.lastName),
                email: DOMPurify.sanitize(formData.value.email),
                dob: formData.value.dob,
                status: "Setup pending",
                subscribe: false,
                role: "user"
            });
            router.push({ name: 'Setup Profile' });
            clearForm();        
        } catch (error) {
            errors.value.firebase = getFirebaseErrorMessage(error.code);
        } finally {
            loading.value = false;
        }
    }
};

const clearForm = () => {
    formData.value = {
        firstName: '',
        lastName: '',
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