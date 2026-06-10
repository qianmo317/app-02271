<template>
  <div class="cart-page">
    <div class="page-banner">
      <div class="banner-content">
        <h1>购物车</h1>
        <p>精选甜品，甜蜜带回家</p>
      </div>
    </div>

    <div class="page-container">
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <el-empty description="购物车空空如亦" :image-size="200">
          <el-button type="primary" round @click="$router.push('/products')">
            去逛逛
          </el-button>
        </el-empty>
      </div>

      <div v-else class="cart-content">
        <div class="cart-header">
          <el-checkbox
            :model-value="cartStore.allSelected"
            @change="cartStore.toggleSelectAll"
          >
            全选
          </el-checkbox>
          <span class="header-info">商品信息</span>
          <span class="header-price">单价</span>
          <span class="header-quantity">数量</span>
          <span class="header-subtotal">小计</span>
          <span class="header-action">操作</span>
        </div>

        <div class="cart-list">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-checkbox">
              <el-checkbox
                :model-value="item.selected"
                @change="cartStore.toggleSelect(item.id)"
              />
            </div>

            <div class="item-image" @click="goToDetail(item.id)">
              <img :src="item.image" :alt="item.name" />
            </div>

            <div class="item-info" @click="goToDetail(item.id)">
              <h3 class="item-name">{{ item.name }}</h3>
            </div>

            <div class="item-price">
              <span class="current-price">¥{{ item.price }}</span>
              <span
                class="original-price"
                v-if="item.originalPrice > item.price"
              >
                ¥{{ item.originalPrice }}
              </span>
            </div>

            <div class="item-quantity">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="(val) => cartStore.updateQuantity(item.id, val)"
              />
            </div>

            <div class="item-subtotal">
              <span class="subtotal-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>

            <div class="item-action">
              <el-button
                type="danger"
                text
                size="small"
                @click="handleRemove(item.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="footer-left">
            <el-checkbox
              :model-value="cartStore.allSelected"
              @change="cartStore.toggleSelectAll"
            >
              全选
            </el-checkbox>
            <el-button type="danger" text @click="handleRemoveSelected">
              删除选中
            </el-button>
            <el-button type="danger" text @click="handleClearCart">
              清空购物车
            </el-button>
          </div>

          <div class="footer-right">
            <div class="price-summary">
              <div class="summary-row">
                <span class="summary-label">已选 {{ cartStore.selectedCount }} 件商品</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label">合计：</span>
                <span class="summary-total">¥{{ cartStore.selectedTotalPrice.toFixed(2) }}</span>
              </div>
              <div class="summary-row" v-if="cartStore.savedAmount > 0">
                <span class="summary-label">已优惠：</span>
                <span class="summary-saved">¥{{ cartStore.savedAmount.toFixed(2) }}</span>
              </div>
            </div>

            <el-button
              type="primary"
              size="large"
              class="checkout-btn"
              :disabled="cartStore.selectedCount === 0"
              @click="openCheckoutDialog"
            >
              去结算
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showCheckoutDialog"
      title="确认订单"
      width="560px"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="shippingForm"
        :rules="formRules"
        label-width="80px"
        class="shipping-form"
      >
        <el-form-item label="收货人" prop="name">
          <el-input
            v-model="shippingForm.name"
            placeholder="请输入收货人姓名"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="shippingForm.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="shippingForm.address"
            type="textarea"
            :rows="3"
            placeholder="请输入详细收货地址"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="shippingForm.remark"
            type="textarea"
            :rows="2"
            placeholder="选填，如有特殊要求请备注"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div class="order-summary">
        <div class="summary-title">订单商品</div>
        <div class="summary-items">
          <div
            v-for="item in cartStore.selectedItems"
            :key="item.id"
            class="summary-item"
          >
            <img :src="item.image" :alt="item.name" />
            <div class="item-detail">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
            <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="summary-total">
          <span>共 {{ cartStore.selectedCount }} 件商品</span>
          <span class="total-price">
            合计：<em>¥{{ cartStore.selectedTotalPrice.toFixed(2) }}</em>
          </span>
        </div>
      </div>

      <template #footer>
        <el-button @click="showCheckoutDialog = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showOrderSuccess"
      title="订单提交成功"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="order-success-content">
        <el-icon :size="64" color="#67c23a"><CircleCheck /></el-icon>
        <p class="success-text">您的订单已提交成功！</p>
        <p class="order-no">订单号：{{ lastOrderId }}</p>
        <p class="order-amount">订单金额：¥{{ lastOrderAmount }}</p>
      </div>
      <template #footer>
        <el-button @click="showOrderSuccess = false; $router.push('/products')">
          继续购物
        </el-button>
        <el-button type="primary" @click="showOrderSuccess = false; $router.push('/orders')">
          查看订单
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const showCheckoutDialog = ref(false)
const showOrderSuccess = ref(false)
const lastOrderId = ref('')
const lastOrderAmount = ref('')
const formRef = ref(null)

