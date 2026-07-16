<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-6 py-12 space-y-8">
      
      <!-- Page Header & Search -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#EAE8E0] pb-6">
        <div class="text-left">
          <h1 class="font-serif text-3xl md:text-4xl font-light text-[#1E3A32] tracking-tight">Favorilerim</h1>
          <p class="text-xs text-stone-500 font-light mt-1">
            <span v-if="favoriteStore.totalFavorites > 0">{{ favoriteStore.totalFavorites }} favori ürün listeleniyor</span>
            <span v-else>Favori ürünleriniz burada listelenir.</span>
          </p>
        </div>

        <div class="relative w-full md:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Favorilerde ara..."
            class="w-full md:w-64 pl-9 pr-4 py-2.5 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] placeholder-stone-400 transition-all"
          >
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="7" />
            <path stroke-linecap="round" d="m20 20-3.5-3.5" />
          </svg>
        </div>
      </div>

      <!-- Main Content -->
      <div>
        <!-- Empty State -->
        <div v-if="favoriteStore.totalFavorites === 0 || filteredFavorites.length === 0" class="py-16 px-4 text-center max-w-md mx-auto bg-[#FAF9F6] border border-dashed border-[#EAE8E0] rounded-xl">
          <svg class="w-12 h-12 text-[#C97A62] mx-auto mb-4 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 6.364L12 21l8.8-8.8a4.5 4.5 0 000-7.64z" />
          </svg>
          <p class="text-sm text-stone-600 mb-6 font-light" v-if="favoriteStore.totalFavorites === 0">Henüz favori ürününüz yok.</p>
          <p class="text-sm text-stone-600 mb-6 font-light" v-else>Aramanıza uygun favori ürün bulunamadı.</p>
          <router-link to="/" class="inline-flex items-center justify-center px-6 py-3 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95">
            Ürünleri İncele
          </router-link>
        </div>

        <!-- Product Grid -->
        <div v-else class="space-y-12">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            <article
              v-for="product in paginatedFavorites"
              :key="product.id"
              class="group relative flex flex-col cursor-pointer bg-[#FAF9F6]/40 rounded-xl p-3 border border-transparent hover:border-[#EAE8E0] hover:bg-white hover:shadow-xl transition-all duration-500"
              @click="goToDetail(product.id)"
            >
              <!-- Product Image -->
              <div class="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#FAF9F6] border border-[#EAE8E0]/30 flex items-center justify-center p-4 transition-colors duration-300 group-hover:bg-[#F2F1EC]">
                
                <!-- Unfavorite Button -->
                <button
                  class="absolute top-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-[#FAF9F6] border border-[#EAE8E0] flex items-center justify-center text-[#C97A62] hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
                  @click.stop="favoriteStore.removeFavorite(product.id)"
                  title="Favorilerden çıkar"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <!-- Image -->
                <img :src="product.thumbnail" :alt="product.title" class="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105">
              </div>

              <!-- Details -->
              <div class="mt-4 flex flex-col flex-grow text-left">
                <div>
                  <p class="text-[9px] font-extrabold tracking-widest text-[#C97A62] uppercase mb-1">
                    {{ product.brand || 'Marka' }}
                  </p>
                  <h3 class="font-serif text-sm font-medium text-[#1E3A32] line-clamp-1 group-hover:text-[#C97A62] transition-colors duration-300">
                    {{ product.title }}
                  </h3>
                </div>

                <p class="text-[10px] text-stone-400 font-medium mt-1">Hızlı teslimat</p>

                <!-- Pricing -->
                <div class="mt-4 pt-3 flex flex-col border-t border-[#EAE8E0]/40">
                  <div class="flex items-baseline gap-2">
                    <span class="font-serif text-base font-semibold text-[#1E3A32]">{{ discountedPrice(product).toFixed(2) }} TL</span>
                    <span v-if="hasDiscount(product)" class="text-xs text-stone-400 line-through font-serif">{{ Number(product.price).toFixed(2) }} TL</span>
                  </div>
                  <span v-if="hasDiscount(product)" class="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg self-start mt-1.5 uppercase tracking-wider">
                    Sizin için indirimli
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
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '../../layouts/DefaultLayout.vue'
import { useCartStore } from '../../stores/cartStore'
import { useFavoriteStore } from '../../stores/favoriteStore'
import { getDiscountedPrice, hasDiscount as hasProductDiscount } from '../../utils/discount'

const router = useRouter()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const searchQuery = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

const filteredFavorites = computed(() => {
  if (!searchQuery.value) return favoriteStore.favoriteItems
  const q = searchQuery.value.toLowerCase()
  return favoriteStore.favoriteItems.filter(p =>
    p.title.toLowerCase().includes(q) || 
    (p.brand && p.brand.toLowerCase().includes(q)) ||
    (p.description && p.description.toLowerCase().includes(q))
  )
})

watch(searchQuery, () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(filteredFavorites.value.length / itemsPerPage))

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
  
  return Array.from(pages).sort((a, b) => a - b)
})

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredFavorites.value.slice(start, start + itemsPerPage)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const discountedPrice = (product) => getDiscountedPrice(product)
const hasDiscount = (product) => hasProductDiscount(product)

const goToDetail = (id) => {
  router.push(`/urun/${id}`)
}
</script>

<style scoped>
/* Scoped styles are kept minimal since we're using tailwind classes */
</style>