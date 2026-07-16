<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto space-y-8">
      
      <div class="text-center max-w-2xl mx-auto space-y-2 py-4">
        <h1 class="font-serif text-3xl md:text-4xl font-light text-[#1E3A32] tracking-tight">İndirim Yönetimi</h1>
        <p class="text-xs text-stone-500 font-light leading-relaxed">Ürünlerinize kampanya tanımlayın, yüzde veya sabit tutar indirimlerini ayarlayın.</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        
        <div class="bg-white border border-[#EAE8E0] rounded-xl p-6 shadow-xs text-left flex flex-col justify-between min-h-[500px]">
          
          <div v-if="selectedProduct" class="space-y-6 w-full">
            <div class="flex items-center justify-between pb-4 border-b border-[#EAE8E0]/60">
              <div>
                <h2 class="font-serif text-lg font-semibold text-[#1E3A32]">İndirim Düzenle</h2>
                <p class="text-xs text-stone-500 mt-1">Seçilen ürün için kampanya değerlerini ayarlayın.</p>
              </div>
              <span class="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#1E3A32]/10 text-[#1E3A32]">
                Seçili Ürün
              </span>
            </div>

            <div class="flex items-center gap-4 bg-[#FAF9F6] border border-[#EAE8E0]/60 p-4 rounded-xl">
              <img :src="selectedProduct.thumbnail" class="w-16 h-16 rounded-lg object-contain bg-white border border-[#EAE8E0]/40 p-1 flex-shrink-0" :alt="selectedProduct.title">
              <div class="flex-grow min-w-0">
                <span class="text-[9px] font-extrabold tracking-widest text-[#C97A62] uppercase block mb-0.5">{{ selectedProduct.brand || 'Marka' }}</span>
                <h3 class="text-sm font-bold text-[#1E3A32] truncate leading-tight">{{ selectedProduct.title }}</h3>
                <div class="mt-2 flex items-baseline gap-2">
                  <span class="text-xs text-stone-400 font-medium">Orijinal Fiyat:</span>
                  <strong class="font-serif text-sm text-[#1E3A32]">{{ Number(selectedProduct.price).toFixed(2) }} TL</strong>
                </div>
              </div>
              <button 
                type="button" 
                @click="selectedProductId = ''" 
                class="text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors uppercase px-2 py-1 cursor-pointer"
                title="Kapat"
              >
                Kapat
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1.5">İndirim Türü</label>
                <div class="relative">
                  <select
                    v-model="discountType"
                    class="w-full bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg px-3.5 py-2.5 text-xs text-stone-700 outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] appearance-none cursor-pointer transition-all"
                  >
                    <option value="none">İndirim Yok / Kampanyayı Kaldır</option>
                    <option value="percent">Yüzdelik İndirim (%)</option>
                    <option value="amount">Sabit Tutar İndirimi (TL)</option>
                  </select>
                  <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg class="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div v-if="discountType !== 'none'" class="animate-fade-in">
                <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1.5">
                  {{ discountType === 'amount' ? 'İndirim Tutarı (TL)' : 'İndirim Oranı (%)' }}
                </label>
                <input
                  v-model.number="discountValue"
                  type="number"
                  step="0.1"
                  min="0.1"
                  :max="discountType === 'percent' ? 100 : undefined"
                  placeholder="Değer girin"
                  class="w-full bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg px-3.5 py-2.5 text-xs text-[#1E3A32] outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] transition-all"
                />
              </div>

              <div v-if="discountType !== 'none'" class="grid gap-4 md:grid-cols-2 animate-fade-in">
                <div>
                  <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1.5">İndirim Süresi / Bitiş</label>
                  <div class="relative">
                    <select
                      v-model="durationUnit"
                      class="w-full bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg px-3.5 py-2.5 text-xs text-stone-700 outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] appearance-none cursor-pointer transition-all"
                    >
                      <option value="indefinite">Süresiz (İptal edilene kadar)</option>
                      <option value="hour">Saat Belirle</option>
                      <option value="day">Gün Belirle</option>
                      <option value="month">Ay Belirle</option>
                      <option value="custom">Özel Tarih Seç</option>
                    </select>
                    <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <svg class="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div v-if="['hour', 'day', 'month'].includes(durationUnit)">
                    <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1.5">
                      Süre Değeri ({{ durationUnit === 'hour' ? 'Saat' : durationUnit === 'day' ? 'Gün' : 'Ay' }})
                    </label>
                    <input
                      v-model.number="durationValue"
                      type="number"
                      min="1"
                      required
                      class="w-full bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg px-3.5 py-2.5 text-xs text-[#1E3A32] outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] transition-all"
                    />
                  </div>

                  <div v-else-if="durationUnit === 'custom'">
                    <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1.5">Özel Tarih</label>
                    <input
                      v-model="customDate"
                      type="date"
                      required
                      class="w-full bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg px-3.5 py-2.5 text-xs text-[#1E3A32] outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div v-if="discountType !== 'none' && discountValue > 0" class="bg-green-50/50 border border-green-700/10 rounded-xl p-4 flex items-center justify-between text-xs text-green-800">
                <div class="space-y-0.5">
                  <p class="font-medium text-green-700">İndirim Önizleme:</p>
                  <p class="text-[10px] text-stone-500 font-light">
                    Süre: {{ getDurationPreviewText() }}
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-stone-400 line-through mr-2">{{ Number(selectedProduct.price).toFixed(2) }} TL</span>
                  <strong class="font-serif text-base text-green-700">{{ calculateLivePrice() }} TL</strong>
                </div>
              </div>

            </div>

            <div class="flex gap-3 pt-4 border-t border-[#EAE8E0]/60">
              <button
                type="button"
                @click="saveDiscount"
                class="px-5 py-3 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
              >
                İndirimi Uygula
              </button>
              <button
                type="button"
                @click="clearDiscount"
                class="px-5 py-3 border border-[#EAE8E0] text-stone-700 bg-white hover:bg-stone-50 text-xs font-bold uppercase tracking-wider rounded-lg active:scale-95 transition-all cursor-pointer"
              >
                İndirimi Kaldır
              </button>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-24 text-center space-y-4 my-auto">
            <div class="w-16 h-16 bg-[#1E3A32]/5 text-[#1E3A32] rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.572zM12 2.25V4.5m5.303.197-1.591 1.591M21.75 12h-2.25m-.197 5.303-1.591-1.591M12 19.5v2.25m-7.303-.197 1.591-1.591M2.25 12h2.25m.197-7.303 1.591 1.591" />
              </svg>
            </div>
            <div class="space-y-1">
              <h3 class="text-sm font-bold text-[#1E3A32]">Ürün Seçilmedi</h3>
              <p class="text-xs text-stone-500 max-w-[240px] mx-auto leading-relaxed">İndirim tanımlamak için sağdaki listeden bir ürün seçin veya arama çubuğunu kullanın.</p>
            </div>
          </div>

        </div>

        <div class="bg-white border border-[#EAE8E0] rounded-xl p-6 shadow-xs text-left flex flex-col h-[600px]">
          
          <div class="space-y-4 flex-shrink-0 mb-4 pb-4 border-b border-[#EAE8E0]/60">
            <div>
              <h2 class="font-serif text-lg font-semibold text-[#1E3A32]">Envanter Listesi</h2>
              <p class="text-xs text-stone-500 mt-1">İndirim uygulayacağınız ürünü arayın ve seçin.</p>
            </div>

            <div class="relative">
              <input
                v-model="productSearchQuery"
                type="text"
                placeholder="Ürün adı veya kategori ara..."
                class="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] placeholder-stone-400 transition-all"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="7" />
                <path stroke-linecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </div>

            <div class="flex gap-1.5">
              <button 
                v-for="filter in ['all', 'active', 'none']" 
                :key="filter"
                @click="activeListFilter = filter"
                class="px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border"
                :class="activeListFilter === filter ? 'bg-[#1E3A32] border-[#1E3A32] text-white shadow-xs' : 'bg-white border-[#EAE8E0] text-stone-600 hover:bg-stone-50'"
              >
                {{ filter === 'all' ? 'Hepsi' : filter === 'active' ? 'İndirimdekiler' : 'İndirimsizler' }}
              </button>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-xs text-stone-400 py-12 text-center flex-grow">
            Arama kriterlerine uygun ürün bulunamadı.
          </div>

          <div v-else class="space-y-2.5 overflow-y-auto pr-1 flex-grow scrollbar-thin">
            <button
              v-for="product in paginatedProducts"
              :key="product.id"
              type="button"
              @click="selectProduct(product)"
              class="w-full rounded-xl border p-3 text-left hover:border-[#1E3A32]/25 hover:bg-[#1E3A32]/5 transition-all cursor-pointer flex flex-col justify-between gap-2.5"
              :class="String(product.id) === String(selectedProductId) ? 'border-[#1E3A32] bg-[#1E3A32]/5 ring-1 ring-[#1E3A32]' : 'border-[#EAE8E0] bg-white'"
            >
              <div class="flex items-center gap-3">
                <img :src="product.thumbnail || '/placeholder.png'" class="h-10 w-10 rounded-lg object-contain bg-[#FAF9F6] border border-[#EAE8E0]/40 p-1 flex-shrink-0" :alt="product.title" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-[#1E3A32] truncate leading-tight">{{ product.title }}</p>
                  <p class="text-[10px] text-stone-500 mt-0.5 capitalize">{{ categoryName(product.category) }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-[10px] pt-2 border-t border-[#EAE8E0]/30">
                <span v-if="isDiscountActive(product)" class="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-700/10 font-bold uppercase tracking-wider text-[8px]">
                  Aktif İndirim
                </span>
                <span v-else-if="hasSavedDiscount(product)" class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-700/10 font-bold uppercase tracking-wider text-[8px]">
                  Süresi Doldu
                </span>
                <span v-else class="px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-bold uppercase tracking-wider text-[8px]">
                  İndirim Yok
                </span>
                
                <div class="text-right">
                  <span class="text-stone-400 mr-1">Fiyat:</span>
                  <strong class="text-[#1E3A32] font-serif text-xs">
                    {{ Number(product.price).toFixed(2) }} TL
                  </strong>
                  <span v-if="isDiscountActive(product)" class="text-[9px] text-[#C97A62] font-bold ml-1.5">
                    → {{ Number(getDiscountedPrice(product)).toFixed(2) }} TL
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div v-if="filteredProducts.length > 0 && totalPages > 1" class="flex items-center justify-center pt-4 border-t border-[#EAE8E0]/60 mt-3 flex-shrink-0">
            <div class="flex items-center gap-1.5">
              <button 
                :disabled="currentPage === 1" 
                @click="currentPage = Math.max(1, currentPage - 1)" 
                class="px-2 py-1 rounded-lg border border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-[9px] font-bold text-stone-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                «
              </button>
              <template v-for="page in displayedPages" :key="page">
                <span 
                  v-if="page === '...'" 
                  class="w-6 h-6 flex items-center justify-center text-[9px] text-stone-400 font-bold select-none"
                >
                  ...
                </span>
                <button 
                  v-else
                  @click="currentPage = page" 
                  :class="currentPage === page ? 'bg-[#1E3A32] border-[#1E3A32] text-white shadow-sm' : 'border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-stone-600 bg-white'" 
                  class="w-6 h-6 rounded-lg border flex items-center justify-center text-[9px] font-bold active:scale-95 cursor-pointer transition-all"
                >
                  {{ page }}
                </button>
              </template>
              <button 
                :disabled="currentPage === totalPages" 
                @click="currentPage = Math.min(totalPages, currentPage + 1)" 
                class="px-2 py-1 rounded-lg border border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-[9px] font-bold text-stone-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                »
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useProductStore } from '../../stores/productStore'
import { useToast } from '../../composables/useToast'
import { translateCategory } from '../../utils/translator'
import { getDiscountedPrice, isDiscountActive as checkDiscountActive } from '../../utils/discount'

const productStore = useProductStore()
const { addToast } = useToast()

const selectedProductId = ref('')
const discountType = ref('none')
const discountValue = ref(0)
const expiresAt = ref('')

const durationUnit = ref('indefinite')
const durationValue = ref(1)
const customDate = ref('')

const productSearchQuery = ref('')
const activeListFilter = ref('all')

const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() => {
  if (!filteredProducts.value.length) return 1;
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const displayedPages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  const pages = new Set();
  pages.add(1);
  pages.add(total);
  pages.add(Math.max(1, current - 1));
  pages.add(current);
  pages.add(Math.min(total, current + 1));
  
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result = [];
  let last = 0;
  for (const page of sorted) {
    if (last > 0) {
      if (page - last === 2) {
        result.push(last + 1);
      } else if (page - last > 2) {
        result.push('...');
      }
    }
    result.push(page);
    last = page;
  }
  return result;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredProducts.value.slice(start, start + itemsPerPage.value);
});

watch([productSearchQuery, activeListFilter], () => {
  currentPage.value = 1;
});

const selectedProduct = computed(() => {
  return productStore.products.find(product => String(product.id) === String(selectedProductId.value)) || null
})

const filteredProducts = computed(() => {
  const query = productSearchQuery.value.trim().toLocaleLowerCase('tr-TR')
  return productStore.products.filter(p => {
    const matchesSearch = !query || [p.title, p.brand, p.category].filter(Boolean).some(val => val.toLocaleLowerCase('tr-TR').includes(query))
    
    let matchesFilter = true
    if (activeListFilter.value === 'active') {
      matchesFilter = isDiscountActive(p)
    } else if (activeListFilter.value === 'none') {
      matchesFilter = !isDiscountActive(p)
    }
    
    return matchesSearch && matchesFilter
  })
})

const hasSavedDiscount = (product) => {
  return Boolean(product?.discountType && product?.discountType !== 'none' && Number(product?.discountValue || 0) > 0)
}

const isDiscountActive = (product) => {
  return checkDiscountActive(product)
}

const calculateLivePrice = () => {
  if (!selectedProduct.value) return '0.00'
  const price = Number(selectedProduct.value.price) || 0
  if (discountType.value === 'percent') {
    return Math.max(price - (price * (Number(discountValue.value) || 0) / 100), 0).toFixed(2)
  }
  if (discountType.value === 'amount') {
    return Math.max(price - (Number(discountValue.value) || 0), 0).toFixed(2)
  }
  return price.toFixed(2)
}

const getDurationPreviewText = () => {
  if (durationUnit.value === 'indefinite') return 'Süresiz (İptal edilene kadar)'
  if (durationUnit.value === 'custom') return customDate.value ? `${customDate.value} Günü Sonu` : 'Seçilmedi'
  
  const unitText = durationUnit.value === 'hour' ? 'Saat' : durationUnit.value === 'day' ? 'Gün' : 'Ay'
  return `${durationValue.value} ${unitText}`
}

const selectProduct = (product) => {
  selectedProductId.value = product.id
  discountType.value = product.discountType || 'none'
  discountValue.value = Number(product.discountValue ?? product.discountPercentage ?? 0) || 0
  
  const endsAt = product.discountEndsAt || ''
  if (!endsAt) {
    durationUnit.value = 'indefinite'
    durationValue.value = 1
    customDate.value = ''
  } else if (endsAt.includes('T') || endsAt.includes(':')) {
    const diffMs = new Date(endsAt) - new Date()
    if (diffMs <= 0) {
      durationUnit.value = 'indefinite'
    } else {
      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
      if (diffHours < 24) {
        durationUnit.value = 'hour'
        durationValue.value = diffHours || 1
      } else {
        const diffDays = Math.round(diffHours / 24)
        if (diffDays < 30) {
          durationUnit.value = 'day'
          durationValue.value = diffDays || 1
        } else {
          durationUnit.value = 'month'
          durationValue.value = Math.round(diffDays / 30) || 1
        }
      }
    }
  } else {
    durationUnit.value = 'custom'
    customDate.value = endsAt
  }
  
  expiresAt.value = endsAt
}

const clearDiscount = () => {
  if (!selectedProduct.value) {
    addToast('Önce bir ürün seçin.', 'warning')
    return
  }

  const updatedProduct = {
    ...selectedProduct.value,
    discountType: 'none',
    discountValue: 0,
    discountPercentage: 0,
    discountEndsAt: ''
  }

  productStore.updateProduct(updatedProduct)
  selectProduct(updatedProduct)
  addToast(`${selectedProduct.value.title} için indirim kaldırıldı.`, 'info')
}

const saveDiscount = () => {
  if (!selectedProduct.value) {
    addToast('Önce bir ürün seçin.', 'warning')
    return
  }

  if (discountType.value === 'percent' && Number(discountValue.value) > 100) {
    addToast('Yüzde indirimi 100\'ü geçemez.', 'warning')
    return
  }

  if (discountType.value === 'none' || Number(discountValue.value) <= 0) {
    clearDiscount()
    return
  }

  let computedEndsAt = ''
  const now = new Date()
  
  if (durationUnit.value === 'hour') {
    computedEndsAt = new Date(now.getTime() + (Number(durationValue.value) || 1) * 60 * 60 * 1000).toISOString()
  } else if (durationUnit.value === 'day') {
    computedEndsAt = new Date(now.getTime() + (Number(durationValue.value) || 1) * 24 * 60 * 60 * 1000).toISOString()
  } else if (durationUnit.value === 'month') {
    computedEndsAt = new Date(now.getTime() + (Number(durationValue.value) || 1) * 30 * 24 * 60 * 60 * 1000).toISOString()
  } else if (durationUnit.value === 'custom') {
    computedEndsAt = customDate.value || ''
  }

  const updatedProduct = {
    ...selectedProduct.value,
    discountType: discountType.value,
    discountValue: Number(discountValue.value) || 0,
    discountPercentage: discountType.value === 'percent' ? Number(discountValue.value) || 0 : 0,
    discountEndsAt: computedEndsAt
  }

  productStore.updateProduct(updatedProduct)
  selectProduct(updatedProduct)
  addToast(`${selectedProduct.value.title} için indirim kaydedildi.`, 'success')
}

const categoryName = translateCategory;

onMounted(async () => {
  await productStore.loadProducts()
})
</script>
