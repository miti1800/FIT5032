<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="px-4 py-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Users</p>
        </div>
    </div>
    <div v-if="users.length > 0" class="card p-4 mx-4 mb-4 primary-color">
        <h5 class="fw-bold">User Management</h5>

        <DataTable 
            :value="users"
            v-model:filters="filters"
            dataKey="userId"
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
            showGridlines
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

            <template #empty> No users found. </template>
            <template #loading> Loading users data... </template>

            <Column field="firstName" header="First Name" filterField="firstName" sortable>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by First Name" />
                </template>
            </Column>

            <Column field="lastName" header="Last Name" filterField="lastName" sortable>
                <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" placeholder="Search by Last Name" />
                </template>
            </Column>

            <Column field="role" header="Role" filterField="role" sortable 
                :showFilterMatchModes="false"
                filterMatchMode="equals"
            >
                <template #filter="{ filterModel }">
                <Select v-model="filterModel.value" :options="roles" placeholder="Select Role" showClear />
                </template>
            </Column>

            <Column field="email" header="Email" filterField="email" sortable>
                <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" placeholder="Search by Email" />
                </template>
            </Column>

            <Column field="dob" header="Date of Birth" style="min-width: 10rem" filterField="dob" sortable
                :showFilterMatchModes="false"
            >
                <template #body="{ data }">
                    {{ formatDate(data.dob) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column field="createdAt" header="Date Joined" style="min-width: 10rem" filterField="createdAt" sortable
                :showFilterMatchModes="false"
            >
                <template #body="{ data }">
                    {{ formatDate(data.createdAt) }}
                </template>
                <template #filter="{ filterModel }">
                <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column header="Actions">
                <template #body="slotProps">
                    <button class="icon-btn mx-3" @click="onDelete(slotProps.data)">
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

const users = ref([]);
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
        const querySnapshot = await getDocs(collection(db, 'users'));
        users.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            userId: doc.id,
            ...data,
            dob: data.dob?.seconds ? new Date(data.dob.seconds * 1000) : null,
            createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : null,
            };
        }).filter(user => user.role?.toLowerCase() !== 'admin');
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
        console.log(users.value[0].dob instanceof Date)
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