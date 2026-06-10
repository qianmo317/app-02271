import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const CART_STORAGE_KEY = 'sweet-bakery-cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCartFromStorage())

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  function loadCartFromStorage() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveCartToStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
  }

  watch(items, saveCartToStorage, { deep: true })

  function addToCart(product, quantity = 1) {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
      ElMessage.success(`已将 ${product.name} 数量增加到 ${existingItem.quantity}`)
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
      ElMessage.success(`已将 ${product.name} 加入购物车`)
    }
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      const item = items.value[index]
      items.value.splice(index, 1)
      ElMessage.info(`已将 ${item.name} 从购物车移除`)
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  function isInCart(productId) {
    return items.value.some((item) => item.id === productId)
  }

  function getItemQuantity(productId) {
    const item = items.value.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  return {
    items,
    totalCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }
})
