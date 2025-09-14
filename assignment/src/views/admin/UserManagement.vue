<template>
    <AuthenticatedHeader />
    <div class="px-4 py-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Users</p>
        </div>
    </div>
    <div class="card p-4 mx-4 primary-color">
        <h5 class="fw-bold pb-4">User Management</h5>
        <DataTable :value="users" responsiveLayout="scroll" stripedRows class="custom-table">
            <Column field="user_id" header="User ID"></Column>
            <Column field="first_name" header="First Name"></Column>
            <Column field="last_name" header="Last Name"></Column>
            <Column field="date_of_birth" header="Date of Birth"></Column>
            <Column field="email" header="Email"></Column>
            <Column header="Password">
                <template #body="slotProps">
                    {{ '*'.repeat(slotProps.data.password.length) }}
                </template>
            </Column>
            <Column field="date_joined" header="Date Joined"></Column>
            <Column header="Actions" columnResizeMode="expand">
                <template #body="slotProps">
                    <button class="icon-btn" @click="onEdit(slotProps.data)">
                        <i class="bi bi-pencil-fill fs-5 primary-color"></i>
                    </button>
                    <button class="icon-btn mx-3" @click="onDelete(slotProps.data)">
                        <i class="bi bi-trash-fill fs-5 primary-color"></i>
                    </button>
                </template>
            </Column>
        </DataTable>
    </div>
    <AuthenticatedFooter />
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import users from '../../assets/json/users.json';
import AuthenticatedHeader from '@/components/AuthenticatedHeader.vue';
import AuthenticatedFooter from '@/components/AuthenticatedFooter.vue';
</script>

<style scoped>
.card {
  background-color: var(--white);
  border-radius: 0.5rem;
  border: none;
}
</style>