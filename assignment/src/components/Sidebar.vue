<template>
  <div>
    <div class="overlay" v-if="showOverlay" @click="closeSidebar"></div>
    <div class="sidebar"
        :class="{ 
            collapsed: isCollapsed && !isMobile,
            open: !isCollapsed && isMobile
        }">
      <div class="sidebar-header p-3">
        <h4 v-if="!isCollapsed || isMobile" class="secondary-color mb-0">NutriED</h4>
        <button class="icon-btn" @click="toggleSidebar">
          <i :class="isCollapsed ? 'bi bi-list fs-5' : 'bi bi-x-lg fs-5'"></i>
        </button>
      </div>

      <nav class="mt-2">
        <ul class="nav flex-column">
            <li class="nav-item" v-for="item in filteredNavItems" :key="item.path">
                <router-link
                    :to="item.path"
                    class="sidebar-nav-link p-3"
                    :class="{ active: isActive(item.path) }"
                    @click.native="setActive(item.path)"
                >
                    <i :class="item.icon"></i>
                    <span v-if="!isCollapsed || isMobile">{{ item.name }}</span>
                </router-link>
            </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits, watch, computed } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const props = defineProps({
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(["close-sidebar", "toggle-sidebar"]);

const isCollapsed = ref(true);
const isMobile = ref(false);
const showOverlay = ref(false);

const router = useRouter();
const route = useRoute();

const navItems = [
  { name: "Dashboard", icon: "bi bi-speedometer", path: "/dashboard", role: ["user", "nutritionist"] },
  { name: "Dashboard", icon: "bi bi-speedometer", path: "/admin/dashboard", role: ["admin"] },
  { name: "User Management", icon: "bi bi-people-fill", path: "/admin/user-management", role: ["admin"] },
  { name: "Recipes", icon: "bi bi-book-fill", path: "/recipes", role: ["user", "nutritionist"] },
  { name: "Post Recipe", icon: "bi bi-pen-fill", path: "/post-recipe", role: ["nutritionist"] },
  { name: "Recipes", icon: "bi bi-book-fill", path: "/admin/recipes-list", role: ["admin"] },
  { name: "Queries", icon: "bi bi-question-square-fill", path: "/admin/queries", role: ["admin"] },
  { name: "Restaurants", icon: "bi bi-fork-knife", path: "/restaurants", role: ["user", "nutritionist"] },
  { name: "Contact Us", icon: "bi bi-telephone-fill", path: "/contact-us", role: ["user", "nutritionist"] }
];

watch(
  () => props.isOpen,
  (val) => {
    if (isMobile.value) {
      isCollapsed.value = !val;
      showOverlay.value = val;
    }
    else {
        isCollapsed.value = !val;
    }
  }
);

const filteredNavItems = computed(() => {
  if (!userStore.currentUser) return [navItems[0]];

  const userRole = userStore.currentUser.role;

  return navItems.filter(item => item.role.includes(userRole));
});

const toggleSidebar = () => {
    emit("toggle-sidebar");
};

const closeSidebar = () => {
    emit("close-sidebar");
};

const setActive = (path) => {
    router.push(path);
    if (isMobile.value) closeSidebar();
};

const handleResize = () => {
    isMobile.value = window.innerWidth < 992;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const isActive = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

.sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--primary);
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sidebar-nav-link i {
  font-size: 1.25rem;
  min-width: 24px;
  transition: transform 0.3s ease;
}

.sidebar-nav-link span {
  margin-left: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.sidebar-nav-link:hover i {
  transform: scale(1.1);
}

.sidebar-nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-left: 4px solid #ffffff;
}

.sidebar-nav-link.active i {
  transform: scale(1.1);
}

.sidebar.collapsed .sidebar-nav-link {
  justify-content: center;
}

@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    width: 240px;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
</style>