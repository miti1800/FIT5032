<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="px-4 py-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Recipes</p>
        </div>
    </div>
    <div v-if="recipes.length > 0" class="card p-4 mx-4 mb-4 primary-color">
        <h5 class="fw-bold">Recipes List</h5>

        <DataTable 
            :value="recipes"
            v-model:filters="filters"
            dataKey="recipeId"
            responsiveLayout="scroll"
            stripedRows
            class="custom-table"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 30, 50]"
            v-model:first="first"
            removableSort
            filterDisplay="menu"
            :globalFilterFields="['firstName', 'lastName', 'role', 'email', 'dob', 'createdAt']"
            :loading="loading"
        >
            <template #header class="p-0">
                <div class="d-flex justify-content-between align-items-center">
                    <Button type="button" icon="bi bi-filter" label="Clear Filters" class="primary-btn" @click="clearFilter" />
                    <IconField>
                        <InputIcon><i class="bi bi-search" /></InputIcon>
                        <InputText v-model="filters.global.value" class="form-control" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>

            <template #empty> No recipes found. </template>
            <template #loading> Loading recipe data... </template>

            <Column header="Recipe Name" filterField="recipe_name" sortable>
                <template #body="{ data }">
                    <div class="d-flex align-items-center gap-2">
                        <img :alt="data.recipe_name" :src="data.image" style="width: 50px;height:50px" />
                        <span>{{ data.recipe_name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" placeholder="Search by Last Name" />
                </template>
            </Column>

            <Column field="cuisine_path" header="Category" filterField="cuisine_path" sortable 
                :showFilterMatchModes="false"
                filterMatchMode="equals"
            >
                <template #filter="{ filterModel }">
                <Select v-model="filterModel.value" :options="roles" placeholder="Select Role" showClear />
                </template>
            </Column>

            <Column header="Ratings" filterField="rating" sortable>
                <template #body="slotProps">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-star-fill warning-color"></i>
                        <span>
                        {{ averageRating(slotProps.data.rating) }}
                        </span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" placeholder="Search by Email" />
                </template>
            </Column>

            <Column field="author_name" header="Author Name" filterField="author_name" sortable>
                <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" placeholder="Search by Email" />
                </template>
            </Column>

            <Column header="Posted on" style="min-width: 10rem" filterField="posted_by" sortable
                :showFilterMatchModes="false"
            >
                <template #body="{ data }">
                    {{ formatDate(data.posted_by) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column header="Actions">
                <template #body="slotProps">
                    <router-link :to="{ name: 'RecipeDetailView', params: { id: slotProps.data.recipeId } }"
                        class="icon-btn me-3"
                    >
                        <i class="bi bi-file-earmark-text-fill fs-5 primary-color"></i>
                    </router-link>
                    <button class="icon-btn" @click="onDelete(slotProps.data)">
                        <i class="bi bi-trash-fill fs-5 primary-color"></i>
                    </button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { ref, onMounted } from 'vue';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const roles = ref(['user', 'nutritionist']);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    lastName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    dob: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: 'dateIs' }] },
    createdAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: 'dateIs' }] },
});

const recipes = ref([]);
const loading = ref(true);

const first = ref(0);

const db = getFirestore();

const filterPanel = ref();

const clearFilter = () => {
  Object.keys(filters.value).forEach(k => {
    if (filters.value[k].constraints) {
      filters.value[k].constraints.forEach(c => (c.value = null))
    } else {
      filters.value[k].value = null
    }
  })
};

onMounted(async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        recipes.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            recipeId: doc.id,
            ...data,
            posted_by: data.posted_on?.seconds ? new Date(data.posted_on.seconds * 1000) : null,
            };
        })
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});

const formatDate = (date) => {
  if (!(date instanceof Date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const onDelete = (user) => {
  console.log('Deleting', user)
};

const averageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return '0.0';
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return (sum / ratings.length).toFixed(1);
};
</script>

<style scoped>
.card {
  background-color: var(--white);
  border-radius: 0.5rem;
  border: none;
}

.field {
  margin-bottom: 1rem;
}
</style>