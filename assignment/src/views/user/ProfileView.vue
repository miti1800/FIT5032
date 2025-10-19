<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="px-4 pt-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">User > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Profile</p>
        </div>
    </div>

    <div class="card p-4 mx-4 my-4 primary-color">
        <div class="d-flex align-items-center mb-3">
            <div class="secondary-bg p-2 me-3 border-radius8 fw-bold">{{userStore.currentUser.firstName[0] }}{{ userStore.currentUser.lastName[0] }}</div>
            <div>
                <div class="fw-bold">{{userStore.currentUser.firstName}} {{userStore.currentUser.lastName}}</div>
                <small>{{ userStore.currentUser.role }}</small>
            </div>
        </div>

        <div class="mb-3 form-check" style="cursor: pointer;">
            <input type="checkbox" class="form-check-input" id="emailUpdates" v-model="subscribe" @change="updateSubscription">
            <label class="form-check-label" for="emailUpdates">Yes! I want to receive recipe updates email.</label>
        </div>
    </div>

    <div v-if="userStore.currentUser.role == 'nutritionist'" class="row mt-4 mb-1 px-4">
        <h5 class="fw-bold mb-2">Your recipes</h5>
    </div>
        
    <div v-if="userStore.currentUser.role == 'nutritionist'" class="row d-flex justify-content-evenly flex-wrap mb-4">
        <RecipeCard 
            v-for="recipe in recipes" 
            :key="recipe.recipeId" 
            :recipe="recipe"
        />
    </div>

    <div class="card p-4 mx-4 my-4 primary-color">
        <h6 class="fw-bold mb-2">Terms & Conditions</h6>
        <p>
            Welcome to NutriEd! By using our platform, you agree to the following:
        </p>
        <ul>
            <li>You are responsible for keeping your account information secure.</li>
            <li>Use the platform only for lawful purposes.</li>
            <li>Content you post remains yours but grants NutriEd a license to display it.</li>
            <li>NutriEd may modify services or policies at any time.</li>
            <li>NutriEd is not liable for any loss resulting from platform use.</li>
        </ul>
    </div>

    <div class="card p-4 mx-4 my-4 primary-color">
        <h6 class="fw-bold mb-2">Privacy Policy</h6>
        <p>
            NutriEd respects your privacy. Here's how we handle your data:
        </p>
        <ul>
            <li>Your account information is stored securely.</li>
            <li>Email updates are sent only if you opt-in.</li>
            <li>We analyze usage to improve the platform experience.</li>
            <li>Your personal information is never sold.</li>
            <li>You can request access, correction, or deletion of your data anytime.</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import RecipeCard from '@/components/RecipeCard.vue';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useToast } from 'primevue/usetoast';

const loading = ref(false);
const userStore = useUserStore();
const recipes = ref([]);
const subscribe = ref(userStore.currentUser.subscribe ?? false);

const db = getFirestore();
const toast = useToast();

const fetchUserRecipes = async () => {
  if (!userStore.currentUser?.userId) return;

  loading.value = true;
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('author_id', '==', userStore.currentUser.userId));

    const querySnapshot = await getDocs(q);
    recipes.value = querySnapshot.docs.map((doc) => ({
      recipeId: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    console.error('Error fetching user recipes:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserRecipes();
});

const updateSubscription = async () => {
  try {
    const userId = userStore.currentUser.userId;
    console.log(userId, userStore.currentUser);
    if (!userId) throw new Error("User ID not found");

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { subscribe: subscribe.value });

    userStore.currentUser.subscribe = subscribe.value;

    toast.add({
        severity: "success",
        summary: "Preference Saved",
        detail: subscribe.value
            ? "You’ll now receive recipe updates by email."
            : "You’ve unsubscribed from recipe updates.",
        life: 3000,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    toast.add({
        severity: "error",
        summary: "Update Failed",
        detail: "Could not update email preferences.",
        life: 3000,
    });
  }
};
</script>