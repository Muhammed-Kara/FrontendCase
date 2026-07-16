<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-6 py-12 space-y-8">
      
      <!-- Page Header (Only visible if not checked out successfully) -->
      <div v-if="!checkoutSuccess" class="border-b border-[#EAE8E0] pb-6 text-left flex justify-between items-end">
        <div>
          <h1 class="font-serif text-3xl md:text-4xl font-light text-[#1E3A32] tracking-tight">Sepetiniz</h1>
          <p class="text-xs text-stone-500 font-light mt-1">Sipariş özetinizi buradan inceleyebilirsiniz.</p>
        </div>
        <p v-if="cartStore.cartItems.length > 0" class="text-xs text-stone-400 font-medium bg-[#EAE8E0]/40 px-3 py-1 rounded-full">
          {{ cartStore.totalItems }} ürün
        </p>
      </div>

      <!-- Checkout Success State -->
      <div v-if="checkoutSuccess" class="py-16 px-6 text-center max-w-md mx-auto bg-white border border-[#EAE8E0] shadow-xl rounded-xl space-y-6 animate-fade-in">
        <div class="w-16 h-16 bg-[#1E3A32]/10 text-[#1E3A32] rounded-full flex items-center justify-center mx-auto mb-2">
          <svg class="w-8 h-8 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="space-y-2">
          <h2 class="font-serif text-2xl font-light text-[#1E3A32] tracking-tight">Siparişiniz Başarıyla Alındı!</h2>
          <p class="text-xs text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
            Siparişiniz başarıyla işlendi ve hazırlık sürecine alındı. Bizleri tercih ettiğiniz için teşekkür ederiz.
          </p>
        </div>
        <div class="border-t border-[#EAE8E0]/60 pt-6">
          <button 
            @click="goToHome" 
            class="inline-flex items-center justify-center px-6 py-3 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="cartStore.cartItems.length === 0" class="py-16 px-4 text-center max-w-md mx-auto bg-[#FAF9F6] border border-dashed border-[#EAE8E0] rounded-xl">
        <svg class="w-12 h-12 text-[#C97A62] mx-auto mb-4 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-sm text-stone-600 mb-6 font-light">Sepetiniz şu an boş görünüyor.</p>
        <router-link to="/" class="inline-flex items-center justify-center px-6 py-3 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95">
          Alışverişe Başla
        </router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        
        <!-- Cart Items List -->
        <div class="space-y-4">
          <div 
            v-for="(item, index) in cartStore.cartItems" 
            :key="item.id" 
            class="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FAF9F6]/40 hover:bg-white border border-[#EAE8E0]/60 hover:border-[#EAE8E0] hover:shadow-lg rounded-xl p-4 sm:p-5 transition-all duration-300 group"
          >
            <!-- Media & Details (Clickable Router Link) -->
            <router-link :to="'/urun/' + item.id" class="flex items-center gap-4 w-full sm:w-auto cursor-pointer group/item text-left">
              <div class="w-20 h-20 bg-white border border-[#EAE8E0]/40 rounded-lg p-2 flex items-center justify-center flex-shrink-0 group-hover/item:border-[#C97A62]/30 transition-all duration-300">
                <img :src="item.thumbnail" :alt="item.title" class="max-h-full max-w-full object-contain group-hover/item:scale-105 transition-all duration-500">
              </div>
              <div>
                <h3 class="font-serif text-sm font-semibold text-[#1E3A32] group-hover/item:text-[#C97A62] transition-colors duration-300">
                  {{ item.title }}
                </h3>
                <div class="mt-1 flex items-center gap-2 flex-wrap">
                  <template v-if="item.originalPrice && item.discountedPrice">
                    <strong class="font-serif text-sm font-semibold text-[#C97A62]">
                      {{ Number(item.discountedPrice).toFixed(2) }} TL
                    </strong>
                    <span class="text-xs text-stone-400 line-through font-serif">
                      {{ Number(item.originalPrice).toFixed(2) }} TL
                    </span>
                    <span v-if="item.promo" class="text-[9px] font-bold text-white bg-[#C97A62] px-1.5 py-0.5 rounded shadow-xs">
                      {{ item.promo }}
                    </span>
                  </template>
                  <template v-else>
                    <strong class="font-serif text-sm font-semibold text-[#C97A62]">
                      {{ Number(item.price).toFixed(2) }} TL
                    </strong>
                  </template>
                </div>
              </div>
            </router-link>

            <!-- Quantity & Actions -->
            <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
              <div class="flex items-center border border-[#EAE8E0] rounded-lg bg-white overflow-hidden shadow-xs">
                <button 
                  @click="updateItemQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center text-sm font-semibold text-stone-600 hover:bg-stone-50 active:scale-90 transition-all cursor-pointer"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <input 
                  type="number" 
                  :value="item.quantity" 
                  @input="handleManualQuantity(item.id, $event.target.value)"
                  @change="handleManualQuantity(item.id, $event.target.value)"
                  min="1"
                  aria-label="Ürün Miktarı"
                  class="w-11 h-8 border-x border-[#EAE8E0] text-center text-xs font-bold text-stone-700 focus:outline-none focus:bg-[#FAF9F6] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                >
                <button 
                  @click="updateItemQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center text-sm font-semibold text-stone-600 hover:bg-stone-50 active:scale-90 transition-all cursor-pointer"
                >
                  +
                </button>
              </div>
              
              <button 
                @click="cartStore.removeFromCart(item.id)"
                class="w-9 h-9 rounded-lg border border-[#EAE8E0] hover:border-[#C97A62]/20 hover:bg-[#C97A62]/5 text-stone-400 hover:text-[#C97A62] flex items-center justify-center transition-all duration-200 cursor-pointer"
                title="Ürünü Çıkar"
              >
                <svg class="w-4 h-4 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary Card -->
        <aside class="w-full">
          <div class="bg-[#1E3A32] text-[#FAF9F6] p-6 rounded-xl shadow-xl sticky top-24 space-y-6 text-left border border-[#1E3A32]/10">
            <h2 class="font-serif text-lg font-medium text-white tracking-tight">Sipariş Özeti</h2>
            
            <div class="space-y-3.5">
              <div class="flex justify-between items-center text-xs text-white/70">
                <span>Ara Toplam:</span>
                <span class="font-bold text-white">{{ cartStore.subtotal.toFixed(2) }} TL</span>
              </div>
              
              <div v-if="cartStore.activeDiscountCode" class="flex justify-between items-center text-xs text-[#FAF9F6] font-semibold bg-[#C97A62]/45 px-2.5 py-1 rounded-lg">
                <span>İndirim ({{ cartStore.activeDiscountCode }}):</span>
                <span>-{{ discountAmount }} TL</span>
              </div>

              <div class="flex justify-between items-center text-xs text-white/70">
                <span>Kargo:</span>
                <span class="text-[#FAF9F6] font-semibold bg-[#C97A62]/25 px-2 py-0.5 rounded text-[10px]">Ücretsiz</span>
              </div>
              
              <div class="flex justify-between items-center text-xs text-white/70">
                <span>KDV:</span>
                <span class="text-white">%20 Dahil</span>
              </div>
            </div>

            <!-- Coupon Code Field -->
            <div class="border-t border-white/10 pt-4 space-y-2">
              <label class="block text-[8px] font-extrabold tracking-widest text-[#FAF9F6]/80 uppercase">İndirim Kuponu</label>
              
              <form v-if="!cartStore.activeDiscountCode" @submit.prevent="applyCoupon" class="flex gap-2">
                <input 
                  v-model="couponCodeInput" 
                  type="text" 
                  placeholder="Kodu girin" 
                  class="flex-grow px-3 py-2 bg-white/10 border border-white/20 rounded-lg outline-none text-xs text-white placeholder-white/40 focus:ring-1 focus:ring-white/30 transition-all uppercase"
                />
                <button 
                  type="submit"
                  class="px-4 py-2 bg-[#C97A62] hover:bg-[#b0634c] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Uygula
                </button>
              </form>
              
              <div v-else class="flex items-center justify-between bg-white/10 px-3 py-2 rounded-lg border border-white/25">
                <div class="text-left">
                  <p class="text-[10px] font-bold text-white tracking-wider uppercase">{{ cartStore.activeDiscountCode }}</p>
                  <p class="text-[8px] text-[#FAF9F6]/60 font-light mt-0.5">Kupon başarıyla uygulandı</p>
                </div>
                <button 
                  @click="removeCoupon"
                  class="text-[9px] font-bold text-red-300 hover:text-red-400 uppercase tracking-wider cursor-pointer"
                >
                  Kaldır
                </button>
              </div>

            </div>
            
            <div class="border-t border-white/10 my-4"></div>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-white/70">Toplam Ödenecek:</span>
              <span class="font-serif text-xl font-bold text-[#FAF9F6]">{{ cartStore.totalPrice.toFixed(2) }} TL</span>
            </div>
            
            <button 
              @click="handleCheckout"
              class="w-full py-3.5 bg-[#C97A62] hover:bg-[#b0634c] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-[0.98] cursor-pointer shadow-[#C97A62]/10"
            >
              Satın Almayı Tamamla
            </button>
          </div>
        </aside>
      </div>

    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from '../../layouts/DefaultLayout.vue';
import { useCartStore } from '../../stores/cartStore';
import { useProductStore } from '../../stores/productStore';
import { useToast } from '../../composables/useToast';

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();
const { addToast } = useToast();

const checkoutSuccess = ref(false);
const couponCodeInput = ref('');
const copiedCouponSuggestion = ref(sessionStorage.getItem('last_won_coupon') || null);

onMounted(async () => {
  await productStore.loadProducts();
  cartStore.removeDiscount();
});

const discountAmount = computed(() => {
  return (cartStore.subtotal - cartStore.totalPrice).toFixed(2);
});

const updateItemQuantity = (id, newQuantity) => {
  if (newQuantity > 0) {
    cartStore.updateQuantity(id, newQuantity);
  }
};

const handleManualQuantity = (id, val) => {
  let num = parseInt(val, 10);
  if (isNaN(num) || num < 1) {
    num = 1;
  }
  cartStore.updateQuantity(id, num);
};

const applyCoupon = () => {
  if (!couponCodeInput.value.trim()) return;
  const res = cartStore.applyDiscountCode(couponCodeInput.value);
  if (res.success) {
    addToast(res.message);
    couponCodeInput.value = '';
  } else {
    addToast(res.message, 'warning');
  }
};

const removeCoupon = () => {
  cartStore.removeDiscount();
  addToast('Kupon kaldırıldı.');
};

const applySuggestedCoupon = () => {
  if (copiedCouponSuggestion.value) {
    const res = cartStore.applyDiscountCode(copiedCouponSuggestion.value);
    if (res.success) {
      addToast(res.message);
    }
  }
};

const handleCheckout = () => {
  if (cartStore.cartItems.length > 0) {
    // Check if any product has insufficient stock first
    const outOfStockItems = [];
    for (const item of cartStore.cartItems) {
      const product = productStore.products.find(p => String(p.id) === String(item.id));
      if (!product || product.stock < item.quantity) {
        outOfStockItems.push(item.title);
      }
    }

    if (outOfStockItems.length > 0) {
      const list = outOfStockItems.join(', ');
      addToast(`"${list}" ürünü/ürünleri için yeterli stok bulunmamaktadır.`, 'warning');
      return;
    }

    const success = productStore.sellMultipleProducts(cartStore.cartItems);
    if (success) {
      checkoutSuccess.value = true;
      cartStore.clearCart();
      cartStore.removeDiscount(); // Clear coupon after order
    }
  }
};

const goToHome = () => {
  checkoutSuccess.value = false;
  router.push('/');
};
</script>

<style scoped>
/* Standard styles are handled by Tailwind classes */
</style>