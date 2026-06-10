import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const CART_STORAGE_KEY = 'sweet_cart'

function loadCartFromStorage() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    console.error('保存购物车数据失败')
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCartFromStorage())

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const totalOriginalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  })

  const savedAmount = computed(() => {
    return totalOriginalPrice.value - totalPrice.value
  })

  watch(
    items,
    (newItems) => {
      saveCartToStorage(newItems)
    },
    { deep: true }
  )

  function addToCart(product, quantity = 1) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        quantity,
        selected: true,
      })
    }
    ElMessage.success(`已添加 ${product.name} 到购物车`)
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
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

  function toggleSelect(productId) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      item.selected = !item.selected
    }
  }

  function toggleSelectAll(selected) {
    items.value.forEach((item) => {
      item.selected = selected
    })
  }

  const allSelected = computed(() => {
    if (items.value.length === 0) return false
    return items.value.every((item) => item.selected)
  })

  const selectedItems = computed(() => {
    return items.value.filter((item) => item.selected)
  })

  const selectedCount = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const selectedTotalPrice = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  function clearCart() {
    items.value = []
  }

  function removeSelected() {
    items.value = items.value.filter((item) => !item.selected)
  }

  return {
    items,
    totalCount,
    totalPrice,
    totalOriginalPrice,
    savedAmount,
    allSelected,
    selectedItems,
    selectedCount,
    selectedTotalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    clearCart,
    removeSelected,
  }
})
