import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ContactUsView from '@/views/ContactUsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import DashboardView from '@/views/user/DashboardView.vue';
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue';
import RecipeDetailView from '@/views/RecipeDetailView.vue';
import { useUserStore } from '@/stores/user';
import UserManagementView from '@/views/admin/UserManagementView.vue';
import PageNotFoundView from '@/views/PageNotFoundView.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import RecipesListView from '@/views/admin/RecipesListView.vue';
import { auth } from '@/firebaseConfig';
import QueriesView from '@/views/admin/QueriesView.vue';
import RestaurantsView from '@/views/user/RestaurantsView.vue';
import RecipesView from '@/views/user/RecipesView.vue';
import PostRecipeView from '@/views/user/PostRecipeView.vue';
import SetupProfileView from '@/views/SetupProfileView.vue';
import ProfileView from '@/views/user/ProfileView.vue';

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
    path: '/setup-profile',
    name: 'Setup Profile',
    component: SetupProfileView,
    meta: { requiresAuth: true, roles: ["user", "nutritionist"] }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true, roles: ["user", "nutritionist"] }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, roles: ["user", "nutritionist"] }
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
    path: '/admin/recipes-list',
    name: 'Recipe List',
    component: RecipesListView,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: '/admin/queries',
    name: 'Queries',
    component: QueriesView,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: RecipesView,
    meta: { requiresAuth: true, roles: ["user", "nutritionist"] }
  },
  {
    path: '/post-recipe',
    name: 'Post Recipe',
    component: PostRecipeView,
    meta: { requiresAuth: true, roles: ["nutritionist"] }
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetailView',
    component: RecipeDetailView,
    props: true,
    meta: { requiresAuth: true, roles: ["user", "nutritionist", "admin"] }
  },
  {
    path: '/restaurants',
    name: 'Restaurants',
    component: RestaurantsView,
    meta: { requiresAuth: true, roles: ["user", "nutritionist"] }
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


router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (userStore.loadingUser) {
    await new Promise(resolve => {
      const unwatch = userStore.$subscribe(() => {
        if (!userStore.loadingUser) {
          unwatch()
          resolve()
        }
      })
    })
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const allowedRoles = to.meta.roles || []
  const currentUser = userStore.currentUser
  const firebaseUser = auth.currentUser

  if (requiresAuth && !firebaseUser) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (requiresAuth && allowedRoles.length > 0) {
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      if (currentUser?.role === 'admin') {
        return next({ name: 'Admin Dashboard' })
      } else if (currentUser?.role === 'user' || currentUser?.role === 'nutritionist') {
        return next({ name: 'Dashboard' })
      } else {
        return next({ name: 'Login' })
      }
    }
  }

  return next()
});

export default router;