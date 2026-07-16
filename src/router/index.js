import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/Login.vue'),
    meta: { requiresAuth: false }
  },        
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/shop/Home.vue'),
    meta: { requiresAuth: false }
  },
  // --- YENİ EKLENEN SAYFALAR ---
  {
    path: '/urun/:id',
    name: 'ProductDetail',
    component: () => import('../pages/shop/ProductDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/favorilerim',
    name: 'Favorites',
    component: () => import('../pages/shop/Favorites.vue'), // Klasör yolunu kendi yapına göre düzelt
    meta: { requiresAuth: true }
  },
  // -----------------------------
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../pages/shop/Cart.vue'),
    meta: { requiresAuth: true }
  },
   {
     path: '/admin',
     name: 'AdminDashboard',
     component: () => import('../pages/admin/Dashboard.vue'),
     meta: { requiresAuth: true, requiresAdmin: true }
   },
   {
     path: '/admin/wheel',
     name: 'AdminWheel',
     component: () => import('../pages/admin/WheelManagement.vue'),
     meta: { requiresAuth: true, requiresAdmin: true }
   },
   {
     path: '/admin/sales',
     name: 'RecentSales',
     component: () => import('../pages/admin/RecentSales.vue'),
     meta: { requiresAuth: true, requiresAdmin: true }
   },
   {
     path: '/admin/discounts',
     name: 'AdminDiscounts',
     component: () => import('../pages/admin/Discounts.vue'),
     meta: { requiresAuth: true, requiresAdmin: true }
   }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
});

// Dinamik import ile pinia'nın hazır olduğundan emin oluyoruz
router.beforeEach(async (to, from) => {
  const { useAuthStore } = await import('../stores/authStore');
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  } 
  if (to.meta.requiresAdmin && !isAdmin) {           
    return '/'; 
  }
  if (to.path === '/login' && isAuthenticated) {
    return '/';
  }
});

export default router;
