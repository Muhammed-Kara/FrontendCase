<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between gap-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 flex-shrink-0">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-bold text-gray-900">Frontend Case</p>
            <p class="text-xs text-orange-600 font-semibold">Shop</p>
          </div>
        </router-link>

        <!-- Arama (Ortada) -->
        <div class="flex-1 max-w-md hidden md:block">
          <div class="relative">
            <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Ürün ara..."
              class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all"
            />
          </div>
        </div>

         <!-- Sağ Menü -->
         <div class="flex items-center gap-1 sm:gap-3">
           <!-- Favoriler -->
           <router-link
             v-if="authStore.isAuthenticated"
             to="/favorilerim"
             class="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all"
             title="Favoriler"
           >
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" />
             </svg>
             <span v-if="favoriteStore.totalFavorites > 0" class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
               {{ favoriteStore.totalFavorites }}
             </span>
           </router-link>

           <!-- Sepet -->
           <router-link
             v-if="authStore.isAuthenticated"
             to="/cart"
             class="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all"
             title="Sepetim"
           >
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
             </svg>
             <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
               {{ cartStore.totalItems }}
             </span>
           </router-link>

          <!-- Giriş Yap / Çıkış -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-3 pl-3 border-l border-gray-100">
            <span class="text-sm font-medium text-gray-700">{{ authStore.user?.username }}</span>
            <button
              @click="handleLogout"
              class="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Çıkış
            </button>
          </div>

          <router-link
            v-else
            to="/login"
            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Giriş Yap
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { useFavoriteStore } from '../../stores/favoriteStore'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const handleLogout = () => {
  authStore.logout()
  cartStore.clearCart()
  favoriteStore.clearFavorites()
  router.push('/')
}
</script>
