<template>
  <AdminLayout>
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header Section -->
      <div class="text-center max-w-2xl mx-auto space-y-2 py-4">
        <h1 class="font-serif text-3xl md:text-4xl font-light text-[#1E3A32] tracking-tight">Hediye Çarkı Yönetimi</h1>
        <p class="text-xs text-stone-500 font-light leading-relaxed">Şans çarkında çıkacak olan indirim kuponlarını ekleyebilir veya silebilirsiniz.</p>
      </div>

      <!-- HEDİYE ÇARKI KUPON YÖNETİMİ -->
      <div class="bg-white border border-[#EAE8E0] rounded-xl p-6 shadow-xs space-y-6">
        <div class="text-left">
          <h2 class="font-serif text-lg font-semibold text-[#1E3A32]">Çark Dilimleri & Kuponlar</h2>
          <p class="text-xs text-stone-500 mt-1">Çarkın dönebilmesi için en az 2 aktif kupon bulunması gerekmektedir. Renkler otomatik olarak atanır.</p>
        </div>

        <!-- Add Coupon Form -->
        <form class="grid grid-cols-1 md:grid-cols-5 gap-4 bg-[#FAF9F6] border border-[#EAE8E0] rounded-xl p-4 text-left" @submit.prevent="addWheelSegment">
          <div class="space-y-1">
            <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Kupon Kodu</label>
            <input
              v-model="newWheelCoupon.code"
              type="text"
              placeholder="Örn: HEDIYE25"
              required
              class="w-full px-3 py-2.5 bg-white border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] uppercase"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase">İndirim Tipi</label>
            <select
              v-model="newWheelCoupon.type"
              class="w-full px-3 py-2.5 bg-white border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-stone-600 appearance-none cursor-pointer"
            >
              <option value="percentage">Yüzde (%)</option>
              <option value="amount">Sabit Tutar (TL)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Değer</label>
            <input
              v-model.number="newWheelCoupon.value"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2.5 bg-white border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32]"
            >
          </div>

          <div class="space-y-1">
            <label class="block text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Kupon Etiketi (Opsiyonel)</label>
            <input
              v-model="newWheelCoupon.label"
              type="text"
              placeholder="Örn: %25 İndirim"
              class="w-full px-3 py-2.5 bg-white border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32]"
            >
          </div>

          <div class="flex items-end">
            <button
              type="submit"
              class="w-full py-2.5 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Kupon Ekle
            </button>
          </div>
        </form>

        <!-- Dynamic List of Coupons -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-[#FAF9F6] border-b border-[#EAE8E0]">
                <th class="px-6 py-3 text-left text-[9px] font-extrabold tracking-widest text-stone-500 uppercase">Görünüm (Çark Dilimi)</th>
                <th class="px-6 py-3 text-left text-[9px] font-extrabold tracking-widest text-stone-500 uppercase">Kupon Kodu</th>
                <th class="px-6 py-3 text-left text-[9px] font-extrabold tracking-widest text-stone-500 uppercase">Etiket</th>
                <th class="px-6 py-3 text-right text-[9px] font-extrabold tracking-widest text-stone-500 uppercase">İndirim Değeri</th>
                <th class="px-6 py-3 text-center text-[9px] font-extrabold tracking-widest text-stone-500 uppercase w-32">İşlemler</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EAE8E0]/60">
              <tr v-for="(coupon, index) in wheelSegments" :key="index" class="hover:bg-stone-50/45 transition-colors">
                <td class="px-6 py-3.5 text-left">
                  <span
                    class="inline-block px-3 py-1.5 rounded-lg text-xs font-bold font-mono border border-stone-200/50 shadow-xs"
                    :style="{ backgroundColor: coupon.color, color: coupon.textColor }"
                  >
                    {{ coupon.label }}
                  </span>
                </td>
                <td class="px-6 py-3.5 text-left font-mono text-xs font-bold text-[#1E3A32]">
                  {{ coupon.code }}
                </td>
                <td class="px-6 py-3.5 text-left text-xs text-stone-600">
                  {{ coupon.label }}
                </td>
                <td class="px-6 py-3.5 text-right text-xs font-medium text-stone-700">
                  <span v-if="coupon.percentage > 0">%{{ coupon.percentage }} İndirim</span>
                  <span v-else>{{ coupon.amount }} TL İndirim</span>
                </td>
                <td class="px-6 py-3.5 text-center">
                  <button
                    type="button"
                    @click="deleteWheelSegment(index)"
                    :disabled="wheelSegments.length <= 2"
                    class="px-2.5 py-1.5 text-xs text-stone-400 hover:text-red-600 disabled:opacity-40 disabled:hover:text-stone-400 rounded-lg transition-colors cursor-pointer"
                  >
                    Sil
                  </button>
                </td>
              </tr>
              <tr v-if="wheelSegments.length === 0">
                <td colspan="5" class="px-6 py-16 text-center text-sm text-stone-400 italic">
                  Henüz çark için herhangi bir kupon tanımlanmadı. Lütfen yukarıdan kupon ekleyin.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import AdminLayout from '../../layouts/AdminLayout.vue';
