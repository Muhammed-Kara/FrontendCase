<template>
  <div>
    <!-- Floating Circular Trigger Button (Visible only when scrolled past 350px, Happy Hour active and user hasn't played, or always for Admin) -->
    <transition name="fade-slide">
      <div 
        v-if="isVisibleOnScroll && segments.length >= 2" 
        class="fixed bottom-6 left-6 z-40 cursor-pointer group"
        @click="openModal"
      >
        <!-- Main Circular Button -->
        <button 
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#1E3A32] to-[#2D5A4E] text-[#FAF9F6] shadow-xl border-2 border-[#FAF9F6] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group-hover:border-[#1E3A32]"
          aria-label="Şans Çarkını Aç"
        >
          <!-- Miniature Spin Wheel Icon -->
          <svg class="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-700 ease-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7" stroke-dasharray="1 1" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </button>
      </div>
    </transition>

    <!-- Spin Wheel Modal -->
    <transition name="modal-fade">
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4" 
        role="dialog" 
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[#1E3A32]/25 backdrop-blur-xs" @click="closeModal"></div>

        <!-- Modal Content Card -->
        <div class="relative bg-[#FAF9F6] border border-[#EAE8E0] w-full max-w-[90vw] sm:max-w-sm rounded-2xl shadow-2xl p-4 sm:p-5 text-center space-y-4 animate-slide-up z-10">
          
          <!-- Close Button -->
          <button 
            @click="closeModal" 
            class="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-white/80 border border-[#EAE8E0] flex items-center justify-center text-[#C97A62] hover:text-[#1E3A32] hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs"
            :disabled="isSpinning"
          >
            ✕
          </button>

          <!-- 1. Countdown / Played State Screen (Görüşmek Üzere) -->
          <div v-if="!authStore.isAdmin && hasPlayedInThisCycle" class="space-y-6 py-6 animate-scale-up">
            <div class="w-16 h-16 bg-[#1E3A32]/10 text-[#1E3A32] rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="space-y-2">
              <h2 class="font-serif text-xl font-light text-[#1E3A32] tracking-tight">Görüşmek Üzere!</h2>
              <p class="text-xs text-stone-500 font-light leading-relaxed max-w-[240px] mx-auto">
                Bu ayki şans çarkı hakkınızı kullandınız. Bir sonraki hakkınıza kalan süre:
              </p>
            </div>
            <div class="bg-[#1E3A32] text-white py-3 px-4 rounded-xl shadow-inner font-mono text-sm font-semibold tracking-wider">
              {{ nextMonthCountdownText }}
            </div>
            <button 
              @click="isModalOpen = false"
              class="w-full py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>

          <!-- 2. Main Game Screen -->
          <div v-else class="space-y-4">
            <!-- Header -->
            <div class="space-y-1.5">
              <span class="text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase bg-[#1E3A32]/10 px-2 py-0.5 rounded-md inline-block">
                Şans Saatleri Fırsatı
              </span>
              <h2 class="font-serif text-xl font-light text-[#1E3A32] tracking-tight">Şans Çarkını Çevir!</h2>
              <p class="text-[11px] text-stone-500 font-light max-w-xs mx-auto leading-normal">
                İndirim kuponu kazanmak için çarkı çevirin. Her dönüş kazandırır!
              </p>
            </div>

            <!-- The Wheel Graphic (HTML5 Canvas) -->
            <div class="relative flex justify-center items-center py-1">
              <!-- Selector Pointer -->
              <div class="absolute -top-1 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-[#1E3A32] drop-shadow-md"></div>
              
              <!-- Canvas Container -->
              <div class="bg-white p-2 rounded-full border border-[#EAE8E0]/60 shadow-inner">
                <canvas 
                  ref="wheelCanvas" 
                  width="250" 
                  height="250" 
                  class="rounded-full shadow-md max-w-[190px] sm:max-w-full h-auto"
                ></canvas>
              </div>
            </div>

            <!-- Spin Action Button / Results Card -->
            <div class="pt-1">
              <!-- Spin Button -->
              <button 
                v-if="!hasWon"
                @click="spinWheel" 
                :disabled="isSpinning"
                class="w-full py-3 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {{ isSpinning ? 'Çark Dönüyor...' : 'Çarkı Çevir' }}
              </button>

              <!-- Results Showcase -->
              <div v-else class="bg-white border border-[#EAE8E0] rounded-xl p-3 space-y-2 text-center shadow-xs animate-scale-up">
                <div class="space-y-0.5">
                  <p class="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Kuponunuz Hazır</p>
                  <h3 class="font-serif text-base font-light text-[#1E3A32]">{{ winningPrize.label }} Kazandınız!</h3>
                </div>
                
                <div class="flex items-center justify-between bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg px-3 py-2">
                  <span class="font-mono text-xs font-bold text-[#1E3A32] tracking-wider select-all">{{ winningPrize.code }}</span>
                  <button 
                    @click="copyAndApply(winningPrize.code)"
                    class="text-[9px] font-bold text-[#1E3A32] hover:text-[#2D5A4E] uppercase tracking-wider cursor-pointer"
                  >
                    Kopyala & Uygula
                  </button>
                </div>
                <p class="text-[8px] text-stone-400 font-light">Kodu kopyalayıp Sepet sayfasındaki kupon kısmına girerek kullanabilirsiniz.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useToast } from '../../composables/useToast';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const { addToast } = useToast();
const authStore = useAuthStore();
const cartStore = useCartStore();

// Timers and State variables
const getTodayMonthString = () => new Date().toISOString().slice(0, 7); // Returns YYYY-MM
const isCampaignActive = ref(true);
const hasPlayedInThisCycle = ref(localStorage.getItem('wheel_last_played_month') === getTodayMonthString());

const isModalOpen = ref(false);
const isSpinning = ref(false);
const hasWon = ref(false);

const wheelCanvas = ref(null);

const isVisibleOnScroll = ref(false);
const handleScroll = () => {
  // Show button if scrolled down past 350px (where product cards start)
  isVisibleOnScroll.value = window.scrollY > 350;
};

// Default wheel segments
const defaultSegments = [
  { code: 'SAVE10', type: 'percentage', value: 10, label: '%10 İndirim', color: '#1E3A32', textColor: '#FFFFFF' },
  { code: 'SAVE25', type: 'amount', value: 25, label: '25 TL İndirim', color: '#C97A62', textColor: '#FFFFFF' },
  { code: 'SAVE15', type: 'percentage', value: 15, label: '%15 İndirim', color: '#2D5A4E', textColor: '#FFFFFF' },
  { code: 'SAVE50', type: 'amount', value: 50, label: '50 TL İndirim', color: '#E2E6DF', textColor: '#1E3A32' },
  { code: 'SAVE20', type: 'percentage', value: 20, label: '%20 İndirim', color: '#1E3A32', textColor: '#FFFFFF' },
  { code: 'SAVE100', type: 'amount', value: 100, label: '100 TL İndirim', color: '#C97A62', textColor: '#FFFFFF' }
];

const segments = ref([]);

const loadSegments = () => {
  const stored = localStorage.getItem('wheel_segments');
  if (stored && JSON.parse(stored).length >= 2) {
    segments.value = JSON.parse(stored);
  } else {
    segments.value = [...defaultSegments];
    localStorage.setItem('wheel_segments', JSON.stringify(defaultSegments));
  }
};
loadSegments();

const winningPrize = ref(null);
let animationFrameId = null;

// Next Month Countdown Logic
const nextMonthCountdownText = ref('');
let nextMonthTimer = null;

const updateNextMonthCountdown = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffMs = nextMonth - now;
  
  if (diffMs <= 0) {
    nextMonthCountdownText.value = 'Yeni hakkınız hazır!';
    hasPlayedInThisCycle.value = false;
    return;
  }
  
  const diffSecs = Math.floor(diffMs / 1000);
  const secs = diffSecs % 60;
  const diffMins = Math.floor(diffSecs / 60);
  const mins = diffMins % 60;
  const diffHours = Math.floor(diffMins / 60);
  const hours = diffHours % 24;
  const days = Math.floor(diffHours / 24);
  
  let text = '';
  if (days > 0) text += `${days} gün `;
  if (hours > 0) text += `${hours} saat `;
  if (mins > 0) text += `${mins} dk `;
  text += `${secs} sn`;
  
  nextMonthCountdownText.value = text;
};

