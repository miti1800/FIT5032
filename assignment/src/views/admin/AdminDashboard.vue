<template>
    <div class="px-4 pt-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Dashboard</p>
        </div>
    </div>
    <div class="container-fluid p-4 py-2 primary-color">
        <div class="row">
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard
                    title="Total Users"
                    value="Increased by 12.5%"
                    :percentage="500"
                    icon="bi bi-person-fill"
                />
            </div>
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard
                    title="Total Nutritionists"
                    value="Increased by 8.3%"
                    :percentage="30"
                    icon="bi bi-person-vcard-fill"
                />
            </div>
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard
                    title="Recipes Sharing"
                    value="Increased by 15.2%"
                    :percentage="2038"
                    icon="bi bi-fork-knife"
                />
            </div>
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard
                    title="Active Communities"
                    value="Increased by 22.1%"
                    :percentage="1200"
                    icon="bi bi-people-fill"
                />
            </div>
        </div>

        <div class="row my-4">
            <div class="col-12">
                <h5 class="fw-bold mb-2">Recent recipes</h5>
            </div>
        </div>
            
        <div class="row d-flex justify-content-evenly flex-wrap mb-4">
            <RecipeCard 
                v-for="recipe in recipes" 
                :key="recipe.id" 
                :recipe="recipe"
                :isAdmin=true
            />
        </div>
    </div>
</template>

<script setup>
import StatsCard from '@/components/StatsCard.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import recipes from '@/assets/json/recipes.json';
</script>