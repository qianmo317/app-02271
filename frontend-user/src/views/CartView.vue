<template>
  <div class="cart-page">
    <div class="page-container">
      <h1 class="page-title">我的购物车</h1>

      <!-- 空购物车 -->
      <el-empty
        v-if="cartStore.items.length === 0"
        description="购物车空空如也，去挑选你喜欢的甜品吧"
        :image-size="200"
      >
        <el-button type="primary" round @click="$router.push('/products')">
          去逛逛
        </el-button>
      </el-empty>

      <!-- 购物车列表 -->
      <div v-else class="cart-layout">
        <div class="cart-list">
          <div class="list-header">
            <span class="col-product">商品</span>
            <span class="col-price">单价</span>
            <span class="col-quantity">数量</span>
            <span class="col-subtotal">小计</span>
            <span class="col-action">操作</span>
          </div>

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item"
          >
            <div class="col-product">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-info">
                <router-link
                  :to="`/product/${item.id}`"
                  class="item-name"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>
            <div class="col-price">¥{{ item.price }}</div>
            <div class="col-quantity">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="(val) => cartStore.updateQuantity(item.id, val)"
              />
            </div>
            <div class="col-subtotal">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </div>
            <div class="col-action">
              <el-button
                type="danger"
                link
                @click="handleRemove(item)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>

          <div class="list-footer">
            <el-button link @click="handleClear">
              <el-icon><Delete /></el-icon>
              清空购物车
            </el-button>
          </div>
        </div>

        <!-- 结算栏 -->
        <div class="checkout-panel">
          <h3 class="panel-title">订单结算</h3>
          <div class="summary-row">
            <span>商品种类</span>
            <span>{{ cartStore.itemCount }} 种</span>
          </div>
          <div class="summary-row">
            <span>商品总数</span>
            <span>{{ cartStore.totalCount }} 件</span>
          </div>
          <el-divider />
          <div class="summary-row total-row">
            <span>合计</span>
            <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <el-button
            type="primary"
            size="large"
            round
            class="checkout-btn"
            @click="showCheckout = true"
          >
            提交订单
          </el-button>
        </div>
      </div>
    </div>

    <!-- 提交订单弹窗 -->
    <el-dialog
      v-model="showCheckout"
      title="确认订单"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="contactForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input
            v-model="contactForm.name"
            placeholder="请输入收货人姓名"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="contactForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="contactForm.address"
            type="textarea"
            :rows="2"
            placeholder="请输入详细地址"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="contactForm.remark"
            type="textarea"
            :rows="2"
            placeholder="选填"
            maxlength="100"
          />
        </el-form-item>
      </el-form>

      <div class="dialog-summary">
        <span>共 {{ cartStore.totalCount }} 件商品</span>
        <span class="dialog-total">合计：¥{{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>

      <template #footer>
        <el-button @click="showCheckout = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确认下单
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const showCheckout = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const contactForm = reactive({
  name: '',
  phone: '',
  address: '',
  remark: '',
})

const formRules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
}

async function handleRemove(item) {
  try {
    await ElMessageBox.confirm(
      `确定要从购物车移除"${item.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    cartStore.removeItem(item.id)
  } catch {
    // 用户取消
  }
}

async function handleClear() {
  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    cartStore.clearCart()
  } catch {
    // 用户取消
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    const order = orderStore.createOrder({
      items: cartStore.items,
      totalPrice: cartStore.totalPrice,
      contact: { ...contactForm },
    })
    if (order) {
      cartStore.clearCart()
      showCheckout.value = false
      router.push('/orders')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.cart-page {
  background: #fafafa;
  min-height: calc(100vh - 140px);
  padding-top: 70px;
}

.page-container {
  max-width: 1200px;
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

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.cart-list {
  background: #fff;
  border-radius: 12px;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.list-header,
.cart-item {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1.4fr 1fr 0.8fr;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.list-header {
  font-size: 13px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
}

.cart-item {
  border-bottom: 1px solid #f5f5f5;
}

.cart-item:last-of-type {
  border-bottom: none;
}

.col-product {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  min-width: 0;
}

.item-name {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}

.item-name:hover {
  color: #d4a574;
}

.col-price {
  color: #666;
  font-size: 14px;
}

.col-subtotal {
  color: #e74c3c;
  font-size: 16px;
  font-weight: 600;
}

.list-footer {
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
}

/* 结算栏 */
.checkout-panel {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 90px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.total-row {
  font-size: 16px;
  color: #333;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
  background: #d4a574;
  border-color: #d4a574;
}

.checkout-btn:hover {
  background: #c49664;
  border-color: #c49664;
}

.dialog-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff9f0;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.dialog-total {
  color: #e74c3c;
  font-size: 18px;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .checkout-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .list-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      'image info'
      'image price'
      'image quantity'
      'image action';
    gap: 4px 12px;
  }

  .col-product {
    grid-area: image;
    align-self: start;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }
}
</style>