import { useToast } from '../../composables/useToast';

const { addToast } = useToast();

// --- HEDİYE ÇARKI KUPON YÖNETİMİ ---
const WHEEL_STORAGE_KEY = 'wheel_segments';
const wheelSegments = ref([]);

const newWheelCoupon = reactive({
  code: '',
  type: 'percentage',
  value: 10,
  label: ''
});

const loadWheelSegments = () => {
  try {
    // Clear default/old data once and start empty if they had defaults
    if (!localStorage.getItem('wheel_defaults_purged_v2')) {
      localStorage.removeItem(WHEEL_STORAGE_KEY);
      localStorage.setItem('wheel_defaults_purged_v2', 'true');
    }

    const stored = localStorage.getItem(WHEEL_STORAGE_KEY);
    // Varsayılan kupon olmayacağı için boş dizi ile başlatıyoruz
    wheelSegments.value = stored ? JSON.parse(stored) : [];
  } catch (e) {
    wheelSegments.value = [];
  }
};

const saveWheelSegments = () => {
  localStorage.setItem(WHEEL_STORAGE_KEY, JSON.stringify(wheelSegments.value));
};

const addWheelSegment = () => {
  const code = newWheelCoupon.code.trim().toUpperCase();
  const value = Math.max(1, Number(newWheelCoupon.value));
  let label = newWheelCoupon.label.trim();
  
  if (!code) {
    addToast('Lütfen kupon kodu girin!', 'warning');
    return;
  }
  
  // Auto-generate label if empty
  if (!label) {
    label = newWheelCoupon.type === 'percentage' ? `%${value} İndirim` : `${value} TL Hediye`;
  }
  
  // Otomatik renk şeması atama (Renk seçimi formdan kaldırıldı)
  const colors = ['#1E3A32', '#2D5A4E', '#8A9A86', '#A3A299', '#D5DDD1', '#E2E6DF'];
  const nextIndex = wheelSegments.value.length % colors.length;
  const color = colors[nextIndex];
  const textColor = (color === '#D5DDD1' || color === '#E2E6DF') ? '#1E3A32' : '#FAF9F6';

  const newSegment = {
    code,
    percentage: newWheelCoupon.type === 'percentage' ? value : 0,
    amount: newWheelCoupon.type === 'amount' ? value : 0,
    label,
    color,
    textColor
  };
  
  // Kuponun benzersiz olmasını sağla
  if (wheelSegments.value.some(s => s.code === code)) {
    addToast('Bu kodlu bir kupon zaten mevcut!', 'warning');
    return;
  }

  wheelSegments.value.push(newSegment);
  saveWheelSegments();
  addToast('Yeni çark kuponu başarıyla eklendi.');
  
  // Reset form
  newWheelCoupon.code = '';
  newWheelCoupon.label = '';
  newWheelCoupon.value = 10;
};

const deleteWheelSegment = (index) => {
  if (wheelSegments.value.length <= 2) {
    addToast('Çarkın çalışabilmesi için en az 2 kupon kalmalıdır!', 'warning');
    return;
  }
  wheelSegments.value.splice(index, 1);
  saveWheelSegments();
  addToast('Kupon başarıyla silindi.', 'info');
};

onMounted(() => {
  loadWheelSegments();
});
</script>

<style scoped>
/* Scoped overrides */
</style>
