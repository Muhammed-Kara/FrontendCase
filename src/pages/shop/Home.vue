<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-6 py-8 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
      <div class="space-y-5 md:space-y-6 text-left">
        <p class="text-[11px] font-bold tracking-widest text-[#C97A62] uppercase animate-fade-in">
          Yeni sezon · 2026
        </p>
        <h1 class="font-serif text-4xl md:text-5xl font-light text-[#1E3A32] leading-tight tracking-tight">
          Daha az eşya.<br>
          <span class="italic text-[#C97A62] font-normal">Daha iyi seçimler.</span>
        </h1>
        <p class="text-sm md:text-base text-stone-600 font-light leading-relaxed max-w-md">
          Gündelik hayatı güzelleştiren, işlevi ve tasarımı dengeli ürünlerden oluşan sakin bir seçki.
        </p>
      </div>
      
      <!-- Asymmetric Hero Art (Aesthetic Dotted Grid & Empty Floating Boxes) -->
      <div class="hero-art-container relative h-[300px] md:h-[360px] bg-gradient-to-br from-[#E2E6DF] to-[#D5DDD1] rounded-[24px_24px_12px_12px] overflow-hidden flex items-center justify-center shadow-inner group/art" aria-hidden="true">
        <!-- Dotted Pattern Background -->
        <div class="absolute inset-0 opacity-15" style="background-image: radial-gradient(#1E3A32 1.5px, transparent 1.5px); background-size: 16px 16px;"></div>

        <!-- Single Subtle Background Line -->
        <div class="absolute w-[220px] h-[220px] md:w-[260px] md:h-[260px] border border-[#1E3A32]/5 border-dashed rounded-full"></div>
        
        <!-- Main Architectural Shape in Center (Slightly Smaller) -->
        <div class="absolute w-[120px] h-[170px] md:w-[135px] md:h-[200px] bg-[#1E3A32] rounded-[70px_70px_10px_10px] transform rotate-6 shadow-lg transition-transform duration-700 group-hover/art:rotate-3 flex items-center justify-center">
          <span class="text-[#FAF9F6]/20 font-serif text-7xl font-bold select-none">F</span>
        </div>

        <!-- Floating Empty Boxes (Aesthetic Glassmorphism) -->
        <div class="absolute left-6 bottom-8 bg-white/20 backdrop-blur-xs border border-[#EAE8E0]/70 w-28 h-20 shadow-md rounded-lg transform -rotate-6 transition-transform duration-700 hover:rotate-0 hover:scale-105 cursor-pointer">
        </div>
        <div class="absolute right-6 top-8 bg-white/20 backdrop-blur-xs border border-[#EAE8E0]/70 w-28 h-20 shadow-md rounded-lg transform rotate-6 transition-transform duration-700 hover:rotate-0 hover:scale-105 cursor-pointer">
        </div>
      </div>
    </section>



    <!-- Catalog Section -->
    <section id="urunler" class="max-w-7xl mx-auto px-6 pb-20">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div class="text-left">
          <p class="text-xs font-bold tracking-widest text-[#C97A62] uppercase mb-2">Mağaza</p>
          <h2 class="font-serif text-3xl md:text-5xl font-light text-[#1E3A32] tracking-tight">Günlük hayat için seçilenler</h2>
        </div>
        <p class="text-xs text-stone-400 font-medium bg-[#EAE8E0]/40 px-3 py-1 rounded-full">{{ filteredProducts.length }} ürün</p>
      </div>

      <!-- Toolbar / Filters (Re-ordered: Sort Left, Stretched Search Right) -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-[#FAF9F6] border border-[#EAE8E0] rounded-xl mb-8 w-full">
        <!-- Left Side: Sort Selector -->
        <div class="relative w-full sm:w-44">
          <select v-model="sortBy" aria-label="Ürünleri sırala" class="w-full appearance-none bg-white border border-[#EAE8E0] rounded-lg px-4 py-2.5 pr-10 text-xs font-medium text-stone-600 outline-none cursor-pointer hover:border-stone-400 focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] transition-all">
            <option value="featured">Öne çıkanlar</option>
            <option value="price-low">Fiyat: düşükten</option>
            <option value="price-high">Fiyat: yüksekten</option>
            <option value="rating">En beğenilenler</option>
          </select>
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
            <svg class="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        <!-- Right Side: Search bar (Stretched) -->
        <label class="flex items-center gap-3 bg-white border border-[#EAE8E0] rounded-lg px-4 py-2.5 w-full md:w-[560px] focus-within:ring-2 focus-within:ring-[#1E3A32]/10 focus-within:border-[#1E3A32] transition-all cursor-text flex-shrink-0">
          <svg class="w-4 h-4 text-stone-400 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="7"/>
            <path d="m20 20-4-4"/>
          </svg>
          <input v-model="searchQuery" type="search" placeholder="Ürün, marka veya kategori ara" aria-label="Ürün ara" class="w-full bg-transparent border-0 outline-none text-sm text-[#1E3A32] placeholder-stone-400">
        </label>
      </div>

      <!-- Product Loading Skeletons -->
      <div v-if="productStore.isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10" aria-label="Ürünler yükleniyor">
        <div v-for="i in 8" :key="i" class="flex flex-col space-y-4">
          <div class="aspect-[4/5] rounded-xl bg-gradient-to-r from-[#F0EFEA] via-[#F6F5F0] to-[#F0EFEA] bg-[length:200%_100%] animate-shimmer border border-[#EAE8E0]/40"></div>
          <div class="h-4 bg-[#EAE8E0]/60 rounded w-2/3 animate-pulse"></div>
          <div class="h-3 bg-[#EAE8E0]/40 rounded w-1/2 animate-pulse"></div>
          <div class="h-5 bg-[#EAE8E0]/60 rounded w-1/3 animate-pulse pt-2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredProducts.length" class="py-16 px-4 text-center max-w-md mx-auto">
        <span class="text-5xl text-[#C97A62] mb-4 block">⌕</span>
        <h3 class="font-serif text-2xl font-light text-[#1E3A32] mb-2">Aradığın ürünü bulamadık</h3>
        <p class="text-sm text-stone-500 mb-6">Başka bir arama yapabilir ya da filtreleri temizleyebilirsin.</p>
        <button @click="clearFilters" class="px-6 py-2.5 bg-[#1E3A32] text-white text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#2D5A4E] transition-all active:scale-95 shadow-md">
          Filtreleri temizle
        </button>
      </div>

      <!-- Product Grid & Pagination -->
      <div v-else class="space-y-12">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          <article v-for="product in paginatedProducts" :key="product.id" class="group relative flex flex-col cursor-pointer bg-white/60 rounded-2xl p-3.5 border border-[#EAE8E0]/60 hover:bg-white hover:border-[#1E3A32]/20 hover:shadow-[0_12px_40px_rgba(30,58,50,0.04)] transition-all duration-500" @click="goToDetail(product.id)">
            <!-- Product Image Container -->
            <div class="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF9F6]/60 flex items-center justify-center p-6 transition-all duration-500 group-hover:bg-[#FAF9F6]">
              
              <!-- Out of Stock Overlay -->
              <div v-if="Number(product.stock || 0) <= 0" class="absolute inset-0 bg-[#1E3A32]/45 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
                <span class="text-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest border border-[#FAF9F6]/30 px-3 py-1.5 rounded-lg bg-[#1E3A32]/85 shadow-md">
                  Stokta Yok
                </span>
              </div>
              
              <!-- Editor's Pick Badge -->
              <span v-if="product.rating >= 4.7" class="absolute top-3 left-3 z-10 text-[9px] uppercase tracking-widest font-bold text-[#1E3A32] bg-[#E2E6DF]/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-[#1E3A32]/10">
                Editörün seçimi
              </span>

              <!-- Discount Badge -->
              <span v-if="hasDiscount(product)" class="absolute bottom-3 left-3 z-10 text-[9px] uppercase tracking-widest font-bold text-white bg-[#C97A62] px-2 py-0.5 rounded-md shadow-sm border border-[#C97A62]/10">
                {{ discountLabel(product) }}
              </span>

              <!-- Favorite Button -->
              <button class="absolute top-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-white/90 backdrop-blur border border-[#EAE8E0] flex items-center justify-center text-stone-700 hover:text-[#C97A62] hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm" :class="{'text-[#C97A62] bg-[#FAF9F6]': favoriteStore.isFavorite(product.id)}" :aria-label="favoriteStore.isFavorite(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'" @click.stop="toggleFavorite(product)">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" :fill="favoriteStore.isFavorite(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
                  <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>
                </svg>
              </button>

              <!-- Image Container (Simplified Hover Zoom) -->
              <div class="relative w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
                <img 
                  :src="product.thumbnail" 
                  :alt="product.title" 
                  loading="lazy" 
                  class="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-[1.04]"
                >
              </div>
            </div>

            <!-- Product Details -->
            <div class="mt-4 flex flex-col flex-grow text-left">
              <div class="flex justify-between items-start gap-2">
                <div>
                  <p class="text-[9px] font-extrabold tracking-widest text-[#C97A62] uppercase mb-1">
                    {{ product.brand || categoryName(product.category) }}
                  </p>
                  <h3 class="font-serif text-sm font-medium text-[#1E3A32] line-clamp-1 group-hover:text-[#C97A62] transition-colors duration-300">
                    {{ product.title }}
                  </h3>
                </div>
                <div class="flex items-center gap-0.5 text-xs text-stone-500 font-semibold bg-stone-100/60 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  <span class="text-[#C97A62] text-[10px]">★</span>
                  <span>{{ Number(product.rating).toFixed(1) }}</span>
                </div>
              </div>

              <!-- Price & Stock -->
              <div class="mt-4 pt-3 flex justify-between items-center border-t border-[#EAE8E0]/40">
                <div class="flex items-baseline gap-1.5">
                  <strong class="font-serif text-base font-semibold text-[#1E3A32]">
                    {{ money(getDiscountedPrice(product)) }}
                  </strong>
                  <span v-if="hasDiscount(product)" class="text-xs text-stone-400 line-through font-serif">
                    {{ money(product.price) }}
                  </span>
                </div>
                <span v-if="Number(product.stock || 0) <= 0" class="text-[9px] text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-md font-bold tracking-wider uppercase">
                  Stokta Yok
                </span>
                <span v-else-if="Number(product.stock || 0) < 15" class="text-[9px] text-[#C97A62] bg-[#C97A62]/10 px-2.5 py-0.5 rounded-md font-bold tracking-wider uppercase animate-pulse">
                  Son {{ product.stock }} ürün
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 pt-6">
          <button 
            :disabled="currentPage === 1" 
            @click="changePage(currentPage - 1)" 
            class="px-4 py-2 rounded-lg border border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 flex items-center justify-center text-xs font-semibold text-stone-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#EAE8E0] cursor-pointer"
          >
            ← Önceki
          </button>
          
          <template v-for="page in displayedPages" :key="page">
            <span 
              v-if="page === '...'" 
              class="w-9 h-9 flex items-center justify-center text-xs text-stone-400 font-bold select-none"
            >
              ...
            </span>
            <button 
              v-else
              @click="changePage(page)" 
              :class="currentPage === page ? 'bg-[#1E3A32] border-[#1E3A32] text-white shadow-sm' : 'border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-stone-600 bg-white'" 
              class="w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              {{ page }}
            </button>
          </template>

          <button 
            :disabled="currentPage === totalPages" 
            @click="changePage(currentPage + 1)" 
            class="px-4 py-2 rounded-lg border border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 flex items-center justify-center text-xs font-semibold text-stone-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#EAE8E0] cursor-pointer"
          >
            Sonraki →
          </button>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DefaultLayout from '../../layouts/DefaultLayout.vue'
import { useProductStore } from '../../stores/productStore'
import { useFavoriteStore } from '../../stores/favoriteStore'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../composables/useToast'
import { translateCategory } from '../../utils/translator'
import { getDiscountedPrice, hasDiscount as checkDiscount, getDiscountLabel } from '../../utils/discount'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const favoriteStore = useFavoriteStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { addToast } = useToast()

const hasDiscount = (item) => checkDiscount(item)
const discountLabel = (item) => getDiscountLabel(item)

const searchQuery = ref(productStore.shopSearchQuery)
const selectedCategory = ref(route.query.kategori || productStore.shopSelectedCategory)
const sortBy = ref(productStore.shopSortBy)
const addedId = ref(null)

watch(() => route.query.kategori, (newCat) => {
  selectedCategory.value = newCat || ''
  productStore.shopSelectedCategory = selectedCategory.value
})

watch(searchQuery, (newVal) => {
  if (productStore.shopSearchQuery !== newVal) {
    productStore.shopSearchQuery = newVal
    currentPage.value = 1
    productStore.shopCurrentPage = 1
  }
})

watch(selectedCategory, (newVal) => {
  if (productStore.shopSelectedCategory !== newVal) {
    productStore.shopSelectedCategory = newVal
    currentPage.value = 1
    productStore.shopCurrentPage = 1
  }
})

watch(sortBy, (newVal) => {
  if (productStore.shopSortBy !== newVal) {
    productStore.shopSortBy = newVal
    currentPage.value = 1
    productStore.shopCurrentPage = 1
  }
})

// Pagination state
const currentPage = ref(productStore.shopCurrentPage)
const itemsPerPage = 12

watch(currentPage, (newVal) => {
  productStore.shopCurrentPage = newVal
})

const categories = computed(() => {
  const productCats = productStore.products.map(p => p.category)
  let customCats = []
  try {
    const stored = localStorage.getItem('categories_list')
    customCats = stored ? JSON.parse(stored) : []
  } catch (e) {
    customCats = []
  }
  return [...new Set([...productCats, ...customCats])].filter(Boolean)
})
const visibleCategories = computed(() => categories.value)
const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLocaleLowerCase('tr-TR')
  let list = productStore.products.filter(p => (!selectedCategory.value || p.category === selectedCategory.value) && (!q || [p.title,p.brand,p.category,p.description].filter(Boolean).some(v => v.toLocaleLowerCase('tr-TR').includes(q))))
  if(sortBy.value === 'price-low') list = [...list].sort((a,b)=>a.price-b.price)
  if(sortBy.value === 'price-high') list = [...list].sort((a,b)=>b.price-a.price)
  if(sortBy.value === 'rating') list = [...list].sort((a,b)=>b.rating-a.rating)
  return list
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const displayedPages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages = new Set()
  pages.add(1)
  pages.add(total)
  pages.add(Math.max(1, current - 1))
  pages.add(current)
  pages.add(Math.min(total, current + 1))
  
  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result = []
  let last = 0
  for (const page of sorted) {
    if (last > 0) {
      if (page - last === 2) {
        result.push(last + 1)
      } else if (page - last > 2) {
        result.push('...')
      }
    }
    result.push(page)
    last = page
  }
  return result
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

// Reset to page 1 when filtering/sorting/searching changes
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    document.getElementById('urunler')?.scrollIntoView({ behavior: 'smooth' })
  }
}

const categoryName = translateCategory;
const money = value => new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2}).format(value)
const getSecondaryImage = (product) => {    
  if (!product.images || product.images.length <= 1) return null
  return product.images.find(img => img !== product.thumbnail) || product.images[1] || null
}
const clearFilters = () => { searchQuery.value=''; selectedCategory.value=''; sortBy.value='featured' }
const goToDetail = id => router.push(`/urun/${id}`)
const requireLogin = message => {
  if (authStore.isAuthenticated) return true
  addToast(message, 'warning')
  router.push({ path: '/login', query: { redirect: '/' } })
  return false
}
const toggleFavorite = product => {
  if (authStore.isAdmin) {
    addToast('Admin sayfasında favorilere ürün eklenemez.', 'warning')
    return
  }
  if (!requireLogin('Favorilere eklemek için lütfen giriş yapın.')) return
  favoriteStore.toggleFavorite(product)
}
const addToCart = product => {
  if (authStore.isAdmin) {
    addToast('Admin sayfasında sepete ürün eklenemez.', 'warning')
    return
  }
  if (!requireLogin('Satın almak için lütfen giriş yapın.')) return
  cartStore.addToCart(product)
  router.push('/cart')
}
onMounted(()=>productStore.loadProducts())
</script>

<style scoped>
/* Custom animations & fine-tuning styles */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes slow-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-slow-spin {
  animation: slow-spin 25s linear infinite;
}

.animate-slow-spin-reverse {
  animation: slow-spin 30s linear infinite reverse;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
