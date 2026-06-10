<template>
  <div class="cart-page">
    <div class="page-banner">
      <div class="banner-content">
        <h1>购物车</h1>
        <p>确认您挑选的美味甜品</p>
      </div>
    </div>

    <div class="page-container">
      <template v-if="cartStore.items.length > 0">
        <div class="cart-layout">
          <div class="cart-list">
            <div class="cart-header">
              <span class="col-product">商品信息</span>
              <span class="col-price">单价</span>
              <span class="col-quantity">数量</span>
              <span class="col-subtotal">小计</span>
              <span class="col-action">操作</span>
            </div>

            <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
              <div class="col-product">
                <img :src="item.image" :alt="item.name" class="item-image" />
                <span class="item-name">{{ item.name }}</span>
              </div>
              <div class="col-price">
                <span class="price">¥{{ item.price }}</span>
              </div>
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
                <span class="subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
              <div class="col-action">
                <el-button type="danger" link @click="cartStore.removeItem(item.id)">
                  <el-icon><Delete /></el-icon>
                  移除
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
            <div class="summary-row">
              <span>商品合计</span>
              <span class="summary-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <el-divider />
            <div class="summary-row total-row">
              <span>应付总额</span>
              <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>

            <el-button
              type="primary"
              size="large"
              round
              class="checkout-btn"
              @click="showCheckoutDialog = true"
            >
              提交订单
            </el-button>
            <el-button round class="continue-btn" @click="$router.push('/products')">
              继续选购
            </el-button>
          </div>
        </div>
      </template>

      <el-empty
        v-else
        description="购物车空空如也，快去挑选甜品吧～"
        :image-size="200"
      >
        <el-button type="primary" round @click="$router.push('/products')">
          去选购
        </el-button>
      </el-empty>
    </div>

    <el-dialog
      v-model="showCheckoutDialog"
      title="确认订单"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="orderForm"
        :rules="formRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="orderForm.name" placeholder="请输入您的姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="orderForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="orderForm.address" placeholder="请输入配送地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="orderForm.remark"
            type="textarea"
            :rows="2"
            placeholder="如有特殊需求请备注（选填）"
          />
        </el-form-item>
      </el-form>

      <div class="dialog-summary">
        <div class="dialog-summary-row">
          <span>共 {{ cartStore.totalCount }} 件商品</span>
          <span class="dialog-total">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="showCheckoutDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitOrder" :loading="submitting">
          确认提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()

const showCheckoutDialog = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const orderForm = reactive({
  name: '',
  phone: '',
  address: '',
  remark: '',
})

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入配送地址', trigger: 'blur' }],
}

async function handleSubmitOrder() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const order = cartStore.submitOrder({ ...orderForm })
    if (order) {
      showCheckoutDialog.value = false
      orderForm.name = ''
      orderForm.phone = ''
      orderForm.address = ''
      orderForm.remark = ''
      ElMessageBox.alert(
        `订单号：${order.orderNo}\n订单金额：¥${order.totalPrice.toFixed(2)}`,
        '下单成功',
        {
          confirmButtonText: '查看订单',
          callback: () => {
            router.push('/orders')
          },
        }
      )
    }
  } finally {
    submitting.value = false
  }
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.cart-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.cart-list {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: #faf8f5;
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}

.cart-item:hover {
  background: #faf8f5;
}

.cart-item:last-child {
  border-bottom: none;
}

.col-product {
  flex: 3;
  display: flex;
  align-items: center;
  gap: 16px;
}

.col-price {
  flex: 1;
  text-align: center;
}

.col-quantity {
  flex: 1.5;
  display: flex;
  justify-content: center;
}

.col-subtotal {
  flex: 1;
  text-align: center;
}

.col-action {
  flex: 0.8;
  text-align: center;
}

.item-image {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.price {
  font-size: 15px;
  color: #666;
}

.subtotal {
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
}

.cart-summary {
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  position: sticky;
  top: 100px;
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
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.summary-price {
  color: #333;
  font-weight: 500;
}

.total-row {
  margin-bottom: 24px;
}

.total-row span:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #e74c3c;
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

.continue-btn {
  width: 100%;
  height: 44px;
  color: #d4a574;
  border-color: #d4a574;
}

.continue-btn:hover {
  color: #c49664;
  border-color: #c49664;
  background: #fff9f0;
}

.dialog-summary {
  background: #faf8f5;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.dialog-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.dialog-total {
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

  .cart-layout {
    flex-direction: column;
  }

  .cart-header {
    display: none;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }

  .col-product {
    flex: 1 1 100%;
  }

  .col-price,
  .col-quantity,
  .col-subtotal,
  .col-action {
    flex: 1;
    justify-content: flex-start;
  }

  .col-price,
  .col-subtotal {
    text-align: left;
  }

  .cart-summary {
    width: 100%;
    position: static;
  }
}
</style>
