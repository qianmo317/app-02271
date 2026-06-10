<template>
  <div class="products-page">
    <!-- 页面顶部横幅 -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>全部产品</h1>
        <p>探索我们精心制作的每一款甜品</p>
      </div>
    </div>

    <div class="page-container">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <el-radio-group v-model="currentCategory" @change="handleCategoryChange">
            <el-radio-button
              v-for="cat in productStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              <el-icon v-if="cat.icon" style="margin-right: 4px">
                <component :is="cat.icon" />
              </el-icon>
              {{ cat.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-right">
          <el-select v-model="sortBy" placeholder="排序方式" style="width: 150px">
            <el-option label="默认排序" value="default" />
            <el-option label="价格从低到高" value="price-asc" />
            <el-option label="价格从高到低" value="price-desc" />
            <el-option label="销量最高" value="sales" />
            <el-option label="评分最高" value="rating" />
          </el-select>
        </div>
      </div>

      <!-- 产品数量 -->
      <div class="result-count">
        共找到 <strong>{{ sortedProducts.length }}</strong> 款产品
      </div>

      <!-- 产品列表 -->
      <div class="products-grid" v-loading="productStore.loading">
        <ProductCard
          v-for="product in sortedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!productStore.loading && sortedProducts.length === 0"
        description="暂无相关产品"
        :image-size="200"
      >
        <el-button type="primary" round @click="handleReset">
          重置筛选
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const productStore = useProductStore()

const currentCategory = ref('all')
const sortBy = ref('default')

// 排序后的产品
const sortedProducts = computed(() => {
  const products = [...productStore.filteredProducts]

  switch (sortBy.value) {
    case 'price-asc':
      return products.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return products.sort((a, b) => b.price - a.price)
    case 'sales':
      return products.sort((a, b) => b.sales - a.sales)
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating)
    default:
      return products
  }
})

function handleCategoryChange(val) {
  productStore.setCategory(val)
}

function handleReset() {
  currentCategory.value = 'all'
  sortBy.value = 'default'
  productStore.setCategory('all')
  productStore.setSearchKeyword('')
}

// 监听路由参数变化
watch(
  () => route.query.category,
  (newCat) => {
    if (newCat) {
      currentCategory.value = newCat
      productStore.setCategory(newCat)
    }
  },
  { immediate: true }
)

onMounted(() => {
  productStore.fetchProducts()
  productStore.fetchCategories()

  // 同步 store 中的分类
  if (productStore.currentCategory !== 'all') {
    currentCategory.value = productStore.currentCategory
  }
})
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

:deep(.el-radio-button__inner) {
  border-color: #ddd;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #d4a574;
  border-color: #d4a574;
  box-shadow: -1px 0 0 0 #d4a574;
}

.result-count {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.result-count strong {
  color: #d4a574;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  min-height: 200px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .page-banner {
    margin-top: 60px;
    height: 180px;
  }

  .banner-content h1 {
    font-size: 28px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>