const startCampaignTimers = () => {
  isCampaignActive.value = true;
  updateNextMonthCountdown();
  nextMonthTimer = setInterval(updateNextMonthCountdown, 1000);
};

// Canvas drawing functions
const drawWheel = (angle = 0) => {
  const canvas = wheelCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 2 - 10;
  
  ctx.clearRect(0, 0, width, height);

  const numSegments = segments.value.length;
  if (numSegments < 2) {
    // Render a nice empty state placeholder
    ctx.fillStyle = '#EAE8E0';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#FAF9F6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#1E3A32';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kupon Bulunmuyor', cx, cy);
    return;
  }

  const arcSize = (2 * Math.PI) / numSegments;

  // Draw segments
  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * arcSize + angle;
    const endAngle = startAngle + arcSize;
    
    ctx.fillStyle = segments.value[i].color;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.lineTo(cx, cy);
    ctx.fill();
    ctx.strokeStyle = '#FAF9F6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw text inside segments
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arcSize / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = segments.value[i].textColor;
    ctx.font = 'bold 10px Inter, sans-serif';
    
    // Fit text inside wedge
    ctx.fillText(segments.value[i].label, radius - 15, 0);
    ctx.restore();
  }

  // Draw center hub
  ctx.fillStyle = '#FAF9F6';
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#1E3A32';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Inner hub star
  ctx.fillStyle = '#2D5A4E';
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
  ctx.fill();
};

