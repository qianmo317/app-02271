import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const ORDER_STORAGE_KEY = 'sweet_orders'

function loadOrdersFromStorage() {
  try {
    const data = localStorage.getItem(ORDER_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveOrdersToStorage(orders) {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    console.error('保存订单数据失败')
  }
}

function generateOrderId() {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `DD${timestamp}${random}`
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref(loadOrdersFromStorage())

  const orderCount = computed(() => orders.value.length)

  const pendingOrders = computed(() => {
    return orders.value.filter((o) => o.status === 'pending')
  })

  watch(
    orders,
    (newOrders) => {
      saveOrdersToStorage(newOrders)
    },
    { deep: true }
  )

  function createOrder(items, totalPrice, shippingInfo = {}) {
    const order = {
      id: generateOrderId(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        quantity: item.quantity,
      })),
      totalPrice,
      status: 'pending',
      statusText: '待配送',
      createdAt: new Date().toISOString(),
      shippingInfo: {
        name: shippingInfo.name || '',
        phone: shippingInfo.phone || '',
        address: shippingInfo.address || '',
        remark: shippingInfo.remark || '',
      },
    }
    orders.value.unshift(order)
    ElMessage.success('订单提交成功！')
    return order
  }

  function getOrderById(orderId) {
    return orders.value.find((o) => o.id === orderId)
  }

  function cancelOrder(orderId) {
    const order = orders.value.find((o) => o.id === orderId)
    if (order && order.status === 'pending') {
      order.status = 'cancelled'
      order.statusText = '已取消'
      ElMessage.success('订单已取消')
      return true
    }
    return false
  }

  function clearOrders() {
    orders.value = []
  }

  return {
    orders,
    orderCount,
    pendingOrders,
    createOrder,
    getOrderById,
    cancelOrder,
    clearOrders,
  }
})
