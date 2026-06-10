<template>
  <div class="orders-page">
    <div class="page-banner">
      <div class="banner-content">
        <h1>我的订单</h1>
        <p>查看您的订单记录</p>
      </div>
    </div>

    <div class="page-container">
      <template v-if="cartStore.orders.length > 0">
        <div class="order-list">
          <div class="order-card" v-for="order in cartStore.orders" :key="order.id">
            <div class="order-header">
              <div class="order-info">
                <span class="order-no">订单号：{{ order.orderNo }}</span>
                <span class="order-time">{{ formatTime(order.createdAt) }}</span>
              </div>
              <el-tag :type="statusTagType(order.status)" effect="dark" round>
                {{ statusText(order.status) }}
              </el-tag>
            </div>

            <div class="order-items">
              <div class="order-item" v-for="item in order.items" :key="item.id">
                <img :src="item.image" :alt="item.name" class="item-image" />
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">¥{{ item.price }} × {{ item.quantity }}</span>
                </div>
                <span class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-customer" v-if="order.customerInfo">
                <span>{{ order.customerInfo.name }}</span>
                <span>{{ order.customerInfo.phone }}</span>
                <span>{{ order.customerInfo.address }}</span>
              </div>
              <div class="order-total">
                共 {{ order.totalCount }} 件商品，合计：
                <span class="total-amount">¥{{ order.totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <el-empty
        v-else
        description="暂无订单记录"
        :image-size="200"
      >
        <el-button type="primary" round @click="$router.push('/products')">
          去选购
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

function formatTime(isoString) {
  const d = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function statusText(status) {
  const map = {
    pending: '待处理',
    processing: '制作中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function statusTagType(status) {
  const map = {
    pending: 'warning',
    processing: '',
    delivering: '',
    completed: 'success',
    cancelled: 'info',
  }
  return map[status] || ''
}
</script>

<style scoped>
.page-banner {
  margin-top: 70px;
  height: 240px;
  background: linear-gradient(135deg, #d4a574 0%, #b8825a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: #fff;
}

.banner-content h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #faf8f5;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-no {
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
  padding: 10px 0;
  border-bottom: 1px solid #f9f9f9;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
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
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.order-customer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #999;
}

.order-total {
  font-size: 14px;
  color: #666;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .page-banner {
    margin-top: 60px;
    height: 180px;
  }

  .banner-content h1 {
    font-size: 28px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
