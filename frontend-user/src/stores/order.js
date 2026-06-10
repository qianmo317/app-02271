import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const ORDER_STORAGE_KEY = 'sweet-bakery-orders'

export const useOrderStore = defineStore('order', () => {
  const orders = ref(loadOrdersFromStorage())

  const sortedOrders = computed(() => {
    return [...orders.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  })

  function loadOrdersFromStorage() {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveOrdersToStorage() {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders.value))
  }

  watch(orders, saveOrdersToStorage, { deep: true })

  function generateOrderId() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    return `ORD${year}${month}${day}${random}`
  }

  function createOrder(cartItems, totalPrice, orderInfo = {}) {
    if (!cartItems || cartItems.length === 0) {
      ElMessage.error('购物车为空，无法下单')
      return null
    }

    const newOrder = {
      id: generateOrderId(),
      items: JSON.parse(JSON.stringify(cartItems)),
      totalPrice: totalPrice,
      status: 'pending',
      statusText: '待确认',
      createdAt: new Date().toISOString(),
      contactName: orderInfo.contactName || '',
      contactPhone: orderInfo.contactPhone || '',
      remark: orderInfo.remark || '',
    }

    orders.value.push(newOrder)
    ElMessage.success('订单提交成功！')
    return newOrder
  }

  function getOrderById(orderId) {
    return orders.value.find((order) => order.id === orderId)
  }

  function cancelOrder(orderId) {
    const order = orders.value.find((order) => order.id === orderId)
    if (order && order.status === 'pending') {
      order.status = 'cancelled'
      order.statusText = '已取消'
      ElMessage.info('订单已取消')
    }
  }

  return {
    orders,
    sortedOrders,
    createOrder,
    getOrderById,
    cancelOrder,
  }
})
