<template>
    <div v-if="recipes.length === 0" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="px-4 pt-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">User > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Dashboard</p>
        </div>
    </div>
    <div class="container-fluid p-4 py-2 primary-color">
        <div class="row">
            <div class="col-12 py-3 d-flex flex-column align-items-center text-center">
                <h3 class="fw-bold">Hello {{ `${userStore.currentUser.firstName} ${userStore.currentUser.lastName}!!`}}</h3>
                <span class="success-box px-4 py-2 mt-3">Small changes in what you eat today, can create big changes in how you feel tomorrow.</span>
            </div>
        </div>

        <div class="row mt-4 mb-1">
            <div class="col-12 d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-2">Recent recipes</h5>
                <router-link to="/recipes">
                    <button class="btn primary-btn">
                        Explore more recipes
                    </button>
                </router-link>
            </div>
        </div>
            
        <div class="row d-flex justify-content-evenly flex-wrap mb-4">
            <RecipeCard 
                v-for="recipe in recipes" 
                :key="recipe.id" 
                :recipe="recipe"
            />
        </div>
    </div>
</template>

<script setup>
import StatsCard from '@/components/StatsCard.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useUserStore } from '@/stores/user';

const recipes = ref([]);
const loading = ref(false);
const userStore = useUserStore();

const fetchRecentRecipes = async () => {
    loading.value = true;
    try {
        const recipesRef = collection(db, "recipes");

        const q = query(recipesRef, orderBy("posted_on", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        recipes.value = querySnapshot.docs.map(doc => ({
            recipeId: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching recent recipes:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
  fetchRecentRecipes();
});
</script>