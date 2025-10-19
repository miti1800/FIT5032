<template>
    <div v-if="loading" class="text-center p-5 loader-overlay">
        <span class="spinner-border me-2" role="status"></span>
        <p class="mt-2">Loading...</p>
    </div>
    <div class="px-4 pt-3 m-2 primary-color">
        <div class="d-flex align-items-center fw-lighter">Admin > &nbsp;
            <p class="fw-normal text-decoration-underline mb-0">Dashboard</p>
        </div>
    </div>
    <div class="container-fluid p-4 py-2 primary-color">
        <div class="row">
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard title="Total Users" value="Active users in the system" :percentage="`${totalUsers}`"
                    icon="bi bi-person-fill" />
            </div>
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard title="Total Nutritionists" value="Professionals to guide users" :percentage="`${totalNutritionists}`"
                    icon="bi bi-person-vcard-fill" />
            </div>
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard title="Total Recipes" value="Available recipes" :percentage="`${totalRecipes}`"
                    icon="bi bi-fork-knife" />
            </div>
            <div class="col-md-3 col-sm-6 col-12 py-3">
                <StatsCard title="Unresolved Queries" value="Queries awaiting resolution" :percentage="`${unresolvedQueries}`"
                    icon="bi bi-question-square-fill" />
            </div>
        </div>

        <div class="row mt-4 mb-2">
            <div class="col-12">
                <h5 class="fw-bold mb-2">Recent updates</h5>
            </div>
        </div>

        <AdminDashboardChart />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminDashboardChart from '@/components/AdminDashboardChart.vue';
import StatsCard from '@/components/StatsCard.vue';
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const loading = ref(true);
const totalUsers = ref(0);
const totalNutritionists = ref(0);
const totalRecipes = ref(0);
const unresolvedQueries = ref(0);

const fetchDashboardStats = async () => {
    loading.value = true;
    try {
        const usersSnap = await getDocs(collection(db, "users"));
        let usersCount = 0;
        let nutritionistsCount = 0;

        usersSnap.forEach(doc => {
            const data = doc.data();
            if (data.role === "nutritionist") nutritionistsCount++;
            else if(data.role === "user") usersCount++;
            else ;
        });

        totalUsers.value = usersCount;
        totalNutritionists.value = nutritionistsCount;

        const recipesSnap = await getDocs(collection(db, "recipes"));
        totalRecipes.value = recipesSnap.size;

        const querySnap = await getDocs(query(collection(db, "queries"), where("status", "==", "Unresolved")));
        unresolvedQueries.value = querySnap.size;

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchDashboardStats);
</script>