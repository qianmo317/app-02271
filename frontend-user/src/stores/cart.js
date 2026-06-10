import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'sweet-bakery-cart'

// 从 localStorage 读取初始数据
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  // 购物车商品列表
  const items = ref(loadCartFromStorage())

  // 商品总数（所有商品数量之和）
  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // 商品种类数
  const itemCount = computed(() => items.value.length)

  // 总价
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // 持久化：监听 items 变化写入 localStorage
  watch(
    items,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        // 忽略写入失败（如配额满）
      }
    },
    { deep: true }
  )

  // 添加商品到购物车
  function addToCart(product, quantity = 1) {
    if (!product || !product.id) return
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
    ElMessage.success(`已添加到购物车：${product.name}`)
  }

  // 修改数量（直接设置）
  function updateQuantity(id, quantity) {
    const item = items.value.find((it) => it.id === id)
    if (!item) return
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    item.quantity = quantity
  }

  // 数量加减
  function increaseQuantity(id) {
    const item = items.value.find((it) => it.id === id)
    if (item) item.quantity += 1
  }

  function decreaseQuantity(id) {
    const item = items.value.find((it) => it.id === id)
    if (!item) return
    if (item.quantity <= 1) {
      removeItem(id)
    } else {
      item.quantity -= 1
    }
  }

  // 移除商品
  function removeItem(id) {
    const idx = items.value.findIndex((it) => it.id === id)
    if (idx > -1) {
      items.value.splice(idx, 1)
    }
  }

  // 清空购物车
  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalCount,
    itemCount,
    totalPrice,
    addToCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  }
})
