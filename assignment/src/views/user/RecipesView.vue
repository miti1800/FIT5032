<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    
    <div class="px-4 pt-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">User > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Recipes</p>
        </div>

        <div class="d-flex align-items-center justify-content-between">
            <h5 class="mt-3 mb-0">Curated Healthy Recipes by Our Expert Nutritionist</h5>
            <router-link v-if="userStore.currentUser.role == 'nutritionist'" to="/post-recipe">
                <button class="btn primary-btn">Post Recipe</button>
            </router-link>
        </div>
    </div>

    <div class="container-fluid p-4 py-2 primary-color">
        <div class="row d-flex justify-content-evenly flex-wrap mb-4">
            <RecipeCard
                v-for="recipe in recipes" 
                :key="recipe.recipeId" 
                :recipe="recipe"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RecipeCard from '@/components/RecipeCard.vue';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const recipes = ref([]);
const loading = ref(false);

const db = getFirestore();

onMounted(async () => {
    loading.value = true;
    try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        recipes.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                recipeId: doc.id,
                ...data
            };
        })
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});

const averageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return (sum / ratings.length);
};
</script>