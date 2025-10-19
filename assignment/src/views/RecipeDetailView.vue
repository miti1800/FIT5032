<template>
    <div v-if="recipe">
        <div class="px-4 py-3 m-2 primary-color">
            <div class="d-flex align-items-center fw-lighter">
                <span v-if="isAdmin">Admin</span>
                <span v-else>User</span>
                &nbsp; > Recipes > &nbsp;
                <p class="fw-normal text-decoration-underline mb-0">{{recipe.recipe_name}}</p>
            </div>
        </div>
        <div class="container-fluid px-4 py-3">
            <div class="row mb-4 d-flex">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h4 class="fw-bold mb-0">{{ recipe.recipe_name }}</h4>
                        <small>Posted on {{ formatDate(recipe.posted_on?.seconds ? new Date(recipe.posted_on.seconds * 1000) : null) }}</small>
                    </div>
                    <div v-if="isAdmin" class="d-flex align-items-center">
                        <button class="icon-btn" @click="removeRecipe">
                            <i class="bi bi-trash-fill fs-4 error-color"></i>
                        </button>
                    </div>
                </div>
                
                <div class="col-md-6 mx-auto">
                    <div class="card">
                        <img :src="recipe.image" :alt="recipe.recipe_name" style="border-radius: 8px; height: 400px; object-fit: cover;">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="row g-3 mb-4">
                        <Rating :ratings="recipe.rating" />
                        <div class="col-6 col-md-3">
                            <div class="card info-card text-center p-3 primary-color">
                                <div class="fw-bold">
                                    <i class="bi bi-alarm-fill"></i>
                                    {{ recipe.prep_time }}m
                                </div>
                                <small>Prep Time</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="card info-card text-center p-3 primary-color">
                                <div class="fw-bold">
                                    <i class="bi bi-fire"></i>
                                    {{ recipe.cook_time }}m</div>
                                <small>Cook Time</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="card info-card text-center p-3 primary-color">
                                <div class="fw-bold">
                                    <i class="bi bi-clock-fill"></i>
                                    {{ recipe.total_time }}m</div>
                                <small>Total Time</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="card info-card text-center p-3 primary-color">
                                <div class="fw-bold">
                                    <i class="bi bi-people-fill"></i>
                                    {{ recipe.servings }}
                                </div>
                                <small>Servings</small>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h5 class="mb-3 fw-bold">Nutrition Information</h5>
                        <div class="row g-3">
                            <div class="col-6 col-md-2">
                                <div class="card nutrition-item text-center px-3 py-2">
                                    <div class="fw-bold">{{ recipe.nutrition.calories }}</div>
                                    <small>Calories</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-2">
                                <div class="card nutrition-item text-center px-3 py-2 primary-color">
                                    <div class="fw-bold">{{ recipe.nutrition.protein }}</div>
                                    <small>Protein</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-2">
                                <div class="card nutrition-item text-center px-3 py-2 primary-color">
                                    <div class="fw-bold">{{ recipe.nutrition.carbs }}</div>
                                    <small>Carbs</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-2">
                                <div class="card nutrition-item text-center px-3 py-2 primary-color">
                                    <div class="fw-bold">{{ recipe.nutrition.fat }}</div>
                                    <small>Fat</small>
                                </div>
                            </div>
                            <div class="col-6 col-md-2">
                                <div class="card nutrition-item text-center px-3 py-2 primary-color">
                                    <div class="fw-bold">{{ recipe.nutrition.fiber }}</div>
                                    <small>Fiber</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h5 class="fw-bold">Made by:</h5>
                    <div class="d-flex align-items-center">
                        <!-- <img :src="recipe.author.photo" :alt="recipe.author.name" class="avatar-btn profile-photo me-2"> -->
                        <div>
                            <h6 class="mb-0">{{ recipe.author_name }}</h6>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-md-5">
                    <div class="card h-100">
                        <div class="card-header p-3 d-flex align-items-center">
                            <i class="bi bi-list-check fs-5 me-2"></i>
                            <h5 class="mb-0">Ingredients</h5>
                        </div>
                        <div class="px-3 py-2 primary-color">
                            <ul class="list-group list-group-flush">
                                <li v-for="(ingredient, index) in recipe.ingredients" :key="index"
                                    class="list-group-item d-flex align-items-center py-3 primary-color"
                                    :class="{ 'border-bottom': index !== recipe.ingredients.length - 1 }"
                                >
                                    <i class="bi bi-arrow-right-square-fill me-2"></i>
                                    <label :for="`ingredient-${index}`" class="flex-grow-1">
                                        {{ ingredient }}
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-md-7">
                    <div class="card h-100">
                        <div class="card-header p-3 d-flex align-items-center">
                            <i class="bi bi-journal-check fs-5 me-2"></i>
                            <h5 class="mb-0">Directions</h5>
                        </div>
                        <div class="px-3 py-2">
                            <ul class="list-group list-group-flush">
                                <li v-for="(direction, index) in recipe.directions" :key="index"
                                    class="list-group-item d-flex align-items-start py-3 primary-color">
                                    <div class="ms-2 me-auto">
                                        <span class="step-number badge me-3">{{ index +
                                            1 }}</span>
                                        {{ direction }}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!isAdmin" class="mb-4">
                <div class="card primary-color" v-if="!hasUserRated">
                    <div class="card-header p-3 d-flex align-items-center">
                        <i class="bi bi-check-circle-fill fs-5 me-2"></i>
                        <h5 class="mb-0">Rate this recipe:</h5>
                    </div>
                    <div class="p-3">
                        <Rating :ratings="[]" :interactive="true" @rating-added="handleRatingAdded" />
                    </div>
                </div>
                <div class="mt-2" v-else>
                    <div class="success-box p-3">
                        <i class="bi bi-check-circle-fill fs-5 me-2"></i>
                        Thanks for rating this recipe!
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="text-center py-5">
        <p>Loading recipe details...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Rating from '@/components/Rating.vue';
