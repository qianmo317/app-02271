<template>
  <div class="product-card" @click="goToDetail">
    <div class="card-image">
      <img :src="product.image" :alt="product.name" loading="lazy" />
      <div class="card-tags" v-if="product.tags?.length">
        <el-tag
          v-for="tag in product.tags.slice(0, 2)"
          :key="tag"
          size="small"
          :type="getTagType(tag)"
          effect="dark"
          round
        >
          {{ tag }}
        </el-tag>
      </div>
      <div class="card-overlay">
        <el-button type="primary" round @click.stop="goToDetail">
          查看详情
        </el-button>
        <el-button round class="add-cart-btn" @click.stop="handleAddCart">
          <el-icon><ShoppingCart /></el-icon>
          加入购物车
        </el-button>
      </div>
    </div>

    <div class="card-info">
      <h3 class="card-name">{{ product.name }}</h3>
      <p class="card-desc">{{ product.description }}</p>
      <div class="card-bottom">
        <div class="card-price">
          <span class="current-price">¥{{ product.price }}</span>
          <span class="original-price" v-if="product.originalPrice > product.price">
            ¥{{ product.originalPrice }}
          </span>
        </div>
        <div class="card-rating">
          <el-rate
            :model-value="product.rating"
            disabled
            :size="14"
            :colors="['#d4a574', '#d4a574', '#d4a574']"
          />
          <span class="sales">月售{{ product.sales }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart } from '@element-plus/icons-vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const cartStore = useCartStore()

function goToDetail() {
  router.push(`/product/${props.product.id}`)
}

function handleAddCart() {
  cartStore.addItem(props.product)
}

function getTagType(tag) {
  const tagMap = {
    '新品': 'success',
    '招牌': 'warning',
    '人气': 'danger',
    '限定': '',
    '季节限定': '',
    '健康': 'success',
    '经典': 'info',
  }
  return tagMap[tag] || ''
}
</script>

<style scoped>
.product-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .card-image img {
  transform: scale(1.08);
}

.card-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  display: flex;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
  transform: translateY(0);
}

.card-overlay .el-button {
  background: #d4a574;
  border-color: #d4a574;
}

.card-overlay .el-button:hover {
  background: #c49664;
  border-color: #c49664;
}

.add-cart-btn {
  background: rgba(255, 255, 255, 0.9) !important;
  border-color: transparent !important;
  color: #d4a574 !important;
}

.add-cart-btn:hover {
  background: #fff !important;
  color: #c49664 !important;
}

.card-info {
  padding: 16px;
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.current-price {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.original-price {
  font-size: 13px;
  color: #ccc;
  text-decoration: line-through;
}

.card-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.card-rating :deep(.el-rate) {
  height: auto;
}

.sales {
  font-size: 12px;
  color: #bbb;
}
</style>
