<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header Section (Centered & Clean) -->
      <div class="text-center max-w-2xl mx-auto space-y-2 py-4">
        <h1 class="font-serif text-3xl md:text-4xl font-light text-[#1E3A32] tracking-tight">Satış Geçmişi & Raporlar</h1>
        <p class="text-xs text-stone-500 font-light leading-relaxed">Mağazanızda gerçekleşen tüm sipariş işlemlerinin detaylı listesi ve güncel ciro analizleri.</p>
      </div>

      <!-- Centered Financial Summary Card (Full Width) -->
      <div class="bg-white border border-[#EAE8E0] rounded-[24px] p-8 shadow-xs text-center flex flex-col items-center justify-center space-y-6 max-w-5xl mx-auto">
        <div class="space-y-1">
          <h3 class="font-serif text-2xl font-medium text-[#1E3A32] tracking-tight">Finansal Özet</h3>
          <p class="text-xs text-stone-400 font-light">Mağazanızın güncel toplam gelir ve sipariş metrikleri.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full py-4 max-w-4xl">
          <!-- Total Revenue (Ciro) -->
          <div class="flex flex-col items-center justify-center p-6 bg-[#FAF9F6] border border-[#EAE8E0]/60 rounded-2xl space-y-2">
            <span class="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">Toplam Ciro</span>
            <strong class="font-serif text-3xl font-bold text-[#1E3A32]">{{ totalRevenue.toFixed(2) }} TL</strong>
          </div>
          
          <!-- Total Orders (Sipariş Adedi) -->
          <div class="flex flex-col items-center justify-center p-6 bg-[#FAF9F6] border border-[#EAE8E0]/60 rounded-2xl space-y-2">
            <span class="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">Toplam Sipariş</span>
            <strong class="font-serif text-3xl font-bold text-[#1E3A32]">{{ sales.length }} Adet</strong>
          </div>

          <!-- Average Order Value (Ortalama Sipariş Tutarı) -->
          <div class="flex flex-col items-center justify-center p-6 bg-[#FAF9F6] border border-[#EAE8E0]/60 rounded-2xl space-y-2">
            <span class="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">Ortalama Sipariş</span>
            <strong class="font-serif text-3xl font-bold text-[#C97A62]">{{ averageOrderValue.toFixed(2) }} TL</strong>
          </div>
        </div>
        
        <div class="text-[10px] text-[#1E3A32] font-semibold bg-[#1E3A32]/5 px-4 py-2 rounded-full border border-[#1E3A32]/10 inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Mağaza kasası aktif ve güncel durumda.</span>
        </div>
      </div>

      <!-- Sales Table Card -->
      <div class="bg-white border border-[#EAE8E0] rounded-[24px] overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] border-collapse">
            <thead>
              <tr class="bg-[#FAF9F6] border-b border-[#EAE8E0]">
                <th class="px-6 py-4 text-left text-[10px] font-extrabold tracking-widest text-stone-500 uppercase">Sipariş No</th>
                <th class="px-6 py-4 text-left text-[10px] font-extrabold tracking-widest text-stone-500 uppercase">Tarih</th>
                <th class="px-6 py-4 text-left text-[10px] font-extrabold tracking-widest text-stone-500 uppercase">Ürün Görselleri & Başlık</th>
                <th class="px-6 py-4 text-right text-[10px] font-extrabold tracking-widest text-stone-500 uppercase w-32">Toplam Tutar</th>
                <th class="px-6 py-4 text-center text-[10px] font-extrabold tracking-widest text-stone-500 uppercase w-32">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EAE8E0]/60">
              <tr v-for="sale in paginatedSales" :key="sale.id" class="hover:bg-stone-50/45 transition-colors">
                <!-- Order No -->
                <td class="px-6 py-4 text-left font-serif text-sm font-semibold text-[#1E3A32]">
                  #{{ sale.id.toString().slice(-6) }}
                </td>
                
                <!-- Date -->
                <td class="px-6 py-4 text-left text-xs text-stone-500">
                  {{ formatDate(sale.date) }}
                </td>
                
                <!-- Products list with neat horizontal avatar stack & clean layouts -->
                <td class="px-6 py-4 text-left">
                  <div class="flex items-center gap-4">
                    
                    <!-- Overlapping Product Avatars Row (Son derece temiz ve düzenli) -->
                    <div class="flex -space-x-2.5 overflow-hidden flex-shrink-0">
                      <img 
                        v-for="item in sale.items.slice(0, 3)" 
                        :key="item.id" 
                        :src="getProductImage(item)" 
                        :alt="item.title" 
                        :title="item.title + ' (' + item.quantity + ' adet)'"
                        class="inline-block h-8.5 w-8.5 rounded-full ring-2 ring-white bg-white border border-[#EAE8E0] object-contain p-0.5"
                      >
                      <div v-if="sale.items.length > 3" class="inline-flex items-center justify-center h-8.5 w-8.5 rounded-full ring-2 ring-white bg-stone-100 text-[9px] font-bold text-stone-600 border border-[#EAE8E0] flex-shrink-0">
                        +{{ sale.items.length - 3 }}
                      </div>
                    </div>

                    <!-- Clean products title text listing -->
                    <div class="flex flex-col text-xs text-stone-600 font-light max-w-sm">
                      <span v-for="item in sale.items" :key="item.id" class="truncate font-medium max-w-[280px]" :title="item.title">
                        {{ item.title }} <span class="text-[#C97A62] font-semibold text-[10px] ml-1 bg-[#C97A62]/10 px-1.5 py-0.2 rounded">x{{ item.quantity }}</span>
                      </span>
                    </div>

                  </div>
                </td>
                
                <!-- Total price -->
                <td class="px-6 py-4 text-right font-serif text-sm font-semibold text-[#1E3A32]">
                  {{ sale.totalPrice.toFixed(2) }} TL
                </td>
                
                <!-- Delete action -->
                <td class="px-6 py-4 text-center">
                  <button class="px-3 py-1.5 hover:bg-[#C97A62]/10 text-xs font-semibold text-[#C97A62] rounded-xl transition-all cursor-pointer" @click="handleDeleteSale(sale.id)">
                    Sil
                  </button>
                </td>
              </tr>
              <tr v-if="salesStore.sales.length === 0">
                <td colspan="5" class="px-6 py-16 text-center text-sm text-stone-400 italic">
                  Henüz herhangi bir satış gerçekleştirilmedi.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="salesStore.sales.length > 0 && totalPages > 1" class="flex items-center justify-center px-6 py-4 bg-[#FAF9F6] border-t border-[#EAE8E0]/60">
          <div class="flex items-center gap-1.5">
            <button 
              :disabled="currentPage === 1" 
              @click="currentPage = Math.max(1, currentPage - 1)" 
              class="px-2.5 py-1.5 rounded-lg border border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-[10px] font-bold text-stone-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              «
            </button>
            <template v-for="page in displayedPages" :key="page">
              <span 
                v-if="page === '...'" 
                class="w-7 h-7 flex items-center justify-center text-[10px] text-stone-400 font-bold select-none"
              >
                ...
              </span>
              <button 
                v-else
                @click="currentPage = page" 
                :class="currentPage === page ? 'bg-[#1E3A32] border-[#1E3A32] text-white shadow-sm' : 'border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-stone-600 bg-white'" 
                class="w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold active:scale-95 cursor-pointer transition-all"
              >
                {{ page }}
              </button>
            </template>
            <button 
              :disabled="currentPage === totalPages" 
              @click="currentPage = Math.min(totalPages, currentPage + 1)" 
              class="px-2.5 py-1.5 rounded-lg border border-[#EAE8E0] hover:border-[#1E3A32] hover:bg-[#1E3A32]/5 text-[10px] font-bold text-stone-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              »
            </button>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { useSalesStore } from '../../stores/salesStore';
