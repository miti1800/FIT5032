<template>
    <div class="px-4 py-3 m-2 primary-color">
        <div class="d-flex align-items-center fs-6 fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Users</p>
        </div>
    </div>
    <div class="card p-4 mx-4 primary-color">
        <h5 class="fw-bold pb-2">User Management</h5>
        <DataTable :value="users" responsiveLayout="scroll" stripedRows>
            <Column field="user_id" header="User ID" sortable></Column>
            <Column field="first_name" header="First Name" sortable></Column>
            <Column field="last_name" header="Last Name" sortable></Column>
            <Column field="date_of_birth" header="Date of Birth" sortable></Column>
            <Column field="email" header="Email" sortable></Column>
            <Column header="Password" sortable>
                <template #body="slotProps">
                    {{ '*'.repeat(slotProps.data.password.length) }}
                </template>
            </Column>
            <Column field="date_joined" header="Date Joined" sortable></Column>
        </DataTable>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import users from '../../assets/json/users.json';
</script>

<style scoped>
/* White background + spacing */
.card {
  background-color: #fff;
  border-radius: 0.5rem;
  border: none;
}
</style>