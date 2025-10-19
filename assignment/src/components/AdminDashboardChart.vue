<template>
    <div class="row d-flex mb-4">
        <div class="col-md-6">
            <div class="chart-container p-3">
                <div v-if="loading" class="text-center p-5 loader-overlay">
                    <span class="spinner-border me-2" role="status"></span>
                    <p class="mt-2">Loading...</p>
                </div>

                <div v-else-if="chartData" class="chart-wrapper">
                    <Line :data="chartData" :options="chartOptions" />
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="chart-container p-3">
                <div v-if="loading" class="text-center p-5 loader-overlay">
                    <span class="spinner-border me-2" role="status"></span>
                    <p class="mt-2">Loading...</p>
                </div>

                <div v-else-if="recipeChartData" class="chart-wrapper">
                    <Bar :data="recipeChartData" :options="chartOptionsRecipe" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartData = ref(null);
const recipeChartData = ref(null);

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#284B63' }
    },
    title: {
      display: true,
      text: 'Users vs Nutritionists - Last 7 Days',
      color: '#284B63',
      font: {
        size: 18
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
});

const chartOptionsRecipe = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: "Recipes Added Daily (Last 7 Days)",
      color: '#284B63',
      font: { size: 18 }
    }
  },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
};

const loading = ref(true);

const fetchStats = async () => {
    try { 
        const today = new Date(); const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split("T")[0]);
        }
        
        const userCounts = Array(7).fill(0); 
        const nutritionistCounts = Array(7).fill(0);
        const recipeCounts = Array(7).fill(0);
        
        const usersSnap = await getDocs(collection(db, "users"));
        usersSnap.forEach(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate?.() || new Date();
            const dateStr = createdAt.toISOString().split("T")[0];
            const idx = last7Days.indexOf(dateStr);
            if (idx >= 0) { 
                if (data.role === "nutritionist") nutritionistCounts[idx]++; 
                else if(data.role === "user") userCounts[idx]++;
                else ;
            } 
        }); 

        const recipesSnap = await getDocs(collection(db, "recipes"));
            recipesSnap.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.posted_on?.toDate?.() || new Date();
            const dateStr = createdAt.toISOString().split("T")[0];
            const idx = last7Days.indexOf(dateStr);
            if (idx >= 0) recipeCounts[idx]++;
        });

        chartData.value = {
            labels: last7Days,
            datasets: [
                {
                    label: 'Users',
                    backgroundColor: "rgba(40, 75, 99, 0.15)",   // #284B63 with opacity
                    borderColor: "#284B63",
                    borderWidth: 3,
                    data: userCounts,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Nutritionists',
                    backgroundColor: "rgba(255, 184, 0, 0.2)",   // #FFB800 with opacity
                    borderColor: "#FFB800",
                    borderWidth: 3,
                    data: nutritionistCounts,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        };
            
        recipeChartData.value = {
            labels: last7Days,
            datasets: [
                {
                    label: "Recipes Added",
                    backgroundColor: "rgba(40, 75, 99, 0.15)",   // #284B63 with opacity
                    borderColor: "#284B63",
                    borderWidth: 2,
                    borderRadius: 6,
                    data: recipeCounts
                }
            ]
        };
    } catch (error) {
        console.error("Error fetching chart data:", error);
    } finally {
        loading.value = false; 
    }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  border-radius: 8px;
  background-color: var(--white);
}

.chart-wrapper {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 1rem;
  }

  .chart-wrapper {
    height: 300px;
  }
}
</style>