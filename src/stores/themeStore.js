import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark');

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Run on load
  applyTheme();

  return { isDark, toggleTheme, applyTheme };
});