import { useUserStore } from '@/stores/user';
import { doc, getDoc, getFirestore, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const userStore = useUserStore();
const db = getFirestore();
const functions = getFunctions(getApp());
const deleteImageByURL = httpsCallable(functions, "deleteImageByURL");

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const isAdmin = (userStore.currentUser.role === "admin");

const recipe = ref(null);
const route = useRoute();

const hasUserRated = ref(false);

onMounted(async () => {
    console.log(route.params.id);
    const recipeId = props.id || route.params.id;
    
    const recipeDoc = await getDoc(doc(db, "recipes", recipeId));
    recipe.value = { recipeId, ...recipeDoc.data() };
    hasUserRated.value = recipe.value.user_id.includes(userStore.currentUser.userId);

    console.log(recipe.value);
});

const handleRatingAdded = async (rating) => {
    if (!userStore.currentUser?.userId || !recipe.value?.recipeId) return;

    hasUserRated.value = true;

    try {
        const recipeRef = doc(db, "recipes", recipe.value.recipeId);
        const recipeSnap = await getDoc(recipeRef);

        if (recipeSnap.exists()) {
            const data = recipeSnap.data();
            const ratings = data.rating || [];
            const userIds = data.user_id || [];

            await updateDoc(recipeRef, {
                rating: [...ratings, rating],
                user_id: [...userIds, userStore.currentUser.userId]
            });

            recipe.value.rating.push(rating);
            recipe.value.user_id.push(userStore.currentUser.userId);
        }

        toast.add({
            severity: "success",
            summary: "Recipe ratings updated",
            detail: `User rated the recipe!`,
            life: 3000,
        });

        console.log(`User rated the recipe: ${rating} stars`);
    } catch (error) {
        console.error("Error updating recipe rating:", error);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: `Error updating recipe rating!`,
            life: 3000,
        });
    }
};

const formatDate = (date) => {
  if (!(date instanceof Date)) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const removeRecipe = async () => {
    if (!recipe.value || !recipe.value.recipeId) return;

    const confirmDelete = confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
        if (recipe.value.image) {
            await deleteImageByURL({ publicURL: recipe.value.image });
            console.log("Image deleted successfully.");
        }

        await deleteDoc(doc(db, "recipes", recipe.value.recipeId));
        console.log("Recipe deleted successfully.");

        toast.add({
            severity: "success",
            summary: "Recipe deleted",
            detail: "Recipe has been deleted successfully!",
            life: 3000,
        });
        window.history.back();
    } catch (error) {
        console.error("Error deleting recipe:", error);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete recipe. Please try again.",
            life: 5000,
        });
    }
};
</script>

<style scoped>
.profile-photo {
    width: 60px;
    height: 60px;
}

.custom-hr {
    border-top: 1px solid var(--primary);
    opacity: 1;
}

.info-card {
    box-shadow: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nutrition-item {
    background-color: var(--primary);
    color: var(--secondary);
    transition: transform 0.2s ease;
}

.nutrition-item:hover {
    transform: scale(1.02);
}

.step-number {
    background-color: var(--primary);
    color: var(--secondary);
    border-radius: 0px;
}

.list-group-item:hover {
    background-color: var(--secondary);
}
</style>