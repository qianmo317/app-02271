<template>
  <div class="orders-page">
    <div class="page-container">
      <h1 class="page-title">我的订单</h1>

      <!-- 空订单 -->
      <el-empty
        v-if="orderStore.orders.length === 0"
        description="暂无订单记录"
        :image-size="200"
      >
        <el-button type="primary" round @click="$router.push('/products')">
          去下单
        </el-button>
      </el-empty>

      <!-- 订单列表 -->
      <div v-else class="order-list">
        <div
          v-for="order in orderStore.sortedOrders"
          :key="order.orderNo"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-meta">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-time">{{ formatTime(order.createdAt) }}</span>
            </div>
            <el-tag
              :type="statusTagType(order.status)"
              size="small"
              effect="plain"
              round
            >
              {{ statusText(order.status) }}
            </el-tag>
          </div>

          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-main">
                <router-link
                  :to="`/product/${item.id}`"
                  class="item-name"
                >
                  {{ item.name }}
                </router-link>
                <div class="item-price-line">
                  <span>¥{{ item.price }}</span>
                  <span class="item-qty">× {{ item.quantity }}</span>
                </div>
              </div>
              <div class="item-subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="contact-info" v-if="order.contact">
              收货人：{{ order.contact.name }} {{ order.contact.phone }}
            </div>
            <div class="footer-right">
              <span class="total-label">
                共 {{ totalQuantity(order) }} 件，合计：
              </span>
              <span class="total-amount">¥{{ order.totalPrice.toFixed(2) }}</span>
              <el-button
                v-if="order.status === 'pending'"
                size="small"
                round
                @click="handleCancel(order)"
              >
                取消订单
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

function statusText(status) {
  const map = {
    pending: '待处理',
    paid: '已付款',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function statusTagType(status) {
  const map = {
    pending: 'warning',
    paid: 'primary',
    completed: 'success',
    cancelled: 'info',
  }
  return map[status] || ''
}

function formatTime(ts) {
  const d = new Date(ts)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

function totalQuantity(order) {
  return order.items.reduce((sum, it) => sum + it.quantity, 0)
}

async function handleCancel(order) {
  try {
    await ElMessageBox.confirm(
      `确定要取消订单 ${order.orderNo} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        type: 'warning',
      }
    )
    orderStore.cancelOrder(order.orderNo)
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.orders-page {
  background: #fafafa;
  min-height: calc(100vh - 140px);
  padding-top: 70px;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px 60px;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.order-no {
  color: #666;
  font-weight: 500;
}

.order-items {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-image {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-name {
  display: block;
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s;
}

.item-name:hover {
  color: #d4a574;
}

.item-price-line {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 8px;
}

.item-subtotal {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 12px;
}

.contact-info {
  font-size: 13px;
  color: #999;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 13px;
  color: #666;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .order-card {
    padding: 16px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
