<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="d-flex align-items-center login-background min-vh-100 primary-color">
        <div class="col-md-6"></div>
        
        <div v-if="userStore.currentUser.status == 'Pending approval'" class="col-md-6 d-flex justify-content-center">
            <div class="w-100 card p-5 shadow-lg primary-color" style="max-width: 430px;">
                <div class="text-center mt-2 mb-4 primary-color">
                    <i class="bi bi-hourglass-split display-1 mb-3"></i>
                    <h2 class="h3 fw-bold mb-2">Application Under Review !</h2>
                    <p>Thank you for submitting your details. Your application is currently being reviewed. We will get back to you within 1-2 business days via email.</p>
                </div>
            </div>
        </div>

        <div v-else class="col-md-6 d-flex justify-content-center">
            <div class="w-100 card p-5 shadow-lg primary-color" style="max-width: 430px;">
                <div class="text-center mt-2 mb-4 primary-color">
                    <h2 class="h3 fw-bold mb-2">Welcome!</h2>
                    <p>Let's Complete Your Profile.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="mb-2">
                    <div class="mb-3">
                        <label class="form-label">Select Role: <span class="error-color">*</span></label>
                        <select class="form-select"
                                v-model="formData.role"
                                @change="() => { validateRole(); onRoleChange(); }">
                            <option disabled value="">Select your role</option>
                            <option value="user">User</option>
                            <option value="nutritionist">Professional Dietitian</option>
                        </select>
                        <div v-if="errors.role" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.role }}
                        </div>
                    </div>

                    <div v-if="formData.role === 'nutritionist'" class="mb-3">
                        <label for="apdNumber" class="form-label">
                            APD Registration Number: <span class="error-color">*</span>
                        </label>
                        <input type="text" id="apdNumber" class="form-control"
                            placeholder="Enter your APD number"
                            v-model="formData.apdNumber"
                            @blur="validateAPD(true)"
                            @input="validateAPD(false)"
                            :class="{ invalid: errors.apdNumber != null }"
                        />

                        <div v-if="errors.apdNumber" class="error-box py-1 px-2 my-1 small d-flex align-items-center">
                            <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                            {{ errors.apdNumber }}
                        </div>
                    </div>

                    <div class="mb-3 form-check" style="cursor: pointer;">
                        <input type="checkbox" class="form-check-input" id="emailUpdates" v-model="formData.emailUpdates">
                        <label class="form-check-label" for="emailUpdates">Yes! I want to receive recipe updates email.</label>
                    </div>

                    <div v-if="errors.firebase" class="error-box py-1 px-2 mt-1 mb-2 small d-flex align-items-center">
                        <i class="bi bi-exclamation-circle error-color fs-6 me-2"></i>
                        {{ errors.firebase }}
                    </div>

                    <button type="submit" class="btn primary-btn w-100 mb-3">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useToast } from 'primevue/usetoast';

const loading = ref(false);
const toast = useToast();

const userStore = useUserStore();

const formData = ref({
    role: '',
    apdNumber: '',
    emailUpdates: false
});

const errors = ref({
    role: null,
    apdNumber: null
});

const onRoleChange = () => {
    if (formData.value.role !== 'nutritionist') {
        formData.value.apdNumber = '';
        errors.value.apdNumber = null;
    }
};

const validateRole = () => {
    if (!formData.value.role) {
        errors.value.role = 'Please select a role.';
    } else {
        errors.value.role = null;
    }
};

const validateAPD = (blur) => {
  const apdNumber = formData.value.apdNumber || '';
  const regex = /^APD\d{6}$/;

  if (formData.value.role === 'nutritionist') {
    if (blur && !apdNumber) {
      errors.value.apdNumber = 'APD Registration Number is required.';
    } else if (apdNumber && !regex.test(apdNumber)) {
      if(blur) errors.value.apdNumber = 'APD number must start with "APD" followed by 6 digits (e.g., APD060234).';
    } else {
      errors.value.apdNumber = null;
    }
  }
};

const handleSubmit = async () => {
    validateRole();
    validateAPD(true);

    if(!errors.value.role && !errors.value.apdNumber) {
        loading.value = true;

        try {
            const db = getFirestore();

            console.log(userStore.currentUser, userStore.currentUser.userId);

            const userRef = doc(db, "users", userStore.currentUser.userId);

            await updateDoc(userRef, {
                role: formData.value.role,
                apdNumber: formData.value.role === "nutritionist" ? formData.value.apdNumber : null,
                subscribe: formData.value.emailUpdates,
                status: formData.value.role === "nutritionist" ? "Pending approval" : "Active"
            });

            toast.add({ severity: 'success', summary: 'Profile Submitted', detail: 'Your profile has been successfully submitted!' });

            userStore.currentUser.role = formData.value.role;
            userStore.currentUser.apdNumber = formData.value.apdNumber;
            userStore.currentUser.subscribe = formData.value.emailUpdates;
            userStore.currentUser.status = formData.value.role == "nutritionist" ? "Pending approval" : "Active" ;

            clearForm();

            if(formData.value.role == "user") {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.add({ severity: 'error', summary: 'Update Failed', detail: error.message });
        } finally {
            loading.value = false;
        }
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