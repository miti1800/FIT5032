import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactUsView from '@/views/ContactUsView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/user/DashboardView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import RecipeDetailView from '@/views/user/RecipeDetailView.vue'
import { useUserStore } from '@/stores/user'
import UserManagement from '@/views/admin/UserManagement.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/contact-us',
    name: 'Contact Us',
    component: ContactUsView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, roles: ["user"] }
  },
  {
    path: '/admin/dashboard',
    name: 'Admin Dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: '/admin/user-management',
    name: 'User Management',
    component: UserManagement,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetailView',
    component: RecipeDetailView,
    props: true,
    meta: { requiresAuth: true, roles: ["user", "admin"] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    if (!userStore.currentUser) {
      return next({ name: 'Login' })
    }

    if (to.meta.roles && !to.meta.roles.includes(userStore.currentUser.role)) {
      return next({ name: userStore.currentUser.role === "admin" ? 'AdminDashboard' : 'Dashboard' })
    }
  }
  
  next();
});

export default router;