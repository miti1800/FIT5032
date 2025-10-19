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
        <div class="d-flex justify-content-between">
            <h5 class="fw-bold">Recipes List</h5>
            <div class="position-relative">
                <button
                    class="btn primary-btn"
                    @click="toggleDropdown"
                >
                    <i class="bi bi-file-earmark-arrow-down-fill"></i>
                    Export
                </button>

                <div v-if="dropdownOpen" class="dropdown-menu-custom shadow-lg">
                    <small class="dropdown-item" @click="exportCSVFile">
                        <i class="bi bi-download me-2"></i>
                        Export as CSV
                    </small>
                    <button class="dropdown-item small" @click="exportPDFFile">
                        <i class="bi bi-download me-2"></i>
                        Export as PDF
                    </button>
                </div>
            </div>
        </div>

        <DataTable 
            ref="dt"
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
            :globalFilterFields="['recipe_name', 'cuisine_path', 'avgRating', 'author_name']"
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

            <Column field="recipe_name" header="Recipe Name" filterField="recipe_name" sortable>
                <template #body="{ data }">
                    <div class="d-flex align-items-center gap-2">
                        <img :alt="data.recipe_name" :src="data.image" style="width: 50px;height:50px" />
                        <span>{{ data.recipe_name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by recipe name" />
                </template>
            </Column>

            <Column field="cuisine_path" header="Category" filterField="cuisine_path" sortable>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by category" />
                </template>
            </Column>

            <Column field="avgRating" header="Ratings" filterField="avgRating" sortable
                    :showFilterMatchModes="false"
            >
                <template #body="slotProps">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-star-fill warning-color"></i>
                        <span>
                            {{ Number(slotProps.data.avgRating).toFixed(1) }}
                        </span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model.number="filterModel.value" placeholder="Search by rating" />
                </template>
            </Column>

            <Column field="author_name" header="Author Name" filterField="author_name" sortable>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by Author name" />
                </template>
            </Column>

            <Column field="postedBy" header="Posted on" style="min-width: 10rem" sortable
                :showFilterMatchModes="false"
                :filterFunction="dateFilterFn"
                filterMatchMode="custom"
            >
                <template #body="{ data }">
                    {{ formatDate(data.postedBy) }}
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
                        <i class="bi bi-file-earmark-text-fill fs-5 success-color"></i>
                    </router-link>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    recipe_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    cuisine_path: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    avgRating: { value: null, matchMode: FilterMatchMode.EQUALS },
    author_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    posted_by: { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
});

const dt = ref(null);
const recipes = ref([]);
const loading = ref(true);

const first = ref(0);

const db = getFirestore();

const dropdownOpen = ref(false);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
};

const dateFilterFn = (value, filter) => {
  if (!filter || !value) return true;
  const fv = new Date(filter);
  const vv = new Date(value);
  return (
    fv.getFullYear() === vv.getFullYear() &&
    fv.getMonth() === vv.getMonth() &&
    fv.getDate() === vv.getDate()
  );
};

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
            avgRating: averageRating(data.rating),
            postedBy: data.posted_on?.seconds ? new Date(data.posted_on.seconds * 1000) : null,
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
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return (sum / ratings.length);
};

const exportCSVFile = () => {
    const exportData = recipes.value.map(r => ({
        "Recipe name": r.recipe_name,
        "Category": r.cuisine_path,
        "Rating": r.avgRating.toFixed(1),
        "Author": r.author_name,
        "Posted on": r.postedBy ? formatDate(r.postedBy) : '', 
        "Prep time": r.prep_time,
        "Cook time": r.cook_time,
        "Total time": r.total_time,
        "Servings": r.servings
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
        headers.join(","),
        ...exportData.map(row => headers.map(h => `"${row[h]}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Recipes.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportPDFFile = () => {
  const doc = new jsPDF();

  const columns = [
    { header: 'Recipe Name', dataKey: 'recipe_name' },
    { header: 'Category', dataKey: 'cuisine_path' },
    { header: 'Rating', dataKey: 'avgRating' },
    { header: 'Author', dataKey: 'author_name' },
    { header: 'Posted On', dataKey: 'postedBy' },
    { header: 'Prep time', dataKey: 'prep_time' },
    { header: 'Cook time', dataKey: 'cook_time' },
    { header: 'Total time', dataKey: 'total_time' },
    { header: 'Servings', dataKey: 'servings' }
  ];

  const title = "Recipes";
  doc.setFontSize(18);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  autoTable(doc, {
    columns,
    body: recipes.value.map(r => ({
      ...r,
      avgRating: r.avgRating.toFixed(1),
      postedBy: r.postedBy ? formatDate(r.postedBy) : '',
    })),
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [40, 75, 99] },
  });

  doc.save('Recipes.pdf');
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