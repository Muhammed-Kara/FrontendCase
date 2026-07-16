import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: JSON.parse(sessionStorage.getItem('favorites')) || []
  }),
  
  getters: {
    favoriteItems: (state) => state.favorites,
    
    totalFavorites: (state) => state.favorites.length,

    isFavorite: (state) => (id) => {
      return state.favorites.some(item => String(item.id) === String(id));
    }
  },
  
  actions: {
    toggleFavorite(product) {
      const index = this.favorites.findIndex(item => String(item.id) === String(product.id));
      
      if (index === -1) {
        this.favorites.push(product);
      } else {
        this.favorites.splice(index, 1);
      }
      
      // Değişikliği SessionStorage'a kaydet
      sessionStorage.setItem('favorites', JSON.stringify(this.favorites));
    },

    removeFavorite(productId) {
      this.favorites = this.favorites.filter(item => String(item.id) !== String(productId));
      sessionStorage.setItem('favorites', JSON.stringify(this.favorites));
    },

    clearFavorites() {
      this.favorites = [];
      sessionStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
  }
});