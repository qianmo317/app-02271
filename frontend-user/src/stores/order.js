import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'sweet-bakery-orders'

// 从 localStorage 读取订单数据
function loadOrdersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// 生成订单号：时间戳 + 随机数
function generateOrderNo() {
  const ts = Date.now()
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `SB${ts}${rand}`
}

export const useOrderStore = defineStore('order', () => {
  // 订单列表
  const orders = ref(loadOrdersFromStorage())

  // 订单总数
  const orderCount = computed(() => orders.value.length)

  // 按时间倒序排列的订单
  const sortedOrders = computed(() =>
    [...orders.value].sort((a, b) => b.createdAt - a.createdAt)
  )

  // 持久化
  watch(
    orders,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        // 忽略
      }
    },
    { deep: true }
  )

  // 创建订单
  function createOrder({ items, totalPrice, contact }) {
    if (!Array.isArray(items) || items.length === 0) {
      ElMessage.warning('购物车为空，无法提交订单')
      return null
    }
    const order = {
      orderNo: generateOrderNo(),
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        image: it.image,
        quantity: it.quantity,
      })),
      totalPrice,
      contact: contact || null,
      status: 'pending', // pending / paid / completed / cancelled
      createdAt: Date.now(),
    }
    orders.value.push(order)
    ElMessage.success('订单提交成功')
    return order
  }

  // 根据订单号获取订单
  function getOrderByNo(orderNo) {
    return orders.value.find((o) => o.orderNo === orderNo) || null
  }

  // 取消订单（仅允许取消待处理状态的订单）
  function cancelOrder(orderNo) {
    const order = orders.value.find((o) => o.orderNo === orderNo)
    if (!order) {
      ElMessage.warning('订单不存在')
      return false
    }
    if (order.status !== 'pending') {
      ElMessage.warning('当前订单状态不可取消')
      return false
    }
    order.status = 'cancelled'
    ElMessage.success('订单已取消')
    return true
  }

  // 清空所有订单
  function clearOrders() {
    orders.value = []
  }

  return {
    orders,
    orderCount,
    sortedOrders,
    createOrder,
    getOrderByNo,
    cancelOrder,
    clearOrders,
  }
})
