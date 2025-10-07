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
            :globalFilterFields="['firstName', 'lastName', 'role', 'email', 'modifiedDob', 'dateJoined']"
            :loading="loading"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear Filters" @click="clearFilter" />
                    <IconField>
                        <InputIcon><i class="pi pi-search" /></InputIcon>
                        <InputText v-model="filters.global.value" placeholder="Keyword Search" />
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

            <Column field="role" header="Role" filterField="role" sortable>
                <template #filter="{ filterModel }">
                <Select v-model="filterModel.value" :options="roles" placeholder="Select Role" showClear />
                </template>
            </Column>

            <Column field="email" header="Email" filterField="email" sortable>
                <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" placeholder="Search by Email" />
                </template>
            </Column>

            <Column field="modifiedDob" header="Date of Birth" style="min-width: 10rem" filterField="modifiedDob" sortable>
                <template #filter="{ filterModel }">
                <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column field="dateJoined" header="Date Joined" style="min-width: 10rem" filterField="dateJoined" sortable>
                <template #filter="{ filterModel }">
                <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column header="Actions">
                <template #body="{ data }">
                <Button icon="pi pi-trash" severity="danger" text @click="onDelete(data)" />
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
  modifiedDob: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
  dateJoined: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
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
            modifiedDob: data.dob?.seconds
                ? formatDate(data.dob)
                : '',
            dateJoined: data.createdAt?.seconds
                ? formatDate(data.createdAt)
                : '',
            };
        }).filter(user => user.role?.toLowerCase() !== 'admin');
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';

  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);

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

:deep(.p-overlaypanel) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.field {
  margin-bottom: 1rem;
}
</style>