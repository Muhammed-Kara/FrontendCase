<template>
  <div class="min-h-screen flex flex-col bg-[#f7f6f2] text-stone-900 font-sans">
    <header class="sticky top-0 z-40 bg-white border-b border-[#EAE8E0] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full border border-[#1E3A32]/20 flex items-center justify-center bg-[#1E3A32]/5 select-none">
                <span class="font-serif text-[#1E3A32] text-sm font-semibold">F</span>
              </div>
              <span class="font-serif text-[#1E3A32] font-bold text-sm tracking-widest uppercase select-none">Yönetim Paneli</span>
            </div>
            
            <div class="hidden md:block h-6 w-px bg-[#EAE8E0]"></div>
            
            <nav class="hidden md:flex items-center gap-2">
              <router-link 
                to="/admin" 
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-300" 
                exact-active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
              >
                <svg class="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <span>Ürün Yönetimi</span>
              </router-link>
              
              <router-link 
                to="/admin/sales" 
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-300" 
                active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
              >
                <svg class="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <span>Son Satışlar</span>
              </router-link>
              
              <router-link 
                to="/admin/discounts" 
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-300" 
                active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
              >
                <svg class="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.562 3.077c.552-.552 1.45-.552 2.002 0l8.5 8.5c.551.551.551 1.45 0 2.002l-6.5 6.5c-.551.551-1.45.551-2.002 0l-8.5-8.5c-.267-.268-.412-.63-.412-.997V4.5c0-.828.672-1.5 1.5-1.5h2.5c.368 0 .73.145.998.412zM6.5 7.5h.01" /></svg>
                <span>İndirim Yönetimi</span>
              </router-link>

              <router-link 
                to="/admin/wheel" 
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-300" 
                active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
              >
                <svg class="w-4 h-4 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7" stroke-dasharray="1 1" />
                </svg>
                <span>Çark Yönetimi</span>
              </router-link>
            </nav>
          </div>

          <div class="hidden md:flex items-center gap-3">
            <div class="flex items-center gap-2 bg-[#1E3A32]/5 px-2.5 py-1 rounded-lg border border-[#1E3A32]/10 select-none">
              <span class="text-[10px] text-stone-600 font-medium">Hoş geldin, <span class="font-serif text-[#1E3A32] font-bold">{{ authStore.user?.username }}</span></span>
              <span class="text-[8px] font-extrabold tracking-widest uppercase text-white bg-[#1E3A32] px-1.5 py-0.5 rounded">Admin</span>
            </div>
            
            <router-link 
              to="/" 
              class="w-9 h-9 rounded-xl border border-[#EAE8E0]/40 hover:border-[#1E3A32]/25 hover:bg-[#1E3A32]/5 text-[#1E3A32] cursor-pointer transition-all duration-300 active:scale-95 flex items-center justify-center"
              title="Vitrine Dön"
            >
              <svg class="w-4.5 h-4.5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9.5 12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" /></svg>
            </router-link>
          </div>

          <div class="flex md:hidden">
            <button 
              @click="toggleMobileMenu" 
              class="inline-flex items-center justify-center p-2.5 rounded-xl text-stone-500 hover:text-[#1E3A32] hover:bg-[#1E3A32]/5 focus:outline-none transition-all duration-200 cursor-pointer"
              aria-expanded="false"
            >
              <span class="sr-only">Menüyü aç</span>
              <svg v-if="!isMobileMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      <transition 
        enter-active-class="transition duration-200 ease-out" 
        enter-from-class="opacity-0 -translate-y-1" 
        enter-to-class="opacity-100 translate-y-0" 
        leave-active-class="transition duration-150 ease-in" 
        leave-from-class="opacity-100 translate-y-0" 
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-show="isMobileMenuOpen" class="md:hidden border-t border-[#EAE8E0] bg-white px-4 py-3 space-y-2">
          <div class="px-3 py-1.5 flex items-center justify-between border-b border-[#EAE8E0]/60 pb-2 mb-1">
            <span class="text-[10px] text-stone-500 font-light">Hoş geldin, <strong class="font-serif text-[#1E3A32] font-bold">{{ authStore.user?.username }}</strong></span>
            <span class="text-[8px] font-extrabold tracking-widest uppercase text-white bg-[#1E3A32] px-1.5 py-0.5 rounded shadow-sm">Admin</span>
          </div>

          <router-link 
            to="/admin" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-200" 
            exact-active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span>Ürün Yönetimi</span>
          </router-link>

          <router-link 
            to="/admin/sales" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-200" 
            active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <span>Son Satışlar</span>
          </router-link>

          <router-link 
            to="/admin/discounts" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-200" 
            active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.562 3.077c.552-.552 1.45-.552 2.002 0l8.5 8.5c.551.551.551 1.45 0 2.002l-6.5 6.5c-.551.551-1.45.551-2.002 0l-8.5-8.5c-.267-.268-.412-.63-.412-.997V4.5c0-.828.672-1.5 1.5-1.5h2.5c.368 0 .73.145.998.412zM6.5 7.5h.01" /></svg>
            <span>İndirim Yönetimi</span>
          </router-link>

          <router-link 
            to="/admin/wheel" 
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all duration-200" 
            active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7" stroke-dasharray="1 1" />
            </svg>
            <span>Çark Yönetimi</span>
          </router-link>

          <router-link 
            to="/" 
            class="flex items-center gap-3 px-4 py-3 bg-[#1E3A32]/5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1E3A32] transition-all duration-200" 
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9.5 12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" /></svg>
            <span>Vitrine Dön</span>
          </router-link>
        </div>
      </transition>
    </header>

    <main class="flex-grow flex flex-col">
      <div class="p-4 sm:p-6 md:p-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>