const shippingForm = reactive({
  name: '',
  phone: '',
  address: '',
  remark: '',
})

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号码'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

const formRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入收货地址', trigger: 'blur' },
    { min: 5, max: 200, message: '地址长度在 5 到 200 个字符', trigger: 'blur' },
  ],
}

function goToDetail(id) {
  router.push(`/product/${id}`)
}

function handleRemove(productId) {
  ElMessageBox.confirm('确定要删除这件商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.removeFromCart(productId)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function handleRemoveSelected() {
  if (cartStore.selectedCount === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  ElMessageBox.confirm('确定要删除选中的商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.removeSelected()
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function handleClearCart() {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.clearCart()
      ElMessage.success('购物车已清空')
    })
    .catch(() => {})
}

function openCheckoutDialog() {
  if (cartStore.selectedCount === 0) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }
  showCheckoutDialog.value = true
}

function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

function submitOrder() {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (valid) {
      const selectedItems = cartStore.selectedItems
      const totalPrice = cartStore.selectedTotalPrice

      const order = orderStore.createOrder(selectedItems, totalPrice, {
        name: shippingForm.name,
        phone: shippingForm.phone,
        address: shippingForm.address,
        remark: shippingForm.remark,
      })

      if (order) {
        lastOrderId.value = order.id
        lastOrderAmount.value = totalPrice.toFixed(2)
        cartStore.removeSelected()
        showCheckoutDialog.value = false
        showOrderSuccess.value = true
      }
    }
  })
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.empty-cart {
  padding: 60px 0;
}

.cart-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.cart-header {
  display: grid;
  grid-template-columns: 60px 120px 1fr 120px 140px 120px 80px;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.header-info {
  grid-column: 3;
  padding-left: 12px;
}

.header-price,
.header-quantity,
.header-subtotal,
.header-action {
  text-align: center;
}

.cart-list {
  max-height: 500px;
  overflow-y: auto;
}

.cart-item {
  display: grid;
  grid-template-columns: 60px 120px 1fr 120px 140px 120px 80px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s;
}

.cart-item:hover {
  background: #fafafa;
}

.item-checkbox {
  display: flex;
  justify-content: center;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.cart-item:hover .item-image img {
  transform: scale(1.05);
}

.item-info {
  padding-left: 12px;
  cursor: pointer;
}

.item-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px;
  transition: color 0.2s;
}

.cart-item:hover .item-name {
  color: #d4a574;
}

.item-price {
  text-align: center;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
}

.original-price {
  display: block;
  font-size: 13px;
  color: #ccc;
  text-decoration: line-through;
  margin-top: 2px;
}

.item-quantity {
  display: flex;
  justify-content: center;
}

.item-subtotal {
  text-align: center;
}

.subtotal-price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.item-action {
  text-align: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.price-summary {
  text-align: right;
}

.summary-row {
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.summary-row.total-row {
  margin-bottom: 4px;
}

.summary-label {
  margin-right: 8px;
}

.summary-total {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
}

.summary-saved {
  font-size: 14px;
  color: #67c23a;
  font-weight: 500;
}

.checkout-btn {
  width: 140px;
  height: 48px;
  font-size: 16px;
  background: #d4a574;
  border-color: #d4a574;
  border-radius: 24px;
}

.checkout-btn:hover {
  background: #c49664;
  border-color: #c49664;
}

.checkout-btn:disabled {
  background: #ddd;
  border-color: #ddd;
  cursor: not-allowed;
}

.order-success-content {
  text-align: center;
  padding: 20px 0;
}

.success-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px;
}

.order-no,
.order-amount {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}

.order-amount {
  color: #e74c3c;
  font-weight: 600;
}

.shipping-form {
  margin-bottom: 20px;
}

.order-summary {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.summary-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.summary-items {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
}

.item-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-detail .item-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-detail .item-qty {
  font-size: 12px;
  color: #999;
}

.summary-item .item-price {
  font-size: 15px;
  font-weight: 600;
  color: #e74c3c;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
}

.summary-total .total-price em {
  font-style: normal;
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

  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 40px 80px 1fr 80px;
    grid-template-rows: auto auto;
    gap: 8px;
    padding: 16px;
  }

  .item-checkbox {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .item-image {
    grid-column: 2;
    grid-row: 1 / span 2;
    width: 70px;
    height: 70px;
  }

  .item-info {
    grid-column: 3 / span 2;
    grid-row: 1;
    padding-left: 0;
  }

  .item-price {
    grid-column: 3;
    grid-row: 2;
    text-align: left;
  }

  .item-quantity {
    grid-column: 4;
    grid-row: 2;
    justify-content: flex-end;
  }

  .item-subtotal,
  .item-action {
    display: none;
  }

  .cart-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .footer-left {
    justify-content: space-between;
  }

  .footer-right {
    justify-content: space-between;
  }
}
</style>
