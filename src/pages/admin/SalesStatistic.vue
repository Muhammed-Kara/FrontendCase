<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Satış İstatistikleri</h1>
      <p class="text-sm text-gray-600 mt-2">Satış performansını takip edin ve en çok satılan ürünleri görüntüleyin</p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-sm text-gray-600 font-medium">Toplam Satış</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalSales }}</p>
        <p class="text-xs text-gray-400 mt-2">Tüm zamanlar</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-sm text-gray-600 font-medium">Toplam Gelir</p>
        <p class="text-3xl font-bold text-orange-600 mt-2">${{ totalRevenue.toFixed(2) }}</p>
        <p class="text-xs text-gray-400 mt-2">Tüm zamanlar</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-sm text-gray-600 font-medium">Ortalama Fiyat</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">${{ averagePrice.toFixed(2) }}</p>
        <p class="text-xs text-gray-400 mt-2">Ürün başına</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-sm text-gray-600 font-medium">Toplam Ürün</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalProducts }}</p>
        <p class="text-xs text-gray-400 mt-2">Katalogda</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Sales by Category Chart -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Kategoriye Göre Satışlar</h2>
        <div class="space-y-4">
          <div v-for="(category, index) in categorySalesData" :key="index">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
              <span class="text-sm font-semibold text-orange-600">{{ category.count }} satış</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5">
              <div
                class="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: category.percentage + '%' }"
              ></div>
            </div>
          </div>
          <div v-if="categorySalesData.length === 0" class="text-center py-8">
            <p class="text-gray-400 text-sm">Henüz satış verisi yok</p>
          </div>
        </div>
      </div>

      <!-- Price Range Distribution -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Fiyat Aralığı Dağılımı</h2>
        <div class="space-y-4">
          <div v-for="(range, index) in priceRanges" :key="index">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">{{ range.label }}</span>
              <span class="text-sm font-semibold text-orange-600">{{ range.count }} ürün</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5">
              <div
                class="bg-orange-400 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: range.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Selling Products -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">En Çok Satılan Ürünler</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ürün</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fiyat</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Satış</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Puan</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in topSellingProducts" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg p-1">
                    <img :src="product.thumbnail" class="w-full h-full object-contain rounded" alt="Ürün" />
                  </div>
                  <span class="font-medium text-gray-900 text-sm">{{ product.title }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full">
                  {{ product.category || 'Kategorisiz' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="font-bold text-orange-600">${{ Number(product.price || 0).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-700 font-medium">{{ product.totalSold || 0 }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-semibold text-gray-900">{{ product.rating || 0 }}</span>
                  <svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="product.stock > 10" class="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  Stokta
                </span>
                <span v-else-if="product.stock > 0" class="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full">
                  Az Stok
                </span>
                <span v-else class="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                  Tükendi
                </span>
              </td>
            </tr>
            <tr v-if="topSellingProducts.length === 0">
              <td colspan="6" class="px-6 py-16 text-center">
                <p class="text-gray-600 font-medium">Henüz ürün bulunmuyor</p>
                <p class="text-sm text-gray-400 mt-1">Ürün ekleyerek başlayın</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useProductStore } from '../../stores/productStore'
import { useSalesStore } from '../../stores/salesStore'

const productStore = useProductStore()
const salesStore = useSalesStore()

onMounted(() => {
  productStore.loadProducts()
})

// Total Sales Count
const totalSales = computed(() => {
  return salesStore.totalSales
})

// Total Revenue
const totalRevenue = computed(() => {
  return salesStore.totalRevenue
})

// Average Price
const averagePrice = computed(() => {
  if (productStore.products.length === 0) return 0
  const sum = productStore.products.reduce((total, product) => total + product.price, 0)
  return sum / productStore.products.length
})

// Total Products
const totalProducts = computed(() => {
  return productStore.products.length
})

const soldProductDetails = computed(() => {
  return salesStore.topSellingProducts.map(saleItem => {
    const product = productStore.products.find(item => String(item.id) === String(saleItem.id))

    return {
      ...saleItem,
      category: product?.category || 'Kategorisiz',
      thumbnail: product?.thumbnail || '',
      stock: product?.stock ?? 0,
      rating: product?.rating ?? 0,
      price: Number(saleItem.price || product?.price || 0)
    }
  })
})

// Category Sales Data
const categorySalesData = computed(() => {
  const categoryMap = {}
  
  soldProductDetails.value.forEach(product => {
    const category = product.category || 'Kategorisiz'
    if (!categoryMap[category]) {
      categoryMap[category] = 0
    }
    categoryMap[category] += product.totalSold || 0
  })

  const totalCount = Object.values(categoryMap).reduce((sum, count) => sum + count, 0)
  
  return Object.entries(categoryMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
})

// Price Range Distribution
const priceRanges = computed(() => {
  const ranges = [
    { label: '$0 - $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: Infinity }
  ]

  const totalProducts = productStore.products.length

  return ranges.map(range => {
    const count = productStore.products.filter(
      product => product.price >= range.min && product.price < range.max
    ).length
    
    return {
      ...range,
      count,
      percentage: totalProducts > 0 ? (count / totalProducts) * 100 : 0
    }
  })
})

// Top Selling Products
const topSellingProducts = computed(() => {
  return soldProductDetails.value
})
</script>

<style scoped>
</style>