const openModal = () => {
  loadSegments(); // Refresh segments whenever modal opens in case admin edited them
  isModalOpen.value = true;
  hasWon.value = false;
  winningPrize.value = null;
  
  // Render canvas after modal becomes visible
  nextTick(() => {
    drawWheel(0);
  });
};

const closeModal = () => {
  if (!isSpinning.value) {
    isModalOpen.value = false;
    hasWon.value = false;
    winningPrize.value = null;
  }
};

const spinWheel = () => {
  if (isSpinning.value) return;
  if (segments.value.length < 2) {
    addToast('Çarkı çevirmek için en az 2 kupon tanımlanmalıdır!', 'warning');
    return;
  }

  isSpinning.value = true;
  hasWon.value = false;

  const numSegments = segments.value.length;
  const arcSize = (2 * Math.PI) / numSegments;
  
  // Pick a random wedge index
  const winnerIndex = Math.floor(Math.random() * numSegments);
  winningPrize.value = segments.value[winnerIndex];

  // Calculate target rotation to align the pointer (at -90 deg / top position) with the winner slice
  // Pointer is at index 0 angle offset Math.PI * 1.5 (top).
  // Target rotation angle ends at the selected index.
  const extraSpins = 4 + Math.floor(Math.random() * 4); // 4, 5, 6, or 7 full rotations (MUST be integer!)
  const finalAngle = extraSpins * 2 * Math.PI + (numSegments - winnerIndex) * arcSize - (arcSize / 2) - (Math.PI / 2);
  
  let currentRotation = 0;
  const duration = 4000; // 4 seconds duration
  const start = performance.now();

  const animate = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing formula (Ease out cubic)
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    currentRotation = finalAngle * easeOut(progress);

    drawWheel(currentRotation);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      isSpinning.value = false;
      hasWon.value = true;
      hasPlayedInThisCycle.value = true;
      localStorage.setItem('wheel_last_played_month', getTodayMonthString());
      updateNextMonthCountdown();
      
      // Save won coupon code to sessionStorage
      const wonCode = segments.value[winnerIndex].code.toUpperCase();
      sessionStorage.setItem('last_won_coupon', wonCode);
      
      // Unlock coupon for use in cart
      try {
        const unlocked = JSON.parse(localStorage.getItem('unlocked_coupons') || '[]');
        if (!unlocked.includes(wonCode)) {
          unlocked.push(wonCode);
          localStorage.setItem('unlocked_coupons', JSON.stringify(unlocked));
        }
      } catch (e) {
        console.error('Kupon kilidi açma hatası:', e);
      }
      
      addToast(`Tebrikler! ${segments.value[winnerIndex].label} Kuponu Kazandınız.`);
      window.dispatchEvent(new CustomEvent('wheel-status-updated'));
    }
  };

  animationFrameId = requestAnimationFrame(animate);
};

const copyAndApply = (code) => {
  // Apply coupon code directly to Pinia cartStore
  cartStore.applyDiscountCode(code);

  // Copy code to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => {
        addToast('Kupon kodu kopyalandı ve sepetinize uygulandı!');
      })
      .catch((err) => {
        console.error('Kopyalama hatası:', err);
      });
  } else {
    // Fallback if clipboard API not supported
    addToast('Kupon kodu sepetinize uygulandı!');
  }
  
  // Close the modal shortly after copying
  setTimeout(() => {
    isModalOpen.value = false;
  }, 1500);
};

onMounted(() => {
  startCampaignTimers();
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  if (nextMonthTimer) clearInterval(nextMonthTimer);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Animations and Transitions styles */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
