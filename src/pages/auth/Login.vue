<template>
  <div class="min-h-screen h-screen w-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-[#FAF9F6]">
    
    <div class="hidden md:block relative h-full w-full overflow-hidden select-none border-r border-[#EAE8E0]/60">
      <img 
        src="/login_ecommerce_abstract.jpg" 
        class="w-full h-full object-cover" 
        alt="E-Commerce Illustration" 
      />
    </div>

    <div class="flex items-center justify-center p-8 md:p-16 h-full w-full bg-white relative">
      <div class="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] bg-[#1E3A32]/5 rounded-full blur-3xl md:hidden" aria-hidden="true"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[380px] h-[380px] bg-[#C97A62]/5 rounded-full blur-3xl md:hidden" aria-hidden="true"></div>

      <div class="w-full max-w-md space-y-8 relative z-10">
        <div class="flex flex-col items-start text-left">
          <router-link to="/" class="w-12 h-12 rounded-full border border-[#1E3A32] flex items-center justify-center mb-6 hover:scale-105 transition-transform duration-300" aria-label="Ana sayfa">
            <span class="font-serif text-[#1E3A32] text-xl font-semibold">F</span>
          </router-link>
          <h2 class="font-serif text-3xl font-light text-[#1E3A32] tracking-tight">Hoş Geldiniz</h2>
          <p class="text-xs text-stone-500 mt-2 font-light leading-relaxed">
            Sakin ve özenle seçilmiş ürünlerle dolu e-ticaret dünyasına adım atın.
          </p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="text-left">
            <label class="block text-[10px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-2">Kullanıcı Adı</label>
            <input 
              v-model="username" 
              type="text" 
              required 
              class="w-full px-4 py-3 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-[#1E3A32] placeholder-stone-400 transition-all"
              placeholder="Adınızı girin"
            >
          </div>

          <div class="text-left">
            <label class="block text-[10px] font-extrabold tracking-widest text-[#1E3A32] uppercase mb-2">Rol Seçimi (Test İçin)</label>
            <div class="relative">
              <select 
                v-model="role" 
                class="w-full px-4 py-3 bg-[#FAF9F6] border border-[#EAE8E0] rounded-lg outline-none focus:ring-2 focus:ring-[#1E3A32]/10 focus:border-[#1E3A32] text-xs text-stone-600 appearance-none cursor-pointer transition-all"
              >
                <option value="user">Standart Kullanıcı (Alışveriş & Sepet)</option>
                <option value="admin">Yönetici (Ürün Yönetimi)</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg class="w-3.5 h-3.5 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
            <p class="text-[10px] text-stone-400 mt-2 leading-relaxed italic">
              * Şifre kontrolü gerekmiyor, test için dummy bir doğrulama yapılacaktır.
            </p>
          </div>

          <button 
            type="submit" 
            class="w-full bg-[#1E3A32] text-[#FAF9F6] font-bold text-xs tracking-wider uppercase py-3.5 px-4 rounded-lg hover:bg-[#2D5A4E] shadow-md hover:shadow-lg hover:shadow-[#1E3A32]/10 transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            Giriş Yap
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const role = ref('user'); 

const handleLogin = () => {
  if (username.value.trim() !== '') {
    authStore.login(username.value, role.value);
    router.push('/');
  }
};
</script>