import { useProductStore } from '../../stores/productStore';
import { translateCategory } from '../../utils/translator';

const salesStore = useSalesStore();
const productStore = useProductStore();

onMounted(() => {
  productStore.loadProducts();
});

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() => {
  if (!salesStore.sales.length) return 1;
  return Math.ceil(salesStore.sales.length / itemsPerPage.value);
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

const paginatedSales = computed(() => {
  const sortedSales = [...salesStore.sales].sort((a, b) => new Date(b.date) - new Date(a.date));
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedSales.slice(start, start + itemsPerPage.value);
});

const sales = computed(() => {
  // Satışları tarihe göre yeniden eskiye sırala
  return [...salesStore.sales].sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Toplam Ciro Hesabı
const totalRevenue = computed(() => {
  return salesStore.sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
});

// Ortalama Sipariş Tutarı
const averageOrderValue = computed(() => {
  if (salesStore.sales.length === 0) return 0;
  return totalRevenue.value / salesStore.sales.length;
});

// Kategori Dağılım İstatistikleri (Top 5)
const categoryStats = computed(() => {
  const stats = {};
  let maxVal = 0;
  
  salesStore.sales.forEach(sale => {
    sale.items.forEach(item => {
      const cat = item.category || 'diger';
      const val = item.price * item.quantity;
      stats[cat] = (stats[cat] || 0) + val;
    });
  });
  
  const keys = Object.keys(stats);
  keys.forEach(k => {
    if (stats[k] > maxVal) maxVal = stats[k];
  });
  
  return keys.map(k => {
    const rawVal = stats[k];
    const pct = maxVal > 0 ? (rawVal / maxVal) * 100 : 0;
    return {
      key: k,
      label: translateCategory(k),
      value: rawVal,
      percentage: pct
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5);
});

// Kategori Dairesel (Donut) Grafik Dilimleri Hesabı
const donutSegments = computed(() => {
  const stats = categoryStats.value;
  const total = stats.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return [];
  
  let currentAngle = 0;
  const colors = ['#1E3A32', '#C97A62', '#A3A299', '#DCA494', '#EAE8E0'];
  
  return stats.map((item, idx) => {
    const fraction = item.value / total;
    const strokeLength = fraction * 251.2;
    const offset = 251.2 - strokeLength;
    const rotation = currentAngle;
    
    // Sonraki dilim için açıyı güncelle
    currentAngle += fraction * 360;
    
    return {
      ...item,
      color: colors[idx % colors.length],
      offset,
      rotation
    };
  });
});

// Son 7 Sipariş Dikey Grafik İstatistikleri
const last7SalesStats = computed(() => {
  const list = [...salesStore.sales].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
  let maxPrice = 0;
  list.forEach(s => {
    if (s.totalPrice > maxPrice) maxPrice = s.totalPrice;
  });
  return list.map(s => ({
    id: s.id,
    label: '#' + s.id.toString().slice(-4),
    price: s.totalPrice,
    height: maxPrice > 0 ? (s.totalPrice / maxPrice) * 100 : 0
  }));
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR');
};

const getProductImage = (item) => {
  if (item.thumbnail) return item.thumbnail;
  const product = productStore.products.find(p => p.id === item.id);
  return product ? product.thumbnail : 'https://dummyjson.com/image/150';
};

const handleDeleteSale = (id) => {
  if (confirm('Bu satış kaydını silmek istediğinize emin misiniz?')) {
    salesStore.sales = salesStore.sales.filter(s => s.id !== id);
    salesStore.saveToLocalStorage();
  }
};
</script>

<style scoped>
/* Custom styled enhancements */
</style>
