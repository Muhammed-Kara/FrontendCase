<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 pointer-events-none max-w-sm w-full">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto w-full bg-white/95 backdrop-blur-md border rounded-xl p-4 shadow-xl flex items-start gap-3.5 animate-slide-in transition-all duration-300"
      :class="{
        'border-[#1E3A32]/25': toast.type === 'success',
        'border-red-200': toast.type === 'error',
        'border-[#C97A62]/20': toast.type === 'warning',
        'border-stone-200': toast.type === 'info'
      }"
    >
      <!-- Icon Wrapper -->
      <div class="flex-shrink-0">
        <!-- Success Icon -->
        <div v-if="toast.type === 'success'" class="w-8 h-8 rounded-full bg-[#1E3A32]/10 text-[#1E3A32] flex items-center justify-center">
          <svg class="w-4.5 h-4.5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <!-- Error Icon -->
        <div v-else-if="toast.type === 'error'" class="w-8 h-8 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center">
          <svg class="w-4.5 h-4.5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <!-- Warning Icon -->
        <div v-else-if="toast.type === 'warning'" class="w-8 h-8 rounded-full bg-[#C97A62]/10 text-[#C97A62] flex items-center justify-center">
          <svg class="w-4.5 h-4.5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <!-- Info Icon -->
        <div v-else class="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
          <svg class="w-4.5 h-4.5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Message Text -->
      <div class="flex-grow text-left space-y-0.5">
        <p class="text-[9px] font-extrabold tracking-widest uppercase"
           :class="{
             'text-[#1E3A32]': toast.type === 'success',
             'text-red-500': toast.type === 'error',
             'text-[#C97A62]': toast.type === 'warning',
             'text-stone-500': toast.type === 'info'
           }"
        >
          {{ toast.type === 'success' ? 'Başarılı' : toast.type === 'error' ? 'Hata' : toast.type === 'warning' ? 'Uyarı' : 'Bilgi' }}
        </p>
        <p class="text-xs text-stone-600 font-medium leading-relaxed whitespace-pre-line">
          {{ toast.message }}
        </p>
      </div>

      <!-- Close Button -->
      <button 
        @click="removeToast(toast.id)" 
        class="flex-shrink-0 text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded-lg hover:bg-stone-100 cursor-pointer"
        aria-label="Kapat"
      >
        <svg class="w-3.5 h-3.5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
