import { defineStore } from 'pinia';
import { useCartStore } from './cartStore';
import { useFavoriteStore } from './favoriteStore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  
  actions: {
    login(username, role = 'user') {
      const userData = { username, role };
      this.user = userData;
      
      
      sessionStorage.setItem('user', JSON.stringify(userData));
    },
    
    
    logout() {
      this.user = null;
      sessionStorage.removeItem('user');
      
      try {
        const cartStore = useCartStore();
        const favoriteStore = useFavoriteStore();
        cartStore.clearCart();
        favoriteStore.clearFavorites();
      } catch (e) {
        console.error('Logout cleanup failed:', e);
      }
    }
  }
});