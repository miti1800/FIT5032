import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactUsView from '@/views/ContactUsView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/user/DashboardView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'
import { useUserStore } from '@/stores/user'
import UserManagementView from '@/views/admin/UserManagementView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import RecipesListView from '@/views/admin/RecipesListView.vue'

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
    component: AdminDashboardView,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: '/admin/user-management',
    name: 'User Management',
    component: UserManagementView,
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
    path: '/admin/recipes-list',
    name: 'Recipe List',
    component: RecipesListView,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    component: ForgotPassword
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



export default router;