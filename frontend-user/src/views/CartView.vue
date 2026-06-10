<template>
  <div class="cart-page">
    <div class="page-container">
      <h1 class="page-title">购物车</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <el-empty description="购物车空空如也，快去挑选美味甜品吧~">
          <el-button type="primary" round @click="$router.push('/products')">
            去选购
          </el-button>
        </el-empty>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-image" @click="goToProduct(item.id)">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="item-info">
              <h3 class="item-name" @click="goToProduct(item.id)">{{ item.name }}</h3>
              <p class="item-price">¥{{ item.price }}</p>
            </div>
            <div class="item-quantity">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="99"
                size="small"
                controls-position="right"
                @change="(val) => handleQuantityChange(item.id, val)"
              />
            </div>
            <div class="item-subtotal">
              <span class="subtotal-label">小计</span>
              <span class="subtotal-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="item-actions">
              <el-button
                type="danger"
                text
                @click="cartStore.removeFromCart(item.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h3 class="summary-title">订单摘要</h3>
          <div class="summary-row">
            <span>商品数量</span>
            <span>{{ cartStore.totalCount }} 件</span>
          </div>
          <div class="summary-row total">
            <span>合计</span>
            <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <el-divider />
          <el-form :model="orderForm" label-position="top">
            <el-form-item label="联系人">
              <el-input v-model="orderForm.contactName" placeholder="请输入您的姓名" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="orderForm.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="orderForm.remark"
                type="textarea"
                :rows="2"
                placeholder="如有特殊要求请备注"
              />
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            size="large"
            round
            class="checkout-btn"
            @click="handleCheckout"
          >
            提交订单
          </el-button>
          <el-button
            size="large"
            round
            class="clear-btn"
            @click="handleClearCart"
          >
            清空购物车
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const orderForm = ref({
  contactName: '',
  contactPhone: '',
  remark: '',
})

function goToProduct(id) {
  router.push(`/product/${id}`)
}

function handleQuantityChange(productId, val) {
  cartStore.updateQuantity(productId, val)
}

function handleClearCart() {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.clearCart()
    })
    .catch(() => {})
}

function handleCheckout() {
  if (!orderForm.value.contactName.trim()) {
    ElMessage.warning('请输入联系人姓名')
    return
  }
  if (!orderForm.value.contactPhone.trim()) {
    ElMessage.warning('请输入联系电话')
    return
  }

  ElMessageBox.confirm(
    `确认提交订单？合计金额 ¥${cartStore.totalPrice.toFixed(2)}`,
    '确认订单',
    {
      confirmButtonText: '确认提交',
      cancelButtonText: '再想想',
      type: 'info',
    }
  )
    .then(() => {
      const order = orderStore.createOrder(
        cartStore.items,
        cartStore.totalPrice,
        orderForm.value
      )
      if (order) {
        cartStore.clearCart()
        router.push('/orders')
      }
    })
    .catch(() => {})
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #faf7f2;
}

.page-container {
  max-width: 1200px;
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

.empty-cart {
  background: #fff;
  border-radius: 16px;
  padding: 60px 24px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.cart-items {
  background: #fff;
  border-radius: 16px;
  padding: 8px 24px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 140px 120px 80px;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  cursor: pointer;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.item-name:hover {
  color: #d4a574;
}

.item-price {
  font-size: 15px;
  color: #e74c3c;
  font-weight: 600;
}

.item-subtotal {
  text-align: right;
}

.subtotal-label {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 4px;
}

.subtotal-price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.item-actions {
  text-align: center;
}

.cart-summary {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  position: sticky;
  top: 90px;
  height: fit-content;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.summary-row.total {
  margin-top: 8px;
  margin-bottom: 0;
}

.summary-row.total span:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.total-price {
  font-size: 24px !important;
  font-weight: 700;
  color: #e74c3c !important;
}

.checkout-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  background: #d4a574;
  border-color: #d4a574;
  margin-bottom: 12px;
}

.checkout-btn:hover {
  background: #c49664;
  border-color: #c49664;
}

.clear-btn {
  width: 100%;
  height: 44px;
  font-size: 14px;
  color: #999;
  border-color: #ddd;
}

.clear-btn:hover {
  color: #e74c3c;
  border-color: #e74c3c;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 80px 1fr auto;
    grid-template-areas:
      'image info actions'
      'image quantity subtotal';
    gap: 12px;
  }

  .item-image {
    grid-area: image;
    width: 80px;
    height: 80px;
  }

  .item-info {
    grid-area: info;
  }

  .item-quantity {
    grid-area: quantity;
  }

  .item-subtotal {
    grid-area: subtotal;
    text-align: left;
  }

  .item-actions {
    grid-area: actions;
    text-align: right;
  }
}
</style>
