<template>
  <div class="detail-page" v-loading="loading">
    <!-- 产品不存在时的空状态 -->
    <div class="page-container" v-if="!loading && !product">
      <el-empty description="产品不存在或已下架" :image-size="200">
        <el-button type="primary" round @click="$router.push('/products')">
          返回产品列表
        </el-button>
      </el-empty>
    </div>

    <div class="page-container" v-if="product">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/products' }">全部产品</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 产品详情 -->
      <div class="detail-grid">
        <!-- 左侧图片 -->
        <div class="detail-images">
          <div class="main-image">
            <img :src="currentImage" :alt="product.name" />
          </div>
          <div class="image-thumbs">
            <div
              v-for="(img, index) in product.images"
              :key="index"
              class="thumb"
              :class="{ active: currentImage === img }"
              @click="currentImage = img"
            >
              <img :src="img" :alt="product.name" />
            </div>
          </div>
        </div>

        <!-- 右侧信息 -->
        <div class="detail-info">
          <div class="info-tags" v-if="product.tags?.length">
            <el-tag
              v-for="tag in product.tags"
              :key="tag"
              size="small"
              effect="dark"
              round
            >
              {{ tag }}
            </el-tag>
          </div>

          <h1 class="product-name">{{ product.name }}</h1>

          <div class="product-meta">
            <el-rate
              :model-value="product.rating"
              disabled
              :colors="['#d4a574', '#d4a574', '#d4a574']"
            />
            <span class="meta-text">{{ product.rating }} 分</span>
            <el-divider direction="vertical" />
            <span class="meta-text">月售 {{ product.sales }}</span>
          </div>

          <div class="product-price-box">
            <div class="price-row">
              <span class="price-label">参考价格</span>
              <span class="current-price">¥{{ product.price }}</span>
              <span class="original-price" v-if="product.originalPrice > product.price">
                ¥{{ product.originalPrice }}
              </span>
              <el-tag type="danger" size="small" v-if="discount">
                省¥{{ product.originalPrice - product.price }}
              </el-tag>
            </div>
          </div>

          <div class="product-desc">
            <p>{{ product.description }}</p>
          </div>

          <el-divider />

          <!-- 服务保障 -->
          <div class="service-tags">
            <span><el-icon><Select /></el-icon> 新鲜现做</span>
            <span><el-icon><Select /></el-icon> 品质保证</span>
            <span><el-icon><Select /></el-icon> 冷链配送</span>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-section">
            <span class="quantity-label">购买数量</span>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="99"
              size="large"
              class="quantity-input"
            />
          </div>

          <!-- 引导按钮 -->
          <div class="action-buttons">
            <el-button
              type="primary"
              size="large"
              round
              class="add-cart-btn-detail"
              @click="handleAddToCart"
            >
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button
              size="large"
              round
              class="buy-now-btn"
              @click="handleBuyNow"
            >
              立即下单
            </el-button>
          </div>
        </div>
      </div>

      <!-- 详细描述 -->
      <div class="detail-description">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="产品详情" name="detail">
            <div class="desc-content">
              <p>{{ product.detail }}</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配送说明" name="delivery">
            <div class="desc-content">
              <h4>配送范围</h4>
              <p>上海市区配送，欢迎联系我们了解具体配送安排。</p>
              <h4>配送时间</h4>
              <p>每日 9:00-21:00，提前预约可安排指定时段送达。节假日可能略有延迟。</p>
              <h4>保鲜说明</h4>
              <p>全程冷链配送，收到后请尽快食用。蛋糕类产品请冷藏保存，保质期为收到后48小时。</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { Select, ShoppingCart } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const currentImage = ref('')
const activeTab = ref('detail')
const quantity = ref(1)

const discount = computed(() => {
  if (!product.value) return false
  return product.value.originalPrice > product.value.price
})

function handleAddToCart() {
  if (!product.value) return
  cartStore.addToCart(product.value, quantity.value)
}

function handleBuyNow() {
  if (!product.value) return
  cartStore.addToCart(product.value, quantity.value)
  router.push('/cart')
}

async function loadProduct(id) {
  loading.value = true
  const data = await productStore.fetchProductById(id)
  if (data) {
    product.value = data
    currentImage.value = data.images?.[0] || data.image
  }
  loading.value = false
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) loadProduct(newId)
  }
)

onMounted(() => {
  loadProduct(route.params.id)
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}

.breadcrumb {
  margin-bottom: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 60px;
}

/* 图片区域 */
.main-image {
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
  aspect-ratio: 1;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-thumbs {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.thumb {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumb.active,
.thumb:hover {
  border-color: #d4a574;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 信息区域 */
.info-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.product-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.meta-text {
  font-size: 14px;
  color: #999;
}

.product-price-box {
  background: linear-gradient(135deg, #fff9f0, #fef5e7);
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.price-label {
  font-size: 14px;
  color: #999;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #e74c3c;
}

.original-price {
  font-size: 16px;
  color: #ccc;
  text-decoration: line-through;
}

.product-desc {
  margin-bottom: 12px;
}

.product-desc p {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
}

.service-tags {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 13px;
  margin-bottom: 28px;
}

.service-tags span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.service-tags .el-icon {
  color: #67c23a;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.quantity-label {
  font-size: 14px;
  color: #999;
}

.quantity-input :deep(.el-input-number__decrease),
.quantity-input :deep(.el-input-number__increase) {
  width: 36px;
}

.quantity-input :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.add-cart-btn-detail {
  flex: 1;
  height: 48px;
  font-size: 16px;
  background: #d4a574;
  border-color: #d4a574;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.add-cart-btn-detail:hover {
  background: #c49664;
  border-color: #c49664;
}

.buy-now-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  color: #d4a574;
  border-color: #d4a574;
  background: #fff9f0;
}

.buy-now-btn:hover {
  color: #c49664;
  border-color: #c49664;
  background: #fff5e6;
}

/* 详情标签页 */
.detail-description {
  margin-top: 20px;
}

:deep(.detail-tabs .el-tabs__item.is-active) {
  color: #d4a574;
}

:deep(.detail-tabs .el-tabs__active-bar) {
  background-color: #d4a574;
}

.desc-content {
  padding: 24px 0;
  line-height: 1.9;
  color: #666;
  font-size: 15px;
}

.desc-content h4 {
  color: #333;
  margin: 20px 0 8px;
  font-size: 16px;
}

.desc-content h4:first-child {
  margin-top: 0;
}

@media (max-width: 768px) {
  .page-container {
    padding-top: 80px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .product-name {
    font-size: 22px;
  }

  .current-price {
    font-size: 26px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
