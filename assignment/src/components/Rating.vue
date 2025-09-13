<template>
    <div class="d-flex align-items-center">
        <div class="stars me-2">
            <i
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{
                    'bi-star-fill': star <= Math.floor(currentRating),
                    'bi-star-half': star === Math.ceil(currentRating) && !Number.isInteger(currentRating),
                    'bi-star': star > Math.ceil(currentRating),
                    'fs-1 p-2': interactive
                }"
                @click="setRating(star)"
                @mouseover="hoverRating = star"
                @mouseleave="hoverRating = 0"
                :style="{ cursor: interactive ? 'pointer' : 'default' }"
            ></i>
        </div>
        
        <span v-if="!interactive" class="rating-text">
            {{ averageRating.toFixed(1) }} ({{ totalRatings }} {{ totalRatings === 1 ? 'rating' : 'ratings' }})
        </span>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  ratings: {
    type: Array,
    required: true
  },
  interactive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['ratingAdded']);

const hoverRating = ref(0);
const userRating = ref(0);
const userHasRated = ref(false);

const averageRating = computed(() => {
  if (props.ratings.length === 0) return 0
  return props.ratings.reduce((sum, rating) => sum + rating, 0) / props.ratings.length
});

const totalRatings = computed(() => props.ratings.length);

const currentRating = computed(() => {
  if (props.interactive && hoverRating.value > 0) {
    return hoverRating.value
  }
  return averageRating.value
});

const setRating = (star) => {
  if (!props.interactive) return
  emit('ratingAdded', star)
};
</script>


<style scoped>
.star {
  font-size: 1.2rem;
  margin-right: 2px;
  transition: color 0.2s ease;
  color: var(--warning);
}

.rating-text {
  font-size: 0.9rem;
}
</style>