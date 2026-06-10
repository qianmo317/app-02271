<template>
  <div class="orders-page">
    <div class="page-container">
      <h1 class="page-title">我的订单</h1>

      <div v-if="orderStore.sortedOrders.length === 0" class="empty-orders">
        <el-empty description="暂无订单记录">
          <el-button type="primary" round @click="$router.push('/products')">
            去选购
          </el-button>
        </el-empty>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in orderStore.sortedOrders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-time">{{ formatTime(order.createdAt) }}</span>
            </div>
            <el-tag :type="getStatusType(order.status)" size="large">
              {{ order.statusText }}
            </el-tag>
          </div>

          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <div class="item-image" @click="$router.push(`/product/${item.id}`)">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-price">¥{{ item.price }} × {{ item.quantity }}</p>
              </div>
              <div class="item-subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-contact" v-if="order.contactName || order.contactPhone">
              <span v-if="order.contactName">联系人：{{ order.contactName }}</span>
              <span v-if="order.contactPhone">电话：{{ order.contactPhone }}</span>
            </div>
            <div class="order-remark" v-if="order.remark">
              备注：{{ order.remark }}
            </div>
            <div class="order-total">
              <span>共 {{ getTotalCount(order.items) }} 件商品，合计：</span>
              <span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="order-actions" v-if="order.status === 'pending'">
              <el-button
                type="danger"
                text
                @click="handleCancelOrder(order.id)"
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
import { useOrderStore } from '@/stores/order'
import { ElMessageBox } from 'element-plus'

const orderStore = useOrderStore()

function formatTime(isoString) {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function getStatusType(status) {
  const typeMap = {
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'info',
  }
  return typeMap[status] || ''
}

function getTotalCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function handleCancelOrder(orderId) {
  ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
    confirmButtonText: '确定取消',
    cancelButtonText: '我再想想',
    type: 'warning',
  })
    .then(() => {
      orderStore.cancelOrder(orderId)
    })
    .catch(() => {})
}
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #faf7f2;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 90px 24px 60px;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
}

.empty-orders {
  background: #fff;
  border-radius: 16px;
  padding: 60px 24px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #fcfaf7;
  border-bottom: 1px solid #f0ebe4;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.order-time {
  font-size: 13px;
  color: #999;
}

.order-items {
  padding: 16px 24px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f8f8f8;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.item-price {
  font-size: 13px;
  color: #999;
}

.item-subtotal {
  font-size: 15px;
  font-weight: 600;
  color: #e74c3c;
}

.order-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0ebe4;
}

.order-contact {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.order-remark {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f8f8f8;
}
</style>
