<template>
    <div class="card recipe-card h-100 p-4 primary-color mx-2 my-4" @click="goToDetail">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="mt-auto d-flex align-items-center">
                <div class="secondary-bg p-2 me-2 border-radius8 fw-bold">{{ recipe.author_name.split(' ').map(n => n[0]).join('').toUpperCase() }}</div>
                <div class="">
                    <div class="fw-bold">{{ recipe.author_name }}</div>
                    <small>{{ recipe.posted_by }}</small>
                </div>
            </div>
            <div v-if="isAdmin" class="d-flex align-items-center">
              <i class="bi bi-pencil-square fs-4 me-2"></i>
              <i class="bi bi-trash-fill fs-4"></i>
            </div>
            <div v-else>
              <i class="bi bi-bookmark-fill fs-4"></i>
            </div>
        </div>

        <div class="position-relative">
            <h5 class="fw-bold mb-2">{{ recipe.recipe_name }}</h5>
            <img :src="recipe.image" :alt="recipe.recipe_name" class="card-img-top recipe-image">
            <div class="position-absolute bottom-0 start-0 m-2">
                <span class="time-badge">
                    <i class="bi bi-clock me-1"></i>{{ recipe.total_time }}min
                </span>
            </div>
        </div>
        
        <div class="d-flex flex-column">
            <div class="my-3">
              <Rating :ratings="recipe.rating" />
            </div>
            <div class="recipe-stats p-3">
                <div class="row text-center">
                    <div class="col-4">
                        <i class="bi bi-alarm-fill warning-color"></i>
                        <div class="small fw-bold">{{ recipe.prep_time }}m</div>
                        <div class="small text-uppercase">Prep</div>
                    </div>
                    <div class="col-4">
                        <i class="bi bi-fire error-color"></i>
                        <div class="small fw-bold">{{ recipe.cook_time }}m</div>
                        <div class="small text-uppercase">Cook</div>
                    </div>
                    <div class="col-4">
                        <i class="bi bi-people-fill success-color"></i>
                        <div class="small fw-bold">{{ recipe.servings }}</div>
                        <div class="small text-uppercase">Serves</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import users from '@/assets/json/users.json';
import Rating from './Rating.vue';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const router = useRouter();

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
});

const isAdmin = (userStore.currentUser.role === "admin");

const averageRating = computed(() => {
  const ratings = props.recipe.rating || []
  if (ratings.length === 0) return 0
  const total = ratings.reduce((sum, r) => sum + r, 0)
  return (total / ratings.length).toFixed(1)
});

const goToDetail = () => {
  router.push({ name: 'RecipeDetailView', params: { id: props.recipe.recipeId } });
};
</script>

<style scoped>
.recipe-card {
  cursor: pointer;
  max-width: 350px;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(202, 210, 197, 0.6);
}

.recipe-image {
  height: 150px;
  object-fit: cover;
}

.time-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--primary);
  color: var(--white);
}

.stars {
  color: var(--warning);
}

.recipe-stats {
  background-color: var(--secondary);
  border-radius: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.85rem;
  font-weight: 500;
}
</style>