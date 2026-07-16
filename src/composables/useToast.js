import { ref } from 'vue'

const toasts = ref([])

export const useToast = () => {
  const addToast = (message, type = 'success', duration = 2800) => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  
  return {
    toasts,
    addToast,
    removeToast
  }
}