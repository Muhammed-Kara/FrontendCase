import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getDiscountedPrice as calculateDiscountedPrice, hasDiscount as hasProductDiscount, getDiscountLabel as getProductDiscountLabel } from '../utils/discount'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref(JSON.parse(sessionStorage.getItem('cartItems')) || [])

  const activeDiscountCode = ref(sessionStorage.getItem('activeDiscountCode') || null)
  const activeDiscountPercentage = ref(Number(sessionStorage.getItem('activeDiscountPercentage')) || 0)
  const activeDiscountAmount = ref(Number(sessionStorage.getItem('activeDiscountAmount')) || 0)

  watch(cartItems, (items) => {
    sessionStorage.setItem('cartItems', JSON.stringify(items))
  }, { deep: true })

  watch(() => ({
    code: activeDiscountCode.value,
    percent: activeDiscountPercentage.value,
    amount: activeDiscountAmount.value
  }), (newVal) => {
    if (newVal.code) {
      sessionStorage.setItem('activeDiscountCode', newVal.code)
      sessionStorage.setItem('activeDiscountPercentage', String(newVal.percent))
      sessionStorage.setItem('activeDiscountAmount', String(newVal.amount))
    } else {
      sessionStorage.removeItem('activeDiscountCode')
      sessionStorage.removeItem('activeDiscountPercentage')
      sessionStorage.removeItem('activeDiscountAmount')
    }
  }, { deep: true })

  const getDiscountedPrice = (product) => calculateDiscountedPrice(product)

  const hasDiscount = (product) => hasProductDiscount(product)

  const discountLabel = (product) => {
    const label = getProductDiscountLabel(product)
    return label ? `Sepette ${label.toLowerCase()}` : null
  }

  // Sepete ürün ekle
  const addToCart = (product, quantityToAdd = 1) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      const maxStock = existingItem.stock || product.stock || Infinity
      existingItem.quantity = Math.min(existingItem.quantity + quantityToAdd, maxStock)
    } else {
      cartItems.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: hasDiscount(product) ? getDiscountedPrice(product).toFixed(2) : product.price,
        thumbnail: product.thumbnail,
        seller: product.brand || 'Trendyol',
        selected: true,
        quantity: quantityToAdd,
        originalPrice: hasDiscount(product) ? product.price : null,
        deliveryEstimate: 'Bugün',
        deliveryDay: 'Yarın',
        soldCount: Math.floor(Math.random() * 500) + 50,
        promo: hasDiscount(product) ? discountLabel(product) : null,
        rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
        stock: product.stock || 50
      })
    }
  }

  // Sepetten ürün sil
  const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }

  // Ürün miktarını güncelle
  const updateQuantity = (id, quantity) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item && quantity > 0) {
      item.quantity = Math.min(quantity, item.stock || Infinity)
    }
  }

  // Ürün seçimini toggle et
  const toggleSelected = (id) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
    }
  }

  // Satıcı seçimini toggle et
  const toggleSeller = (seller) => {
    const sellerItems = cartItems.value.filter(item => item.seller === seller)
    const allSelected = sellerItems.every(item => item.selected)
    
    sellerItems.forEach(item => {
      item.selected = !allSelected
    })
  }

  // Sepeti temizle
  const clearCart = () => {
    cartItems.value = []
    removeDiscount()
  }

  const clearSelectedItems = () => {
    cartItems.value = cartItems.value.filter(item => !item.selected)
  }

  // Satıcıya göre gruplandırılmış ürünler
  const itemsBySeller = computed(() => {
    const groups = {}
    
    cartItems.value.forEach(item => {
      if (!groups[item.seller]) {
        groups[item.seller] = {
          seller: item.seller,
          rating: item.rating,
          items: [],
          allSelected: false
        }
      }
      groups[item.seller].items.push(item)
    })

    // Her grup için allSelected hesapla
    Object.values(groups).forEach(group => {
      group.allSelected = group.items.every(item => item.selected)
    })

    return Object.values(groups)
  })

  // Seçili ürünler
  const selectedItems = computed(() => {
    return cartItems.value.filter(item => item.selected !== false)
  })

  // Ara toplam
  const subtotal = computed(() => {
    return selectedItems.value.reduce((total, item) => {
      const price = item.discountedPrice || item.price
      return total + (parseFloat(price) * item.quantity)
    }, 0)
  })

  // Toplam tasarruf
  const totalSavings = computed(() => {
    return selectedItems.value.reduce((total, item) => {
      if (item.originalPrice && item.discountedPrice) {
        return total + ((item.originalPrice - parseFloat(item.discountedPrice)) * item.quantity)
      }
      return total
    }, 0)
  })

  // Kargo indirimi
  const shippingDiscount = computed(() => {
    return subtotal.value > 500 ? 29.99 : 0
  })

  // Toplam fiyat
  const totalPrice = computed(() => {
    let price = subtotal.value
    if (activeDiscountPercentage.value > 0) {
      price = price * (1 - activeDiscountPercentage.value / 100)
    }
    if (activeDiscountAmount.value > 0) {
      price = Math.max(0, price - activeDiscountAmount.value)
    }
    return price
  })

  // En hızlı teslimat
  const fastestDelivery = computed(() => {
    if (selectedItems.value.length === 0) return 'Bugün'
    return '2 saat'
  })

  // Toplam ürün sayısı
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const applyDiscountCode = (code) => {
    if (!code) return { success: false, message: 'Lütfen bir kupon kodu girin.' }
    
    const formattedCode = code.trim().toUpperCase()
    
    // Read dynamic coupons from localStorage
    const coupons = {}
    try {
      const stored = localStorage.getItem('wheel_segments')
      if (stored) {
        const list = JSON.parse(stored)
        list.forEach(item => {
          coupons[item.code.toUpperCase()] = {
            percentage: item.percentage || 0,
            amount: item.amount || 0,
            label: item.label
          }
        })
      }
    } catch (e) {
      console.error('Kupon yüklenirken hata oluştu:', e)
    }
    
    if (formattedCode in coupons) {
      const coupon = coupons[formattedCode]
      activeDiscountCode.value = formattedCode
      activeDiscountPercentage.value = coupon.percentage
      activeDiscountAmount.value = coupon.amount
      return { 
        success: true, 
        message: `"${formattedCode}" kuponu uygulandı: ${coupon.label}` 
      }
    }
    
    return { success: false, message: 'Geçersiz veya süresi dolmuş kupon kodu.' }
  }

  const removeDiscount = () => {
    activeDiscountCode.value = null
    activeDiscountPercentage.value = 0
    activeDiscountAmount.value = 0
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleSelected,
    toggleSeller,
    clearCart,
    clearSelectedItems,
    itemsBySeller,
    selectedItems,
    subtotal,
    totalSavings,
    shippingDiscount,
    totalPrice,
    fastestDelivery,
    totalItems,
    activeDiscountCode,
    activeDiscountPercentage,
    activeDiscountAmount,
    applyDiscountCode,
    removeDiscount
  }
})
