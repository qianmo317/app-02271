<template>
  <div class="orders-page">
    <div class="page-banner">
      <div class="banner-content">
        <h1>我的订单</h1>
        <p>查看您的甜蜜订单记录</p>
      </div>
    </div>

    <div class="page-container">
      <div v-if="orderStore.orders.length === 0" class="empty-orders">
        <el-empty description="暂无订单" :image-size="200">
          <el-button type="primary" round @click="$router.push('/products')">
            去选购
          </el-button>
        </el-empty>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in orderStore.orders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-label">订单号：</span>
              <span class="order-id">{{ order.id }}</span>
              <span class="order-time">{{ formatTime(order.createdAt) }}</span>
            </div>
            <div class="order-status">
              <el-tag
                :type="getStatusType(order.status)"
                size="medium"
                effect="light"
                round
              >
                {{ order.statusText }}
              </el-tag>
            </div>
          </div>

          <div class="shipping-info" v-if="order.shippingInfo && order.shippingInfo.name">
            <div class="shipping-row">
              <el-icon class="shipping-icon"><Location /></el-icon>
              <div class="shipping-detail">
                <div class="shipping-contact">
                  <span class="contact-name">{{ order.shippingInfo.name }}</span>
                  <span class="contact-phone">{{ order.shippingInfo.phone }}</span>
                </div>
                <div class="shipping-address">{{ order.shippingInfo.address }}</div>
                <div class="shipping-remark" v-if="order.shippingInfo.remark">
                  备注：{{ order.shippingInfo.remark }}
                </div>
              </div>
            </div>
          </div>

          <div class="order-items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
              @click="goToProduct(item.id)"
            >
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-price">¥{{ item.price }}</p>
              </div>
              <div class="item-quantity">x{{ item.quantity }}</div>
              <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>

          <div class="order-footer">
            <div class="footer-left">
              <span class="item-count">共 {{ order.items.length }} 件商品</span>
            </div>
            <div class="footer-right">
              <span class="total-label">实付：</span>
              <span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
              <el-button
                v-if="order.status === 'pending'"
                type="danger"
                text
                size="small"
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
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Location } from '@element-plus/icons-vue'

const router = useRouter()
const orderStore = useOrderStore()

function formatTime(dateStr) {
  const date = new Date(dateStr)
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
    cancelled: 'info',
    completed: 'success',
  }
  return typeMap[status] || ''
}

function goToProduct(id) {
  router.push(`/product/${id}`)
}

function handleCancelOrder(orderId) {
  ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
    confirmButtonText: '确定取消',
    cancelButtonText: '再想想',
    type: 'warning',
  })
    .then(() => {
      const success = orderStore.cancelOrder(orderId)
      if (success) {
        ElMessage.success('订单已取消')
      }
    })
    .catch(() => {})
}
</script>

<style scoped>
.page-banner {
  margin-top: 70px;
  height: 200px;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
}

.empty-orders {
  padding: 60px 0;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.order-label {
  color: #999;
}

.order-id {
  font-weight: 500;
  color: #333;
}

.order-time {
  color: #999;
}

.order-items {
  padding: 16px 24px;
}

.shipping-info {
  padding: 16px 24px;
  background: #fff9f0;
  border-bottom: 1px solid #f5ebe0;
}

.shipping-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.shipping-icon {
  color: #d4a574;
  font-size: 18px;
  margin-top: 2px;
  flex-shrink: 0;
}

.shipping-detail {
  flex: 1;
}

.shipping-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.contact-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.contact-phone {
  font-size: 14px;
  color: #666;
}

.shipping-address {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.shipping-remark {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed #f0e0cc;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background: #fafafa;
}

.item-image {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  padding: 0 16px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 6px;
  transition: color 0.2s;
}

.order-item:hover .item-name {
  color: #d4a574;
}

.item-price {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.item-quantity {
  font-size: 14px;
  color: #666;
  margin-right: 32px;
}

.item-subtotal {
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
  min-width: 80px;
  text-align: right;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.footer-left {
  font-size: 14px;
  color: #999;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .page-banner {
    margin-top: 60px;
    height: 160px;
  }

  .banner-content h1 {
    font-size: 28px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
  }

  .order-items {
    padding: 12px 16px;
  }

  .order-item {
    flex-wrap: wrap;
  }

  .item-info {
    padding: 0 12px;
  }

  .item-quantity {
    margin-right: 0;
    order: 3;
    width: 100%;
    text-align: right;
    padding-right: 0;
  }

  .item-subtotal {
    order: 4;
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
  }

  .footer-right {
    justify-content: space-between;
  }
}
</style>
