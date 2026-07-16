<template>
  <div class="min-h-screen bg-[#f7f6f2] text-stone-900 font-sans flex flex-col transition-colors duration-300">
    <div class="h-8 bg-[#1E3A32] text-white flex items-center justify-center gap-8 text-[10px] font-bold tracking-widest uppercase px-4 select-none">
      <span>500 TL üzeri ücretsiz teslimat</span>
      <span class="opacity-60 hidden sm:inline">14 gün içinde ücretsiz iade</span>
    </div>

    <header class="sticky top-0 z-40 bg-[#f7f6f2]/90 backdrop-blur-md border-b border-[#EAE8E0] transition-colors duration-300">
      <div class="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between gap-4">
        <router-link to="/" class="flex items-center gap-2.5 hover:scale-[1.02] transition-transform duration-300" aria-label="Frontend Case ana sayfa">
          <div class="w-9 h-9 rounded-full border border-[#1E3A32] flex items-center justify-center bg-white/5">
            <span class="font-serif text-[#1E3A32] text-lg font-semibold">F</span>
          </div>
          <div class="flex flex-col text-left">
            <strong class="text-xs font-extrabold tracking-widest text-[#1E3A32] uppercase">FRONTEND CASE</strong>
            <small class="text-[8px] text-stone-500 tracking-wider font-bold uppercase mt-0.5">günlük seçkiler</small>
          </div>
        </router-link>

        <nav class="hidden sm:flex items-center gap-8 z-50" aria-label="Ana menü">
          <div class="relative group/nav-mega py-4">
            <button class="text-[10px] font-bold tracking-wider text-stone-600 hover:text-[#1E3A32] uppercase transition-colors flex items-center gap-1 cursor-pointer">
              Kategoriler
              <svg class="w-3 h-3 stroke-[2] transform group-hover/nav-mega:rotate-180 transition-transform duration-300 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            
            <div class="absolute top-full left-1/2 -translate-x-[200px] mt-0 w-[640px] bg-white border border-[#EAE8E0] rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/nav-mega:opacity-100 group-hover/nav-mega:translate-y-0 group-hover/nav-mega:pointer-events-auto transition-all duration-300 p-6 flex gap-6 text-left">
              <div class="w-48 border-r border-[#EAE8E0] pr-4 flex flex-col gap-1">
                <button 
                  v-for="dept in departments" 
                  :key="dept.id" 
                  @mouseenter="activeDept = dept.id"
                  class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                  :class="activeDept === dept.id ? 'bg-[#1E3A32]/5 text-[#1E3A32] font-bold' : 'text-stone-500 hover:bg-stone-50'"
                >
                  <span>{{ dept.name }}</span>
                  <span v-if="activeDept === dept.id" class="text-[10px] text-[#C97A62]">→</span>
                </button>
              </div>

              <div class="flex-1">
                <h3 class="text-[9px] font-extrabold tracking-widest text-[#C97A62] uppercase mb-4 pb-2 border-b border-[#EAE8E0]/40">
                  {{ departments.find(d => d.id === activeDept)?.name }} Kategorileri
                </h3>
                
                <div v-if="deptSubcategories.length" class="grid grid-cols-2 gap-x-6 gap-y-3">
                  <button 
                    v-for="cat in deptSubcategories" 
                    :key="cat"
                    @click="handleCategoryClick(cat)"
                    class="text-left text-xs text-stone-600 hover:text-[#1E3A32] hover:font-bold py-1.5 transition-all cursor-pointer truncate"
                  >
                    {{ categoryName(cat) }}
                  </button>
                </div>
                <div v-else class="text-xs text-stone-400 italic py-8 text-center">
                  Bu departmanda henüz kategori bulunmuyor.
                </div>
              </div>
            </div>
          </div>

          <router-link to="/" class="text-[10px] font-bold tracking-wider text-stone-600 hover:text-[#1E3A32] uppercase transition-colors" active-class="text-[#1E3A32] font-extrabold">Mağaza</router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="text-[10px] font-bold tracking-wider text-stone-600 hover:text-[#1E3A32] uppercase transition-colors" active-class="text-[#1E3A32] font-extrabold">Yönetim</router-link>
        </nav>

        <div class="flex items-center gap-2.5">
          <span v-if="authStore.isAuthenticated" class="text-xs text-stone-500 font-light mr-1.5 hidden md:inline">
            Merhaba, {{ firstName }}
          </span>
          
          <router-link v-if="authStore.isAuthenticated" to="/favorilerim" class="relative w-9 h-9 rounded-lg border border-[#EAE8E0]/40 hover:border-[#EAE8E0] hover:bg-stone-200/25 active:scale-95 flex items-center justify-center text-[#1E3A32] transition-all" aria-label="Favorilerim">
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>
            <span v-if="favoriteStore.totalFavorites" class="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#C97A62] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">{{ favoriteStore.totalFavorites }}</span>
          </router-link>

          <router-link v-if="authStore.isAuthenticated" to="/cart" class="relative w-9 h-9 rounded-lg border border-[#EAE8E0]/40 hover:border-[#EAE8E0] hover:bg-stone-200/25 active:scale-95 flex items-center justify-center text-[#1E3A32] transition-all" aria-label="Sepetim">
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 7H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
            <span v-if="cartStore.totalItems" class="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#C97A62] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">{{ cartStore.totalItems }}</span>
          </router-link>

          <button v-if="authStore.isAuthenticated" class="w-9 h-9 rounded-lg border border-[#EAE8E0]/40 hover:border-[#C97A62]/20 hover:bg-[#C97A62]/5 active:scale-95 flex items-center justify-center text-stone-500 hover:text-[#C97A62] cursor-pointer transition-all" aria-label="Çıkış yap" @click="handleLogout">
            <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>
          </button>

          <router-link v-else to="/login" class="px-4 py-2 bg-[#1E3A32] text-[#FAF9F6] text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-[#2D5A4E] shadow-md transition-all active:scale-[0.97]">
            Giriş yap
          </router-link>

          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="sm:hidden w-9 h-9 rounded-lg border border-[#EAE8E0]/40 hover:bg-stone-200/25 active:scale-95 flex items-center justify-center text-[#1E3A32] cursor-pointer transition-all ml-1.5"
            aria-label="Menüyü Aç"
          >
            <svg class="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <transition 
        enter-active-class="transition duration-200 ease-out" 
        enter-from-class="opacity-0 -translate-y-2" 
        enter-to-class="opacity-100 translate-y-0" 
        leave-active-class="transition duration-150 ease-in" 
        leave-from-class="opacity-100 translate-y-0" 
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isMobileMenuOpen" class="sm:hidden border-t border-[#EAE8E0] bg-[#f7f6f2] px-6 py-4 space-y-3 shadow-lg max-h-[75vh] overflow-y-auto text-left">
          <div v-if="authStore.isAuthenticated" class="pb-3 border-b border-[#EAE8E0]/60 flex items-center justify-between">
            <span class="text-xs text-stone-500 font-light">Merhaba, <strong class="font-serif text-[#1E3A32] font-semibold">{{ authStore.user?.username }}</strong></span>
            <span v-if="authStore.isAdmin" class="text-[9px] font-extrabold tracking-widest uppercase text-[#1E3A32] bg-[#E2E6DF]/85 border border-[#1E3A32]/10 px-2 py-0.5 rounded-lg shadow-sm">Admin</span>
          </div>

          <div class="border-t border-[#EAE8E0]/60 pt-2 pb-1">
            <button 
              @click="isCategoriesCollapsed = !isCategoriesCollapsed" 
              class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 cursor-pointer"
            >
              <span>Kategoriler</span>
              <svg class="w-3.5 h-3.5 stroke-[2] transform transition-transform duration-300" :class="{'rotate-180': !isCategoriesCollapsed}" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            
            <div v-show="!isCategoriesCollapsed" class="pl-4 pr-2 pt-2 pb-1 space-y-1 animate-fade-in">
              <button 
                v-for="cat in categories" 
                :key="cat"
                @click="handleCategoryClick(cat); isMobileMenuOpen = false"
                class="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] capitalize cursor-pointer transition-all"
              >
                {{ categoryName(cat) }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1 py-1 border-t border-[#EAE8E0]/60">
            <router-link 
              to="/" 
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all"
              active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
              @click="isMobileMenuOpen = false"
            >
              Mağaza
            </router-link>
            
            <router-link 
              v-if="authStore.isAdmin" 
              to="/admin" 
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-[#1E3A32]/5 hover:text-[#1E3A32] transition-all"
              active-class="bg-[#1E3A32]/10 text-[#1E3A32]"
              @click="isMobileMenuOpen = false"
            >
              Yönetim Paneli
            </router-link>
          </div>

          <div v-if="!authStore.isAuthenticated" class="border-t border-[#EAE8E0]/60 pt-3 flex flex-col gap-2">
            <router-link 
              to="/login" 
              class="w-full text-center py-2.5 bg-[#1E3A32] text-[#FAF9F6] text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-[#2D5A4E]"
              @click="isMobileMenuOpen = false"
            >
              Giriş Yap
            </router-link>
          </div>
        </div>
      </transition>
    </header>

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-[#1E3A32] text-white/70 py-12 border-t border-white/5 mt-auto">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 items-end">
        <div class="text-left">
          <span class="font-serif text-lg font-semibold text-white tracking-wider">FRONTEND CASE</span>
          <p class="text-xs text-white/50 mt-2 font-light">İyi tasarlanmış, uzun ömürlü ve sakin ürünler.</p>
        </div>
        <div class="flex items-center gap-6 mt-4 md:mt-0">
          <router-link to="/" class="text-[10px] font-bold tracking-wider text-white/70 hover:text-white uppercase">Mağaza</router-link>
          <router-link to="/favorilerim" class="text-[10px] font-bold tracking-wider text-white/70 hover:text-white uppercase">Favoriler</router-link>
          <router-link to="/cart" class="text-[10px] font-bold tracking-wider text-white/70 hover:text-white uppercase">Sepet</router-link>
        </div>
        <small class="text-[10px] text-white/40 font-medium md:text-right mt-4 md:mt-0">
          © {{ new Date().getFullYear() }} Frontend Case. Tüm hakları saklıdır.
        </small>
      </div>
    </footer>
    
    <CouponWheel />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import CouponWheel from '../components/common/CouponWheel.vue'
import { useCartStore } from '../stores/cartStore'
import { useFavoriteStore } from '../stores/favoriteStore'
import { translateCategory } from '../utils/translator'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const firstName = computed(() => authStore.user?.username?.split(' ')[0] || 'misafir')

const isMobileMenuOpen = ref(false)
const isCategoriesCollapsed = ref(true)

const categories = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('categories_list')) || []
  } catch (e) {
    return []
  }
})

const activeDept = ref('kadın')

const departments = [
  { id: 'kadın', name: 'Kadın' },
  { id: 'erkek', name: 'Erkek' },
  { id: 'ev-yasam', name: 'Ev & Yaşam' },
  { id: 'elektronik', name: 'Elektronik' },
  { id: 'supermarket', name: 'Süpermarket' },
  { id: 'kozmetik', name: 'Kozmetik & Kişisel Bakım' },
  { id: 'spor', name: 'Spor & Outdoor' },
  { id: 'diger', name: 'Diğer' }
]

const deptSubcategories = computed(() => {
  let allCats = []
  try {
    allCats = JSON.parse(localStorage.getItem('categories_list')) || []
  } catch (e) {
    allCats = []
  }
  
  const mapping = {
    'kadın': ['tops', 'womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches'],
    'erkek': ['mens-shirts', 'mens-shoes'],
    'ev-yasam': ['furniture', 'home-decoration', 'kitchen-accessories'],
    'elektronik': ['laptops', 'tablets', 'smartphones', 'mobile-accessories'],
    'supermarket': ['groceries'],
    'kozmetik': ['beauty', 'fragrances'],
    'spor': ['sports-accessories'],
  }
  
  const classified = new Set(Object.values(mapping).flat())
  const digerCats = allCats.filter(cat => !classified.has(cat))
  mapping['diger'] = digerCats
  
  return mapping[activeDept.value] || []
})

const categoryName = translateCategory;

const handleCategoryClick = (cat) => {
  router.push({ path: '/', query: { kategori: cat } })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
