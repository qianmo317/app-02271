import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const CART_STORAGE_KEY = 'sweet-bakery-cart'
const ORDERS_STORAGE_KEY = 'sweet-bakery-orders'

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadFromStorage(CART_STORAGE_KEY) || [])
  const orders = ref(loadFromStorage(ORDERS_STORAGE_KEY) || [])

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  function _persistCart() {
    saveToStorage(CART_STORAGE_KEY, items.value)
  }

  function _persistOrders() {
    saveToStorage(ORDERS_STORAGE_KEY, orders.value)
  }

  function addItem(product, quantity = 1) {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      })
    }
    _persistCart()
    ElMessage.success(`已将「${product.name}」加入购物车`)
  }

  function removeItem(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index !== -1) {
      const name = items.value[index].name
      items.value.splice(index, 1)
      _persistCart()
      ElMessage.info(`已移除「${name}」`)
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        _persistCart()
      }
    }
  }

  function clearCart() {
    items.value = []
    _persistCart()
  }

  function submitOrder(customerInfo) {
    if (items.value.length === 0) {
      ElMessage.warning('购物车为空，无法提交订单')
      return null
    }

    const order = {
      id: Date.now(),
      orderNo: `ORD${Date.now()}`,
      items: [...items.value],
      totalPrice: totalPrice.value,
      totalCount: totalCount.value,
      customerInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    orders.value.unshift(order)
    _persistOrders()
    clearCart()
    ElMessage.success('订单提交成功！')
    return order
  }

  return {
    items,
    orders,
    totalCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    submitOrder,
  }
})
