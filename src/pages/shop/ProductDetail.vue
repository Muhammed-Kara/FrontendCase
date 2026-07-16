<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-6 py-10 space-y-8">

      <!-- Loading State -->
      <div v-if="productStore.isLoading" class="flex justify-center items-center py-24">
        <div class="w-10 h-10 border-4 border-[#EAE8E0] border-t-[#1E3A32] rounded-full animate-spin"></div>
      </div>

      <!-- Product Not Found -->
      <section v-else-if="!product" class="py-16 px-4 text-center max-w-md mx-auto bg-[#FAF9F6] border border-dashed border-[#EAE8E0] rounded-xl">
        <svg class="w-12 h-12 text-[#C97A62] mx-auto mb-4 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h1 class="font-serif text-2xl font-light text-[#1E3A32] mb-2">Ürün bulunamadı</h1>
        <p class="text-sm text-stone-500 mb-6 font-light">Bu ürün kaldırılmış veya bağlantı geçersiz olabilir.</p>
        <router-link to="/" class="inline-flex items-center justify-center px-6 py-3 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95">
          Ürünlere dön
        </router-link>
      </section>

      <!-- Product Content -->
      <section v-else class="space-y-8">

        <!-- Breadcrumb Navigation -->
        <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-stone-500 uppercase text-left">
          <router-link to="/" class="hover:text-[#1E3A32] transition-colors">Ana Sayfa</router-link>
          <span class="text-stone-300 font-normal">/</span>
          <span class="text-stone-500">{{ product.category || 'Ürünler' }}</span>
          <span class="text-stone-300 font-normal">/</span>
          <span class="text-[#1E3A32] font-black truncate max-w-[200px]">{{ product.title }}</span>
        </div>

        <!-- Main Product Card Details -->
        <div class="bg-white border border-[#EAE8E0] rounded-xl overflow-hidden shadow-xs">
          <div class="grid grid-cols-1 lg:grid-cols-2">

            <!-- Left Media Frame & Guarantees -->
            <div class="p-4 md:p-6 bg-[#FAF9F6]/40 border-b lg:border-b-0 lg:border-r border-[#EAE8E0] flex flex-col space-y-4">
              
              <!-- Main Image Frame with Dynamic Inner Zoom & Dots -->
              <div 
                class="relative aspect-square bg-white border border-[#EAE8E0]/40 rounded-lg overflow-hidden flex items-center justify-center p-12 md:p-20 shadow-inner cursor-zoom-in group/media"
                @mousemove="handleMouseMove"
                @mouseenter="isZoomActive = true"
                @mouseleave="isZoomActive = false"
              >
                <span v-if="hasDiscount(product)" class="absolute top-4 left-4 z-10 text-[9px] uppercase tracking-widest font-bold text-[#FAF9F6] bg-[#C97A62] px-2.5 py-1 rounded-lg shadow-sm">
                  {{ discountLabel(product) }}
                </span>

                <img 
                  :src="activeImage" 
                  :alt="product.title" 
                  class="max-h-[85%] max-w-[85%] object-contain mix-blend-multiply transition-transform duration-300 ease-out"
                  :style="isZoomActive ? {
                    transform: 'scale(2.2)',
                    transformOrigin: `${zoomX}% ${zoomY}%`
                  } : {}"
                >

                <!-- Image Indicator Dots (Kaçıncı resimde olduğunu gösteren noktalar) -->
                <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-15 bg-white/80 backdrop-blur px-2.5 py-1.2 rounded-full border border-stone-200/50 shadow-xs pointer-events-auto">
                  <button 
                    v-for="(image, index) in images" 
                    :key="index"
                    @click.stop="activeImage = image"
                    class="w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                    :class="activeImage === image ? 'bg-[#1E3A32] scale-125' : 'bg-stone-300 hover:bg-stone-400'"
                    :aria-label="`${index + 1}. görsele git`"
                  ></button>
                </div>

                <!-- Arrows -->
                <button v-if="images.length > 1" class="absolute top-1/2 -translate-y-1/2 left-4 w-9 h-9 rounded-full bg-white/95 border border-[#EAE8E0] flex items-center justify-center text-stone-600 hover:text-[#1E3A32] active:scale-90 shadow-sm transition-all cursor-pointer z-10" @click.stop="stepImage(-1)" aria-label="Önceki görsel">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button v-if="images.length > 1" class="absolute top-1/2 -translate-y-1/2 right-4 w-9 h-9 rounded-full bg-white/95 border border-[#EAE8E0] flex items-center justify-center text-stone-600 hover:text-[#1E3A32] active:scale-90 shadow-sm transition-all cursor-pointer z-10" @click.stop="stepImage(1)" aria-label="Sonraki görsel">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              <!-- Thumbnails row -->
              <div v-if="images.length > 1" class="flex gap-2 justify-center flex-wrap">
                <button
                  v-for="(image, index) in images"
                  :key="image"
                  class="w-12 h-12 p-1 rounded-lg border border-[#EAE8E0] bg-white cursor-pointer hover:border-[#1E3A32] transition-all flex items-center justify-center"
                  :class="activeImage === image ? 'border-[#1E3A32] ring-2 ring-[#1E3A32]/10' : ''"
                  @click="activeImage = image"
                >
                  <img :src="image" :alt="`${product.title} ${index + 1}`" class="max-h-full max-w-full object-contain">
                </button>
              </div>

              <!-- Guarantees Grid (Adds visual fullness to media section) -->
              <div class="grid grid-cols-2 gap-3 pt-4 border-t border-[#EAE8E0]/60">
                <div class="flex items-center gap-3 p-3 bg-white border border-[#EAE8E0]/40 rounded-lg">
                  <div class="w-8 h-8 rounded-full bg-[#1E3A32]/5 flex items-center justify-center text-[#1E3A32] flex-shrink-0">
                    <svg class="w-4 h-4 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div class="text-left">
                    <h4 class="text-[9px] font-bold uppercase tracking-wider text-stone-700">Ücretsiz Kargo</h4>
                    <p class="text-[8px] text-stone-400">500 TL üzeri alımlarda</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 p-3 bg-white border border-[#EAE8E0]/40 rounded-lg">
                  <div class="w-8 h-8 rounded-full bg-[#1E3A32]/5 flex items-center justify-center text-[#1E3A32] flex-shrink-0">
                    <svg class="w-4 h-4 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" /></svg>
                  </div>
                  <div class="text-left">
                    <h4 class="text-[9px] font-bold uppercase tracking-wider text-stone-700">14 Gün İade</h4>
                    <p class="text-[8px] text-stone-400">Koşulsuz şartsız iade</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-3 bg-white border border-[#EAE8E0]/40 rounded-lg">
                  <div class="w-8 h-8 rounded-full bg-[#1E3A32]/5 flex items-center justify-center text-[#1E3A32] flex-shrink-0">
                    <svg class="w-4 h-4 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" /></svg>
                  </div>
                  <div class="text-left">
                    <h4 class="text-[9px] font-bold uppercase tracking-wider text-stone-700">Güvenli Ödeme</h4>
                    <p class="text-[8px] text-stone-400">256-Bit SSL koruması</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-3 bg-white border border-[#EAE8E0]/40 rounded-lg">
                  <div class="w-8 h-8 rounded-full bg-[#1E3A32]/5 flex items-center justify-center text-[#1E3A32] flex-shrink-0">
                    <svg class="w-4 h-4 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div class="text-left">
                    <h4 class="text-[9px] font-bold uppercase tracking-wider text-stone-700">Destek Hattı</h4>
                    <p class="text-[8px] text-stone-400">7/24 Kesintisiz destek</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right: Info Panel & Specifications -->
            <div class="p-4 md:p-6 flex flex-col justify-between text-left space-y-4">
              
              <div class="space-y-4">
                <div>
                  <span v-if="product.brand" class="text-[9px] font-extrabold tracking-widest text-[#C97A62] uppercase mb-1.5 block">
                    {{ product.brand }}
                  </span>
                  <h1 class="font-serif text-2xl md:text-3xl font-light text-[#1E3A32] tracking-tight leading-tight">
                    {{ product.title }}
                  </h1>

                  <!-- Rating Stars & Reviews Count -->
                  <div v-if="product.rating" class="flex items-center gap-2 mt-3 select-none text-xs font-semibold text-[#1E3A32]">
                    <div class="flex items-center text-[#C97A62] text-[10px]">
                      ★ <span class="ml-1 text-[#1E3A32] text-xs font-bold">{{ Number(product.rating).toFixed(1) }}</span>
                    </div>
                    <span class="text-stone-300">|</span>
                    <a href="#reviews" class="text-stone-400 hover:text-[#C97A62] transition-colors text-[10px] uppercase font-bold tracking-wider">
                      {{ reviewsList.length }} Değerlendirme
                    </a>
                  </div>
                </div>

                <!-- Pricing -->
                <div class="flex items-baseline gap-3 pt-2">
                  <span class="font-serif text-3xl font-semibold text-[#1E3A32]">{{ discountedPrice }} TL</span>
                  <span v-if="hasDiscount(product)" class="text-base text-stone-400 line-through font-serif">{{ Number(product.price).toFixed(2) }} TL</span>
                </div>
                
                <div v-if="hasDiscount(product)" class="flex gap-2 items-center">
                  <span class="text-[9px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-700/10 uppercase tracking-wider">
                    {{ discountLabel(product) }} indirim
                  </span>
                </div>

                <!-- Stock Progress Indicator (Fills up the page elegantly) -->
                <div class="space-y-1.5 pt-2">
                  <div class="flex justify-between items-center text-xs text-stone-500 font-medium">
                    <span class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full" :class="product.stock > 10 ? 'bg-green-600' : product.stock > 0 ? 'bg-amber-600 animate-pulse' : 'bg-red-500'"></span>
                      <span v-if="product.stock > 10">Stokta mevcut</span>
                      <span v-else-if="product.stock > 0">Sınırlı Stok!</span>
                      <span v-else>Tükendi</span>
                    </span>
                    <span>Son {{ product.stock }} adet</span>
                  </div>
                  <!-- Progress Bar -->
                  <div class="h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" :class="product.stock < 15 ? 'bg-[#C97A62]' : 'bg-[#1E3A32]'" :style="{width: `${Math.min((product.stock / 100) * 100, 100)}%`}"></div>
                  </div>
                </div>
              </div>

              <div class="border-t border-[#EAE8E0]/60"></div>

              <!-- Product description -->
              <div class="space-y-2">
                <h2 class="text-[9px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Açıklama</h2>
                <p class="text-sm text-stone-600 font-light leading-relaxed">
                  {{ product.description }}
                </p>
              </div>

              <!-- Specifications Grid (Aesthetic specs table) -->
              <div class="bg-[#FAF9F6]/60 border border-[#EAE8E0]/40 rounded-lg p-4 space-y-2 text-xs">
                <div class="flex justify-between border-b border-[#EAE8E0]/30 pb-2">
                  <span class="text-stone-400 font-medium">Kategori:</span>
                  <span class="font-bold text-stone-700 capitalize">{{ categoryName(product.category) || '-' }}</span>
                </div>
                <div class="flex justify-between border-b border-[#EAE8E0]/30 pb-2">
                  <span class="text-stone-400 font-medium">SKU / Barkod:</span>
                  <span class="font-bold text-stone-700">{{ product.sku || 'N/A' }}</span>
                </div>
                <div class="flex justify-between border-b border-[#EAE8E0]/30 pb-2">
                  <span class="text-stone-400 font-medium">Kargo Süresi:</span>
                  <span class="font-bold text-stone-700">{{ translateInfo(product.shippingInformation) || '1-3 iş günü' }}</span>
                </div>
                <div class="flex justify-between border-b border-[#EAE8E0]/30 pb-2" v-if="product.warrantyInformation">
                  <span class="text-stone-400 font-medium">Garanti:</span>
                  <span class="font-bold text-stone-700">{{ translateInfo(product.warrantyInformation) }}</span>
                </div>
                <div class="flex justify-between pb-1" v-if="product.returnPolicy">
                  <span class="text-stone-400 font-medium">İade Politikası:</span>
                  <span class="font-bold text-stone-700">{{ translateInfo(product.returnPolicy) }}</span>
                </div>
              </div>

              <div class="border-t border-[#EAE8E0]/60"></div>

              <!-- Actions Area (Quantity Selector + Add To Cart) -->
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Adet:</span>
                  
                  <div class="flex items-center border border-[#EAE8E0] rounded-lg bg-white overflow-hidden shadow-xs">
                    <button 
                      @click="quantitySelected = Math.max(1, quantitySelected - 1)"
                      class="w-9 h-9 flex items-center justify-center text-sm font-semibold text-stone-600 hover:bg-stone-50 active:scale-90 transition-all cursor-pointer"
                      :disabled="quantitySelected <= 1"
                    >
                      -
                    </button>
                    <span class="px-4 text-xs font-bold text-stone-700 min-w-8 text-center">{{ quantitySelected }}</span>
                    <button 
                      @click="quantitySelected = Math.min(product.stock, quantitySelected + 1)"
                      class="w-9 h-9 flex items-center justify-center text-sm font-semibold text-stone-600 hover:bg-stone-50 active:scale-90 transition-all cursor-pointer"
                      :disabled="quantitySelected >= product.stock"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button class="flex-grow flex items-center justify-center gap-2.5 h-11 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md active:scale-[0.98] transition-all cursor-pointer" @click="addToCart">
                    <svg class="w-4 h-4 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    Sepete Ekle
                  </button>
                  <button class="w-28 flex items-center justify-center h-11 bg-white hover:bg-stone-50 text-[#1E3A32] border border-[#1E3A32] text-xs font-bold uppercase tracking-wider rounded-lg active:scale-[0.98] transition-all cursor-pointer" @click="buyNow">
                    Hemen Al
                  </button>
                </div>

                <button
                  class="w-full h-11 border border-[#EAE8E0] hover:border-[#C97A62]/20 hover:bg-[#C97A62]/5 text-stone-600 hover:text-[#C97A62] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  :class="favoriteStore.isFavorite(product.id) ? 'text-[#C97A62] bg-[#C97A62]/10 border-transparent hover:bg-[#C97A62]/10' : ''"
                  @click="toggleFavorite"
                >
                  <svg class="w-4.5 h-4.5 stroke-[1.8]" viewBox="0 0 24 24" :fill="favoriteStore.isFavorite(product.id) ? 'currentColor' : 'none'" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" /></svg>
                  {{ favoriteStore.isFavorite(product.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Customer Reviews Section (Ensures page fullness with active interactive components) -->
        <div id="reviews" class="border-t border-[#EAE8E0] pt-12 text-left space-y-8">
          <h2 class="font-serif text-2xl font-light text-[#1E3A32] tracking-tight">Kullanıcı Değerlendirmeleri</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            
            <!-- Reviews List -->
            <div class="space-y-6">
              <div v-for="(review, index) in reviewsList" :key="index" class="bg-white border border-[#EAE8E0]/60 p-5 rounded-lg text-left space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h4 class="font-serif text-sm font-semibold text-[#1E3A32]">{{ review.reviewerName }}</h4>
                    <p class="text-[9px] text-stone-400 mt-0.5">{{ formatDate(review.date) }}</p>
                  </div>
                  <!-- Star Rating -->
                  <div class="flex items-center text-[#C97A62] text-[10px]">
                    <span v-for="star in 5" :key="star" class="mr-0.5">
                      {{ star <= review.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
                <p class="text-xs text-stone-600 font-light leading-relaxed">
                  {{ review.comment }}
                </p>
              </div>
            </div>

            <!-- Add Review Form (Mock feature to make page busy and functional) -->
            <div class="bg-[#FAF9F6] border border-[#EAE8E0]/60 rounded-lg p-5 space-y-4">
              <h3 class="font-serif text-sm font-semibold text-[#1E3A32]">Değerlendirme Yapın</h3>
              
              <form @submit.prevent="submitReview" class="space-y-3">
                <div class="space-y-1">
                  <label class="block text-[8px] font-extrabold tracking-widest text-[#1E3A32] uppercase">İsminiz</label>
                  <input v-model="newReviewName" required type="text" placeholder="Adınız" class="w-full px-3 py-2 bg-white border border-[#EAE8E0] rounded-lg outline-none text-xs text-[#1E3A32] focus:ring-1 focus:ring-[#1E3A32]/10 transition-all">
                </div>

                <div class="space-y-1">
                  <label class="block text-[8px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Puanınız</label>
                  <div class="flex gap-1.5 text-lg cursor-pointer">
                    <span v-for="star in 5" :key="star" class="text-[#C97A62]" @click="newReviewRating = star">
                      {{ star <= newReviewRating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="block text-[8px] font-extrabold tracking-widest text-[#1E3A32] uppercase">Yorumunuz</label>
                  <textarea v-model="newReviewComment" required rows="3" placeholder="Ürün hakkındaki görüşlerinizi yazın..." class="w-full px-3 py-2 bg-white border border-[#EAE8E0] rounded-lg outline-none text-xs text-[#1E3A32] focus:ring-1 focus:ring-[#1E3A32]/10 transition-all resize-none"></textarea>
                </div>

                <button type="submit" class="w-full py-2 bg-[#1E3A32] hover:bg-[#2D5A4E] text-[#FAF9F6] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all active:scale-[0.98]">
                  Yorumu Gönder
                </button>
              </form>
            </div>
            
          </div>
        </div>

        <!-- Similar Products Section -->
        <div v-if="similarProducts.length > 0" class="border-t border-[#EAE8E0] pt-12 text-left">
          <h2 class="font-serif text-2xl font-light text-[#1E3A32] tracking-tight mb-8">Benzer Ürünler</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
             <router-link
               v-for="item in similarProducts"
               :key="item.id"
               :to="`/urun/${item.id}`"
               class="group relative flex flex-col cursor-pointer bg-[#FAF9F6]/40 rounded-xl p-3 border border-transparent hover:border-[#EAE8E0] hover:bg-white hover:shadow-xl transition-all duration-500"
             >
              <!-- Card Image Slot -->
              <div class="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#FAF9F6] border border-[#EAE8E0]/30 flex items-center justify-center p-4 transition-colors duration-300 group-hover:bg-[#F2F1EC]">
                <span v-if="hasDiscount(item)" class="absolute top-3 left-3 z-10 text-[9px] uppercase tracking-widest font-bold text-[#FAF9F6] bg-[#C97A62] px-2 py-0.5 rounded-lg shadow-sm">
                  {{ discountLabel(item) }}
                </span>
                <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105">
              </div>
              
              <!-- Card Details -->
              <div class="mt-4 flex flex-col flex-grow text-left">
                <h3 class="font-serif text-sm font-medium text-[#1E3A32] line-clamp-2 group-hover:text-[#C97A62] transition-colors duration-300 leading-tight">
                  {{ item.title }}
                </h3>

                <!-- Rating -->
                <div v-if="item.rating" class="flex items-center gap-0.5 text-xs text-stone-500 font-semibold bg-stone-100/60 px-1.5 py-0.5 rounded-md flex-shrink-0 w-max mt-2 select-none">
                  <span class="text-[#C97A62] text-[10px]">★</span>
                  <span>{{ Number(item.rating).toFixed(1) }}</span>
                </div>

                <!-- Price row -->
                <div class="mt-4 pt-3 flex items-center gap-2 border-t border-[#EAE8E0]/40">
                  <span class="font-serif text-sm font-semibold text-[#1E3A32]">{{ getDiscountedPrice(item).toFixed(2) }} TL</span>
                  <span v-if="hasDiscount(item)" class="text-xs text-stone-400 line-through font-serif">{{ Number(item.price).toFixed(2) }} TL</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '../../layouts/DefaultLayout.vue'
import { useCartStore } from '../../stores/cartStore'
import { useProductStore } from '../../stores/productStore'
import { useFavoriteStore } from '../../stores/favoriteStore'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../composables/useToast'
import { translateCategory } from '../../utils/translator'
import { getDiscountedPrice, hasDiscount as hasProductDiscount, getDiscountLabel as getProductDiscountLabel } from '../../utils/discount'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()
const { addToast } = useToast()

const activeImage = ref('')
const quantitySelected = ref(1)

// Inner zoom state
const isZoomActive = ref(false)
const zoomX = ref(50)
const zoomY = ref(50)

const handleMouseMove = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Calculate cursor percentage position inside container box
  zoomX.value = (x / rect.width) * 100
  zoomY.value = (y / rect.height) * 100
}

// New review fields
const newReviewName = ref('')
const newReviewRating = ref(5)
const newReviewComment = ref('')

const product = computed(() => productStore.products.find(item => String(item.id) === String(route.params.id)))
const images = computed(() => product.value?.images?.length ? product.value.images : [product.value?.thumbnail].filter(Boolean))
const discountedPrice = computed(() => {
  if (!product.value) return ''
  return getDiscountedPrice(product.value).toFixed(2)
})

const hasDiscount = (item) => hasProductDiscount(item)
const discountLabel = (item) => getProductDiscountLabel(item)

const categoryName = translateCategory;

const translateInfo = (text) => {
  if (!text) return ''
  const translations = {
    'in stock': 'Stokta Var',
    'low stock': 'Sınırlı Stok',
    'out of stock': 'Tükendi',
    'ships in 1-2 business days': '1-2 iş günü içinde kargolanır',
    'ships in 3-5 business days': '3-5 iş günü içinde kargolanır',
    'ships in 1 week': '1 hafta içinde kargolanır',
    'ships in 2 weeks': '2 hafta içinde kargolanır',
    '1 month warranty': '1 Ay Distribütör Garantili',
    '3 months warranty': '3 Ay Distribütör Garantili',
    '6 months warranty': '6 Ay Distribütör Garantili',
    '1 year warranty': '1 Yıl Distribütör Garantili',
    '2 years warranty': '2 Yıl Distribütör Garantili',
    '3 years warranty': '3 Yıl Distribütör Garantili',
    '5 years warranty': '5 Yıl Distribütör Garantili',
    'lifetime warranty': 'Ömür Boyu Garanti',
    'no warranty': 'Garanti Yok',
    '30 days return policy': '30 Gün İade Hakkı',
    '14 days return policy': '14 Gün İade Hakkı',
    '7 days return policy': '7 Gün İade Hakkı',
    'no return policy': 'İade Hakkı Yok'
  }
  const key = String(text).toLowerCase().trim()
  return translations[key] || text
}

// Reviews state (supports existing reviews or fallbacks if none loaded from DummyJSON)
const localReviews = ref([])
const reviewsList = computed(() => localReviews.value)

const similarProducts = computed(() => {
  if (!product.value) return []
  return productStore.products
    .filter(item => item.category === product.value.category && String(item.id) !== String(product.value.id))
    .slice(0, 4)
})

const stepImage = (dir) => {
  const i = images.value.indexOf(activeImage.value)
  const next = (i + dir + images.value.length) % images.value.length
  activeImage.value = images.value[next]
}

const ensureProductsLoaded = async () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  await productStore.loadProducts()
  activeImage.value = images.value[0] || ''
  quantitySelected.value = 1
  
  // Load reviews from localStorage specific to this product
  if (product.value) {
    const productId = product.value.id;
    const stored = localStorage.getItem(`product_reviews_${productId}`);
    if (stored) {
      localReviews.value = JSON.parse(stored);
    } else {
      const defaultReviews = product.value.reviews?.length ? product.value.reviews : [
        {
          reviewerName: "Muhammed Kaya",
          comment: "Ürünün tasarımı harika, sadeliği ve işlevselliği beni cezbetti. Çok kaliteli bir materyali var. Kargo da hızlı geldi.",
          rating: 5,
          date: "2026-07-12T14:32:00Z"
        },
        {
          reviewerName: "Buse Demir",
          comment: "Çok şık duruyor. Fiyatı da indirimle gayet makul bir seviyeye geldi. Teşekkürler, özenle seçilmiş bir seçki olduğu belli.",
          rating: 4,
          date: "2026-07-09T08:15:00Z"
        },
        {
          reviewerName: "Ahmet Yurt",
          comment: "Evime çok yakıştı. Kalitesi beklediğimin çok üstünde. Paketlemesi gayet sağlam ve özenliydi.",
          rating: 5,
          date: "2026-07-05T18:45:00Z"
        }
      ];
      localReviews.value = defaultReviews;
      localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(defaultReviews));
    }
  } else {
    localReviews.value = [];
  }
}

const requireLogin = message => {
  if (authStore.isAuthenticated) return true
  addToast(message, 'warning')
  router.push({ path: '/login', query: { redirect: route.fullPath } })
  return false
}

const addToCart = () => {
  if (!requireLogin('Sepete eklemek için lütfen giriş yapın.')) return
  cartStore.addToCart(product.value, quantitySelected.value)
  addToast(`Sepete ${quantitySelected.value} adet ürün eklendi.`)
}

const toggleFavorite = () => {
  if (!requireLogin('Favorilere eklemek için lütfen giriş yapın.')) return
  favoriteStore.toggleFavorite(product.value)
}

const buyNow = () => {
  if (!requireLogin('Satın almak için lütfen giriş yapın.')) return
  cartStore.addToCart(product.value, quantitySelected.value)
  router.push('/cart')
}

// Format ISO date strings beautifully
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateString
  }
}

// Submit a new review (Saved in localStorage)
const submitReview = () => {
  if (!newReviewName.value || !newReviewComment.value) return
  
  const newReview = {
    reviewerName: newReviewName.value,
    comment: newReviewComment.value,
    rating: newReviewRating.value,
    date: new Date().toISOString()
  }

  // Prepend review to current reviews list
  localReviews.value.unshift(newReview)

  // Save to localStorage
  if (product.value) {
    const productId = product.value.id;
    localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(localReviews.value));
  }

  // Reset form
  newReviewName.value = ''
  newReviewComment.value = ''
  newReviewRating.value = 5

  addToast('Yorumunuz başarıyla eklendi!')
}

onMounted(ensureProductsLoaded)
watch(() => route.params.id, ensureProductsLoaded)
</script>

<style scoped>
/* Custom styled enhancements */
</style>
