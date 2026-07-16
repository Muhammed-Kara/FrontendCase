<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Header Section (Centered & Clean) -->
      <div class="text-center max-w-2xl mx-auto space-y-4 py-4 flex flex-col items-center">
        <div class="space-y-1">
          <h1 class="font-serif text-3xl md:text-4xl font-light text-[#1E3A32] tracking-tight">Ürün Yönetimi</h1>
          <p class="text-xs text-stone-500 font-light leading-relaxed">Envanterdeki tüm ürünleri buradan yönetebilirsiniz.</p>
        </div>
        <button class="inline-flex items-center gap-2 px-5 py-3.5 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer" @click="openAddModal">
          <span class="text-sm font-semibold">+</span> Yeni Ürün Ekle
        </button>
      </div>

      <!-- PRODUCT TABLE CARD -->
      <div class="bg-white border border-[#EAE8E0] rounded-xl overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] border-collapse">
            <thead>
              <tr class="bg-[#FAF9F6] border-b border-[#EAE8E0]">
                <th class="px-6 py-4 text-center text-[10px] font-extrabold tracking-widest text-stone-500 uppercase w-20">Görsel</th>
                <th class="px-6 py-4 text-left text-[10px] font-extrabold tracking-widest text-stone-500 uppercase">Ürün Adı</th>
                <th class="px-6 py-4 text-center text-[10px] font-extrabold tracking-widest text-stone-500 uppercase w-36">Kategori</th>
                <th class="px-6 py-4 text-right text-[10px] font-extrabold tracking-widest text-stone-500 uppercase w-28">Fiyat</th>
                <th class="px-6 py-4 text-left text-[10px] font-extrabold tracking-widest text-stone-500 uppercase hidden md:table-cell">Açıklama</th>
                <th class="px-6 py-4 text-center text-[10px] font-extrabold tracking-widest text-stone-500 uppercase w-48">İşlemler</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EAE8E0]/60">
              <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-stone-50/45 transition-colors">
                <td class="px-6 py-4 text-center">
                  <img :src="product.thumbnail" :alt="product.title" class="w-11 h-11 object-contain bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg p-1 mx-auto">
                </td>
                <td class="px-6 py-4 text-left font-serif text-sm font-semibold text-[#1E3A32]">
                  {{ product.title }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span v-if="product.category" class="inline-flex bg-[#E2E6DF]/80 text-[#1E3A32] border border-[#1E3A32]/10 text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-lg">
                    {{ categoryName(product.category) }}
                  </span>
                  <span v-else class="text-xs text-stone-400">—</span>
                </td>
                <td class="px-6 py-4 text-right font-serif text-sm font-semibold text-[#1E3A32]">
                  {{ Number(product.price).toFixed(2) }} TL
                </td>
                <td class="px-6 py-4 text-left text-xs text-stone-500 max-w-xs truncate hidden md:table-cell">
                  {{ product.description }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <button class="px-3 py-1.5 bg-[#FAF9F6] border border-[#EAE8E0] hover:bg-white text-xs font-semibold text-[#1E3A32] hover:text-stone-800 hover:border-stone-400 rounded-lg shadow-xs transition-all cursor-pointer" @click="openEditModal(product)">
                      Düzenle
                    </button>
                    <button class="px-3 py-1.5 hover:bg-stone-100 text-xs font-semibold text-stone-500 hover:text-stone-800 rounded-lg transition-all cursor-pointer" @click="handleDelete(product.id)">
                      Sil
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="productStore.products.length === 0">
                <td colspan="6" class="px-6 py-16 text-center text-sm text-stone-400 italic">
                  Henüz hiç ürün bulunmuyor.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls for Admin Dashboard (Centered, no page-size selector) -->
        <div v-if="productStore.products.length > 0 && totalPages > 1" class="flex items-center justify-center px-6 py-4 bg-[#FAF9F6] border-t border-[#EAE8E0]/60">
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

      <!-- Add / Edit Modal Overlay (Compact Design) -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50" @click.self="closeModal">
        <div class="bg-white border border-[#EAE8E0] rounded-xl p-5 max-w-sm w-full shadow-xl space-y-4">
          <h2 class="font-serif text-lg font-medium text-[#1E3A32] tracking-tight text-left">
            {{ isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle' }}
          </h2>

          <form class="space-y-3" @submit.prevent="handleSubmit">
            <div class="text-left">
              <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1">Ürün Adı</label>
              <input v-model="formData.title" type="text" required class="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] transition-all">
            </div>

            <div class="text-left">
              <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1">Kategori</label>
              <div class="relative">
                <select v-model="formData.category" required class="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-stone-600 appearance-none cursor-pointer transition-all">
                  <option value="" disabled>Kategori seçin</option>
                  <option v-for="cat in selectCategories" :key="cat" :value="cat">{{ categoryName(cat) }}</option>
                </select>
                <!-- Custom chevron -->
                <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg class="w-3 h-3 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
              <p v-if="!categories.length" class="text-[9px] text-[#C97A62] mt-1 font-semibold">
                * Sistemde tanımlı kategori bulunmamaktadır.
              </p>
            </div>

            <div class="text-left">
              <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1">Fiyat (TL)</label>
              <input v-model.number="formData.price" type="number" step="0.01" min="0.01" required class="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] transition-all">
            </div>

            <div class="text-left space-y-1.5">
              <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Ürün Görseli</label>
              
              <!-- File Preview (Görsel Önizleme) -->
              <div v-if="formData.thumbnail" class="w-16 h-16 rounded-lg border border-[#EAE8E0] overflow-hidden bg-[#FAF9F6] flex items-center justify-center p-1 relative group/preview">
                <img :src="formData.thumbnail" class="max-w-full max-h-full object-contain">
                <button type="button" @click="formData.thumbnail = ''" class="absolute inset-0 bg-stone-900/80 flex items-center justify-center text-[#FAF9F6] text-[9px] font-extrabold tracking-widest opacity-0 group-hover/preview:opacity-100 transition-opacity uppercase cursor-pointer">
                  Kaldır
                </button>
              </div>

              <!-- Dosya Yükleme (File Upload) Container (Compact) -->
              <div class="relative flex items-center justify-center border border-dashed border-[#EAE8E0] rounded-lg p-2.5 bg-[#FAF9F6] hover:bg-stone-50 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleImageUpload" 
                  class="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  :required="!formData.thumbnail"
                >
                <div class="text-center space-y-0.5">
                  <svg class="w-5 h-5 text-stone-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span class="text-[9px] text-stone-500 font-bold block">Görsel Seçin veya Sürükleyin</span>
                </div>
              </div>
            </div>

            <div class="text-left">
              <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-1">Açıklama</label>
              <textarea v-model="formData.description" rows="2" required class="w-full px-3 py-2 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] transition-all resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="px-4 py-2 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-lg transition-all cursor-pointer" @click="closeModal">
                İptal
              </button>
              <button type="submit" class="px-4 py-2 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer">
                {{ isEditing ? 'Güncelle' : 'Kaydet' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Custom Delete Confirmation Modal -->
      <div 
        v-if="isDeleteModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[#1E3A32]/25 backdrop-blur-xs animate-fade-in" @click="closeDeleteModal"></div>

        <!-- Modal Card -->
        <div class="relative bg-[#FAF9F6] border border-[#EAE8E0] w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-5 animate-scale-up z-10">
          <!-- Icon -->
          <div class="w-14 h-14 bg-[#C97A62]/10 text-[#C97A62] rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-7 h-7 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <!-- Content -->
          <div class="space-y-1.5">
            <h3 class="font-serif text-lg font-medium text-[#1E3A32] tracking-tight text-center">Ürünü Sil</h3>
            <p class="text-xs text-stone-500 font-light leading-relaxed max-w-[240px] mx-auto text-center">
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button 
              type="button"
              @click="closeDeleteModal"
              class="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              İptal
            </button>
            <button 
              type="button"
              @click="confirmDelete"
              class="flex-1 py-2.5 bg-[#C97A62] hover:bg-[#b0634c] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { useProductStore } from '../../stores/productStore';
import { translateCategory } from '../../utils/translator';

const productStore = useProductStore();

const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const productIdToDelete = ref(null);

// --- Admin Pagination State ---
const currentPage = ref(1);
const itemsPerPage = ref(10); // Defaults to 10 products per page

const totalPages = computed(() => {
  if (!productStore.products.length) return 1;
  return Math.ceil(productStore.products.length / itemsPerPage.value);
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
  return productStore.products.slice(start, start + itemsPerPage.value);
});

// Reset to page 1 if items-per-page size changes
watch(itemsPerPage, () => {
  currentPage.value = 1;
});

// Adjust current page if items count drops below page limit
watch(totalPages, (newVal) => {
  if (currentPage.value > newVal) {
    currentPage.value = Math.max(1, newVal);
  }
});

// --- KATEGORİLER (localStorage) ---
const CATEGORY_STORAGE_KEY = 'categories_list';
const categories = ref([]);
const newCategoryName = ref('');

const loadCategories = () => {
  try {
    const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
    let list = stored ? JSON.parse(stored) : [];
    if (list.length === 0 && productStore.products.length > 0) {
      const productCats = productStore.products.map(p => p.category);
      list = [...new Set(productCats)].filter(Boolean);
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(list));
    }
    categories.value = list;
  } catch (e) {
    const productCats = productStore.products.map(p => p.category);
    categories.value = [...new Set(productCats)].filter(Boolean);
  }
};

const saveCategories = () => {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories.value));
};

const categoryName = translateCategory;

const addCategory = () => {
  const name = newCategoryName.value.trim();
  if (!name) return;

  const alreadyExists = categories.value.some(
    (c) => c.toLowerCase() === name.toLowerCase()
  );
  if (alreadyExists) {
    newCategoryName.value = '';
    return;
  }

  categories.value.push(name);
  saveCategories();
  newCategoryName.value = '';
};

const deleteCategory = (name) => {
  categories.value = categories.value.filter((c) => c !== name);
  saveCategories();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.thumbnail = e.target.result;
  };
  reader.readAsDataURL(file);
};

// --- ÜRÜN FORMU ---
const emptyForm = () => ({ id: null, title: '', price: 0, thumbnail: '', description: '', category: '' });
const formData = reactive(emptyForm());

const selectCategories = computed(() => {
  const list = [...categories.value];
  if (formData.category && !list.includes(formData.category)) {
    list.push(formData.category);
  }
  return [...new Set(list)].filter(Boolean);
});

onMounted(async () => {
  await productStore.loadProducts();
  loadCategories();
});

const openAddModal = () => {
  isEditing.value = false;
  Object.assign(formData, emptyForm(), { thumbnail: '' });
  isModalOpen.value = true;
};

const openEditModal = (product) => {
  isEditing.value = true;
  Object.assign(formData, emptyForm(), product);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  Object.assign(formData, emptyForm());
};

const handleSubmit = () => {
  if (isEditing.value) {
    productStore.updateProduct({ ...formData });
  } else {
    productStore.addProduct({ ...formData });
  }
  closeModal();
};

const handleDelete = (id) => {
  productIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (productIdToDelete.value) {
    productStore.deleteProduct(productIdToDelete.value);
  }
  closeDeleteModal();
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  productIdToDelete.value = null;
};
</script>

<style scoped>
/* Minimal override styles if any */
</style>