import { defineStore } from 'pinia'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: JSON.parse(localStorage.getItem('sales')) || []
  }),
  
  getters: {
    totalSales: (state) => {
      return state.sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
      }, 0)
    },
    totalRevenue: (state) => {
      return state.sales.reduce((sum, sale) => sum + sale.totalPrice, 0)
    },
    monthlySales: (state) => {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      return state.sales.filter(sale => {
        const saleDate = new Date(sale.date)
        return saleDate.getMonth() === currentMonth && 
               saleDate.getFullYear() === currentYear
      })
    },
    topSellingProducts: (state) => {
      const productMap = {}
      
      state.sales.forEach(sale => {
        sale.items.forEach(item => {
          if (!productMap[item.id]) {
            productMap[item.id] = {
              id: item.id,
              title: item.title,
              totalSold: 0,
              totalRevenue: 0,
              price: Number(item.price) || 0
            }
          }
          productMap[item.id].totalSold += item.quantity
          productMap[item.id].totalRevenue += (Number(item.price) || 0) * item.quantity
        })
      })
      
      return Object.values(productMap)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10)
    }
  },
  
  actions: {
    recordSale(items) {
      const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.discountedPrice || item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail,
          totalPrice: (item.discountedPrice || item.price) * item.quantity
        })),
        totalPrice: items.reduce((sum, item) => {
          return sum + ((item.discountedPrice || item.price) * item.quantity)
        }, 0)
      }
      
      this.sales.push(sale)
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      localStorage.setItem('sales', JSON.stringify(this.sales))
    },
    
    clearSales() {
      this.sales = []
      this.saveToLocalStorage()
    }
  }
})
