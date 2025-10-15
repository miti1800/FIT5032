<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="px-4 py-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Queries</p>
        </div>
    </div>
    <div v-if="queries.length > 0" class="card p-4 mx-4 mb-4 primary-color">
        <div class="d-flex justify-content-between">
            <h5 class="fw-bold">Queries</h5>
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
            :value="queries"
            v-model:filters="filters"
            dataKey="queryId"
            responsiveLayout="scroll"
            stripedRows
            class="custom-table"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 30, 50]"
            v-model:first="first"
            removableSort
            filterDisplay="menu"
            :globalFilterFields="['name', 'email', 'message', 'status']"
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

            <template #empty> No queries found. </template>
            <template #loading> Loading queries data... </template>

            <Column field="name" header="Name" filterField="name" sortable>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by name" />
                </template>
            </Column>

            <Column field="email" header="Email" filterField="email" sortable>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by email" />
                </template>
            </Column>

            <Column field="message" header="Message" filterField="message" sortable>
                <template #body="slotProps">
                    <div
                    style="
                        max-height: 5em;      
                        overflow-y: auto;     
                        white-space: pre-wrap;
                        word-break: break-word;
                    "
                    >
                    {{ slotProps.data.message }}
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by message" />
                </template>
            </Column>

            <Column field="status" header="Status" filterField="status" sortable 
                :showFilterMatchModes="false"
                filterMatchMode="equals"
            >
                <template #body="slotProps">
                    <div class="d-flex">
                        <div class="px-2" 
                            :class="slotProps.data.status== 'Unresolved' ? 'error-box' : 'success-box'"
                        >{{ slotProps.data.status }}</div>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="all_status" placeholder="Select status" showClear />
                </template>
            </Column>

            <Column field="submittedOn" header="Submitted on" style="min-width: 10rem" sortable
                :showFilterMatchModes="false"
                :filterFunction="dateFilterFn"
                filterMatchMode="custom"
            >
                <template #body="{ data }">
                    {{ formatDate(data.submittedOn) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column field="resolvedOn" header="Resolved on" style="min-width: 10rem" sortable
                :showFilterMatchModes="false"
                :filterFunction="dateFilterFn"
                filterMatchMode="custom"
            >
                <template #body="{ data }">
                    {{ formatDate(data.resolvedOn) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" placeholder="Select date" dateFormat="dd/mm/yy" />
                </template>
            </Column>

            <Column header="Action">
                <template #body="slotProps">
                    <button v-if="slotProps.data.status=='Unresolved'" class="icon-btn" @click="onResolve(slotProps.data)">
                        <i class="bi bi-check-square-fill primary-color fs-5"></i>
                    </button>
                    <span v-else class="px-3">-</span>
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
import { collection, getDocs, getFirestore, updateDoc, doc } from 'firebase/firestore';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from 'primevue/usetoast';

const all_status = ref(['Resolved', 'Unresolved']);
const toast = useToast();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    message: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    submittedOn: { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    resolvedOn: { operator: 'and', constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
});

const dt = ref(null);
const queries = ref([]);
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
    fetchQueriesdata();
});

const fetchQueriesdata = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'queries'));
        queries.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            queryId: doc.id,
            ...data,
            resolvedOn: data.resolvedAt?.seconds ? new Date(data.resolvedAt.seconds * 1000) : null,
            submittedOn: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : null,
            };
        })
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => {
  if (!(date instanceof Date)) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const onResolve = async (rowData) => {
    try {
        const docRef = doc(db, "queries", rowData.queryId);

        await updateDoc(docRef, {
            status: "Resolved",
            resolvedAt: new Date()
        });

        fetchQueriesdata();

        toast.add({severity: "success", summary: "Success", detail: "Query marked as resolved!", life: 3000});

    } catch (error) {
        console.error("Error updating status:", error);
        toast.add({severity: "error", summary: "Error", detail: "Failed to update query status!", life: 5000});
    }
};

const exportCSVFile = () => {
    const exportData = queries.value.map(q => ({
        "Name": q.name,
        "Email": q.email,
        "Message": q.message,
        "Status": q.status,
        "Submitted on": q.submittedOn ? formatDate(q.submittedOn) : '-', 
        "Resolved on": q.resolvedOn ? formatDate(q.resolvedOn) : '-', 
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
    link.setAttribute("download", "Queries.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportPDFFile = () => {
  const doc = new jsPDF();

  const columns = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Message', dataKey: 'message' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Submitted on', dataKey: 'submittedOn' },
    { header: 'Resolved on', dataKey: 'resolvedOn' }
  ];

  const title = "Queries";
  doc.setFontSize(18);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  autoTable(doc, {
    columns,
    body: queries.value.map(q => ({
      ...q,
      submittedOn: q.submittedOn ? formatDate(q.submittedOn) : '-',
      resolvedOn: q.resolvedOn ? formatDate(q.resolvedOn) : '-',
    })),
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [40, 75, 99] },
  });

  doc.save('Queries.pdf');
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