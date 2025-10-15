<template>
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
</template>

<script setup>
import { ref } from 'vue';
import contact from '@/assets/images/contact_us.png';
import { useToast } from 'primevue/usetoast';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore();
const toast = useToast();

const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Message sent!', life: 3000 });
}

const formData = ref({
    name: '',
    email: '',
    message: ''
});

const submitForm = async () => {
    validateName(true);
    validateEmail(true);
    validateMessage(true);
    if(!errors.value.name && !errors.value.email && !errors.value.message) {
        try {
            const functions = getFunctions();
            const sendContactEmail = httpsCallable(functions, "sendContactEmail");

            const result = await sendContactEmail({
                name: formData.value.name,
                email: formData.value.email,
                message: formData.value.message,
                subject: "Contact Us Form Submission"
            });
            if(result.data.success){
                showSuccess();

                await addDoc(collection(db, "queries"), {
                    name: formData.value.name,
                    email: formData.value.email,
                    message: formData.value.message,
                    status: "Unresolved",
                    createdAt: serverTimestamp()
                });
                
                clearForm();
            }
        } catch (err) {
            console.error("Error sending email:", err);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send request!', life: 5000 });
        }
    }
};

const clearForm = () => {
    formData.value = {
        name: '',
        email: '',
        message: ''
    };
};

const errors = ref({
    name: null,
    email: null,
    message: null
});

const validateName = (blur) => {
    const hasOnlyAlphabets = /^[A-Za-z' ]+$/.test(formData.value.name);
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